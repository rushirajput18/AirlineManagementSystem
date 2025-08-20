package com.oracle.flightmanagement.staff.entity;

import java.util.List;

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
public class StaffPassengerInFlightView {

    private Long passengerId;
    private String name;
    private String seatNo;

    private String mealPreference;
    private List<String> selectedMeals;
    private List<String> selectedAncillaries;
    private List<String> selectedShoppingItems;
}
