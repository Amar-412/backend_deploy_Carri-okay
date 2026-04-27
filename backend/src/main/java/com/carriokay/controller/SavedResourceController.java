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

import com.carriokay.model.SavedResource;
import com.carriokay.service.SavedResourceService;

@RestController
@RequestMapping("/api/saved-resources")
public class SavedResourceController {

    @Autowired
    private SavedResourceService service;

    // SAVE RESOURCE
    @PostMapping("/{resourceId}")
    public SavedResource save(Authentication authentication,
                              @PathVariable Long resourceId) {
        String email = authentication.getName();
        return service.save(email, resourceId);
    }

    // REMOVE RESOURCE
    @DeleteMapping("/{resourceId}")
    public void remove(Authentication authentication,
                       @PathVariable Long resourceId) {
        String email = authentication.getName();
        service.remove(email, resourceId);
    }

    // GET ALL SAVED RESOURCES FOR USER
    @GetMapping
    public List<SavedResource> get(Authentication authentication) {
        String email = authentication.getName();
        return service.getByUser(email);
    }
}