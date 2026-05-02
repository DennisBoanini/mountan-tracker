package com.mountaintracker.repository;

import com.mountaintracker.model.Activity;
import com.mountaintracker.model.Activity.ActivityType;
import com.mountaintracker.model.Activity.GuideType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {

    List<Activity> findAllByOrderByCreatedAtDesc();

    List<Activity> findByTypeOrderByCreatedAtDesc(ActivityType type);

    List<Activity> findByDoneOrderByCreatedAtDesc(boolean done);

    List<Activity> findByGuideTypeOrderByCreatedAtDesc(GuideType guideType);

    List<Activity> findByTypeAndDoneOrderByCreatedAtDesc(ActivityType type, boolean done);

    List<Activity> findByTypeAndGuideTypeOrderByCreatedAtDesc(ActivityType type, GuideType guideType);

    List<Activity> findByDoneAndGuideTypeOrderByCreatedAtDesc(boolean done, GuideType guideType);

    List<Activity> findByTypeAndDoneAndGuideTypeOrderByCreatedAtDesc(ActivityType type, boolean done, GuideType guideType);
}
