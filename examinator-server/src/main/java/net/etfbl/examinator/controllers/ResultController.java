package net.etfbl.examinator.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.etfbl.examinator.models.Result;
import net.etfbl.examinator.services.ResultService;
import net.etfbl.examinator.services.SubjectService;

@RestController
@RequestMapping("/api/results")
public class ResultController {

  @Autowired
  private ResultService resultService;

  @Autowired
  private SubjectService subjectService;

  @GetMapping
  public ResponseEntity<List<Result>> getAllResults() {
    List<Result> list = resultService.getAllResults();
    return ResponseEntity.ok(list);
  }

  @GetMapping("/{subjectId}")
  public ResponseEntity<?> getResultsForSubject(@PathVariable Integer subjectId) {
    if (subjectService.getById(subjectId).isEmpty()) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Subject with ID " + subjectId + " not found.");
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    List<Result> list = resultService.getResultsForSubject(subjectId);
    return ResponseEntity.ok(list);
  }

  @PostMapping("/add")
  public ResponseEntity<Result> addResult(@RequestBody Result result) {
    return ResponseEntity.ok(resultService.addResult(result));
  }

}
