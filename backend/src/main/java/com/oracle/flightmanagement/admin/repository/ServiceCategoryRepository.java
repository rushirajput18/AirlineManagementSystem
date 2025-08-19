package com.oracle.flightmanagement.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.flightmanagement.admin.entity.ServiceCategory;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {

    Optional<ServiceCategory> findByCategoryNameIgnoreCase(String categoryName);
}
