package com.carriokay.service;

import com.carriokay.model.OTPVerification;
import com.carriokay.model.User;
import com.carriokay.repository.OTPRepository;
import com.carriokay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OTPRepository otpRepository;
    
    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public User register(User user) {

        String normalizedEmail = user.getEmail().trim().toLowerCase();
        user.setEmail(normalizedEmail);

        if(userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public User login(String email, String password) {

        String normalizedEmail = email.trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Backward compatibility for legacy plaintext passwords stored before BCrypt migration.
        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }

        if (user.getPassword().equals(password)) {
            user.setPassword(passwordEncoder.encode(password));
            return userRepository.save(user);
        }

        throw new RuntimeException("Invalid password");
    }
    
    @Transactional
    public String sendOtp(String email) {

        email = email.trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        OTPVerification record = new OTPVerification();
        record.setEmail(email);
        record.setOtp(otp);
        record.setExpiryTime(System.currentTimeMillis() + 2 * 60 * 1000); // 2 min time limit	

        otpRepository.deleteByEmail(email);
        otpRepository.save(record);

        emailService.sendSimpleMail(
            email,
            "OTP Verification",
            "Your OTP is: " + otp + " (valid for 2 minutes)\n Please do not share it."
        );

        return "OTP sent successfully";
    }
    
    @Transactional
    public User verifyOtpAndRegister(User user, String otp) {

        String email = user.getEmail().trim().toLowerCase();
        user.setEmail(email);

        OTPVerification record = otpRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (!record.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (record.getExpiryTime() < System.currentTimeMillis()) {
            throw new RuntimeException("OTP expired");
        }

        otpRepository.deleteByEmail(email);

        // reusing the existing logic thik h ??
        return register(user);
    }
}