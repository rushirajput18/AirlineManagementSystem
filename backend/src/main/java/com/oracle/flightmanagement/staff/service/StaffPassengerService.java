package com.oracle.flightmanagement.staff.service;

import java.util.List;

import com.oracle.flightmanagement.admin.dto.FlightDTO;
import com.oracle.flightmanagement.staff.dto.AncillaryDTO;
import com.oracle.flightmanagement.staff.dto.MealPreferenceDTO;
import com.oracle.flightmanagement.staff.dto.PassengerCheckInDTO;
import com.oracle.flightmanagement.staff.dto.PassengerInFlightDTO;
import com.oracle.flightmanagement.staff.dto.PassengerSeatDTO;
import com.oracle.flightmanagement.staff.dto.SeatDTO;
import com.oracle.flightmanagement.staff.dto.ShoppingDTO;

public interface StaffPassengerService {

    // Common Endpoint
    List<FlightDTO> getAllFlightsForStaff();

    // Check-In Service
    List<PassengerSeatDTO> getPassengersForFlight(Long flightId);

    List<SeatDTO> getSeatMapForFlight(Long flightId);

    PassengerCheckInDTO checkInPassenger(Long passengerId, Long flightId);

    PassengerCheckInDTO checkOutPassenger(Long passengerId, Long flightId);

    // In-Flight Service
    List<PassengerInFlightDTO> getInFlightPassengers(Long flightId);

    void selectAncillaries(Long passengerId, AncillaryDTO dto);

    void updateAncillaries(Long passengerId, AncillaryDTO dto);

    void selectMealPreference(Long passengerId, MealPreferenceDTO dto);

    void updateMealPreference(Long passengerId, MealPreferenceDTO dto);

    void selectShoppingItems(Long passengerId, ShoppingDTO dto);

    void updateShoppingItems(Long passengerId, ShoppingDTO dto);
}
