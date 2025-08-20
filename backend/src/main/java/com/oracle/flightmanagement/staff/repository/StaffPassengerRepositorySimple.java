package com.oracle.flightmanagement.staff.repository;

import java.util.List;

import com.oracle.flightmanagement.admin.entity.Passenger;

public interface StaffPassengerRepositorySimple {

    List<Passenger> findPassengersByFlightId(Long flightId);

    List<Passenger> filterPassengers(Long flightId, Boolean needsWheelchair, Boolean travellingWithInfant, Boolean checkedIn);
}
