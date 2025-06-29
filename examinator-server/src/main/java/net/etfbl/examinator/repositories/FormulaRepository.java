package net.etfbl.examinator.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import net.etfbl.examinator.models.Formula;

public interface FormulaRepository extends JpaRepository<Formula, Integer> {

    Optional<Formula> findById(Integer id);

    boolean existsByName(String name);

    boolean existsById(Integer id);

    boolean existsByNameAndSubjectIdAndIdNot(String name, Integer subjectId, Integer excludeId);

    boolean existsByNameAndSubjectIdAndSchoolYear(String name, Integer subjectId, Integer schoolYear);

    boolean existsByExpressionAndSubjectIdAndSchoolYear(String experession, Integer subjectId, Integer schoolYear);

    boolean existsByNameAndSubjectIdAndSchoolYearAndIdNot(String name, Integer subjectI, Integer schoolYear,
            Integer excludeId);

}
