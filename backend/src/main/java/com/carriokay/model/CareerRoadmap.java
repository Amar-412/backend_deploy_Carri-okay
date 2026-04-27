package com.carriokay.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "career_roadmap")
public class CareerRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int stepNumber;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String duration;

    //  RELATIONSHIP
    @ManyToOne
    @JoinColumn(name = "career_id")
    @JsonBackReference
    private CareerPath career;

    public CareerRoadmap() {}

    // ===== GETTERS =====

    public Long getId() { return id; }
    public int getStepNumber() { return stepNumber; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getDuration() { return duration; }
    public CareerPath getCareer() { return career; }

    // ===== SETTERS =====

    public void setId(Long id) { this.id = id; }
    public void setStepNumber(int stepNumber) { this.stepNumber = stepNumber; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setDuration(String duration) { this.duration = duration; }
    public void setCareer(CareerPath career) { this.career = career; }
}