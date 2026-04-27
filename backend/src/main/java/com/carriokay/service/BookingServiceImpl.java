package com.carriokay.service;

import com.carriokay.model.Booking;
import com.carriokay.model.User;
import com.carriokay.model.Counsellor;
import com.carriokay.repository.BookingRepository;
import com.carriokay.repository.UserRepository;
import com.carriokay.repository.CounsellorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CounsellorRepository counsellorRepository;
    
    @Autowired
    private EmailService emailService;

    @Override
    public Booking createBooking(String email, Long counsellorId, Booking booking) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Counsellor counsellor = counsellorRepository.findById(counsellorId)
                .orElseThrow(() -> new RuntimeException("Counsellor not found"));

        if (bookingRepository.existsByCounsellorIdAndDateAndTime(
                counsellorId,
                booking.getDate(),
                booking.getTime())) {
            throw new RuntimeException("Slot already booked");
        }

        booking.setUser(user);
        booking.setCounsellor(counsellor);
        booking.setStatus("BOOKED");

        Booking saved = bookingRepository.save(booking);

       
        //EMAIL CONTENT
        String subject = "Booking Confirmed";

    String messageToUser =
            "Hello "+ user.getName() +",\n\n" +
            "Your counseling session has been successfully booked.\n\n" +
            "Details:\n" +
            "User: " + user.getName() + "\n" +
            "Counsellor: " + counsellor.getName() + "\n" +
            "Date: " + booking.getDate() + "\n" +
            "Time: " + booking.getTime() + "\n\n" +
            "Thank you.";
    
    String messageToCounsellor = 
    		 "Hello " +counsellor.getName() + ",\n\n" +
    		            "Your counseling session with "+ user.getName()+" has been successfully booked.\n\n" +
    		            "Details:\n" +
    		            "User: " + user.getName() + "\n" +
    		            "Counsellor: " + counsellor.getName() + "\n" +
    		            "Date: " + booking.getDate() + "\n" +
    		            "Time: " + booking.getTime() + "\n\n" +
    		            "Thank you.";

    //SEND EMAILS
    try {
        System.out.println("Sending email to user...");
        emailService.sendSimpleMail(user.getEmail(), subject, messageToUser);

        System.out.println("Sending email to counsellor...");
        emailService.sendSimpleMail(counsellor.getEmail(), subject, messageToCounsellor);

    } catch (Exception e) {
        e.printStackTrace(); // don’t break booking if email fails
    }


        
        return saved;
    }

    @Override
    public List<Booking> getBookingsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByUserId(user.getId());
    }

    @Override
    public List<Booking> getBookingsByCounsellor(Long counsellorId) {
        return bookingRepository.findByCounsellorId(counsellorId);
    }

    @Override
    public void cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }
}