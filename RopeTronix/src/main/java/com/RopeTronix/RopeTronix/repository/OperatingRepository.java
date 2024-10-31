package com.RopeTronix.RopeTronix.repository;

import com.RopeTronix.RopeTronix.model.OperatingTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OperatingRepository extends JpaRepository<OperatingTime,String> {


}
