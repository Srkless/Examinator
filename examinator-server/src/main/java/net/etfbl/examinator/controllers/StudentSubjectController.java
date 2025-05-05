package net.etfbl.examinator.controllers;

import net.etfbl.examinator.models.StudentSubject;
import net.etfbl.examinator.services.StudentSubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@RestController
@RequestMapping("/api/students")
public class StudentSubjectController {

  @Autowired
  private StudentSubjectService studentSubjectService;

  // GET all without pagination
  @GetMapping("/subject/{subjectId}")
  public ResponseEntity<List<StudentSubject>> getAllBySubject(@PathVariable Integer subjectId,
      @RequestParam(defaultValue = "index") String sortBy, @RequestParam(defaultValue = "asc") String direction) {
    Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
    List<StudentSubject> list = studentSubjectService.getAllBySubjectId(subjectId);
    return ResponseEntity.ok(list);
  }

  @PostMapping("/add")
  public ResponseEntity<StudentSubject> addStudentToSubject(@RequestBody StudentSubject studentSubject) {
    StudentSubject saved = studentSubjectService.addStudentToSubject(studentSubject);
    return ResponseEntity.ok(saved);
  }

  @PostMapping("/add-multiple")
  public ResponseEntity<List<StudentSubject>> addStudentsToSubject(@RequestBody List<StudentSubject> studentSubjects) {
    List<StudentSubject> saved = studentSubjectService.addStudentsToSubject(studentSubjects);
    return ResponseEntity.ok(saved);
  }

  @PutMapping("/update")
  public ResponseEntity<StudentSubject> updateStudentSubject(@RequestBody StudentSubject updatedStudent) {
    StudentSubject updated = studentSubjectService.updateStudentSubject(updatedStudent);
    return ResponseEntity.ok(updated);
  }

  // GET with pagination
  @GetMapping("/subject/{subjectId}/paged")
  public ResponseEntity<Page<StudentSubject>> getPagedFilteredBySubject(
      @PathVariable Integer subjectId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(defaultValue = "index") String sortBy,
      @RequestParam(defaultValue = "asc") String direction, @RequestParam(defaultValue = "") String searchQuery) {
    Sort sort = direction.equalsIgnoreCase("desc")
        ? Sort.by(sortBy).descending()
        : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);

    Page<StudentSubject> result = studentSubjectService.getFilteredAndPaged(subjectId, pageable, searchQuery);

    return ResponseEntity.ok(result);
  }
}
