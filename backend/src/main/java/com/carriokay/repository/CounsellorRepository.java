package com.carriokay.repository;

import com.carriokay.model.Counsellor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CounsellorRepository extends JpaRepository<Counsellor, Long> {

    Optional<Counsellor> findByEmail(String email);

    boolean existsByEmail(String email);
}