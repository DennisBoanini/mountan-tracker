package com.mountaintracker.mapper;

import com.mountaintracker.dto.ActivityDtos.CreateActivityRequest;
import com.mountaintracker.dto.ActivityDtos.MarkDoneRequest;
import com.mountaintracker.dto.ActivityDtos.UpdateActivityRequest;
import com.mountaintracker.model.Activity;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ActivityMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "done", constant = "false")
    @Mapping(target = "doneAt", ignore = true)
    @Mapping(target = "doneNotes", ignore = true)
    @Mapping(target = "guideName", ignore = true)
    @Mapping(target = "notes", defaultValue = "")
    @Mapping(target = "links", defaultExpression = "java(new java.util.ArrayList<>())")
    @Mapping(target = "createdAt", expression = "java(java.time.Instant.now())")
    @Mapping(target = "updatedAt", expression = "java(java.time.Instant.now())")
    Activity toEntity(CreateActivityRequest req);

    // guideType usa SET_TO_NULL per permettere la rimozione esplicita della guida
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "done", ignore = true)
    @Mapping(target = "doneAt", ignore = true)
    @Mapping(target = "doneNotes", ignore = true)
    @Mapping(target = "guideName", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", expression = "java(java.time.Instant.now())")
    @Mapping(target = "guideType", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    void updateEntity(UpdateActivityRequest req, @MappingTarget Activity activity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "title", ignore = true)
    @Mapping(target = "notes", ignore = true)
    @Mapping(target = "links", ignore = true)
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "guideType", ignore = true)
    @Mapping(target = "done", constant = "true")
    @Mapping(target = "doneAt", expression = "java(java.time.Instant.now())")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", expression = "java(java.time.Instant.now())")
    void applyMarkDone(MarkDoneRequest req, @MappingTarget Activity activity);
}
