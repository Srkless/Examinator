package net.etfbl.examinator.services;

import net.etfbl.examinator.models.StudentSubject;
import net.etfbl.examinator.repositories.StudentSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.repositories.SubjectRepository;
import java.util.List;

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
    return studentSubjectRepository.findAllBySubject_Id(subjectId);
  }
}
