package com.oracle.flightmanagement.staff.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "PassengerMeals", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"passenger_id", "service_id"})
})
public class StaffPassengerMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "passenger_id", nullable = false)
    private Long passengerId;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    public StaffPassengerMeal() {
    }

    public StaffPassengerMeal(Long passengerId, Long serviceId) {
        this.passengerId = passengerId;
        this.serviceId = serviceId;
    }

    public Long getId() {
        return id;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }
}
