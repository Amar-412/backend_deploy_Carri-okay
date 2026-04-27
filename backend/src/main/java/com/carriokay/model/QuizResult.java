package com.carriokay.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "quiz_results")
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @ElementCollection
    private List<Long> careerIds;

    public QuizResult() {}

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public List<Long> getCareerIds() {
        return careerIds;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setCareerIds(List<Long> careerIds) {
        this.careerIds = careerIds;
    }
}