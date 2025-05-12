package net.etfbl.examinator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

import lombok.*;

import java.util.*;

@Entity
@Table(
        name = "formula",
        uniqueConstraints =
                @UniqueConstraint(columnNames = {"SkolskaGodina", "Naziv", "IdPredmeta"}))
@Getter
@Setter
@NoArgsConstructor
public class Formula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true, name = "IdFormule")
    private Integer id;

    @Column(nullable = false, name = "SkolskaGodina")
    private Integer schoolYear;

    @Column(nullable = false, length = 30, name = "Naziv")
    private String name;

    @Column(nullable = false, length = 100, name = "Izraz")
    private String expression;

    @ManyToOne
    @JoinColumn(name = "IdPredmeta", nullable = false)
    @JsonBackReference("subject-formulas")
    private Subject subject;
}
