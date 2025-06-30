package net.etfbl.examinator.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import net.etfbl.examinator.models.Result;
import net.etfbl.examinator.models.ResultId;

import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, ResultId> {

    @Query("SELECT r FROM Result r WHERE r.studentSubject.index = :studentIndex AND r.studentSubject.subject.code = :subjectCode AND r.activity.shortName = :activityShortName")
    Optional<Result> findByStudentIndexAndSubjectCodeAndActivityShortName(
            @Param("studentIndex") String studentIndex,
            @Param("subjectCode") Integer subjectCode,
            @Param("activityShortName") String activityShortName);

}
