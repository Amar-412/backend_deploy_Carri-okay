package com.carriokay.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "career_paths")
public class CareerPath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "career_skills", joinColumns = @JoinColumn(name = "career_id"))
    @Column(name = "skill")
    private List<String> requiredSkills;

    // RELATIONSHIP
    @OneToMany(mappedBy = "career", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<CareerRoadmap> roadmapSteps;

    public CareerPath() {}

    // ===== GETTERS =====

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public List<String> getRequiredSkills() { return requiredSkills; }
    public List<CareerRoadmap> getRoadmapSteps() { return roadmapSteps; }

    // ===== SETTERS =====

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setCategory(String category) { this.category = category; }
    public void setDescription(String description) { this.description = description; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }
    public void setRoadmapSteps(List<CareerRoadmap> roadmapSteps) { this.roadmapSteps = roadmapSteps; }
}