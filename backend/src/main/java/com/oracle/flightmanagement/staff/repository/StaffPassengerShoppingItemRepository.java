package com.oracle.flightmanagement.staff.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.staff.entity.StaffPassengerShoppingItem;

@Repository
public interface StaffPassengerShoppingItemRepository extends JpaRepository<StaffPassengerShoppingItem, Long> {

    List<StaffPassengerShoppingItem> findByPassengerId(Long passengerId);

    List<StaffPassengerShoppingItem> findItemIdsByPassengerId(Long passengerId);

    void deleteByPassengerId(Long passengerId);
}
