package com.carriokay.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.carriokay.model.Resource;
import com.carriokay.model.Role;
import com.carriokay.model.User;
import com.carriokay.repository.ResourceRepository;
import com.carriokay.repository.UserRepository;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Resource addResource(Resource resource, String email) {

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can do this");
        }

        resource.setCreatedByAdmin(admin);

        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public List<Resource> getResourcesByAdmin(String email) {
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can do this");
        }

        return resourceRepository.findByCreatedByAdminId(admin.getId());
    }

    @Override
    public Resource updateResource(Long id, Resource updatedResource) {

        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        existing.setTitle(updatedResource.getTitle());
        existing.setCategory(updatedResource.getCategory());
        existing.setDescription(updatedResource.getDescription());
        existing.setLink(updatedResource.getLink());

        return resourceRepository.save(existing);
    }

    @Override
    public void deleteResource(Long id) {

        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found");
        }

        resourceRepository.deleteById(id);
    }
}