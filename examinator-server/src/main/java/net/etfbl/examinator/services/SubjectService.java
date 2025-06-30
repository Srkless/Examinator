package net.etfbl.examinator.services;

import jakarta.persistence.EntityNotFoundException;

import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.models.User;
import net.etfbl.examinator.models.UserDTO;
import net.etfbl.examinator.repositories.SubjectRepository;
import net.etfbl.examinator.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SubjectService {

    @Autowired private SubjectRepository subjectRepository;
    @Autowired private UserRepository userRepository;

    public List<Subject> getAll(Principal principal) {
        User user =
                userRepository
                        .findByUsername(principal.getName())
                        .orElseThrow(() -> new RuntimeException("User not found"));
        List<Subject> subjects = new ArrayList<>(user.getSubjects());

        subjects.sort((s1, s2) -> s1.getCode().compareTo(s2.getCode()));

        return subjects;
    }

    public Optional<Subject> getById(Integer id) {
        return subjectRepository.findById(id);
    }

    public Optional<Subject> getByCode(Integer code) {
        return subjectRepository.findByCode(code);
    }

    public Optional<String> add(@RequestBody Map<String, String> body, Principal principal) {
        String name = body.get("name");
        String code = body.get("code");

        if (subjectRepository.existsByName(name)) {
            return Optional.of("Name already exists");
        }

        Subject subject = new Subject();
        subject.setName(name);
        subject.setCode(Integer.parseInt(code));

        subjectRepository.save(subject);

        User user =
                userRepository
                        .findByUsername(principal.getName())
                        .orElseThrow(() -> new RuntimeException("User not found"));
        user.getSubjects().add(subject);
        userRepository.save(user);
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

    public Subject addUserToSubject(String username, Integer subjectCode) {
        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "User not found with username: " + username));
        Subject subject =
                subjectRepository
                        .findByCode(subjectCode)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Subject not found with id: " + subjectCode));

        user.getSubjects().add(subject);

        subject.getUsers().add(user);

        return subjectRepository.save(subject);
    }

    public List<UserDTO> getProfessors(Integer subjectCode) {
        Subject subject =
                subjectRepository
                        .findByCode(subjectCode)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Subject not found with id: " + subjectCode));
        List<UserDTO> professors = new ArrayList<>();
        for (User user : subject.getUsers()) {
            professors.add(
                    new UserDTO(
                            user.getIdKorisnika(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getUsername(),
                            user.getEmail()));
        }
        return professors;
    }

    public Subject removeUserFromSubject(String username, Integer subjectCode) {
        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "User not found with username: " + username));
        Subject subject =
                subjectRepository
                        .findByCode(subjectCode)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Subject not found with id: " + subjectCode));

        user.getSubjects().remove(subject);

        subject.getUsers().remove(user);

        return subjectRepository.save(subject);
    }
}
