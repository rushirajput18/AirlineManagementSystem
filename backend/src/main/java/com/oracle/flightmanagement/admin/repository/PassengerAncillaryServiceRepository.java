package com.oracle.flightmanagement.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.Passenger;
import com.oracle.flightmanagement.admin.entity.PassengerAncillaryService;

@Repository
public interface PassengerAncillaryServiceRepository extends JpaRepository<PassengerAncillaryService, Long> {

    List<PassengerAncillaryService> findByPassenger(Passenger passenger);
}
