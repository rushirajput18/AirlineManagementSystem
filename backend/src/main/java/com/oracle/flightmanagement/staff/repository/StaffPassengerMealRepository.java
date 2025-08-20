package com.oracle.flightmanagement.staff.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.staff.entity.StaffPassengerMeal;

@Repository
public interface StaffPassengerMealRepository extends JpaRepository<StaffPassengerMeal, Long> {

Optional<StaffPassengerMeal> findByPassengerId(Long passengerId);

    void deleteByPassengerId(Long passengerId);
}
