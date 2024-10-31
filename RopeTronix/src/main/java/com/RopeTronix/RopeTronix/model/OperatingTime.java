package com.RopeTronix.RopeTronix.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@Table(name = "operating_time")
@AllArgsConstructor
@NoArgsConstructor
public class OperatingTime {

    @Id
    @GeneratedValue
    private Integer id;

    private String value;

}
