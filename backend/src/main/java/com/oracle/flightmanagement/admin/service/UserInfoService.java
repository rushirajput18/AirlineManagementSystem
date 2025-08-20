package com.oracle.flightmanagement.admin.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.oracle.flightmanagement.admin.entity.User;
import com.oracle.flightmanagement.admin.repository.UserInfoRepository;

@Service("userInfoService")
public class UserInfoService implements UserDetailsService {

    private final UserInfoRepository repository;

    @Autowired
    public UserInfoService(UserInfoRepository repository) {
        this.repository = repository;
    }

    // Method to load user details by username (email)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Fetch user from the database by email (username)
        Optional<User> userInfo = repository.findByUsername(username);
        
        if (userInfo.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }
        
        // Convert UserInfo to UserDetails (UserInfoDetails)
        User user = userInfo.get();
        UserInfoDetails userDetails = new UserInfoDetails(user);

        return new org.springframework.security.core.userdetails.User(userDetails.getUsername(), userDetails.getPassword(), userDetails.getAuthorities());
    }
}