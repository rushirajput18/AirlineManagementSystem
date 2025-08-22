package com.oracle.flightmanagement.staff.dto;

import java.time.LocalDate;

public class PassengerSeatDTO {

    private Long passengerId;
    private String seatNumber;
    private String seatClass;
    private Boolean isCheckedIn;
    private String name;
    private LocalDate dateOfBirth;
    private String passport;
    private String address;

    public PassengerSeatDTO() {
    }

    public PassengerSeatDTO(Long passengerId, String seatNumber, String seatClass, Boolean isCheckedIn, String name, LocalDate dateOfBirth, String passport, String address) {
        this.passengerId = passengerId;
        this.seatNumber = seatNumber;
        this.seatClass = seatClass;
        this.isCheckedIn = isCheckedIn;
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.passport = passport;
        this.address = address;

    }

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getSeatClass() {
        return seatClass;
    }

    public void setSeatClass(String seatClass) {
        this.seatClass = seatClass;
    }

    public Boolean getIsCheckedIn() {
        return isCheckedIn;
    }

    public void setIsCheckedIn(Boolean isCheckedIn) {
        this.isCheckedIn = isCheckedIn;
    }

    public String getName() {
        return name;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPassport() {
        return passport;
    }

    public void setPassport(String passport) {
        this.passport = passport;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setName(String name) {
        this.name = name;
    }
}
