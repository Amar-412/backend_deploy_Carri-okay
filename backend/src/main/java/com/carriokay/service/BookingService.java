package com.carriokay.service;

import com.carriokay.model.Booking;

import java.util.List;

public interface BookingService {

    Booking createBooking(String email, Long counsellorId, Booking booking);

    List<Booking> getBookingsByUser(String email);

    List<Booking> getBookingsByCounsellor(Long counsellorId);

    void cancelBooking(Long bookingId);
}