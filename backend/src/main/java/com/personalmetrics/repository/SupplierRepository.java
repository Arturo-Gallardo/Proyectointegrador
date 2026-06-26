package com.personalmetrics.repository;

import com.personalmetrics.domain.Restaurant;
import com.personalmetrics.domain.Supplier;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

  List<Supplier> findByRestaurant(Restaurant restaurant);
}
