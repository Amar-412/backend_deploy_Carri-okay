package com.carriokay.service;

import com.carriokay.model.User;

public interface AuthService {

    User register(User user);

    User login(String email, String password);
    
    public String sendOtp(String email);
    public User verifyOtpAndRegister(User user, String otp);

}