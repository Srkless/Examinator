package net.etfbl.examinator.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;
import java.io.Serializable;

@Entity
@Table(name = "aktivnost", uniqueConstraints = @UniqueConstraint(columnNames = { "SkraceniNaziv", "IdPredmeta",
    "SkolskaGodina" }))
@Getter
@Setter
@NoArgsConstructor
public class Activity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, length = 50)
  private String name;

  @Column(name = "SkraceniNaziv", nullable = false, length = 10)
  private String shortName;

  @Column(nullable = false)
  private Integer maxPoints;

  @Column(nullable = false)
  private Integer schoolYear;

  @ManyToOne
  @JoinColumn(name = "IdPredmeta", nullable = false)
  private Subject subject;

  @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Result> results = new ArrayList<>();
}
