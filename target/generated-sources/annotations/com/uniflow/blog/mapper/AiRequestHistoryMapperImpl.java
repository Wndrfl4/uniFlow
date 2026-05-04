package com.uniflow.blog.mapper;

import com.uniflow.blog.domain.AiRequestHistory;
import com.uniflow.blog.domain.User;
import com.uniflow.blog.dto.ai.AiRequestHistoryDto;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-04T23:29:07+0500",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class AiRequestHistoryMapperImpl implements AiRequestHistoryMapper {

    @Override
    public AiRequestHistoryDto toDto(AiRequestHistory history) {
        if ( history == null ) {
            return null;
        }

        AiRequestHistoryDto aiRequestHistoryDto = new AiRequestHistoryDto();

        aiRequestHistoryDto.setUserId( historyUserId( history ) );
        aiRequestHistoryDto.setCached( history.isCached() );
        aiRequestHistoryDto.setCreatedAt( history.getCreatedAt() );
        aiRequestHistoryDto.setId( history.getId() );
        aiRequestHistoryDto.setPrompt( history.getPrompt() );
        aiRequestHistoryDto.setResponse( history.getResponse() );

        return aiRequestHistoryDto;
    }

    private Long historyUserId(AiRequestHistory aiRequestHistory) {
        if ( aiRequestHistory == null ) {
            return null;
        }
        User user = aiRequestHistory.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
