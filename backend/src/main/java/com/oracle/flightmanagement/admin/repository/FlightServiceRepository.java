// FlightServiceRepository.java
package com.oracle.flightmanagement.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.FlightService;

@Repository
public interface FlightServiceRepository extends JpaRepository<FlightService, Long>, FlightServiceRepositoryCustom {
}
