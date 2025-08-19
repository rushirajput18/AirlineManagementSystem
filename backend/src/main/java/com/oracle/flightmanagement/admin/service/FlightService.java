package com.oracle.flightmanagement.admin.service;

import java.util.List;
import java.util.Optional;

import com.oracle.flightmanagement.admin.entity.Flight;

public interface FlightService {

    List<Flight> getAllFlights();

    List<Flight> searchFlightsByRoute(String route);

    Optional<Flight> getFlightDetails(Long flightId);

    Optional<Flight> getFlightById(Long flightId);

    Flight addFlight(Flight flight);

    Flight updateFlight(Flight flight);

    void deleteFlight(Long flightId);
}
