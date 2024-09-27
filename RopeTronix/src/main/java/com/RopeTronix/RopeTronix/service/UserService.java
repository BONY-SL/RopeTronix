package com.RopeTronix.RopeTronix.service;
import com.RopeTronix.RopeTronix.dto.RegistrationRequestDto;
import com.RopeTronix.RopeTronix.model.User;
import com.RopeTronix.RopeTronix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

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


}
