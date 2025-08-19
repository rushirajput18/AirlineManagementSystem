package com.oracle.flightmanagement.admin.service;

import java.util.List;
import java.util.Optional;

import com.oracle.flightmanagement.admin.entity.FlightService;

public interface FlightServiceService {

    List<FlightService> getAllServicesByFlightId(Long flightId);

    List<FlightService> getServicesByCategory(Long flightId, String category);

    FlightService addServiceToFlight(FlightService flightService);

    FlightService updateService(FlightService flightService);

    void deleteService(Long serviceId);

    Optional<FlightService> getServiceById(Long serviceId);
}
