package com.untitled.domain;

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
@Table(name = "suppliers")
@Getter
@Setter
@NoArgsConstructor
public class Supplier {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "restaurant_id")
  private Restaurant restaurant;

  @Column(nullable = false, length = 160)
  private String name;

  @Column(length = 160)
  private String email;

  @Column(length = 48)
  private String phone;

  @Column(length = 240)
  private String products;

  @Column(name = "last_purchase_on")
  private LocalDate lastPurchaseOn;

  @Column(name = "last_total", precision = 14, scale = 2)
  private BigDecimal lastTotal;

  @Column(name = "payment_due_on")
  private LocalDate paymentDueOn;
}
