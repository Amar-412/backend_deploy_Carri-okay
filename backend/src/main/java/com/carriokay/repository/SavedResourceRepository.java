package com.carriokay.repository;

import com.carriokay.model.SavedResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedResourceRepository extends JpaRepository<SavedResource, Long> {

    List<SavedResource> findByUserId(Long userId);

    Optional<SavedResource> findByUserIdAndResourceId(Long userId, Long resourceId);

    void deleteByUserIdAndResourceId(Long userId, Long resourceId);
}
