package com.mountaintracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "activities")
public class Activity {

    @Id
    private String id;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityLink {
        private String name;
        private String url;
    }

    private String title;
    private String notes;
    private List<ActivityLink> links = new ArrayList<>();

    @Indexed
    private ActivityType type;

    @Indexed
    private GuideType guideType;

    @Indexed
    private boolean done = false;

    private Instant doneAt;
    private String doneNotes;
    private String guideName;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public enum ActivityType {
        via_ferrata, via_multipitch, canale_invernale, cresta,
        escursionismo, alpinismo, sci_alpinismo, arrampicata, canale_estivo, altro
    }

    public enum GuideType {
        alpina, ambientale, amm
    }
}
