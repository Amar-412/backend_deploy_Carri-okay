package com.carriokay.service;

import com.carriokay.model.SavedResource;

import java.util.List;

public interface SavedResourceService {

    SavedResource save(String email, Long resourceId);

    void remove(String email, Long resourceId);

    List<SavedResource> getByUser(String email);
}