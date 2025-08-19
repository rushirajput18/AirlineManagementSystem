package com.oracle.flightmanagement.admin.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oracle.flightmanagement.admin.entity.Flight;
import com.oracle.flightmanagement.admin.repository.FlightRepository;
import com.oracle.flightmanagement.admin.repository.FlightRepositoryCustom;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class FlightServiceImpl implements FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private FlightRepositoryCustom flightRepositoryCustom;

    @Override
    public List<Flight> getAllFlights() {
        List<Flight> list = flightRepositoryCustom.findAllFlights();
        System.out.println(">> flights count = " + list.size()); // debugging!
        return list;

    }

    @Override
    public List<Flight> searchFlightsByRoute(String route) {
        return flightRepositoryCustom.findFlightsByRoute(route);
    }

    @Override
    public Optional<Flight> getFlightDetails(Long flightId) {
        return flightRepositoryCustom.findFlightWithDetailsById(flightId);
    }

    @Override
    public Optional<Flight> getFlightById(Long flightId) {
        return flightRepository.findById(flightId);
    }

    @Override
    public Flight addFlight(Flight flight) {
        if (flight == null) {
            throw new IllegalArgumentException("Flight cannot be null");
        }
        // Additional validations if needed
        return flightRepository.save(flight);
    }

    @Override
    public Flight updateFlight(Flight flight) {
        if (flight == null || flight.getFlightId() == null) {
            throw new IllegalArgumentException("Flight and Flight ID cannot be null for update.");
        }

        Optional<Flight> existingFlight = flightRepository.findById(flight.getFlightId());
        if (existingFlight.isEmpty()) {
            throw new IllegalArgumentException("Flight with ID " + flight.getFlightId() + " does not exist.");
        }

        return flightRepository.save(flight);
    }

    @Override
    public void deleteFlight(Long flightId) {
        if (flightId == null) {
            throw new IllegalArgumentException("Flight ID cannot be null for deletion.");
        }

        Optional<Flight> existingFlight = flightRepository.findById(flightId);
        if (existingFlight.isEmpty()) {
            throw new IllegalArgumentException("Flight with ID " + flightId + " does not exist.");
        }

        flightRepository.deleteById(flightId);
    }
}
