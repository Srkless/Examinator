package net.etfbl.examinator.services;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.etfbl.examinator.models.Activity;
import net.etfbl.examinator.models.Result;
import net.etfbl.examinator.models.ResultId;
import net.etfbl.examinator.models.StudentSubject;
import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.repositories.ResultRepository;
import net.etfbl.examinator.repositories.StudentSubjectRepository;
import net.etfbl.examinator.repositories.SubjectRepository;

@Service
public class ResultService {
  @Autowired
  private ResultRepository resultRepository;

  @Autowired
  StudentSubjectRepository studentRepository;

  public List<Result> getAllResults() {
    List<Result> list = resultRepository.findAll();
    list.sort(getStudentIndexComparator());
    return list;
  }

  public List<Result> getResultsForSubject(Integer subjectId) {
    List<Result> list = resultRepository.findAll().stream().filter(r -> {
      Integer studentId = r.getId().getStudentSubjectId();
      Optional<StudentSubject> s = studentRepository.findById(studentId);
      if (s.isPresent()) {
        Integer studentSubjectId = s.get().getSubject().getId();
        return subjectId == studentSubjectId ? true : false;
      }
      return false;
    }).collect(Collectors.toList());
    list.sort(getStudentIndexComparator());

    return list;
  }

  public Optional<Result> getById(ResultId id) {
    return resultRepository.findById(id);
  }

  public Optional<Result> getById(Integer studentSubjectId, Integer activityId) {
    ResultId id = new ResultId(activityId, studentSubjectId);
    return resultRepository.findById(id);
  }

  public Result addResult(StudentSubject student, Activity activity, Integer points) {
    if (student.getId() == null || activity.getId() == null) {
      throw new IllegalArgumentException("Both studentSubject and activity must be persisted and have non-null IDs");
    }

    System.out.println("SID: " + student.getId() + " AID: " + activity.getId());

    Result r = new Result();
    r.setStudentSubject(student);
    r.setActivity(activity);
    r.setPoints(points);

    return resultRepository.save(r);
  }

  public Result addResult(Result result) {
    Result r = resultRepository.save(result);
    return r;
  }

  public Result updateResult(Result newResult) {
    ResultId id = newResult.getId();
    Result existing = resultRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Result with ID " + id + " not found"));

    existing.setPoints(newResult.getPoints());

    return resultRepository.save(existing);
  }

  public Result removeResult(ResultId id) {
    Result existing = resultRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Result with ID " + id + " not found."));

    resultRepository.deleteById(id);
    return existing;
  }

  // TODO sort properly comparing index, this is just a temporary solution, a
  // placeholder

  private Comparator<Result> getStudentIndexComparator() {
    return (r1, r2) -> {
      Integer id1 = r1.getId().getStudentSubjectId();
      Integer id2 = r2.getId().getStudentSubjectId();

      Optional<StudentSubject> s1 = studentRepository.findById(id1);
      Optional<StudentSubject> s2 = studentRepository.findById(id2);

      if (s1.isPresent() && s2.isPresent()) {
        StudentSubject st1 = s1.get();
        StudentSubject st2 = s2.get();
        return st1.getIndex().compareToIgnoreCase(st2.getIndex());
      } else if (s1.isPresent()) {
        return -1;
      } else if (s2.isPresent()) {
        return 1;
      } else {
        return 0;
      }
    };
  }
}
