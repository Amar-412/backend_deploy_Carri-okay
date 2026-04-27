package com.carriokay.service;

import com.carriokay.model.SavedCareer;

import java.util.List;

public interface SavedCareerService {

    SavedCareer save(String email, Long careerId);

    void remove(String email, Long careerId);

    List<SavedCareer> getByUser(String email);
}