package net.etfbl.examinator.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.io.Serializable;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "korisnik")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdKorisnika")
    private Integer idKorisnika;

    @Column(nullable = false, length = 30, name = "Ime")
    private String firstName;

    @Column(nullable = false, length = 30, name = "Prezime")
    private String lastName;

    @Column(nullable = false, length = 50, name = "Email")
    @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\."
            + "[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@"
            + "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "{invalid.email}")
    private String email;

    @Column(nullable = false, unique = true, length = 50, name = "Username")
    private String username;

    @Column(nullable = false, length = 255, name = "PasswordHash")
    private String passwordHash;

    @ManyToMany
    @JoinTable(name = "korisnik_predmet", joinColumns = @JoinColumn(name = "IdKorisnika"), inverseJoinColumns = @JoinColumn(name = "IdPredmeta"))
    @JsonBackReference
    private Set<Subject> subjects = new HashSet<>();
}
