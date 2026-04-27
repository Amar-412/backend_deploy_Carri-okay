package com.carriokay.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carriokay.model.Resource;
import com.carriokay.service.ResourceService;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    // ADD (Admin only)
    @PostMapping
    public ResponseEntity<?> addResource(@RequestBody Resource resource,
                                         Authentication authentication) {
        try {
            String email = authentication.getName();
            Resource saved = resourceService.addResource(resource, email);
            return ResponseEntity.ok(saved);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // GET RESOURCES CREATED BY LOGGED-IN ADMIN
    @GetMapping("/me")
    public ResponseEntity<List<Resource>> getResourcesByAdmin(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(resourceService.getResourcesByAdmin(email));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateResource(@PathVariable Long id,
                                            @RequestBody Resource resource) {
        try {
            Resource updated = resourceService.updateResource(id, resource);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        try {
            resourceService.deleteResource(id);
            return ResponseEntity.ok(java.util.Map.of("message", "Resource deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }
}