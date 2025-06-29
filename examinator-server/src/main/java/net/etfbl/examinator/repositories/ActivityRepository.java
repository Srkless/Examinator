package net.etfbl.examinator.repositories;

import net.etfbl.examinator.models.Activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

@Repository
// public interface ActivityRepository extends JpaRepository<Activity, Integer>
// {
//
// Optional<Activity> findById(Integer id);
// Optional<Activity> findByShortName(String shortName);
//
// boolean existsByName(String name);
//
// boolean existsByShortName(String shortName);
//
// boolean existsById(Integer id);
//
// boolean existsByNameAndSubjectIdAndIdNot(String name, Integer subjectId,
// Integer excludeId);
// }
public interface ActivityRepository extends JpaRepository<Activity, Integer> {

    Optional<Activity> findById(Integer id);

    boolean existsByName(String name);

    boolean existsByShortName(String shortName);

    boolean existsById(Integer id);

    boolean existsByNameAndSubjectIdAndIdNot(String name, Integer subjectId, Integer excludeId);

    boolean existsByNameAndSubjectIdAndSchoolYear(String name, Integer subjectId, Integer schoolYear);

    boolean existsByShortNameAndSubjectIdAndSchoolYear(String shortName, Integer subjectId, Integer schoolYear);

    boolean existsByNameAndSubjectIdAndSchoolYearAndIdNot(String name, Integer subjectId, Integer schoolYear,
            Integer excludeId);

    @Query("SELECT DISTINCT ss.schoolYear FROM Activity ss WHERE ss.subject.id = :subjectId ORDER BY ss.schoolYear DESC")
    List<Integer> findDistinctSchoolYearsBySubjectId(@Param("subjectId") Integer subjectId);

    @Query("SELECT a FROM Activity a WHERE a.schoolYear = :schoolYear AND a.subjectId = :subjectId")
    List<Activity> findActivitiesByYearAndSubject(@Param("schoolYear") Integer schoolYear,
            @Param("subjectId") Integer subjectId);
}
