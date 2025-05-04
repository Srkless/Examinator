
package net.etfbl.examinator.controllers;

import net.etfbl.examinator.models.StudentSubject;
import net.etfbl.examinator.services.StudentSubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentSubjectController {

  @Autowired
  private StudentSubjectService studentSubjectService;

  @GetMapping("/subject/{subjectId}")
  public ResponseEntity<List<StudentSubject>> getAllBySubject(@PathVariable Integer subjectId) {
    List<StudentSubject> list = studentSubjectService.getAllBySubjectId(subjectId);
    return ResponseEntity.ok(list);
  }

  @PostMapping
  public ResponseEntity<StudentSubject> addStudentToSubject(@RequestBody StudentSubject studentSubject) {
    StudentSubject saved = studentSubjectService.addStudentToSubject(studentSubject);
    return ResponseEntity.ok(saved);
  }
}
