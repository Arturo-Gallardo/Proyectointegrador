package com.personalmetrics.repository;

import com.personalmetrics.domain.MenuItem;
import com.personalmetrics.domain.Restaurant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

  List<MenuItem> findByRestaurant(Restaurant restaurant);
}
