package com.personalmetrics.controller;

import com.personalmetrics.domain.User;
import com.personalmetrics.repository.UserRepository;
import com.personalmetrics.service.DashboardService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

  private final DashboardService dashboardService;
  private final UserRepository userRepository;

  @GetMapping("/summary")
  public Map<String, Object> summary(Authentication authentication) {
    User user =
        userRepository
            .findByEmail(authentication.getName())
            .orElseThrow(() -> new IllegalStateException("Authenticated user missing"));
    return dashboardService.summary(user.getRestaurant());
  }
}
