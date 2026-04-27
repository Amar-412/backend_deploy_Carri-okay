package com.carriokay.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String link;

    @ManyToOne
    @JoinColumn(name = "created_by_admin_id")
    @JsonIgnoreProperties({"resources"}) // prevent infinite loop
    private User createdByAdmin;

    public Resource() {}


    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public User getCreatedByAdmin() {
        return createdByAdmin;
    }

    public void setCreatedByAdmin(User createdByAdmin) {
        this.createdByAdmin = createdByAdmin;
    }
}