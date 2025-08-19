package com.oracle.flightmanagement.admin.repository;

import java.util.List;

import com.oracle.flightmanagement.admin.entity.FlightService;

public interface FlightServiceRepositoryCustom {

    List<FlightService> findByFlightId(Long flightId);

    List<FlightService> findByCategory(Long flightId, String category);

}
