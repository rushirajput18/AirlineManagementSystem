package com.oracle.flightmanagement.admin.repository;

import java.util.Optional;

import com.oracle.flightmanagement.admin.entity.User;

public interface UserRepositoryCustom {

    Optional<User> findByUsername(String username);
}
