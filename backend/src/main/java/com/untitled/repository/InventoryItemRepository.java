package com.untitled.repository;

import com.untitled.domain.InventoryItem;
import com.untitled.domain.Restaurant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {

  List<InventoryItem> findByRestaurant(Restaurant restaurant);
}
