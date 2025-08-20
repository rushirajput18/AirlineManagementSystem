package com.oracle.flightmanagement.staff.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oracle.flightmanagement.admin.dto.FlightDTO;
import com.oracle.flightmanagement.staff.dto.AncillaryDTO;
import com.oracle.flightmanagement.staff.dto.MealPreferenceDTO;
import com.oracle.flightmanagement.staff.dto.PassengerCheckInDTO;
import com.oracle.flightmanagement.staff.dto.PassengerInFlightDTO;
import com.oracle.flightmanagement.staff.dto.PassengerSeatDTO;
import com.oracle.flightmanagement.staff.dto.SeatDTO;
import com.oracle.flightmanagement.staff.dto.ShoppingDTO;
import com.oracle.flightmanagement.staff.service.StaffPassengerService;

@RestController
@RequestMapping("/staff")
public class StaffPassengerController {

    @Autowired
    private StaffPassengerService staffPassengerService;

    // 🛫 Common Endpoint
    @GetMapping("/flights")
    public List<FlightDTO> getAllFlightsForStaff() {
        return staffPassengerService.getAllFlightsForStaff();
    }

    // ✅ Check-In Endpoints
    @GetMapping("/flights/{flightId}/passengers")
    public List<PassengerSeatDTO> getPassengersForFlight(@PathVariable Long flightId) {
        return staffPassengerService.getPassengersForFlight(flightId);
    }

    @GetMapping("/flights/{flightId}/seats")
    public List<SeatDTO> getSeatMap(@PathVariable Long flightId) {
        return staffPassengerService.getSeatMapForFlight(flightId);
    }

    @PutMapping("/flights/{flightId}/passengers/{passengerId}/checkin")
    public PassengerCheckInDTO checkInPassenger(@PathVariable Long flightId, @PathVariable Long passengerId) {
        return staffPassengerService.checkInPassenger(passengerId, flightId);
    }

    @PutMapping("/flights/{flightId}/passengers/{passengerId}/checkout")
    public PassengerCheckInDTO checkOutPassenger(@PathVariable Long flightId, @PathVariable Long passengerId) {
        return staffPassengerService.checkOutPassenger(passengerId, flightId);
    }

    // 🍽️ In-Flight Endpoints
    @GetMapping("/flights/{flightId}/inflight/passengers")
    public List<PassengerInFlightDTO> getInFlightPassengers(@PathVariable Long flightId) {
        return staffPassengerService.getInFlightPassengers(flightId);
    }

    @PostMapping("/passengers/{passengerId}/inflight/ancillaries")
    public ResponseEntity<String> selectAncillaries(@PathVariable Long passengerId, @RequestBody AncillaryDTO dto) {
        staffPassengerService.selectAncillaries(passengerId, dto);
        return ResponseEntity.ok("Ancillary services updated successfully for passenger " + passengerId);
    }

    @PutMapping("/passengers/{passengerId}/inflight/ancillaries")
    public void updateAncillaries(@PathVariable Long passengerId, @RequestBody AncillaryDTO dto) {
        staffPassengerService.updateAncillaries(passengerId, dto);
    }

    @PostMapping("/passengers/{passengerId}/inflight/meals/preference")
    public void selectMealPreference(@PathVariable Long passengerId, @RequestBody MealPreferenceDTO dto) {
        staffPassengerService.selectMealPreference(passengerId, dto);
    }

    @PutMapping("/passengers/{passengerId}/inflight/meals/preference")
    public void updateMealPreference(@PathVariable Long passengerId, @RequestBody MealPreferenceDTO dto) {
        staffPassengerService.updateMealPreference(passengerId, dto);
    }

    @PostMapping("/passengers/{passengerId}/inflight/shopping")
    public void selectShoppingItems(@PathVariable Long passengerId, @RequestBody ShoppingDTO dto) {
        staffPassengerService.selectShoppingItems(passengerId, dto);
    }

    @PutMapping("/passengers/{passengerId}/inflight/shopping")
    public void updateShoppingItems(@PathVariable Long passengerId, @RequestBody ShoppingDTO dto) {
        staffPassengerService.updateShoppingItems(passengerId, dto);
    }
}
