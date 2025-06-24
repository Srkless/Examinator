package net.etfbl.examinator.repositories;

import net.etfbl.examinator.models.StudentSubject;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSubjectRepository extends JpaRepository<StudentSubject, Integer> {

    Optional<StudentSubject> findByIndexAndSubjectId(String index, Integer subjectId);

    List<StudentSubject> findAllBySubjectId(Integer subjectId);

    @Query("SELECT ss FROM StudentSubject ss WHERE ss.subject.code = :code")
    List<StudentSubject> findAllBySubjectCode(@Param("code") Integer code);

    Page<StudentSubject> findAllBySubjectId(Integer subjectId, Pageable pageable);

    @Query(
            "SELECT DISTINCT ss.schoolYear FROM StudentSubject ss WHERE ss.subject.id = :subjectId"
                + " ORDER BY ss.schoolYear")
    List<Integer> findDistinctSchoolYearsBySubjectId(@Param("subjectId") Integer subjectId);
}
