package com.carriokay.service;

import com.carriokay.model.CareerPath;
import java.util.List;

public interface CareerPathService {

    CareerPath addCareer(CareerPath career);

    List<CareerPath> getAllCareers();

    CareerPath updateCareer(Long id, CareerPath career);
    
    CareerPath getCareerById(Long id);

    void deleteCareer(Long id);
}