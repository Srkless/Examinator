package net.etfbl.examinator.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;
import java.io.Serializable;

@Entity
@Table(name = "formula", uniqueConstraints = @UniqueConstraint(columnNames = { "SkolskaGodina", "Naziv",
    "IdPredmeta" }))
@Getter
@Setter
@NoArgsConstructor
public class Formula {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private Integer schoolYear;

  @Column(nullable = false, length = 30)
  private String name;

  @Column(nullable = false, length = 100)
  private String expression;

  @ManyToOne
  @JoinColumn(name = "IdPredmeta", nullable = false)
  private Subject subject;
}
