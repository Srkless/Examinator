package net.etfbl.examinator.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;
import java.io.Serializable;

@Entity
@Table(name = "rezultat")
@Getter
@Setter
@NoArgsConstructor
public class Result {
  @EmbeddedId
  private ResultId id = new ResultId();

  @ManyToOne
  @MapsId("activityId")
  @JoinColumn(name = "IdAktivnosti")
  private Activity activity;

  @ManyToOne
  @MapsId("studentSubjectId")
  @JoinColumn(name = "IdStudentPredmet")
  private StudentSubject studentSubject;

  @Column(nullable = false)
  private Integer points;
}
