package net.etfbl.examinator.services;

import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.repositories.SubjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Service
public class SubjectService {

    @Autowired private SubjectRepository subjectRepository;

    public Subject getById(Long id) {
        return subjectRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
    }

    public Optional<String> add(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String code = body.get("code");

        if (subjectRepository.existsByName(name)) {
            return Optional.of("Name already exists");
        }

        Subject subject = new Subject();
        subject.setName(name);
        subject.setCode(Integer.parseInt(code));

        subjectRepository.save(subject);
        return Optional.empty();
    }

    public Subject update(Subject updated) {
        Integer id = updated.getId();

        Subject subject =
                subjectRepository
                        .findById(id)
                        .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (subjectRepository.existsByName(updated.getName())
                && !subject.getName().equals(updated.getName())) {
            throw new RuntimeException("Name already exists");
        }

        if (subjectRepository.existsByCode(updated.getCode())
                && !subject.getCode().equals(updated.getCode())) {
            throw new RuntimeException("Code already exists");
        }
        subject.setName(updated.getName());
        subject.setCode(updated.getCode());

        return subjectRepository.save(subject);
    }
}
