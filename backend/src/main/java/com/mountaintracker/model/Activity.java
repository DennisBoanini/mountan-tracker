package com.mountaintracker.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@Document(collection = "activities")
public class Activity {

    @Id
    private String id;

    private String title;
    private String notes;
    private String link;

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
        escursionismo, alpinismo, sci_alpinismo, arrampicata, altro
    }

    public enum GuideType {
        alpina, ambientale, amm
    }
}
