package net.etfbl.examinator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

import lombok.*;

import java.util.*;

@Entity
@Table(name = "student_predmet", uniqueConstraints = @UniqueConstraint(columnNames = { "Indeks", "IdPredmeta",
        "SkolskaGodina" }))
@Getter
@Setter
@NoArgsConstructor
public class StudentSubject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdStudentPredmet")
    private Integer id;

    @Column(nullable = false, name = "SkolskaGodina")
    private Integer schoolYear;

    @Column(nullable = false, length = 10, name = "Indeks")
    private String index;

    @Column(nullable = false, length = 30, name = "Ime")
    private String firstName;

    @Column(nullable = false, length = 30, name = "Prezime")
    private String lastName;

    @Column(nullable = false, length = 5, name = "Grupa")
    private String group;

    @Column(columnDefinition = "text", name = "Napomena")
    private String note;

    @ManyToOne
    @JoinColumn(name = "IdPredmeta")
    @JsonBackReference("subject-studentSubjects")
    private Subject subject;

    @OneToMany(mappedBy = "studentSubject", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("studentSubject-results")
    private List<Result> results = new ArrayList<>();
}
