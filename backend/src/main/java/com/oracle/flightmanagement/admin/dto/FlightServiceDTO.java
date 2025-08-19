package com.oracle.flightmanagement.admin.dto;

import java.math.BigDecimal;

public class FlightServiceDTO {

    private Long serviceId;
    private Long flightId;  // to link service to flight
    private String category; // anciliary, meals, shopping
    private String name;     // service name or item name
    private String type;     // for meals, e.g., veg/non-veg (optional)
    private BigDecimal price;

    // Getters and setters
    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
