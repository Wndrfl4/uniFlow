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
import com.uniflow.blog.mapper.PostMapper;
import com.uniflow.blog.repository.PostRepository;
import com.uniflow.blog.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock private PostRepository postRepository;
    @Mock private UserRepository userRepository;
    @Mock private PostMapper postMapper;

    @InjectMocks
    private PostService postService;

    private User student;
    private User teacher;
    private User admin;
    private Post pendingPost;
    private PostDto postDto;

    @BeforeEach
    void setUp() {
        student = User.builder().id(1L).email("student@test.com").role(Role.STUDENT).build();
        teacher = User.builder().id(2L).email("teacher@test.com").role(Role.TEACHER).build();
        admin   = User.builder().id(3L).email("admin@test.com").role(Role.ADMIN).build();

        pendingPost = Post.builder()
                .id(10L)
                .title("Test Post")
                .content("Some content here")
                .status(PostStatus.PENDING_REVIEW)
                .author(student)
                .build();

        postDto = new PostDto();
        postDto.setId(10L);
        postDto.setStatus(PostStatus.PENDING_REVIEW);
    }

    @Test
    void create_whenStudent_shouldSetPendingReviewStatus() {
        CreatePostRequest request = new CreatePostRequest();
        request.setTitle("Title");
        request.setContent("Content content content");

        when(userRepository.findByEmail(student.getEmail())).thenReturn(Optional.of(student));
        when(postRepository.save(any(Post.class))).thenAnswer(i -> i.getArgument(0));
        when(postMapper.toDto(any(Post.class))).thenReturn(postDto);

        PostDto result = postService.create(request, student.getEmail());

        assertThat(result).isNotNull();
        verify(postRepository).save(argThat(post -> post.getStatus() == PostStatus.PENDING_REVIEW));
    }

    @Test
    void create_whenTeacher_shouldSetPublishedStatus() {
        CreatePostRequest request = new CreatePostRequest();
        request.setTitle("Title");
        request.setContent("Content content content");

        PostDto teacherPostDto = new PostDto();
        teacherPostDto.setStatus(PostStatus.PUBLISHED);

        when(userRepository.findByEmail(teacher.getEmail())).thenReturn(Optional.of(teacher));
        when(postRepository.save(any(Post.class))).thenAnswer(i -> i.getArgument(0));
        when(postMapper.toDto(any(Post.class))).thenReturn(teacherPostDto);

        postService.create(request, teacher.getEmail());

        verify(postRepository).save(argThat(post -> post.getStatus() == PostStatus.PUBLISHED));
    }

    @Test
    void approve_whenPendingReview_shouldSetPublished() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(pendingPost));
        when(postMapper.toDto(any(Post.class))).thenReturn(postDto);

        postService.approve(10L);

        assertThat(pendingPost.getStatus()).isEqualTo(PostStatus.PUBLISHED);
        assertThat(pendingPost.getRejectionReason()).isNull();
    }

    @Test
    void approve_whenAlreadyPublished_shouldThrowConflict() {
        pendingPost.setStatus(PostStatus.PUBLISHED);
        when(postRepository.findById(10L)).thenReturn(Optional.of(pendingPost));

        assertThatThrownBy(() -> postService.approve(10L))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("PENDING_REVIEW");
    }

    @Test
    void reject_whenPendingReview_shouldSetRejectedWithReason() {
        RejectPostRequest request = new RejectPostRequest();
        request.setReason("Inappropriate content");

        when(postRepository.findById(10L)).thenReturn(Optional.of(pendingPost));
        when(postMapper.toDto(any(Post.class))).thenReturn(postDto);

        postService.reject(10L, request);

        assertThat(pendingPost.getStatus()).isEqualTo(PostStatus.REJECTED);
        assertThat(pendingPost.getRejectionReason()).isEqualTo("Inappropriate content");
    }

    @Test
    void delete_whenAuthor_shouldDeleteSuccessfully() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(pendingPost));
        when(userRepository.findByEmail(student.getEmail())).thenReturn(Optional.of(student));

        postService.delete(10L, student.getEmail());

        verify(postRepository).delete(pendingPost);
    }

    @Test
    void delete_whenAdmin_shouldDeleteAnyPost() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(pendingPost));
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));

        postService.delete(10L, admin.getEmail());

        verify(postRepository).delete(pendingPost);
    }

    @Test
    void delete_whenNotOwnerAndNotAdmin_shouldThrowForbidden() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(pendingPost));
        when(userRepository.findByEmail(teacher.getEmail())).thenReturn(Optional.of(teacher));

        assertThatThrownBy(() -> postService.delete(10L, teacher.getEmail()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("not allowed");
    }

    @Test
    void update_whenPublished_shouldThrowConflict() {
        pendingPost.setStatus(PostStatus.PUBLISHED);
        UpdatePostRequest request = new UpdatePostRequest();
        request.setTitle("New title");
        request.setContent("New content here");

        when(postRepository.findById(10L)).thenReturn(Optional.of(pendingPost));

        assertThatThrownBy(() -> postService.update(10L, request, student.getEmail()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Published posts cannot be edited");
    }
}
