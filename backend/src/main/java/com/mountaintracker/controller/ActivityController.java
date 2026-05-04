package com.mountaintracker.controller;

import com.mountaintracker.dto.ActivityDtos.ActivityFilters;
import com.mountaintracker.dto.ActivityDtos.CreateActivityRequest;
import com.mountaintracker.dto.ActivityDtos.MarkDoneRequest;
import com.mountaintracker.dto.ActivityDtos.UpdateActivityRequest;
import com.mountaintracker.model.Activity;
import com.mountaintracker.model.Activity.ActivityType;
import com.mountaintracker.model.Activity.GuideType;
import com.mountaintracker.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService service;

    @GetMapping
    public List<Activity> getAll(
            @RequestParam(required = false) ActivityType type,
            @RequestParam(required = false) Boolean done,
            @RequestParam(required = false) GuideType guideType
    ) {
        return service.findAll(new ActivityFilters(type, done, guideType));
    }

    @GetMapping("/{id}")
    public Activity getById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Activity> create(@Valid @RequestBody CreateActivityRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/{id}")
    public Activity update(@PathVariable String id, @RequestBody UpdateActivityRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/done")
    public Activity markDone(@PathVariable String id, @RequestBody(required = false) MarkDoneRequest req) {
        return service.markDone(id, req != null ? req : new MarkDoneRequest(null, null));
    }

    @DeleteMapping("/{id}/done")
    public Activity markUndone(@PathVariable String id) {
        return service.markUndone(id);
    }
}
