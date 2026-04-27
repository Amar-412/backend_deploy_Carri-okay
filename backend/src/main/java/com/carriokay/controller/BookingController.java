package com.carriokay.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carriokay.model.Booking;
import com.carriokay.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // CREATE BOOKING
    @PostMapping("/{counsellorId}")
    public ResponseEntity<?> createBooking(Authentication authentication,
                                           @PathVariable Long counsellorId,
                                           @RequestBody Booking booking) {
        try {
            String email = authentication.getName();
            Booking saved = bookingService.createBooking(email, counsellorId, booking);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // LOGGED-IN USER BOOKINGS
    @GetMapping("/me")
    public List<Booking> getUserBookings(Authentication authentication) {
        String email = authentication.getName();
        return bookingService.getBookingsByUser(email);
    }

    // COUNSELLOR BOOKINGS
    @GetMapping("/counsellor/{counsellorId}")
    public List<Booking> getCounsellorBookings(@PathVariable Long counsellorId) {
        return bookingService.getBookingsByCounsellor(counsellorId);
    }

    //CANCEL
    @PutMapping("/cancel/{bookingId}")
    public void cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
    }
}