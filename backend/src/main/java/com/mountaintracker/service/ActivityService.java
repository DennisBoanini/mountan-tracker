package com.mountaintracker.service;

import com.mountaintracker.dto.ActivityDtos.*;
import com.mountaintracker.exception.ActivityNotFoundException;
import com.mountaintracker.model.Activity;
import com.mountaintracker.model.Activity.ActivityType;
import com.mountaintracker.model.Activity.GuideType;
import com.mountaintracker.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository repository;

    public List<Activity> findAll(ActivityFilters filters) {
        ActivityType type = filters.type();
        Boolean done = filters.done();
        GuideType guideType = filters.guideType();

        if (type != null && done != null && guideType != null)
            return repository.findByTypeAndDoneAndGuideTypeOrderByCreatedAtDesc(type, done, guideType);
        if (type != null && done != null)
            return repository.findByTypeAndDoneOrderByCreatedAtDesc(type, done);
        if (type != null && guideType != null)
            return repository.findByTypeAndGuideTypeOrderByCreatedAtDesc(type, guideType);
        if (done != null && guideType != null)
            return repository.findByDoneAndGuideTypeOrderByCreatedAtDesc(done, guideType);
        if (type != null)
            return repository.findByTypeOrderByCreatedAtDesc(type);
        if (done != null)
            return repository.findByDoneOrderByCreatedAtDesc(done);
        if (guideType != null)
            return repository.findByGuideTypeOrderByCreatedAtDesc(guideType);

        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Activity findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ActivityNotFoundException(id));
    }

    public Activity create(CreateActivityRequest req) {
        Activity activity = new Activity();
        activity.setTitle(req.title());
        activity.setNotes(req.notes() != null ? req.notes() : "");
        activity.setLink(req.link() != null ? req.link() : "");
        activity.setType(req.type());
        activity.setGuideType(req.guideType());
        activity.setCreatedAt(Instant.now());
        activity.setUpdatedAt(Instant.now());
        return repository.save(activity);
    }

    public Activity update(String id, UpdateActivityRequest req) {
        Activity activity = findById(id);

        if (req.title() != null) activity.setTitle(req.title());
        if (req.notes() != null) activity.setNotes(req.notes());
        if (req.link() != null) activity.setLink(req.link());
        if (req.type() != null) activity.setType(req.type());
        // guideType può essere esplicitamente null per rimuovere la guida
        activity.setGuideType(req.guideType());
        activity.setUpdatedAt(Instant.now());

        return repository.save(activity);
    }

    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new ActivityNotFoundException(id);
        }
        repository.deleteById(id);
    }

    public Activity markDone(String id, MarkDoneRequest req) {
        Activity activity = findById(id);
        activity.setDone(true);
        activity.setDoneAt(Instant.now());
        activity.setDoneNotes(req.doneNotes());
        activity.setGuideName(req.guideName());
        activity.setUpdatedAt(Instant.now());
        return repository.save(activity);
    }

    public Activity markUndone(String id) {
        Activity activity = findById(id);
        activity.setDone(false);
        activity.setDoneAt(null);
        activity.setDoneNotes(null);
        activity.setGuideName(null);
        activity.setUpdatedAt(Instant.now());
        return repository.save(activity);
    }
}
