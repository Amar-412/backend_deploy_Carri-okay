package com.carriokay.dto;

public class AdminAnalyticsDTO {

    private long totalUsers;
    private long totalResources;
    private long totalCounsellors;
    private long totalCareers;

    private long totalSavedResources;
    private long totalSavedCareers;
    private long totalBookings;

    public AdminAnalyticsDTO(long totalUsers,
                             long totalResources,
                             long totalCounsellors,
                             long totalCareers,
                             long totalSavedResources,
                             long totalSavedCareers,
                             long totalBookings) {

        this.totalUsers = totalUsers;
        this.totalResources = totalResources;
        this.totalCounsellors = totalCounsellors;
        this.totalCareers = totalCareers;
        this.totalSavedResources = totalSavedResources;
        this.totalSavedCareers = totalSavedCareers;
        this.totalBookings = totalBookings;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalResources() { return totalResources; }
    public long getTotalCounsellors() { return totalCounsellors; }
    public long getTotalCareers() { return totalCareers; }

    public long getTotalSavedResources() { return totalSavedResources; }
    public long getTotalSavedCareers() { return totalSavedCareers; }
    public long getTotalBookings() { return totalBookings; }
}