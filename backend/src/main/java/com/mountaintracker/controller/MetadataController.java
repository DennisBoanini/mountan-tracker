package com.mountaintracker.controller;

import com.mountaintracker.model.Activity.ActivityType;
import com.mountaintracker.model.Activity.GuideType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/metadata")
public class MetadataController {

    @GetMapping("/activity-types")
    public List<String> getActivityTypes() {
        return Arrays.stream(ActivityType.values())
                .map(Enum::name)
                .toList();
    }

    @GetMapping("/guide-types")
    public List<String> getGuideTypes() {
        return Arrays.stream(GuideType.values())
                .map(Enum::name)
                .toList();
    }
}
