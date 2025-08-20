package com.oracle.flightmanagement.admin.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.oracle.flightmanagement.admin.entity.FlightService;
import com.oracle.flightmanagement.admin.repository.FlightServiceRepository;
import com.oracle.flightmanagement.admin.repository.FlightServiceRepositoryCustom;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class FlightServiceServiceImpl implements FlightServiceService {

    @Autowired
    private FlightServiceRepository flightServiceRepository;

    @Autowired
    @Qualifier("flightServiceRepositoryImpl")
    private FlightServiceRepositoryCustom flightServiceRepositoryCustom;

    @Override
    public List<FlightService> getAllServicesByFlightId(Long flightId) {
        return flightServiceRepositoryCustom.findByFlightId(flightId);
    }

    @Override
    public List<FlightService> getServicesByCategory(Long flightId, Long category) {
        return flightServiceRepositoryCustom.findByCategory(flightId, category);
    }

    @Override
    public FlightService addServiceToFlight(FlightService flightService) {
        // You can add validation logic here (e.g., duplicate service check)
        return flightServiceRepository.save(flightService);
    }

    @Override
    public FlightService updateService(FlightService flightService) {
        if (flightService.getServiceId() == null) {
            throw new IllegalArgumentException("Service ID cannot be null for update.");
        }

        Optional<FlightService> existing = flightServiceRepository.findById(flightService.getServiceId());
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Service with ID " + flightService.getServiceId() + " does not exist.");
        }

        return flightServiceRepository.save(flightService);
    }

    @Override
    public void deleteService(Long serviceId) {
        Optional<FlightService> existing = flightServiceRepository.findById(serviceId);
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Service with ID " + serviceId + " does not exist.");
        }

        flightServiceRepository.deleteById(serviceId);
    }

    @Override
    public Optional<FlightService> getServiceById(Long serviceId) {
        return flightServiceRepository.findById(serviceId);
    }
}
