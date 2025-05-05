package net.etfbl.examinator.repositories;

import net.etfbl.examinator.models.StudentSubject;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface StudentSubjectRepository extends JpaRepository<StudentSubject, Integer> {

  Optional<StudentSubject> findByIndexAndSubjectId(String index, Integer subjectId);

  List<StudentSubject> findAllBySubjectId(Integer subjectId);

  Page<StudentSubject> findAllBySubjectId(Integer subjectId, Pageable pageable);

}
