package com.oracle.flightmanagement.admin.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Passengers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "passenger_seq")
    @SequenceGenerator(name = "passenger_seq", sequenceName = "passengers_seq", allocationSize = 1)
    @Column(name = "passenger_id")
    private Long passengerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "passport")
    private String passport;

    @Lob
    @Column(name = "address")
    private String address;

    @Column(name = "meal_preference", nullable = false)
    private String mealPreference; // Could consider Enum here later

    @Column(name = "need_wheelchair", nullable = false)
    private Boolean needsWheelchair;

    @Column(name = "travelling_with_infant", nullable = false)
    private Boolean travellingWithInfant;
}
