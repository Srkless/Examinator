package net.etfbl.examinator.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "predmet")
@Getter
@Setter
@NoArgsConstructor
public class Subject {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false, unique = true, name = "IdPredmeta")
  private Integer id;

  @Column(nullable = false, length = 50, name = "Naziv")
  private String name;

  @Column(nullable = false, unique = true, name = "Sifra")
  private Integer code;

  @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<Activity> activities = new ArrayList<>();

  @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<StudentSubject> studentSubjects = new ArrayList<>();

  @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Formula> formulas = new ArrayList<>();

  @ManyToMany(mappedBy = "subjects")
  private Set<User> users = new HashSet<>();
}
