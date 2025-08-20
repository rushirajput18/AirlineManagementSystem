package com.oracle.flightmanagement.admin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.Flight;
import com.oracle.flightmanagement.admin.entity.Passenger;
import com.oracle.flightmanagement.admin.entity.SeatAssignment;

@Repository
public interface SeatAssignmentRepository extends JpaRepository<SeatAssignment, Long> {

    // @Query("SELECT s FROM SeatAssignment s WHERE s.passenger.passengerId = :passengerId AND s.flight.flightId = :flightId")
    // Optional<SeatAssignment> findSeat(@Param("passengerId") Long passengerId, @Param("flightId") Long flightId);
    // @Query(value = "SELECT * FROM seat_assignments WHERE passenger_id = :passengerId AND flight_id = :flightId", nativeQuery = true)
    // Optional<SeatAssignment> findSeat(@Param("passengerId") Long passengerId, @Param("flightId") Long flightId);
    @Query(value = "SELECT * FROM SeatAssignments WHERE passenger_id = :passengerId AND flight_id = :flightId", nativeQuery = true)
    Optional<SeatAssignment> findSeat(@Param("passengerId") Long passengerId, @Param("flightId") Long flightId);

    @Query(value = "SELECT seat_no, checked_in FROM SeatAssignments WHERE passenger_id = :passengerId AND flight_id = :flightId", nativeQuery = true)
    List<Object[]> findSeatRaw(@Param("passengerId") Long passengerId, @Param("flightId") Long flightId);

    List<SeatAssignment> findByFlight(Flight flight);

    SeatAssignment findByPassenger(Passenger passenger);

    @Query(value = "SELECT * FROM Seatassignments WHERE flight_id = :flightId", nativeQuery = true)
    List<SeatAssignment> findSeatsByFlightId(@Param("flightId") Long flightId);

    Optional<SeatAssignment> findByPassenger_PassengerIdAndFlight_FlightId(Long passengerId, Long flightId);

}
