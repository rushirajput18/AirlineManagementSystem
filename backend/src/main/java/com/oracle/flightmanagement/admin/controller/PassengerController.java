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

import com.oracle.flightmanagement.admin.dto.PassengerDTO;
import com.oracle.flightmanagement.admin.entity.Flight;
import com.oracle.flightmanagement.admin.entity.Passenger;
import com.oracle.flightmanagement.admin.service.FlightService;
import com.oracle.flightmanagement.admin.service.PassengerService;

@RestController
@RequestMapping("/admin/passengers")
public class PassengerController {

    @Autowired
    private PassengerService passengerService;

    @Autowired
    private FlightService flightService;

    // Convert Entity to DTO
    private PassengerDTO toDTO(Passenger p) {
        PassengerDTO dto = new PassengerDTO();
        dto.setPassengerId(p.getPassengerId());
        dto.setName(p.getName());
        dto.setDateOfBirth(p.getDateOfBirth());
        dto.setPassport(p.getPassport());
        dto.setAddress(p.getAddress());
        dto.setMealPreference(p.getMealPreference());
        dto.setNeedsWheelchair(p.getNeedsWheelchair());
        dto.setTravellingWithInfant(p.getTravellingWithInfant());
        if (p.getFlight() != null) {
            dto.setFlightId(p.getFlight().getFlightId());
        }
        return dto;
    }

    // Convert DTO to Entity
    private Passenger toEntity(PassengerDTO dto) {
        Passenger p = new Passenger();
        p.setPassengerId(dto.getPassengerId());
        p.setName(dto.getName());
        p.setDateOfBirth(dto.getDateOfBirth());
        p.setPassport(dto.getPassport());
        p.setAddress(dto.getAddress());
        p.setMealPreference(dto.getMealPreference());
        p.setNeedsWheelchair(dto.getNeedsWheelchair());
        p.setTravellingWithInfant(dto.getTravellingWithInfant());

        if (dto.getFlightId() != null) {
            Optional<Flight> flight = flightService.getFlightDetails(dto.getFlightId());
            flight.ifPresent(p::setFlight);
        }

        return p;
    }

    @GetMapping("/{passengerId}")
    public ResponseEntity<PassengerDTO> getPassengerById(@PathVariable Long passengerId) {
        Optional<Passenger> passenger = passengerService.getPassengerById(passengerId);
        return passenger.map(p -> ResponseEntity.ok(toDTO(p)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PassengerDTO> addPassenger(@RequestBody PassengerDTO passengerDTO) {
        Passenger savedPassenger = passengerService.addPassenger(toEntity(passengerDTO));
        return ResponseEntity.ok(toDTO(savedPassenger));
    }

    @PutMapping("/{passengerId}")
    public ResponseEntity<PassengerDTO> updatePassenger(@PathVariable Long passengerId,
            @RequestBody PassengerDTO passengerDTO) {
        if (!passengerId.equals(passengerDTO.getPassengerId())) {
            return ResponseEntity.badRequest().build();
        }
        Passenger updatedPassenger = passengerService.updatePassenger(toEntity(passengerDTO));
        return ResponseEntity.ok(toDTO(updatedPassenger));
    }

    @DeleteMapping("/{passengerId}")
    public ResponseEntity<Void> deletePassenger(@PathVariable Long passengerId) {
        passengerService.deletePassenger(passengerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<PassengerDTO>> getPassengersByFlight(@PathVariable Long flightId,
            @RequestParam(required = false) String filter) {

        List<Passenger> passengers = passengerService.getPassengersByFlightId(flightId);

        if (filter != null) {
            switch (filter.toLowerCase()) {
                case "missingdob":
                    passengers = passengers.stream()
                            .filter(p -> p.getDateOfBirth() == null)
                            .collect(Collectors.toList());
                    break;
                case "missingpassport":
                    passengers = passengers.stream()
                            .filter(p -> p.getPassport() == null || p.getPassport().isEmpty())
                            .collect(Collectors.toList());
                    break;
                case "missingaddress":
                    passengers = passengers.stream()
                            .filter(p -> p.getAddress() == null || p.getAddress().isEmpty())
                            .collect(Collectors.toList());
                    break;
                // Add more filters if needed
            }
        }

        List<PassengerDTO> dtos = passengers.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
