package com.oracle.flightmanagement.admin.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oracle.flightmanagement.admin.dto.FlightDTO;
import com.oracle.flightmanagement.admin.entity.Flight;
import com.oracle.flightmanagement.admin.service.FlightService;

@RestController
@RequestMapping("/api/admin/flights")
public class FlightController {

    @Autowired
    private FlightService flightService;

    // Convert Entity to DTO
    private FlightDTO toDTO(Flight flight) {
        FlightDTO dto = new FlightDTO();
        dto.setFlightId(flight.getFlightId());
        dto.setFlightNumber(flight.getFlightNumber());

        // Split route into origin and destination
        if (flight.getFlightRoute() != null && flight.getFlightRoute().contains("-")) {
            String[] parts = flight.getFlightRoute().split("-");
            if (parts.length == 2) {
                dto.setOrigin(parts[0]);
                dto.setDestination(parts[1]);
            }
        }

        dto.setDepartureTime(flight.getDepartureTime());
        dto.setArrivalTime(flight.getArrivalTime());
        return dto;
    }

    // Convert DTO to Entity
    private Flight toEntity(FlightDTO dto) {
        Flight flight = new Flight();
        flight.setFlightId(dto.getFlightId());
        flight.setFlightNumber(dto.getFlightNumber());

        // Merge origin and destination into flightRoute
        if (dto.getOrigin() != null && dto.getDestination() != null) {
            flight.setFlightRoute(dto.getOrigin() + "-" + dto.getDestination());
        }

        flight.setDepartureTime(dto.getDepartureTime());
        flight.setArrivalTime(dto.getArrivalTime());
        return flight;
    }

    @GetMapping
    public ResponseEntity<List<FlightDTO>> getAllFlights() {
        List<Flight> flights = flightService.getAllFlights();
        System.out.println(">> Flight list from DB: " + flights.size());
        flights.forEach(f -> System.out.println(" - " + f.getFlightNumber()));

        List<FlightDTO> dtos = flights.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<FlightDTO>> searchFlights(@RequestParam String route) {
        List<Flight> flights = flightService.searchFlightsByRoute(route);
        List<FlightDTO> dtos = flights.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{flightId}")
    public ResponseEntity<FlightDTO> getFlightById(@PathVariable Long flightId) {
        Optional<Flight> flight = flightService.getFlightDetails(flightId);
        return flight.map(f -> ResponseEntity.ok(toDTO(f)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FlightDTO> addFlight(@RequestBody FlightDTO flightDTO) {
        Flight flight = toEntity(flightDTO);
        Flight savedFlight = flightService.addFlight(flight);
        return ResponseEntity.ok(toDTO(savedFlight));
    }

    @PutMapping("/{flightId}")
    public ResponseEntity<FlightDTO> updateFlight(@PathVariable Long flightId, @RequestBody FlightDTO flightDTO) {
        if (!flightId.equals(flightDTO.getFlightId())) {
            return ResponseEntity.badRequest().build();
        }
        Flight updatedFlight = flightService.updateFlight(toEntity(flightDTO));
        return ResponseEntity.ok(toDTO(updatedFlight));
    }

    @DeleteMapping("/{flightId}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long flightId) {
        flightService.deleteFlight(flightId);
        return ResponseEntity.noContent().build();
    }
}
