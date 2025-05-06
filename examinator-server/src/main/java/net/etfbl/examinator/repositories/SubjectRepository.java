package net.etfbl.examinator.repositories;

import net.etfbl.examinator.models.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    Optional<Subject> findByName(String name);

    Optional<Subject> findById(Long id);

    Optional<Subject> findByCode(Integer code);

    boolean existsByName(String name);

    boolean existsByCode(Integer code);
}
