package com.personalmetrics.repository;

import com.personalmetrics.domain.Alert;
import com.personalmetrics.domain.Restaurant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {

  List<Alert> findTop10ByRestaurantOrderByCreatedAtDesc(Restaurant restaurant);
}
