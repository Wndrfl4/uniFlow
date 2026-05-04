package com.uniflow.blog.mapper;

import com.uniflow.blog.domain.Post;
import com.uniflow.blog.domain.User;
import com.uniflow.blog.dto.post.PostDto;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-04T23:43:19+0500",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class PostMapperImpl implements PostMapper {

    @Override
    public PostDto toDto(Post post) {
        if ( post == null ) {
            return null;
        }

        PostDto postDto = new PostDto();

        postDto.setAuthorId( postAuthorId( post ) );
        postDto.setContent( post.getContent() );
        postDto.setCreatedAt( post.getCreatedAt() );
        postDto.setId( post.getId() );
        postDto.setRejectionReason( post.getRejectionReason() );
        postDto.setStatus( post.getStatus() );
        postDto.setTitle( post.getTitle() );
        postDto.setUpdatedAt( post.getUpdatedAt() );

        postDto.setAuthorName( post.getAuthor().getFirstName() + " " + post.getAuthor().getLastName() );

        return postDto;
    }

    private Long postAuthorId(Post post) {
        if ( post == null ) {
            return null;
        }
        User author = post.getAuthor();
        if ( author == null ) {
            return null;
        }
        Long id = author.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
