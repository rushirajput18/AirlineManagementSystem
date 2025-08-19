package com.oracle.flightmanagement.admin.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.oracle.flightmanagement.admin.entity.Passenger;
import com.oracle.flightmanagement.admin.repository.PassengerRepository;
import com.oracle.flightmanagement.admin.repository.PassengerRepositoryCustom;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PassengerServiceImpl implements PassengerService {

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    @Qualifier("passengerRepositoryImpl")  // explicitly specify your custom impl bean name
    private PassengerRepositoryCustom passengerRepositoryCustom;

    @Override
    public List<Passenger> getPassengersByFlightId(Long flightId) {
        return passengerRepositoryCustom.findPassengersByFlightId(flightId);
    }

    @Override
    public List<Passenger> getPassengersMissingDetails(Long flightId, boolean missingDOB, boolean missingPassport, boolean missingAddress) {
        return passengerRepositoryCustom.findPassengersMissingDetails(flightId, missingDOB, missingPassport, missingAddress);
    }

    @Override
    public List<Passenger> filterPassengersBySpecialNeeds(Long flightId, Boolean needsWheelchair, Boolean withInfant) {
        return passengerRepositoryCustom.filterPassengersBySpecialNeeds(flightId, needsWheelchair, withInfant);
    }

    @Override
    public Optional<Passenger> getPassengerById(Long passengerId) {
        return passengerRepository.findById(passengerId);
    }

    @Override
    public Passenger addPassenger(Passenger passenger) {
        return passengerRepository.save(passenger);
    }

    @Override
    public Passenger updatePassenger(Passenger passenger) {
        // Optionally check if passenger exists before updating
        return passengerRepository.save(passenger);
    }

    @Override
    public void deletePassenger(Long passengerId) {
        passengerRepository.deleteById(passengerId);
    }
}
