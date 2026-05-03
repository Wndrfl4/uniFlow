package com.uniflow.blog.mapper;

import com.uniflow.blog.domain.Post;
import com.uniflow.blog.dto.post.PostDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(source = "author.id", target = "authorId")
    @Mapping(expression = "java(post.getAuthor().getFirstName() + \" \" + post.getAuthor().getLastName())", target = "authorName")
    PostDto toDto(Post post);
}
