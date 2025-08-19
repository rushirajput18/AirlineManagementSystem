package com.oracle.flightmanagement.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oracle.flightmanagement.admin.entity.User;

@Repository
public interface UserInfoRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String email); // Use 'email' if that is the correct field for login
}