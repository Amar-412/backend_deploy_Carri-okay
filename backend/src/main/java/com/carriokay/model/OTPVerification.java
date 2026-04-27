package com.carriokay.model;

import jakarta.persistence.*;

@Entity
@Table(name = "otp_verifications")
public class OTPVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String otp;
    private long expiryTime;

    public OTPVerification() {}

    public Long getId() { return id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public long getExpiryTime() { return expiryTime; }
    public void setExpiryTime(long expiryTime) { this.expiryTime = expiryTime; }
}