package net.etfbl.examinator.services;

import lombok.RequiredArgsConstructor;

import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.repositories.SubjectRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
}
