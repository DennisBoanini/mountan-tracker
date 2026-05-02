package com.mountaintracker.dto;

import com.mountaintracker.model.Activity.ActivityType;
import com.mountaintracker.model.Activity.GuideType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ActivityDtos {

    // ── CREATE ──────────────────────────────────────────────────────────────
    public record CreateActivityRequest(
            @NotBlank(message = "Il titolo è obbligatorio") String title,
            String notes,
            String link,
            @NotNull(message = "Il tipo è obbligatorio") ActivityType type,
            GuideType guideType
    ) {}

    // ── UPDATE ──────────────────────────────────────────────────────────────
    public record UpdateActivityRequest(
            String title,
            String notes,
            String link,
            ActivityType type,
            GuideType guideType
    ) {}

    // ── MARK DONE ───────────────────────────────────────────────────────────
    public record MarkDoneRequest(
            String doneNotes,
            String guideName
    ) {}

    // ── FILTERS (query params) ───────────────────────────────────────────────
    public record ActivityFilters(
            ActivityType type,
            Boolean done,
            GuideType guideType
    ) {}
}
