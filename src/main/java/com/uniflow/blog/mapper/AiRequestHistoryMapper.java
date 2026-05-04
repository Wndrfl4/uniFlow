package com.uniflow.blog.mapper;

import com.uniflow.blog.domain.AiRequestHistory;
import com.uniflow.blog.dto.ai.AiRequestHistoryDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AiRequestHistoryMapper {

    @Mapping(source = "user.id", target = "userId")
    AiRequestHistoryDto toDto(AiRequestHistory history);
}
