package com.oracle.flightmanagement.admin.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.Flight;
import com.oracle.flightmanagement.admin.entity.FlightService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Repository
public class FlightServiceRepositoryImpl implements FlightServiceRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<FlightService> findByFlightId(Long flightId) {
//         Flight flight = entityManager.find(Flight.class, flightId);
//         System.out.println("Flight found: " + flight);
        String jpql = "SELECT fs FROM FlightService fs WHERE fs.flight.flightId = :flightId";
        TypedQuery<FlightService> query = entityManager.createQuery(jpql, FlightService.class);
        query.setParameter("flightId", flightId);
        return query.getResultList();
    }

    @Override
    public List<FlightService> findByCategory(Long flightId, Long category) {
        String jpql = "SELECT fs FROM FlightService fs WHERE fs.flight.flightId = :flightId AND fs.category.categoryId = :category";
        TypedQuery<FlightService> query = entityManager.createQuery(jpql, FlightService.class);
        query.setParameter("flightId", flightId);
        query.setParameter("category", category);
        return query.getResultList();
    }

//     public List<FlightService> findAllServices() {
//         String jpql = "SELECT fs FROM FlightService fs";
//         TypedQuery<FlightService> query = entityManager.createQuery(jpql, FlightService.class);
//         List<FlightService> results = query.getResultList();
//         System.out.println("Total services found (no filter): " + results.size());
//         return results;
//     }

}
