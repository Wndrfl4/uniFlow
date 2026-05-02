package com.uniflow.blog.mapper;

import com.uniflow.blog.domain.User;
import com.uniflow.blog.dto.user.UserDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);
}
