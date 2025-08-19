package com.oracle.flightmanagement.admin.repository;

import java.util.List;
import java.util.Optional;

import com.oracle.flightmanagement.admin.entity.Flight;

public interface FlightRepositoryCustom {

    List<Flight> findAllFlights();

    List<Flight> findFlightsByRoute(String route);

    Optional<Flight> findFlightWithDetailsById(Long flightId);
}
