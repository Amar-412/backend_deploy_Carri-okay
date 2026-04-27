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

import com.carriokay.model.Counsellor;
import com.carriokay.service.CounsellorService;

@RestController
@RequestMapping("/api/counsellors")
public class CounsellorController {

    @Autowired
    private CounsellorService service;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Counsellor c) {
        try {
            return ResponseEntity.ok(service.addCounsellor(c));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public List<Counsellor> getAll() {
        return service.getAllCounsellors();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody Counsellor c) {
        try {
            return ResponseEntity.ok(service.updateCounsellor(id, c));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.deleteCounsellor(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}