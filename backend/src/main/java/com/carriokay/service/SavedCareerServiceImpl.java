package com.carriokay.service;

import com.carriokay.model.SavedCareer;
import com.carriokay.model.User;
import com.carriokay.repository.SavedCareerRepository;
import com.carriokay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SavedCareerServiceImpl implements SavedCareerService {

    @Autowired
    private SavedCareerRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public SavedCareer save(String email, Long careerId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        return repository.findByUserIdAndCareerId(userId, careerId)
                .orElseGet(() -> {
                    SavedCareer sc = new SavedCareer();
                    sc.setUserId(userId);
                    sc.setCareerId(careerId);
                    return repository.save(sc);
                });
    }

    @Override
    @Transactional
    public void remove(String email, Long careerId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();
        repository.deleteByUserIdAndCareerId(userId, careerId);
    }

    @Override
    public List<SavedCareer> getByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();
        return repository.findByUserId(userId);
    }
}