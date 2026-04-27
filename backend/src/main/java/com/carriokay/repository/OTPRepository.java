package com.carriokay.repository;

import com.carriokay.model.OTPVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OTPRepository extends JpaRepository<OTPVerification, Long> {

    Optional<OTPVerification> findByEmail(String email);

    void deleteByEmail(String email);
}