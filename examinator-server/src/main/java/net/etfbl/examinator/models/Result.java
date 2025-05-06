package net.etfbl.examinator.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonBackReference;

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
  @JsonBackReference
  private Activity activity;

  @ManyToOne
  @MapsId("studentSubjectId")
  @JoinColumn(name = "IdStudentPredmet")
  @JsonBackReference
  private StudentSubject studentSubject;

  @Column(nullable = false, name = "Bodovi")
  private Integer points;
}
