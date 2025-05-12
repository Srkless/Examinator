package net.etfbl.examinator.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import net.etfbl.examinator.models.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer> {
}
