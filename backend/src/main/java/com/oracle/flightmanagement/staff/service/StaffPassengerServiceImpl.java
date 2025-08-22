package com.oracle.flightmanagement.staff.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oracle.flightmanagement.admin.dto.FlightDTO;
import com.oracle.flightmanagement.admin.entity.Passenger;
import com.oracle.flightmanagement.admin.entity.SeatAssignment;
import com.oracle.flightmanagement.admin.repository.FlightRepository;
import com.oracle.flightmanagement.admin.repository.PassengerRepositoryCustom;
import com.oracle.flightmanagement.admin.repository.SeatAssignmentRepository;
import com.oracle.flightmanagement.staff.dto.AncillaryDTO;
import com.oracle.flightmanagement.staff.dto.MealPreferenceDTO;
import com.oracle.flightmanagement.staff.dto.PassengerCheckInDTO;
import com.oracle.flightmanagement.staff.dto.PassengerInFlightDTO;
import com.oracle.flightmanagement.staff.dto.PassengerSeatDTO;
import com.oracle.flightmanagement.staff.dto.SeatDTO;
import com.oracle.flightmanagement.staff.dto.ShoppingDTO;
import com.oracle.flightmanagement.staff.entity.StaffPassengerAncillaryService;
import com.oracle.flightmanagement.staff.entity.StaffPassengerMeal;
import com.oracle.flightmanagement.staff.entity.StaffPassengerShoppingItem;
import com.oracle.flightmanagement.staff.repository.StaffPassengerAncillaryServiceRepository;
import com.oracle.flightmanagement.staff.repository.StaffPassengerMealRepository;
import com.oracle.flightmanagement.staff.repository.StaffPassengerShoppingItemRepository;

