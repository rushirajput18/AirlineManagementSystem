package com.oracle.flightmanagement.staff.dto;

public class SeatDTO {

    private String seatNumber;
    private String seatClass;
    private Boolean isAvailable;

    public SeatDTO() {
    }

    public SeatDTO(String seatNumber, String seatClass, Boolean isAvailable) {
        this.seatNumber = seatNumber;
        this.seatClass = seatClass;
        this.isAvailable = isAvailable;
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

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
}
