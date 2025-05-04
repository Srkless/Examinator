package net.etfbl.examinator.repositories;

import net.etfbl.examinator.models.StudentSubject;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

@Repository
public interface StudentSubjectRepository extends JpaRepository<StudentSubject, Integer> {

  Optional<StudentSubject> findByIndexAndSubjectId(String index, Integer subjectId);
  List<StudentSubject> findAllBySubject_Id(Integer subjectId);
}
