// PassengerRepository.java
package com.oracle.flightmanagement.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.Passenger;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long>, PassengerRepositoryCustom {
}
