package com.oracle.flightmanagement.staff.dto;

public class PassengerSeatDTO {

    private Long passengerId;
    private String seatNumber;
    private String seatClass;
    private Boolean isCheckedIn;

    public PassengerSeatDTO() {
    }

    public PassengerSeatDTO(Long passengerId, String seatNumber, String seatClass, Boolean isCheckedIn) {
        this.passengerId = passengerId;
        this.seatNumber = seatNumber;
        this.seatClass = seatClass;
        this.isCheckedIn = isCheckedIn;
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
}
