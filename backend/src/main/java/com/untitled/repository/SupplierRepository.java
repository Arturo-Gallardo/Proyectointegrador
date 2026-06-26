package com.untitled.repository;

import com.untitled.domain.Restaurant;
import com.untitled.domain.Supplier;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

  List<Supplier> findByRestaurant(Restaurant restaurant);
}
