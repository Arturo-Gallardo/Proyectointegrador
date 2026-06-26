package com.personalmetrics.repository;

import com.personalmetrics.domain.InventoryItem;
import com.personalmetrics.domain.Restaurant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {

  List<InventoryItem> findByRestaurant(Restaurant restaurant);
}
