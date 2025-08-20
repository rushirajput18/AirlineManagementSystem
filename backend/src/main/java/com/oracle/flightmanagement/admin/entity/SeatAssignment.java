package com.oracle.flightmanagement.admin.entity;

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
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "SeatAssignments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"flight_id", "seat_no"}),
    @UniqueConstraint(columnNames = {"passenger_id", "flight_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seat_assignments_seq")
    @SequenceGenerator(name = "seat_assignments_seq", sequenceName = "seat_assignments_seq", allocationSize = 1)
    @Column(name = "assignment_id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;

    @Column(name = "seat_no", nullable = false, length = 10)
    private String seatNo;

    @Column(name = "checked_in", nullable = false)
    @Builder.Default
    private Boolean checkedIn = false;
}
