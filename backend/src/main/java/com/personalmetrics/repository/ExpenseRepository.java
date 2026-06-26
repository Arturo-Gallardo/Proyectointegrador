package com.personalmetrics.repository;

import com.personalmetrics.domain.Expense;
import com.personalmetrics.domain.Restaurant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

  List<Expense> findByRestaurant(Restaurant restaurant);
}
