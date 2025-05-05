package net.etfbl.examinator.services;

import net.etfbl.examinator.models.StudentSubject;
import net.etfbl.examinator.repositories.StudentSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.repositories.SubjectRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageImpl;

@Service
public class StudentSubjectService {

  @Autowired
  private StudentSubjectRepository studentSubjectRepository;

  @Autowired
  private SubjectRepository subjectRepository;

  public StudentSubject addStudentToSubject(StudentSubject studentSubject) {
    Integer subjectId = studentSubject.getSubject().getId();

    Subject subject = subjectRepository.findById(subjectId)
        .orElseThrow(() -> new IllegalArgumentException("Subject with ID " + subjectId + " not found"));

    studentSubject.setSubject(subject);

    return studentSubjectRepository.save(studentSubject);
  }

  public List<StudentSubject> getAllBySubjectId(Integer subjectId) {
    return studentSubjectRepository.findAllBySubjectId(subjectId);
  }

  public List<StudentSubject> addStudentsToSubject(List<StudentSubject> students) {
    for (StudentSubject studentSubject : students) {
      Integer subjectId = studentSubject.getSubject().getId();

      Subject subject = subjectRepository.findById(subjectId)
          .orElseThrow(() -> new IllegalArgumentException("Subject with ID " + subjectId + " not found"));
      studentSubject.setSubject(subject);
    }
    return studentSubjectRepository.saveAll(students);
  }

  public StudentSubject updateStudentSubject(StudentSubject updated) {
    Integer id = updated.getId();
    StudentSubject existing = studentSubjectRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("StudentSubject with ID " + id + " not found"));

    existing.setIndex(updated.getIndex());
    existing.setSubject(updated.getSubject());

    return studentSubjectRepository.save(existing);
  }

  // GET students filtered and paged, the filter parameters are checked with the
  // AND operator, which implies separate filters for each parameter
  // the search query is provided in the following format:
  // "index_query name_query group_query"
  // The filter parameters are separated by a space
  public Page<StudentSubject> getFilteredAndPaged(Integer subjectId, Pageable pageable, String searchQuery) {
    List<StudentSubject> all = studentSubjectRepository.findAllBySubjectId(subjectId);

    String[] parts = searchQuery != null ? searchQuery.split(" ") : new String[0];
    String indexQuery = parts.length > 0 ? parts[0] : "";
    String nameQuery = parts.length > 1 ? parts[1] : "";
    String groupQuery = parts.length > 2 ? parts[2] : "";

    List<StudentSubject> filtered = all.stream()
        .filter(s -> s.getIndex().contains(indexQuery) &&
            (s.getFirstName() + " " + s.getLastName()).contains(nameQuery) &&
            s.getGroup().contains(groupQuery))
        .collect(Collectors.toList());

    int start = (int) pageable.getOffset();
    int end = Math.min((start + pageable.getPageSize()), filtered.size());

    List<StudentSubject> pageContent = start > end ? List.of() : filtered.subList(start, end);

    return new PageImpl<>(pageContent, pageable, filtered.size());
  }
}
