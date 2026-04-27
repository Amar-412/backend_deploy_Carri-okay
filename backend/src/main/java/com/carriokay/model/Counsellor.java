package com.carriokay.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "counsellors")
public class Counsellor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private int experience;

    @Column(columnDefinition = "TEXT")
    private String bio;

    // FIXED
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "counsellor_expertise",
        joinColumns = @JoinColumn(name = "counsellor_id")
    )
    @Column(name = "expertise")
    private List<String> expertise = new ArrayList<>();

    // RELATIONSHIP
  
    @OneToMany(mappedBy = "counsellor")
    @JsonIgnore
    private List<Booking> bookings;
  

    public Counsellor() {}

    // ===== GETTERS =====

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public int getExperience() { return experience; }
    public String getBio() { return bio; }
    public List<String> getExpertise() { return expertise; }
    public List<Booking> getBookings() { return bookings; }

    // ===== SETTERS =====

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setExperience(int experience) { this.experience = experience; }
    public void setBio(String bio) { this.bio = bio; }
    public void setExpertise(List<String> expertise) { this.expertise = expertise; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
}