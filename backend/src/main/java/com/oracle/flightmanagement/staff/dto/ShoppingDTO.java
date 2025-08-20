package com.oracle.flightmanagement.staff.dto;

import java.util.List;

public class ShoppingDTO {

    private Long passengerId;
    private List<String> shoppingItems;

    public ShoppingDTO() {
    }

    public ShoppingDTO(Long passengerId, List<String> shoppingItems) {
        this.passengerId = passengerId;
        this.shoppingItems = shoppingItems;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public List<String> getShoppingItems() {
        return shoppingItems;
    }

    public void setShoppingItems(List<String> shoppingItems) {
        this.shoppingItems = shoppingItems;
    }
}
