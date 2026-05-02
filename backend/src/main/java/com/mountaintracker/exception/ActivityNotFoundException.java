package com.mountaintracker.exception;

public class ActivityNotFoundException extends RuntimeException {

    public ActivityNotFoundException(String id) {
        super("Attività non trovata con id: " + id);
    }
}
