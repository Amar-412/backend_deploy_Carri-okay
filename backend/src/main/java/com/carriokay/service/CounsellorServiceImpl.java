package com.carriokay.service;

import com.carriokay.model.Counsellor;
import com.carriokay.repository.CounsellorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CounsellorServiceImpl implements CounsellorService {

    @Autowired
    private CounsellorRepository repository;

    @Override
    public Counsellor addCounsellor(Counsellor c) {

        if (repository.existsByEmail(c.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // ✅ NULL SAFETY
        if (c.getExpertise() == null) {
            c.setExpertise(List.of());
        }

        return repository.save(c);
    }

    @Override
    public List<Counsellor> getAllCounsellors() {
        return repository.findAll();
    }

    @Override
    public Counsellor updateCounsellor(Long id, Counsellor c) {

        Counsellor existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Counsellor not found"));

        if (!existing.getEmail().equals(c.getEmail()) &&
            repository.existsByEmail(c.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        existing.setName(c.getName());
        existing.setEmail(c.getEmail());
        existing.setExperience(c.getExperience());
        existing.setBio(c.getBio());

        // 🔥 CORRECT EXPERTISE UPDATE
        existing.getExpertise().clear();

        if (c.getExpertise() != null) {
            existing.getExpertise().addAll(c.getExpertise());
        }

        return repository.save(existing);
    }

    @Override
    public void deleteCounsellor(Long id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Counsellor not found");
        }

        repository.deleteById(id);
    }
}