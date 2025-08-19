package com.oracle.flightmanagement.admin.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.oracle.flightmanagement.admin.entity.User;
import com.oracle.flightmanagement.admin.repository.UserRepository;
import com.oracle.flightmanagement.admin.repository.UserRepositoryCustom;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    @Qualifier("userRepositoryImpl")
    private UserRepositoryCustom userRepositoryCustom;

    @Override
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepositoryCustom.findByUsername(username);
    }

    @Override
    public User addUser(User user) {
        // Optional: check if username already exists
        return userRepository.save(user);
    }

    @Override
    public User updateUser(User user) {
        if (user.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null for update.");
        }

        Optional<User> existing = userRepository.findById(user.getUserId());
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("User with ID " + user.getUserId() + " does not exist.");
        }

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        Optional<User> existing = userRepository.findById(userId);
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("User with ID " + userId + " does not exist.");
        }

        userRepository.deleteById(userId);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
