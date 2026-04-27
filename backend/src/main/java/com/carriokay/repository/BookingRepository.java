package com.carriokay.repository;

import com.carriokay.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByCounsellorId(Long counsellorId);
    
    boolean existsByCounsellorIdAndDateAndTime(Long counsellorId, String date, String time);
}