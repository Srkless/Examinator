package net.etfbl.examinator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

import lombok.*;

import java.util.*;

@Entity
@Table(name = "rezultat")
@Getter
@Setter
@NoArgsConstructor
public class Result {
    @EmbeddedId private ResultId id = new ResultId();

    @ManyToOne
    @MapsId("activityId")
    @JoinColumn(name = "IdAktivnosti")
    @JsonBackReference("activity-results")
    private Activity activity;

    @ManyToOne
    @MapsId("studentSubjectId")
    @JoinColumn(name = "IdStudentPredmet")
    @JsonBackReference("studentSubject-results")
    private StudentSubject studentSubject;

    @Column(nullable = false, name = "Bodovi")
    private Integer points;
}
