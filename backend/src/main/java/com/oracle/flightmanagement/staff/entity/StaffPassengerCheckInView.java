package com.oracle.flightmanagement.staff.entity;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffPassengerCheckInView {

    private Long passengerId;
    private String name;
    private LocalDate dateOfBirth;
    private String passport;
    private String address;

    private String seatNo;
    private Boolean checkedIn;

    private Boolean needsWheelchair;
    private Boolean travellingWithInfant;
}
