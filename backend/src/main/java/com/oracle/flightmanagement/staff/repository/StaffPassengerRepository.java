package com.oracle.flightmanagement.staff.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.Passenger;

@Repository
public interface StaffPassengerRepository extends JpaRepository<Passenger, Long>, StaffPassengerRepositorySimple {
}
