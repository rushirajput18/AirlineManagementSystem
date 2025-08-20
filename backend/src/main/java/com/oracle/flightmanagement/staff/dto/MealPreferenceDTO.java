package com.oracle.flightmanagement.staff.dto;

public class MealPreferenceDTO {

    private Long passengerId;
    private String mealPreference;

    public MealPreferenceDTO() {
    }

    public MealPreferenceDTO(Long passengerId, String mealPreference) {
        this.passengerId = passengerId;
        this.mealPreference = mealPreference;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public String getMealPreference() {
        return mealPreference;
    }

    public void setMealPreference(String mealPreference) {
        this.mealPreference = mealPreference;
    }
}
