package com.oracle.flightmanagement.admin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.Flight;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
@Primary
public class FlightRepositoryImpl implements FlightRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Flight> findAllFlights() {
        String jpql = "SELECT f FROM Flight f";
        return entityManager.createQuery(jpql, Flight.class).getResultList();
    }

    @Override
    public List<Flight> findFlightsByRoute(String route) {
        String jpql = "SELECT f FROM Flight f WHERE f.flightRoute  LIKE :route";
        return entityManager.createQuery(jpql, Flight.class)
                .setParameter("route", "%" + route + "%")
                .getResultList();
    }

    @Override
    public Optional<Flight> findFlightWithDetailsById(Long flightId) {
        String jpql = "SELECT f FROM Flight f "
                + "LEFT JOIN FETCH f.seatAssignments "
                + // example of fetching related entities eagerly
                "WHERE f.flightId = :flightId";

        List<Flight> result = entityManager.createQuery(jpql, Flight.class)
                .setParameter("flightId", flightId)
                .getResultList();

        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }
}
