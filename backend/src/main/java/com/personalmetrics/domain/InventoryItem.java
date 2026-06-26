package com.personalmetrics.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "inventory_items")
@Getter
@Setter
@NoArgsConstructor
public class InventoryItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "restaurant_id")
  private Restaurant restaurant;

  @Column(nullable = false, length = 160)
  private String name;

  @Column(nullable = false)
  private Integer quantity;

  @Column(nullable = false, length = 16)
  private String unit;

  @Column(nullable = false, precision = 12, scale = 2, name = "unit_cost")
  private BigDecimal unitCost;

  @Column(name = "expires_on")
  private LocalDate expiresOn;

  @Column(name = "reorder_at")
  private Integer reorderAt;
}
