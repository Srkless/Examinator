package net.etfbl.examinator.models;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.*;

import lombok.*;

import java.util.*;

@Entity
@Table(
        name = "aktivnost",
        uniqueConstraints =
                @UniqueConstraint(columnNames = {"SkraceniNaziv", "IdPredmeta", "SkolskaGodina"}))
@Getter
@Setter
@NoArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdAktivnosti")
    private Integer id;

    @Column(name = "Naziv", nullable = false, length = 50)
    private String name;

    @Column(name = "SkraceniNaziv", nullable = false, length = 10)
    private String shortName;

    @Column(nullable = false, name = "MaksBrBodova")
    private Integer maxPoints;

    @Column(nullable = false, name = "SkolskaGodina")
    private Integer schoolYear;

    @ManyToOne
    @JoinColumn(name = "IdPredmeta")
    // @JsonBackReference("subject-activities")
    private Subject subject;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("activity-results")
    private List<Result> results = new ArrayList<>();
}
