package com.oracle.flightmanagement.admin.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "FLIGHTSERVICES") // ✅ Not "flight_services"
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightService {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "flight_service_seq")
    @SequenceGenerator(name = "flight_service_seq", sequenceName = "flight_services_seq", allocationSize = 1)
    @Column(name = "service_id")
    private Long serviceId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Column(name = "service_type")
    private String serviceType;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

}
