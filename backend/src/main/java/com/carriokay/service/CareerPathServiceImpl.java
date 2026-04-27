package com.carriokay.service;

import com.carriokay.model.CareerPath;
import com.carriokay.model.CareerRoadmap;
import com.carriokay.repository.CareerPathRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CareerPathServiceImpl implements CareerPathService {

    @Autowired
    private CareerPathRepository repository;

    @Override
    public CareerPath addCareer(CareerPath career) {

        //  LINK ROADMAP → CAREER
        if (career.getRoadmapSteps() != null) {
            for (CareerRoadmap step : career.getRoadmapSteps()) {
                step.setCareer(career);
            }
        }

        return repository.save(career);
    }

    @Override
    public List<CareerPath> getAllCareers() {
        return repository.findAll();
    }

    @Override
    public CareerPath getCareerById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Career not found"));
    }
    
    @Override
    public CareerPath updateCareer(Long id, CareerPath career) {

        CareerPath existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Career not found"));

        existing.setTitle(career.getTitle());
        existing.setCategory(career.getCategory());
        existing.setDescription(career.getDescription());
        existing.setRequiredSkills(career.getRequiredSkills());

        //  CLEAR OLD + SET NEW ROADMAP
        existing.getRoadmapSteps().clear();

        if (career.getRoadmapSteps() != null) {
            for (CareerRoadmap step : career.getRoadmapSteps()) {
                step.setCareer(existing);
                existing.getRoadmapSteps().add(step);
            }
        }

        return repository.save(existing);
    }

    @Override
    public void deleteCareer(Long id) {
    	
        if (!repository.existsById(id)) {
            throw new RuntimeException("Career not found");
        }

        repository.deleteById(id);
    }
}