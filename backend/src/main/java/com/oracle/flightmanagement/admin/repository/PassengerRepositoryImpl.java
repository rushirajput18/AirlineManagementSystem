package com.oracle.flightmanagement.admin.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.Passenger;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Repository
public class PassengerRepositoryImpl implements PassengerRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Passenger> findPassengersByFlightId(Long flightId) {
        String jpql = "SELECT p FROM Passenger p WHERE p.flight.flightId = :flightId";
        return entityManager.createQuery(jpql, Passenger.class)
                .setParameter("flightId", flightId)
                .getResultList();
    }

    @Override
    public List<Passenger> findPassengersMissingDetails(Long flightId, boolean missingDOB, boolean missingPassport, boolean missingAddress) {
        StringBuilder jpql = new StringBuilder("SELECT p FROM Passenger p WHERE p.flight.flightId = :flightId AND (");
        List<String> clauses = new ArrayList<>();
        if (missingDOB) {
            clauses.add("p.dateOfBirth IS NULL");
        }
        if (missingPassport) {
            clauses.add("p.passport IS NULL OR p.passport = ''");
        }
        if (missingAddress) {
            clauses.add("p.address IS NULL OR p.address = ''");
        }
        jpql.append(String.join(" OR ", clauses)).append(")");

        TypedQuery<Passenger> query = entityManager.createQuery(jpql.toString(), Passenger.class);
        query.setParameter("flightId", flightId);
        return query.getResultList();
    }

    @Override
    public List<Passenger> filterPassengersBySpecialNeeds(Long flightId, Boolean needsWheelchair, Boolean withInfant) {
        StringBuilder jpql = new StringBuilder("SELECT p FROM Passenger p WHERE p.flight.flightId = :flightId");
        if (needsWheelchair != null) {
            jpql.append(" AND p.needWheelchair = :needsWheelchair");
        }
        if (withInfant != null) {
            jpql.append(" AND p.travellingWithInfant = :withInfant");
        }

        TypedQuery<Passenger> query = entityManager.createQuery(jpql.toString(), Passenger.class);
        query.setParameter("flightId", flightId);
        if (needsWheelchair != null) {
            query.setParameter("needsWheelchair", needsWheelchair);
        }
        if (withInfant != null) {
            query.setParameter("withInfant", withInfant);
        }
        return query.getResultList();
    }

}
