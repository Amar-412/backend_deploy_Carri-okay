package com.carriokay.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carriokay.model.SavedCareer;
import com.carriokay.service.SavedCareerService;

@RestController
@RequestMapping("/api/saved-careers")
public class SavedCareerController {

    @Autowired
    private SavedCareerService service;

    @PostMapping("/{careerId}")
    public SavedCareer save(Authentication authentication, @PathVariable Long careerId) {
        String email = authentication.getName();
        return service.save(email, careerId);
    }

    @DeleteMapping("/{careerId}")
    public void remove(Authentication authentication, @PathVariable Long careerId) {
        String email = authentication.getName();
        service.remove(email, careerId);
    }

    @GetMapping
    public List<SavedCareer> get(Authentication authentication) {
        String email = authentication.getName();
        return service.getByUser(email);
    }
}