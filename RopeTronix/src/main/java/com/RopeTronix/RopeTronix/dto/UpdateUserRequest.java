package com.RopeTronix.RopeTronix.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateUserRequest {

    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
}
