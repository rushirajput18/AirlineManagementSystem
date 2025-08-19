package com.oracle.flightmanagement.admin.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "FLIGHTS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "flight_seq")
    @SequenceGenerator(name = "flight_seq", sequenceName = "flights_seq", allocationSize = 1)
    @Column(name = "flight_id")
    private Long flightId;

    @Column(name = "flight_route", nullable = false)
    private String flightRoute; // e.g., "DEL-BLR"

    @Column(name = "flight_number", nullable = false, unique = true)
    private String flightNumber;

    @Column(name = "departure_time")
    private LocalDateTime departureTime;

    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;
}
