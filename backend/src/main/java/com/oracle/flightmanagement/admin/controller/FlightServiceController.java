package com.oracle.flightmanagement.admin.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // This is the service class
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oracle.flightmanagement.admin.dto.FlightServiceDTO;
import com.oracle.flightmanagement.admin.entity.Flight;
import com.oracle.flightmanagement.admin.entity.ServiceCategory;
import com.oracle.flightmanagement.admin.service.FlightService;
import com.oracle.flightmanagement.admin.service.FlightServiceService;
import com.oracle.flightmanagement.admin.service.ServiceCategoryService;

@RestController
@RequestMapping("/api/flight-services")
public class FlightServiceController {

    @Autowired
    private FlightServiceService flightServiceService;

    @Autowired
    private FlightService flightDataService; // Service class

    @Autowired
    private ServiceCategoryService serviceCategoryService;

    // Convert Entity to DTO
    private FlightServiceDTO toDTO(com.oracle.flightmanagement.admin.entity.FlightService service) {
        FlightServiceDTO dto = new FlightServiceDTO();
        dto.setServiceId(service.getServiceId());
        dto.setFlightId(service.getFlight().getFlightId());
        dto.setCategory(service.getCategory().getCategoryName());
        dto.setName(service.getServiceName());
        dto.setType(service.getServiceType());
        dto.setPrice(service.getPrice());
        return dto;
    }

    // Convert DTO to Entity
    private com.oracle.flightmanagement.admin.entity.FlightService toEntity(FlightServiceDTO dto) {
        com.oracle.flightmanagement.admin.entity.FlightService service = new com.oracle.flightmanagement.admin.entity.FlightService();
        service.setServiceId(dto.getServiceId());

        // Fetch and set Flight
        Flight flight = flightDataService.getFlightDetails(dto.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found with ID: " + dto.getFlightId()));
        service.setFlight(flight);

        // Fetch and set Category
        ServiceCategory category = serviceCategoryService.findByName(dto.getCategory())
                .orElseThrow(() -> new RuntimeException("Category not found: " + dto.getCategory()));
        service.setCategory(category);

        service.setServiceName(dto.getName());
        service.setServiceType(dto.getType());
        service.setPrice(dto.getPrice());
        return service;
    }

    // Get all services for a flight
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<FlightServiceDTO>> getAllServicesByFlightId(@PathVariable Long flightId) {
        List<com.oracle.flightmanagement.admin.entity.FlightService> services = flightServiceService.getAllServicesByFlightId(flightId);
        List<FlightServiceDTO> dtos = services.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get services by flight ID and category
    @GetMapping("/flight/{flightId}/category/{category}")
    public ResponseEntity<List<FlightServiceDTO>> getServicesByCategory(
            @PathVariable Long flightId, @PathVariable Long category) {
        List<com.oracle.flightmanagement.admin.entity.FlightService> services = flightServiceService.getServicesByCategory(flightId, category);
        List<FlightServiceDTO> dtos = services.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get service by ID
    @GetMapping("/{serviceId}")
    public ResponseEntity<FlightServiceDTO> getServiceById(@PathVariable Long serviceId) {
        Optional<com.oracle.flightmanagement.admin.entity.FlightService> service = flightServiceService.getServiceById(serviceId);
        return service.map(s -> ResponseEntity.ok(toDTO(s)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Add a new service to a flight
    @PostMapping
    public ResponseEntity<FlightServiceDTO> addServiceToFlight(@RequestBody FlightServiceDTO dto) {
        com.oracle.flightmanagement.admin.entity.FlightService savedService = flightServiceService.addServiceToFlight(toEntity(dto));
        return ResponseEntity.ok(toDTO(savedService));
    }

    // Update an existing service
    @PutMapping
    public ResponseEntity<FlightServiceDTO> updateService(@RequestBody FlightServiceDTO dto) {
        com.oracle.flightmanagement.admin.entity.FlightService updatedService = flightServiceService.updateService(toEntity(dto));
        return ResponseEntity.ok(toDTO(updatedService));
    }

    // Delete service
    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable Long serviceId) {
        flightServiceService.deleteService(serviceId);
        return ResponseEntity.noContent().build();
    }
}
