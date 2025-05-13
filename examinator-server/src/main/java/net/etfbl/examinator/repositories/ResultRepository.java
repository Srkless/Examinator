package net.etfbl.examinator.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import net.etfbl.examinator.models.Result;
import net.etfbl.examinator.models.ResultId;

@Repository
public interface ResultRepository extends JpaRepository<Result, ResultId> {
}
