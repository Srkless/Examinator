package net.etfbl.examinator.services;

import lombok.RequiredArgsConstructor;

import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.repositories.SubjectRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

    @PostMapping("/add")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String code = body.get("code");

        if (subjectRepository.existsByName(name)) {
            return ResponseEntity.badRequest().body("Name already exists");
        }

        Subject subject = new Subject();
        subject.setName(name);
        subject.setCode(Integer.parseInt(code));

        subjectRepository.save(subject);

        return ResponseEntity.ok("Subject added successfully");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSubject(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Subject> optionalSubject = subjectRepository.findById(id);
        if (optionalSubject.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subject not found");
        }

        Subject subject = optionalSubject.get();

        String name = body.get("name");
        String code = body.get("code");

        if (subjectRepository.existsByName(name) && !subject.getName().equals(name)) {
            return ResponseEntity.badRequest().body("Name already exists");
        }
        if (subjectRepository.existsByCode(Integer.parseInt(code))
                && !subject.getCode().equals(Integer.parseInt(code))) {
            return ResponseEntity.badRequest().body("Code already exists");
        }

        subject.setName(name);
        subject.setCode(Integer.parseInt(code));

        subjectRepository.save(subject);

        return ResponseEntity.ok("Subject updated successfully");
    }
}
