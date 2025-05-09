package net.etfbl.examinator.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import net.etfbl.examinator.models.Result;

@Repository
public interface ResultRepository extends JpaRepository<Result, Integer> {
}
