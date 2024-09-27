package com.RopeTronix.RopeTronix.controller;

import com.RopeTronix.RopeTronix.dto.LoginRequestDto;
import com.RopeTronix.RopeTronix.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/repotronix")
@RequiredArgsConstructor
@CrossOrigin("*")
public class LoginController {


    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto user) {

        System.out.println(user.toString());
        return ResponseEntity.ok(HttpStatus.OK);
    }
}
