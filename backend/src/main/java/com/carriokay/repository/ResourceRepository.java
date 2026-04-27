package com.carriokay.repository;

import com.carriokay.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByCreatedByAdminId(Long adminId);
}