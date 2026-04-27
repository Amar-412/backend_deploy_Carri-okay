package com.carriokay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carriokay.dto.AdminAnalyticsDTO;
import com.carriokay.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/analytics")
    public AdminAnalyticsDTO getAnalytics() {
        return adminService.getAnalytics();
    }
}	