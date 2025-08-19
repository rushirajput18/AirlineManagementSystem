package com.oracle.flightmanagement.admin.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oracle.flightmanagement.admin.entity.ServiceCategory;
import com.oracle.flightmanagement.admin.repository.ServiceCategoryRepository;

@Service
public class ServiceCategoryServiceImpl implements ServiceCategoryService {

    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;

    @Override
    public Optional<ServiceCategory> findByName(String categoryName) {
        return serviceCategoryRepository.findByCategoryNameIgnoreCase(categoryName);
    }
}
