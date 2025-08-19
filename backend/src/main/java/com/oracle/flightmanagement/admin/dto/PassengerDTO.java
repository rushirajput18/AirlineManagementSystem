package com.oracle.flightmanagement.admin.dto;

import java.time.LocalDate;

public class PassengerDTO {

    private Long passengerId;
    private Long flightId; // 🆕 Needed to associate passenger to a flight

    private String name;
    private LocalDate dateOfBirth;
    private String passport;
    private String address;
    private String mealPreference;
    private Boolean needsWheelchair;
    private Boolean travellingWithInfant;

    // Getters and Setters
    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getMealPreference() {
        return mealPreference;
    }

    public void setMealPreference(String mealPreference) {
        this.mealPreference = mealPreference;
    }

    public Boolean getNeedsWheelchair() {
        return needsWheelchair;
    }

    public void setNeedsWheelchair(Boolean needsWheelchair) {
        this.needsWheelchair = needsWheelchair;
    }

    public Boolean getTravellingWithInfant() {
        return travellingWithInfant;
    }

    public void setTravellingWithInfant(Boolean travellingWithInfant) {
        this.travellingWithInfant = travellingWithInfant;
    }
}
