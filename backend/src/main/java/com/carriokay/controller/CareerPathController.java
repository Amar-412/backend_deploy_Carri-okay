package com.carriokay.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carriokay.model.CareerPath;
import com.carriokay.service.CareerPathService;

@RestController
@RequestMapping("/api/careers")
public class CareerPathController {

    @Autowired
    private CareerPathService service;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody CareerPath career) {
        try {
            return ResponseEntity.ok(service.addCareer(career));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            CareerPath career = service.getCareerById(id);
            return ResponseEntity.ok(career);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public List<CareerPath> getAll() {
        return service.getAllCareers();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody CareerPath career) {
        try {
            return ResponseEntity.ok(service.updateCareer(id, career));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.deleteCareer(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}