package com.oracle.flightmanagement.staff.dto;

import java.util.List;

public class AncillaryDTO {

    private Long passengerId;
    private List<Long> selectedAncillaries;

    public AncillaryDTO() {
    }

    public AncillaryDTO(Long passengerId, List<Long> selectedAncillaries) {
        this.passengerId = passengerId;
        this.selectedAncillaries = selectedAncillaries;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public List<Long> getSelectedAncillaries() {
        return selectedAncillaries;
    }

    public void setSelectedAncillaries(List<Long> selectedAncillaries) {
        this.selectedAncillaries = selectedAncillaries;
    }
}
