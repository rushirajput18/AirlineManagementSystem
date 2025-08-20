package com.oracle.flightmanagement.staff.service;

import java.util.List;

import com.oracle.flightmanagement.staff.entity.StaffPassengerCheckInView;
import com.oracle.flightmanagement.staff.entity.StaffPassengerInFlightView;

public interface StaffPassengerServiceSimple {

    List<StaffPassengerCheckInView> getPassengerCheckInView(Long flightId);

    List<StaffPassengerCheckInView> filterPassengerCheckInView(Long flightId, Boolean needsWheelchair, Boolean travellingWithInfant, Boolean checkedIn);

    List<StaffPassengerInFlightView> getPassengerInFlightView(Long flightId);

    void checkInPassenger(Long passengerId, String seatNo);

    void checkOutPassenger(Long passengerId);
}
