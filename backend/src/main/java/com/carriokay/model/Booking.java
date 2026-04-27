package com.carriokay.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
    private String time;
    private String status; // BOOKED / COMPLETED / CANCELLED

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"resources"})
    private User user;

    @ManyToOne
    @JoinColumn(name = "counsellor_id")
    @JsonIgnoreProperties({"bookings"})
    private Counsellor counsellor;

    public Booking() {}

    // GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Counsellor getCounsellor() {
        return counsellor;
    }

    public void setCounsellor(Counsellor counsellor) {
        this.counsellor = counsellor;
    }
}