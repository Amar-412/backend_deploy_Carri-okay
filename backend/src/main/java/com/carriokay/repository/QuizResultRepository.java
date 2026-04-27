package com.carriokay.repository;

import com.carriokay.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    Optional<QuizResult> findByUserId(Long userId);
}