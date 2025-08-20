package com.oracle.flightmanagement.staff.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.staff.entity.StaffPassengerAncillaryService;

import jakarta.transaction.Transactional;

@Repository
public interface StaffPassengerAncillaryServiceRepository extends JpaRepository<StaffPassengerAncillaryService, Long> {

    List<StaffPassengerAncillaryService> findByPassengerId(Long passengerId);

    @Transactional
    @Modifying
    @Query("DELETE FROM StaffPassengerAncillaryService s WHERE s.passengerId = :passengerId")
    void deleteByPassengerId(@Param("passengerId") Long passengerId);

    @Query("SELECT s.serviceId FROM StaffPassengerAncillaryService s WHERE s.passengerId = :passengerId")
    List<Long> findServiceIdsByPassengerId(@Param("passengerId") Long passengerId);

}