@Service
public class StaffPassengerServiceImpl implements StaffPassengerService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    @Qualifier("passengerRepositoryImpl")
    private PassengerRepositoryCustom passengerRepositoryCustom;

    @Autowired
    private SeatAssignmentRepository seatAssignmentRepository;

    @Autowired
    private StaffPassengerAncillaryServiceRepository ancillaryRepo;

    @Autowired
    private StaffPassengerMealRepository mealRepo;

    @Autowired
    private StaffPassengerShoppingItemRepository shoppingRepo;

    // Common
    @Override
    public List<FlightDTO> getAllFlightsForStaff() {
        return flightRepository.findAll().stream().map(flight -> {
            FlightDTO dto = new FlightDTO();
            dto.setFlightId(flight.getFlightId());
            dto.setFlightNumber(flight.getFlightNumber());

            String[] routeParts = flight.getFlightRoute().split("-");
            dto.setOrigin(routeParts.length > 0 ? routeParts[0] : null);
            dto.setDestination(routeParts.length > 1 ? routeParts[1] : null);

            dto.setDepartureTime(flight.getDepartureTime());
            dto.setArrivalTime(flight.getArrivalTime());
            return dto;
        }).collect(Collectors.toList());
    }

    // Check-In
    @Override
    public List<PassengerSeatDTO> getPassengersForFlight(Long flightId) {
        List<Passenger> passengers = passengerRepositoryCustom.findPassengersByFlightId(flightId);

        return passengers.stream().map(p -> {
            System.out.println("Looking for seat assignment with passengerId=" + p.getPassengerId() + " and flightId=" + flightId);

            List<Object[]> results = seatAssignmentRepository.findSeatRaw(p.getPassengerId(), flightId);
            System.out.println("Raw seat: " + results);

            PassengerSeatDTO dto = new PassengerSeatDTO();
            dto.setPassengerId(p.getPassengerId());

            if (!results.isEmpty()) {
                Object[] row = results.get(0);
                dto.setSeatNumber((String) row[0]);
                dto.setIsCheckedIn(((Number) row[1]).intValue() == 1);
            } else {
                dto.setSeatNumber(null);
                dto.setIsCheckedIn(false);
            }

            dto.setSeatClass("Economy"); // Placeholder
            dto.setName(p.getName() != null ? p.getName() : null);
            dto.setDateOfBirth(p.getDateOfBirth() != null ? p.getDateOfBirth() : null);
            dto.setPassport(p.getPassport() != null ? p.getPassport() : null);
            dto.setAddress(p.getAddress() != null ? p.getAddress() : null);

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<SeatDTO> getSeatMapForFlight(Long flightId) {
        List<SeatAssignment> seats = seatAssignmentRepository.findSeatsByFlightId(flightId);

        return seats.stream().map(seat -> {
            SeatDTO dto = new SeatDTO();
            dto.setSeatNumber(seat.getSeatNo());
            dto.setSeatClass("Economy"); // Placeholder
            dto.setIsAvailable(!seat.getCheckedIn());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PassengerCheckInDTO checkInPassenger(Long passengerId, Long flightId) {
        System.out.println("🔍 Attempting check-in for passengerId=" + passengerId + ", flightId=" + flightId);

        List<Object[]> results = seatAssignmentRepository.findSeatRaw(passengerId, flightId);
        System.out.println("📦 Raw seat query returned " + results.size() + " result(s)");

        if (!results.isEmpty()) {
            System.out.println("🪑 Raw seat data: seatNo=" + results.get(0)[0] + ", checkedIn=" + results.get(0)[1]);
        } else {
            System.out.println("⚠️ No seat assignment found in raw query for passengerId=" + passengerId + ", flightId=" + flightId);
        }

        Optional<SeatAssignment> seatOpt = seatAssignmentRepository.findSeat(passengerId, flightId);

        if (seatOpt.isEmpty()) {
            System.out.println("❌ No SeatAssignment found using native query for passengerId=" + passengerId + ", flightId=" + flightId);
            return new PassengerCheckInDTO(passengerId, flightId, false, "Seat assignment not found");
        }

        SeatAssignment seat = seatOpt.get();
        System.out.println("✅ SeatAssignment found: seatNo=" + seat.getSeatNo() + ", checkedIn=" + seat.getCheckedIn());

        if (Boolean.TRUE.equals(seat.getCheckedIn())) {
            System.out.println("ℹ️ Passenger already checked in: seatNo=" + seat.getSeatNo());
            return new PassengerCheckInDTO(passengerId, flightId, true, "Passenger already checked in");
        }

        seat.setCheckedIn(true);
        seatAssignmentRepository.saveAndFlush(seat); // Ensures immediate update
        System.out.println("🎉 Passenger " + passengerId + " checked in successfully for flight " + flightId);

        return new PassengerCheckInDTO(passengerId, flightId, true, "Checked in successfully");
    }

    @Override
    @Transactional
    public PassengerCheckInDTO checkOutPassenger(Long passengerId, Long flightId) {
        List<Object[]> results = seatAssignmentRepository.findSeatRaw(passengerId, flightId);

        if (results.isEmpty()) {
            return new PassengerCheckInDTO(passengerId, null, false, "No seat found");
        }

        Optional<SeatAssignment> seatOpt = seatAssignmentRepository
                .findByPassenger_PassengerIdAndFlight_FlightId(passengerId, flightId);

        SeatAssignment seat = seatOpt.get();
        seat.setCheckedIn(false);
        seatAssignmentRepository.save(seat);

        return new PassengerCheckInDTO(passengerId, flightId, false, "Checked out successfully");
    }

    // In-Flight
    @Override
    public List<PassengerInFlightDTO> getInFlightPassengers(Long flightId) {
        List<Passenger> passengers = passengerRepositoryCustom.findPassengersByFlightId(flightId);

        return passengers.stream().map(p -> {
            List<Object[]> results = seatAssignmentRepository.findSeatRaw(p.getPassengerId(), flightId);

            PassengerInFlightDTO dto = new PassengerInFlightDTO();
            dto.setPassengerId(p.getPassengerId());
            dto.setName(p.getName());
            dto.setSeatNumber(!results.isEmpty() ? (String) results.get(0)[0] : null);
            dto.setMealPreference(p.getMealPreference());
            dto.setNeedsWheelchair(p.getNeedsWheelchair());
            dto.setTravellingWithInfant(p.getTravellingWithInfant());
            return dto;
        }).collect(Collectors.toList());
    }

    // Ancillaries
    @Override
    @Transactional
    public void selectAncillaries(Long passengerId, AncillaryDTO dto) {
        // Step 1: Validate input
        if (dto.getSelectedAncillaries() == null || dto.getSelectedAncillaries().isEmpty()) {
            System.out.println("⚠️ No ancillary services selected for passengerId=" + passengerId);
            return;
        }

        // Step 2: Fetch existing service IDs for the passenger
        List<Long> existingServiceIds = ancillaryRepo.findServiceIdsByPassengerId(passengerId);

        // Step 3: Filter out already existing services
        List<StaffPassengerAncillaryService> newServices = dto.getSelectedAncillaries().stream()
                .distinct()
                .filter(serviceId -> !existingServiceIds.contains(serviceId))
                .map(serviceId -> new StaffPassengerAncillaryService(passengerId, serviceId))
                .collect(Collectors.toList());
        System.out.println("🧪 New services to insert: " + newServices);
        System.out.println("🔍 Existing service IDs for passenger " + passengerId + ": " + existingServiceIds);
        System.out.println("🧪 Transaction active: " + org.springframework.transaction.support.TransactionSynchronizationManager.isActualTransactionActive());

        // Step 4: Save only new services
        try {
            ancillaryRepo.saveAll(newServices);
            ancillaryRepo.flush(); // Forces Hibernate to push changes immediately

            System.out.println("✅ Added " + newServices.size() + " new ancillary services for passengerId=" + passengerId);
        } catch (Exception e) {
            System.err.println("❌ Failed to save ancillary services: " + e.getMessage());
        }

        // Step 5: Log each saved service
        newServices.forEach(s
                -> System.out.println("📦 Saved: passengerId=" + s.getPassengerId() + ", serviceId=" + s.getServiceId())
        );
    }

    @Override
    @Transactional
    public void updateAncillaries(Long passengerId, AncillaryDTO dto) {
        if (dto.getSelectedAncillaries() == null) {
            System.out.println("⚠️ No ancillary services provided for update for passengerId=" + passengerId);
            return;
        }

        // Delete all existing services
        ancillaryRepo.deleteByPassengerId(passengerId);
        System.out.println("🧹 Cleared existing ancillary services for passengerId=" + passengerId);

        // Insert new ones
        List<StaffPassengerAncillaryService> updatedServices = dto.getSelectedAncillaries().stream()
                .distinct()
                .map(serviceId -> new StaffPassengerAncillaryService(passengerId, serviceId))
                .collect(Collectors.toList());

        try {
            ancillaryRepo.saveAll(updatedServices);
            ancillaryRepo.flush();
            System.out.println("✅ Updated ancillary services for passengerId=" + passengerId);
        } catch (Exception e) {
            System.err.println("❌ Failed to update ancillary services: " + e.getMessage());
        }

        updatedServices.forEach(s
                -> System.out.println("📦 Updated: passengerId=" + s.getPassengerId() + ", serviceId=" + s.getServiceId())
        );
    }

    @Override
    @Transactional
    public void selectMealPreference(Long passengerId, MealPreferenceDTO dto) {
        // Step 1: Validate input
        if (dto.getMealPreference() == null || dto.getMealPreference().isBlank()) {
            System.out.println("⚠️ No meal preference provided for passengerId=" + passengerId);
            return;
        }

        // Step 2: Check if meal already exists
        Optional<StaffPassengerMeal> existingMeal = mealRepo.findByPassengerId(passengerId);
        if (existingMeal.isPresent()) {
            System.out.println("❌ Meal preference already exists for passengerId=" + passengerId);
            throw new IllegalStateException("Meal preference already exists for passengerId=" + passengerId);
        }

        // Step 3: Insert new meal preference
        StaffPassengerMeal newMeal = new StaffPassengerMeal(passengerId, Long.parseLong(dto.getMealPreference()));
        try {
            mealRepo.save(newMeal);
            mealRepo.flush();
            System.out.println("✅ Meal preference inserted for passengerId=" + passengerId + ", mealId=" + dto.getMealPreference());
        } catch (Exception e) {
            System.err.println("❌ Failed to insert meal preference: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void updateMealPreference(Long passengerId, MealPreferenceDTO dto) {
        // Step 1: Validate input
        if (dto.getMealPreference() == null || dto.getMealPreference().isBlank()) {
            System.out.println("⚠️ No meal preference provided for update for passengerId=" + passengerId);
            return;
        }

        // Step 2: Delete existing preference
        mealRepo.deleteByPassengerId(passengerId);
        System.out.println("🧹 Cleared existing meal preference for passengerId=" + passengerId);

        // Step 3: Insert new preference
        StaffPassengerMeal updatedMeal = new StaffPassengerMeal(passengerId, Long.parseLong(dto.getMealPreference()));
        try {
            mealRepo.save(updatedMeal);
            mealRepo.flush();
            System.out.println("🔄 Meal preference updated for passengerId=" + passengerId + ", new mealId=" + dto.getMealPreference());
        } catch (Exception e) {
            System.err.println("❌ Failed to update meal preference: " + e.getMessage());
        }
    }

    // Shopping
    @Override
    @Transactional
    public void selectShoppingItems(Long passengerId, ShoppingDTO dto) {
        // Step 1: Validate input
        if (dto.getShoppingItems() == null || dto.getShoppingItems().isEmpty()) {
            System.out.println("⚠️ No shopping items selected for passengerId=" + passengerId);
            return;
        }

        // Step 2: Fetch existing item IDs for the passenger
        List<Long> existingItemIds = shoppingRepo.findItemIdsByPassengerId(passengerId);

        // Step 3: Filter out already existing items
        List<StaffPassengerShoppingItem> newItems = dto.getShoppingItems().stream()
                .distinct()
                .filter(itemId -> !existingItemIds.contains(itemId))
                .map(itemId -> new StaffPassengerShoppingItem(passengerId, Long.parseLong(itemId)))
                .collect(Collectors.toList());

        System.out.println("🧪 New shopping items to insert: " + newItems);
        System.out.println("🔍 Existing item IDs for passenger " + passengerId + ": " + existingItemIds);
        System.out.println("🧪 Transaction active: " + org.springframework.transaction.support.TransactionSynchronizationManager.isActualTransactionActive());

        // Step 4: Save only new items
        try {
            shoppingRepo.saveAll(newItems);
            shoppingRepo.flush();
            System.out.println("✅ Added " + newItems.size() + " new shopping items for passengerId=" + passengerId);
        } catch (Exception e) {
            System.err.println("❌ Failed to save shopping items: " + e.getMessage());
        }

        // Step 5: Log each saved item
        newItems.forEach(item
                -> System.out.println("📦 Saved: passengerId=" + item.getPassengerId() + ", itemId=" + item.getId())
        );
    }

    @Override
    @Transactional
    public void updateShoppingItems(Long passengerId, ShoppingDTO dto) {
        // Step 1: Validate input
        if (dto.getShoppingItems() == null) {
            System.out.println("⚠️ No shopping items provided for update for passengerId=" + passengerId);
            return;
        }

        // Step 2: Delete all existing items
        shoppingRepo.deleteByPassengerId(passengerId);
        System.out.println("🧹 Cleared existing shopping items for passengerId=" + passengerId);

        // Step 3: Insert new items
        List<StaffPassengerShoppingItem> updatedItems = dto.getShoppingItems().stream()
                .distinct()
                .map(itemId -> new StaffPassengerShoppingItem(passengerId, Long.parseLong(itemId)))
                .collect(Collectors.toList());

        try {
            shoppingRepo.saveAll(updatedItems);
            shoppingRepo.flush();
            System.out.println("✅ Updated shopping items for passengerId=" + passengerId);
        } catch (Exception e) {
            System.err.println("❌ Failed to update shopping items: " + e.getMessage());
        }

        updatedItems.forEach(item
                -> System.out.println("📦 Updated: passengerId=" + item.getPassengerId() + ", itemId=" + item.getId())
        );
    }

}
