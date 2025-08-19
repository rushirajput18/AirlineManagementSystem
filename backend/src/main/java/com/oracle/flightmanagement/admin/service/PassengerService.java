package com.oracle.flightmanagement.admin.service;

import java.util.List;
import java.util.Optional;

import com.oracle.flightmanagement.admin.entity.Passenger;

public interface PassengerService {

    List<Passenger> getPassengersByFlightId(Long flightId);

    List<Passenger> getPassengersMissingDetails(Long flightId, boolean missingDOB, boolean missingPassport, boolean missingAddress);

    List<Passenger> filterPassengersBySpecialNeeds(Long flightId, Boolean needsWheelchair, Boolean withInfant);

    Optional<Passenger> getPassengerById(Long passengerId);

    Passenger addPassenger(Passenger passenger);

    Passenger updatePassenger(Passenger passenger);

    void deletePassenger(Long passengerId);
}
