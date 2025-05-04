package net.etfbl.examinator.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;
import java.io.Serializable;

@Entity
@Table(name = "predmet")
@Getter
@Setter
@NoArgsConstructor
public class Subject {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, length = 50)
  private String name;

  @Column(nullable = false, unique = true)
  private Integer code;

  @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Activity> activities = new ArrayList<>();

  @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<StudentSubject> studentSubjects = new ArrayList<>();

  @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Formula> formulas = new ArrayList<>();

  @ManyToMany(mappedBy = "subjects")
  private Set<User> users = new HashSet<>();
}
