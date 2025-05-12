package net.etfbl.examinator.repositories;

import net.etfbl.examinator.models.Activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer> {

    Optional<Activity> findById(Integer id);

    boolean existsByName(String name);

    boolean existsByShortName(String shortName);
}
