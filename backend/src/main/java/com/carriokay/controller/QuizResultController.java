package com.carriokay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carriokay.model.QuizResult;
import com.carriokay.service.QuizResultService;

@RestController
@RequestMapping("/api/quiz")
public class QuizResultController {

    @Autowired
    private QuizResultService service;

    @PostMapping
    public QuizResult save(@RequestBody QuizResult result, Authentication authentication) {
        String email = authentication.getName();
        return service.saveResult(result, email);
    }

    @GetMapping("/me")
    public QuizResult get(Authentication authentication) {
        String email = authentication.getName();
        return service.getByUser(email);
    }
}