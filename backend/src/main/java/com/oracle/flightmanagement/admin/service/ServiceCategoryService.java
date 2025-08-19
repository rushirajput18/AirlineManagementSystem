package com.oracle.flightmanagement.admin.service;

import java.util.Optional;

import com.oracle.flightmanagement.admin.entity.ServiceCategory;

public interface ServiceCategoryService {

    Optional<ServiceCategory> findByName(String categoryName);
}
