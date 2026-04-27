package com.carriokay.service;

import com.carriokay.dto.AdminAnalyticsDTO;
import com.carriokay.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired private UserRepository userRepo;
    @Autowired private ResourceRepository resourceRepo;
    @Autowired private CounsellorRepository counsellorRepo;
    @Autowired private CareerPathRepository careerRepo;

    @Autowired private SavedResourceRepository savedResourceRepo;
    @Autowired private SavedCareerRepository savedCareerRepo;
    @Autowired private BookingRepository bookingRepo;

    @Override
    public AdminAnalyticsDTO getAnalytics() {

        long totalUsers = userRepo.count();
        long totalResources = resourceRepo.count();
        long totalCounsellors = counsellorRepo.count();
        long totalCareers = careerRepo.count();

        long totalSavedResources = savedResourceRepo.count();
        long totalSavedCareers = savedCareerRepo.count();
        long totalBookings = bookingRepo.count();

        return new AdminAnalyticsDTO(
                totalUsers,
                totalResources,
                totalCounsellors,
                totalCareers,
                totalSavedResources,
                totalSavedCareers,
                totalBookings
        );
    }
}