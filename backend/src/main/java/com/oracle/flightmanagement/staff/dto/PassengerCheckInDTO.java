package com.oracle.flightmanagement.staff.dto;

public class PassengerCheckInDTO {

    private Long passengerId;
    private Long flightId;
    private Boolean isCheckedIn;
    private String checkInStatusMessage;

    public PassengerCheckInDTO() {
    }

    public PassengerCheckInDTO(Long passengerId, Long flightId, Boolean isCheckedIn, String checkInStatusMessage) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.isCheckedIn = isCheckedIn;
        this.checkInStatusMessage = checkInStatusMessage;
    }

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

    public Boolean getIsCheckedIn() {
        return isCheckedIn;
    }

    public void setIsCheckedIn(Boolean isCheckedIn) {
        this.isCheckedIn = isCheckedIn;
    }

    public String getCheckInStatusMessage() {
        return checkInStatusMessage;
    }

    public void setCheckInStatusMessage(String checkInStatusMessage) {
        this.checkInStatusMessage = checkInStatusMessage;
    }
}
