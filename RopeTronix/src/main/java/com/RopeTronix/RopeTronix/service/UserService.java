package com.RopeTronix.RopeTronix.service;
import com.RopeTronix.RopeTronix.dto.LoginRequestDto;
import com.RopeTronix.RopeTronix.dto.RegistrationRequestDto;
import com.RopeTronix.RopeTronix.dto.UpdateUserRequest;
import com.RopeTronix.RopeTronix.model.User;
import com.RopeTronix.RopeTronix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void register(RegistrationRequestDto requestDto){


        var savedUser = new User();
        savedUser.setFirstname(requestDto.getFirstname());
        savedUser.setLastname(requestDto.getLastname());
        savedUser.setEmail(requestDto.getEmail());
        savedUser.setPassword(requestDto.getPassword());

        userRepository.save(savedUser);

    }

    // In UserService
    public ResponseEntity<?> login(LoginRequestDto user) {

        User getUserDetails = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is Not Found"));

        // Check the password
        if (!user.getPassword().equals(getUserDetails.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // Login successful
        return ResponseEntity.status(HttpStatus.OK).body(getUserDetails);
    }


    public ResponseEntity<?> updateUserDetails(UpdateUserRequest updateUserRequest) {
        Optional<User> getUserDetails = userRepository.findByEmail(updateUserRequest.getEmail());

        if (getUserDetails.isPresent()) {
            User user = getUserDetails.get();

            user.setFirstname(updateUserRequest.getFirstname());
            user.setLastname(updateUserRequest.getLastname());
            user.setId(updateUserRequest.getId());
            user.setEmail(updateUserRequest.getEmail());

            return ResponseEntity.ok(userRepository.save(user));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Update Unsuccessful");
        }
    }


}
