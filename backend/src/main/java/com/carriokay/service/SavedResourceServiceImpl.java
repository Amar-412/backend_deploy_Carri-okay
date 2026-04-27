package com.carriokay.service;

import com.carriokay.model.SavedResource;
import com.carriokay.model.User;
import org.springframework.transaction.annotation.Transactional;
import com.carriokay.repository.SavedResourceRepository;
import com.carriokay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavedResourceServiceImpl implements SavedResourceService {

    @Autowired
    private SavedResourceRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public SavedResource save(String email, Long resourceId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        return repository.findByUserIdAndResourceId(userId, resourceId)
                .orElseGet(() -> {
                    SavedResource sr = new SavedResource();
                    sr.setUserId(userId);
                    sr.setResourceId(resourceId);
                    return repository.save(sr);
                });
    }

    @Override
    @Transactional
    public void remove(String email, Long resourceId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();
        repository.deleteByUserIdAndResourceId(userId, resourceId);
    }

    @Override
    public List<SavedResource> getByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();
        return repository.findByUserId(userId);
    }
}