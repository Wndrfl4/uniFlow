package com.uniflow.blog.service;

import com.uniflow.blog.domain.Post;
import com.uniflow.blog.domain.User;
import com.uniflow.blog.domain.enums.PostStatus;
import com.uniflow.blog.domain.enums.Role;
import com.uniflow.blog.dto.post.CreatePostRequest;
import com.uniflow.blog.dto.post.PostDto;
import com.uniflow.blog.dto.post.RejectPostRequest;
import com.uniflow.blog.dto.post.UpdatePostRequest;
import com.uniflow.blog.exception.ApiException;
import com.uniflow.blog.exception.ResourceNotFoundException;
import com.uniflow.blog.mapper.PostMapper;
import com.uniflow.blog.repository.PostRepository;
import com.uniflow.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostMapper postMapper;

    @Transactional
    public PostDto create(CreatePostRequest request, String authorEmail) {
        User author = findUserByEmail(authorEmail);

        PostStatus initialStatus = author.getRole() == Role.STUDENT
                ? PostStatus.PENDING_REVIEW
                : PostStatus.PUBLISHED;

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .status(initialStatus)
                .author(author)
                .build();

        postRepository.save(post);
        log.info("Post created by {} with status {}", authorEmail, initialStatus);
        return postMapper.toDto(post);
    }

    @Transactional(readOnly = true)
    public Page<PostDto> getPublished(Pageable pageable) {
        return postRepository.findAllByStatus(PostStatus.PUBLISHED, pageable)
                .map(postMapper::toDto);
    }

    @Transactional(readOnly = true)
    public PostDto getById(Long id, String currentEmail) {
        Post post = findPostById(id);

        boolean isAuthor = post.getAuthor().getEmail().equals(currentEmail);
        boolean isPublished = post.getStatus() == PostStatus.PUBLISHED;

        if (!isPublished && !isAuthor) {
            User currentUser = findUserByEmail(currentEmail);
            if (currentUser.getRole() != Role.ADMIN) {
                throw new ApiException(HttpStatus.FORBIDDEN, "Access denied to this post");
            }
        }

        return postMapper.toDto(post);
    }

    @Transactional(readOnly = true)
    public Page<PostDto> getMyPosts(String email, Pageable pageable) {
        User author = findUserByEmail(email);
        return postRepository.findAllByAuthorId(author.getId(), pageable)
                .map(postMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<PostDto> getPending(Pageable pageable) {
        return postRepository.findAllByStatus(PostStatus.PENDING_REVIEW, pageable)
                .map(postMapper::toDto);
    }

    @Transactional
    public PostDto update(Long id, UpdatePostRequest request, String currentEmail) {
        Post post = findPostById(id);
        checkOwnership(post, currentEmail);

        if (post.getStatus() == PostStatus.PUBLISHED) {
            throw new ApiException(HttpStatus.CONFLICT, "Published posts cannot be edited");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setStatus(PostStatus.PENDING_REVIEW);
        post.setRejectionReason(null);

        log.info("Post {} updated by {}", id, currentEmail);
        return postMapper.toDto(post);
    }

    @Transactional
    public void delete(Long id, String currentEmail) {
        Post post = findPostById(id);
        User currentUser = findUserByEmail(currentEmail);

        boolean isOwner = post.getAuthor().getEmail().equals(currentEmail);
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not allowed to delete this post");
        }

        postRepository.delete(post);
        log.info("Post {} deleted by {}", id, currentEmail);
    }

    @Transactional
    public PostDto approve(Long id) {
        Post post = findPostById(id);

        if (post.getStatus() != PostStatus.PENDING_REVIEW) {
            throw new ApiException(HttpStatus.CONFLICT, "Only posts with PENDING_REVIEW status can be approved");
        }

        post.setStatus(PostStatus.PUBLISHED);
        post.setRejectionReason(null);

        log.info("Post {} approved", id);
        return postMapper.toDto(post);
    }

    @Transactional
    public PostDto reject(Long id, RejectPostRequest request) {
        Post post = findPostById(id);

        if (post.getStatus() != PostStatus.PENDING_REVIEW) {
            throw new ApiException(HttpStatus.CONFLICT, "Only posts with PENDING_REVIEW status can be rejected");
        }

        post.setStatus(PostStatus.REJECTED);
        post.setRejectionReason(request.getReason());

        log.info("Post {} rejected", id);
        return postMapper.toDto(post);
    }

    private Post findPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    private void checkOwnership(Post post, String email) {
        if (!post.getAuthor().getEmail().equals(email)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not the author of this post");
        }
    }
}
