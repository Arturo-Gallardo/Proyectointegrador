package com.untitled.repository;

import com.untitled.domain.MenuItem;
import com.untitled.domain.Restaurant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

  List<MenuItem> findByRestaurant(Restaurant restaurant);
}
