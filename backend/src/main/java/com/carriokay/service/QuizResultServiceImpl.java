package com.carriokay.service;

import com.carriokay.model.QuizResult;
import com.carriokay.model.User;
import com.carriokay.repository.QuizResultRepository;
import com.carriokay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuizResultServiceImpl implements QuizResultService {

    @Autowired
    private QuizResultRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public QuizResult saveResult(QuizResult result, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        result.setUserId(user.getId());

        // Replace existing result for same user
        repository.findByUserId(result.getUserId())
                .ifPresent(existing -> repository.deleteById(existing.getId()));

        return repository.save(result);
    }

    @Override
    public QuizResult getByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        return repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No quiz result found"));
    }
}