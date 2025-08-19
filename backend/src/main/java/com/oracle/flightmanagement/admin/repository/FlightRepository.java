// FlightRepository.java
package com.oracle.flightmanagement.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.Flight;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long>, FlightRepositoryCustom {
    // You can add additional query methods here if needed
}
