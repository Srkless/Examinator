package net.etfbl.examinator.models;

import jakarta.persistence.*; // JPA/Hibernate annotations
import lombok.*; // Lombok annotations
import java.util.*; // Collections
import java.io.Serializable; // For @Embeddable ID class

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
    private String email;

    @Column(nullable = false, unique = true, length = 50, name="Username")
    private String username;

    @Column(nullable = false, length = 255, name = "PasswordHash")
    private String passwordHash;

    @ManyToMany
    @JoinTable(name = "korisnik_predmet", joinColumns = @JoinColumn(name = "IdKorisnika"), inverseJoinColumns = @JoinColumn(name = "IdPredmeta"))
    private Set<Subject> subjects = new HashSet<>();
}
