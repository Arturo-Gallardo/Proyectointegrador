package com.untitled.repository;

import com.untitled.domain.Expense;
import com.untitled.domain.Restaurant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

  List<Expense> findByRestaurant(Restaurant restaurant);
}
