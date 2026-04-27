package com.carriokay.model;

import jakarta.persistence.*;

@Entity
@Table(name = "saved_careers")
public class SavedCareer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long careerId;

    public SavedCareer() {}

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getCareerId() { return careerId; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setCareerId(Long careerId) { this.careerId = careerId; }
}