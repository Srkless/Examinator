package net.etfbl.examinator.controllers;

import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.services.SubjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired private SubjectService subjectService;

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getById(@PathVariable Long id) {
        Subject subject = subjectService.getById(id);
        return ResponseEntity.ok(subject);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Map<String, String> body) {
        return subjectService
                .add(body)
                .map(error -> ResponseEntity.badRequest().body(error))
                .orElseGet(() -> ResponseEntity.ok("Subject added successfully"));
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateSubject(@RequestBody Subject updated) {
        System.out.println("Received subject: " + updated);
        Subject subject = subjectService.update(updated);
        return ResponseEntity.ok(subject);
    }
}
