package com.RopeTronix.RopeTronix.controller;

import com.RopeTronix.RopeTronix.dto.LoginRequestDto;
import com.RopeTronix.RopeTronix.dto.RegistrationRequestDto;
import com.RopeTronix.RopeTronix.dto.UpdateUserRequest;
import com.RopeTronix.RopeTronix.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/repotronix")
@RequiredArgsConstructor
@CrossOrigin("*")
public class LoginController {


    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto user) {

        return userService.login(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequestDto requestDto){

        userService.register(requestDto);
        return ResponseEntity.ok(HttpStatus.OK);

    }

    @PutMapping("/updateUser")
    public ResponseEntity<?> updateUserDetails(@RequestBody UpdateUserRequest updateUserRequest){

        return userService.updateUserDetails(updateUserRequest);

    }

    @PostMapping("/save")
    public void saveOperationTime(@RequestBody Map<String, Integer> request) {
        int operationTimeCounter = request.get("operationTimeCounter");
        System.out.println("Received operation time counter: " + operationTimeCounter); // Debug line
        userService.saveOperationTime(operationTimeCounter);
    }

}
