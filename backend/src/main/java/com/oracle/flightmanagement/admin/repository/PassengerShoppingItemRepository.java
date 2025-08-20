package com.oracle.flightmanagement.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.Passenger;
import com.oracle.flightmanagement.admin.entity.PassengerShoppingItem;

@Repository
public interface PassengerShoppingItemRepository extends JpaRepository<PassengerShoppingItem, Long> {

    List<PassengerShoppingItem> findByPassenger(Passenger passenger);
}
