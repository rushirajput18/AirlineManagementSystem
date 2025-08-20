package com.oracle.flightmanagement.staff.dto;

public class PassengerInFlightDTO {

    private Long passengerId;
    private String name;
    private String seatNumber;
    private String mealPreference;
    private Boolean needsWheelchair;
    private Boolean travellingWithInfant;

    public PassengerInFlightDTO() {
    }

    public PassengerInFlightDTO(Long passengerId, String name, String seatNumber, String mealPreference,
            Boolean needsWheelchair, Boolean travellingWithInfant) {
        this.passengerId = passengerId;
        this.name = name;
        this.seatNumber = seatNumber;
        this.mealPreference = mealPreference;
        this.needsWheelchair = needsWheelchair;
        this.travellingWithInfant = travellingWithInfant;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
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
