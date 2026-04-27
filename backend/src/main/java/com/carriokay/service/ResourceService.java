package com.carriokay.service;

import com.carriokay.model.Resource;
import java.util.List;

public interface ResourceService {

    Resource addResource(Resource resource, String email);

    List<Resource> getAllResources();

    List<Resource> getResourcesByAdmin(String email);

    Resource updateResource(Long id, Resource resource);

    void deleteResource(Long id);
}