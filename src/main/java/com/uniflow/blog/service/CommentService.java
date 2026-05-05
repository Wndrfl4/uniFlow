package com.uniflow.blog.service;

import com.uniflow.blog.domain.Comment;
import com.uniflow.blog.domain.Post;
import com.uniflow.blog.domain.User;
import com.uniflow.blog.dto.comment.CommentDto;
import com.uniflow.blog.dto.comment.CreateCommentRequest;
import com.uniflow.blog.exception.ApiException;
import com.uniflow.blog.exception.ResourceNotFoundException;
import com.uniflow.blog.repository.CommentRepository;
import com.uniflow.blog.repository.PostRepository;
import com.uniflow.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<CommentDto> getByPost(Long postId) {
        return commentRepository.findAllByPostIdOrderByCreatedAtAsc(postId)
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public CommentDto create(Long postId, CreateCommentRequest request, String authorEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + postId));
        User author = findUser(authorEmail);

        Comment comment = Comment.builder()
                .post(post)
                .author(author)
                .content(request.getContent())
                .build();
        commentRepository.save(comment);

        if (!post.getAuthor().getId().equals(author.getId())) {
            notificationService.notify(
                    post.getAuthor().getId(),
                    "COMMENT",
                    author.getFirstName() + " оставил(а) комментарий к вашему посту «" + post.getTitle() + "»",
                    "/posts/" + postId
            );
        }

        return toDto(comment);
    }

    @Transactional
    public void delete(Long commentId, String currentEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));
        User user = findUser(currentEmail);

        boolean isAuthor = comment.getAuthor().getId().equals(user.getId());
        boolean isPostOwner = comment.getPost().getAuthor().getId().equals(user.getId());
        if (!isAuthor && !isPostOwner) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentDto toDto(Comment c) {
        CommentDto dto = new CommentDto();
        dto.setId(c.getId());
        dto.setPostId(c.getPost().getId());
        dto.setAuthorId(c.getAuthor().getId());
        dto.setAuthorName(c.getAuthor().getFirstName() + " " + c.getAuthor().getLastName());
        dto.setAuthorAvatarUrl(c.getAuthor().getAvatarUrl());
        dto.setContent(c.getContent());
        dto.setCreatedAt(c.getCreatedAt());
        return dto;
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
