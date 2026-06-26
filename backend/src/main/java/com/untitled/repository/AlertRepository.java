package com.untitled.repository;

import com.untitled.domain.Alert;
import com.untitled.domain.Restaurant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {

  List<Alert> findTop10ByRestaurantOrderByCreatedAtDesc(Restaurant restaurant);
}
