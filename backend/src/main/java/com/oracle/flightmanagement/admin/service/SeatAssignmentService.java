package com.oracle.flightmanagement.admin.service;

import java.util.List;
import java.util.Optional;

import com.oracle.flightmanagement.admin.entity.SeatAssignment;

public interface SeatAssignmentService {

    List<SeatAssignment> getSeatAssignmentsByFlightId(Long flightId);

    Optional<SeatAssignment> getSeatAssignmentById(Long seatAssignmentId);

    SeatAssignment addSeatAssignment(SeatAssignment seatAssignment);

    SeatAssignment updateSeatAssignment(SeatAssignment seatAssignment);

    void deleteSeatAssignment(Long seatAssignmentId);
}
