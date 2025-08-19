package com.oracle.flightmanagement.admin.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oracle.flightmanagement.admin.dto.UserDTO;
import com.oracle.flightmanagement.admin.entity.User;
import com.oracle.flightmanagement.admin.service.UserService;
import com.oracle.flightmanagement.enums.UserRole;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Convert Entity to DTO
    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        // dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name()); // Enum to String
        return dto;
    }

    // Convert DTO to Entity
    private User toEntity(UserDTO dto) {
        User user = new User();
        user.setUserId(dto.getUserId());
        user.setUsername(dto.getUsername());
        // user.setEmail(dto.getEmail());

        if (dto.getRole() != null) {
            user.setRole(UserRole.valueOf(dto.getRole().toUpperCase())); // String to Enum
        }

        // Default or dummy password hash (real use case should securely handle this)
        user.setPasswordHash("dummy-password-hash");  // Replace with actual logic if needed

        return user;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> dtos = users.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        return user.map(u -> ResponseEntity.ok(toDTO(u)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<UserDTO> getUserByUsername(@RequestParam String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(u -> ResponseEntity.ok(toDTO(u)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDTO> addUser(@RequestBody UserDTO userDTO) {
        User user = toEntity(userDTO);
        User savedUser = userService.addUser(user);
        return ResponseEntity.ok(toDTO(savedUser));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        if (!userId.equals(userDTO.getUserId())) {
            return ResponseEntity.badRequest().build();
        }
        User updatedUser = userService.updateUser(toEntity(userDTO));
        return ResponseEntity.ok(toDTO(updatedUser));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
