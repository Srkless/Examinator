package net.etfbl.examinator.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import net.etfbl.examinator.models.Activity;
import net.etfbl.examinator.models.Result;
import net.etfbl.examinator.models.ResultId;
import net.etfbl.examinator.models.StudentSubject;
import net.etfbl.examinator.repositories.ActivityRepository;
import net.etfbl.examinator.repositories.StudentSubjectRepository;
import net.etfbl.examinator.requests.AddResultRequest;
import net.etfbl.examinator.requests.UpdateResultRequest;
import net.etfbl.examinator.services.ResultService;
import net.etfbl.examinator.services.SubjectService;

@RestController
@RequestMapping("/api/results")
public class ResultController {

  @Autowired
  private ResultService resultService;

  @Autowired
  private SubjectService subjectService;

  @Autowired
  private StudentSubjectRepository studentSubjectRepository;

  @Autowired
  private ActivityRepository activityRepository;

  @GetMapping
  public ResponseEntity<List<Result>> getAllResults() {
    List<Result> list = resultService.getAllResults();
    return ResponseEntity.ok(list);
  }

  @GetMapping("/subject/{subjectId}")
  public ResponseEntity<?> getResultsForSubject(@PathVariable Integer subjectId) {
    if (subjectService.getById(subjectId).isEmpty()) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Subject with ID " + subjectId + " not found.");
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    List<Result> list = resultService.getResultsForSubject(subjectId);
    return ResponseEntity.ok(list);
  }

  @GetMapping("/{resultId}")
  public ResponseEntity<?> getById(@PathVariable ResultId resultId) {
    if (resultService.getById(resultId).isEmpty()) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Result not found");
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    return ResponseEntity.ok(resultService.getById(resultId).get());
  }

  @GetMapping("/{studentSubjectId}/{activityId}")
  public ResponseEntity<?> getById(
      @PathVariable Integer studentSubjectId,
      @PathVariable Integer activityId) {

    Optional<Result> result = resultService.getById(studentSubjectId, activityId);

    if (result.isEmpty()) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Result not found");
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    return ResponseEntity.ok(result.get());
  }

  @PostMapping("/add")
  public ResponseEntity<Result> addResult(@RequestBody Result result) {
    return ResponseEntity.ok(resultService.addResult(result));
  }

  @PostMapping("/")
  public ResponseEntity<?> addResult(@RequestBody AddResultRequest request) {
    Optional<StudentSubject> studentOpt = studentSubjectRepository.findById(request.getStudentSubjectId());
    Optional<Activity> activityOpt = activityRepository.findById(request.getActivityId());

    if (studentOpt.isEmpty() || activityOpt.isEmpty()) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Invalid studentSubjectId or activityId");
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    Result savedResult = resultService.addResult(studentOpt.get(), activityOpt.get(), request.getPoints());
    return ResponseEntity.status(HttpStatus.CREATED).body(savedResult);
  }

  @PutMapping("/")
  public ResponseEntity<?> updateResult(@RequestBody UpdateResultRequest request) {
    ResultId id = new ResultId(request.getActivityId(), request.getStudentSubjectId());

    Result existing = resultService.getById(id)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Result with ID (" + request.getStudentSubjectId() + ", " + request.getActivityId() + ") not found"));

    existing.setPoints(request.getPoints());
    Result updated = resultService.updateResult(existing);

    return ResponseEntity.ok(updated);
  }

  @DeleteMapping("/{studentSubjectId}/{activityId}")
  public ResponseEntity<?> removeResult(
      @PathVariable Integer studentSubjectId,
      @PathVariable Integer activityId) {

    ResultId id = new ResultId(activityId, studentSubjectId);

    try {
      Result deleted = resultService.removeResult(id);
      return ResponseEntity.ok(deleted);
    } catch (IllegalArgumentException ex) {
      Map<String, String> error = new HashMap<>();
      error.put("error", ex.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
  }
}
