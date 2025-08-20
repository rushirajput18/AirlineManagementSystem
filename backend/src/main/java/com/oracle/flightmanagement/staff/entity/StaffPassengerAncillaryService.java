package com.oracle.flightmanagement.staff.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "PassengerAncillaryServices", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"passenger_id", "service_id"})
})
public class StaffPassengerAncillaryService {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pas_ancillary_seq")
    @SequenceGenerator(name = "pas_ancillary_seq", sequenceName = "pas_ancillary_seq", allocationSize = 1)
    private Long id;

    @Column(name = "passenger_id", nullable = false)
    private Long passengerId;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    public StaffPassengerAncillaryService() {
    }

    public StaffPassengerAncillaryService(Long passengerId, Long serviceId) {
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
