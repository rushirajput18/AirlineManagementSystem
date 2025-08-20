package com.oracle.flightmanagement.admin.repository;

import java.util.List;

import com.oracle.flightmanagement.admin.entity.Passenger;

public interface PassengerRepositoryCustom {

    
    List<Passenger> findPassengersByFlightId(Long flightId);

    List<Passenger> findPassengersMissingDetails(Long flightId, boolean missingDOB, boolean missingPassport, boolean missingAddress);

    List<Passenger> filterPassengersBySpecialNeeds(Long flightId, Boolean needsWheelchair, Boolean withInfant);
}
