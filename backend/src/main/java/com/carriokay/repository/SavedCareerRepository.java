package com.carriokay.repository;

import com.carriokay.model.SavedCareer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedCareerRepository extends JpaRepository<SavedCareer, Long> {

    List<SavedCareer> findByUserId(Long userId);

    Optional<SavedCareer> findByUserIdAndCareerId(Long userId, Long careerId);

    void deleteByUserIdAndCareerId(Long userId, Long careerId);
}