package com.oracle.flightmanagement.admin.service;

import java.util.List;
import java.util.Optional;

import com.oracle.flightmanagement.admin.entity.User;

public interface UserService {

    Optional<User> getUserById(Long userId);

    Optional<User> getUserByUsername(String username);

    User addUser(User user);

    User updateUser(User user);

    void deleteUser(Long userId);

    List<User> getAllUsers();
}
