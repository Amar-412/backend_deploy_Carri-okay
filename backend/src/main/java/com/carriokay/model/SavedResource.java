package com.carriokay.model;

import jakarta.persistence.*;

@Entity
@Table(name = "saved_resources")
public class SavedResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long resourceId;

    public SavedResource() {}

    // ===== GETTERS =====
    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getResourceId() {
        return resourceId;
    }

    // ===== SETTERS =====
    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }
}