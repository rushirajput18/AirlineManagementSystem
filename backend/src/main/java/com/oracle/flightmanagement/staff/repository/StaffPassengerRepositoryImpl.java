package com.oracle.flightmanagement.staff.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.Passenger;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Repository
public class StaffPassengerRepositoryImpl implements StaffPassengerRepositorySimple {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Passenger> findPassengersByFlightId(Long flightId) {
        String jpql = "SELECT p FROM Passenger p WHERE p.flight.flightId = :flightId";
        TypedQuery<Passenger> query = entityManager.createQuery(jpql, Passenger.class);
        query.setParameter("flightId", flightId);
        return query.getResultList();
    }

    @Override
    public List<Passenger> filterPassengers(Long flightId, Boolean needsWheelchair, Boolean travellingWithInfant, Boolean checkedIn) {
        StringBuilder jpql = new StringBuilder("SELECT p FROM Passenger p JOIN SeatAssignment s ON p.passengerId = s.passenger.passengerId WHERE p.flight.flightId = :flightId");

        if (needsWheelchair != null) {
            jpql.append(" AND p.needsWheelchair = :needsWheelchair");
        }
        if (travellingWithInfant != null) {
            jpql.append(" AND p.travellingWithInfant = :travellingWithInfant");
        }
        if (checkedIn != null) {
            jpql.append(" AND s.checkedIn = :checkedIn");
        }

        TypedQuery<Passenger> query = entityManager.createQuery(jpql.toString(), Passenger.class);
        query.setParameter("flightId", flightId);

        if (needsWheelchair != null) {
            query.setParameter("needsWheelchair", needsWheelchair);
        }
        if (travellingWithInfant != null) {
            query.setParameter("travellingWithInfant", travellingWithInfant);
        }
        if (checkedIn != null) {
            query.setParameter("checkedIn", checkedIn);
        }

        return query.getResultList();
    }
}
