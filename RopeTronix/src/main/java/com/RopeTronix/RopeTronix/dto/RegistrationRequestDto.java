package com.RopeTronix.RopeTronix.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RegistrationRequestDto {

    private String firstname;

    private String lastname;

    private String email;

    private String password;
}
