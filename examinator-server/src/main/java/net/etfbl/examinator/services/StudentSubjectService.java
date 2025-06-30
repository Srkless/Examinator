package net.etfbl.examinator.services;

import net.etfbl.examinator.models.StudentSubject;
import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.repositories.StudentSubjectRepository;
import net.etfbl.examinator.repositories.SubjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentSubjectService {

    @Autowired private StudentSubjectRepository studentSubjectRepository;

    @Autowired private SubjectRepository subjectRepository;

    public StudentSubject addStudentToSubject(StudentSubject studentSubject) {
        Integer subjectCode = studentSubject.getSubject().getCode();

        Subject subject =
                subjectRepository
                        .findByCode(subjectCode)
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Subject with code " + subjectCode + " not found"));

        studentSubject.setSubject(subject);

        return studentSubjectRepository.save(studentSubject);
    }

    public List<StudentSubject> getAllBySubjectId(Integer subjectId) {
        return studentSubjectRepository.findAllBySubjectId(subjectId);
    }

    public List<StudentSubject> getAllBySubjectCode(Integer subjectCode) {
        return studentSubjectRepository.findAllBySubjectCode(subjectCode);
    }

    public List<Integer> getAllSubjectStudentYears(Integer subjectCode) {
        Subject subj =
                subjectRepository
                        .findByCode(subjectCode)
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Subject with ID " + subjectCode + " not found"));

        return studentSubjectRepository.findDistinctSchoolYearsBySubjectId(subj.getId());
    }

    public List<StudentSubject> addStudentsToSubject(List<StudentSubject> students) {
        for (StudentSubject studentSubject : students) {
            Integer subjectId = studentSubject.getSubject().getId();

            Subject subject =
                    subjectRepository
                            .findById(subjectId)
                            .orElseThrow(
                                    () ->
                                            new IllegalArgumentException(
                                                    "Subject with ID " + subjectId + " not found"));
            studentSubject.setSubject(subject);
        }
        return studentSubjectRepository.saveAll(students);
    }

    public StudentSubject updateStudentSubject(StudentSubject updated) {
        Integer id = updated.getId();
        StudentSubject existing =
                studentSubjectRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "StudentSubject with ID " + id + " not found"));

        // existing.setIndex(updated.getIndex());
        // existing.setSubject(updated.getSubject());
        //
        // return studentSubjectRepository.save(existing);
        // Update all relevant fields
        existing.setIndex(updated.getIndex());
        existing.setSchoolYear(updated.getSchoolYear());
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setGroup(updated.getGroup());
        existing.setNote(updated.getNote());

        // Handle Subject by code
        if (updated.getSubject() != null && updated.getSubject().getCode() != null) {
            Subject subject =
                    subjectRepository
                            .findByCode(updated.getSubject().getCode())
                            .orElseThrow(
                                    () ->
                                            new IllegalArgumentException(
                                                    "Subject with code "
                                                            + updated.getSubject().getCode()
                                                            + " not found"));
            existing.setSubject(subject);
        }

        return studentSubjectRepository.save(existing);
    }

    // GET students filtered and paged, the filter parameters are checked with the
    // AND operator, which implies separate filters for each parameter
    // the search query is provided in the following format:
    // "index_query name_query group_query"
    // The filter parameters are separated by a space
    public Page<StudentSubject> getFilteredAndPaged(
            Integer subjectCode, Pageable pageable, String searchQuery) {
        List<StudentSubject> all = studentSubjectRepository.findAllBySubjectCode(subjectCode);

        String[] parts = searchQuery != null ? searchQuery.split(" ") : new String[0];
        String indexQuery = parts.length > 0 ? parts[0] : "";
        String nameQuery = parts.length > 1 ? parts[1] : "";
        String groupQuery = parts.length > 2 ? parts[2] : "";
        String schoolYearQuery = parts.length > 3 ? parts[3] : "";

        List<StudentSubject> filtered =
                all.stream()
                        .filter(
                                s ->
                                        s.getIndex().contains(indexQuery)
                                                && (s.getFirstName() + "_" + s.getLastName())
                                                        .contains(nameQuery)
                                                && s.getGroup().contains(groupQuery)
                                                && s.getSchoolYear()
                                                        .toString()
                                                        .contains(schoolYearQuery))
                        .collect(Collectors.toList());

        if (pageable.getSort().isSorted()) {
            String sortField = pageable.getSort().iterator().next().getProperty();
            boolean isDesc = pageable.getSort().iterator().next().isDescending();
            filtered.sort(
                    (a, b) -> {
                        Comparable valueA = getFieldValue(a, sortField);
                        Comparable valueB = getFieldValue(b, sortField);
                        int result = valueA.compareTo(valueB);
                        return isDesc ? -result : result;
                    });
        }
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());

        List<StudentSubject> pageContent = start > end ? List.of() : filtered.subList(start, end);

        return new PageImpl<>(pageContent, pageable, filtered.size());
    }

    public Page<StudentSubject> getStudentsFromFilePaged(
            MultipartFile file, Integer subjectCode, Pageable pageable) {
        try (BufferedReader reader =
                new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            Set<String> indexesInFile = new HashSet<>();

            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;

                String[] parts = line.split(",");

                for (String part : parts) {
                    String trimmed = part.trim();
                    String clean = trimmed.replaceAll("^\"|\"$", "");
                    if (clean.matches("\\d{3,}/\\d+")) {
                        indexesInFile.add(clean);
                    }
                }
            }

            if (indexesInFile.isEmpty()) {
                return new PageImpl<>(List.of(), pageable, 0);
            }

            // Pretpostavljam da imaš metodu u repository da pronađeš po indeksima i predmetu
            List<StudentSubject> studentsFound =
                    studentSubjectRepository.findByIndexInAndSubjectCode(
                            new ArrayList<>(indexesInFile), subjectCode);

            // Sada filtriraj i sortiraj u memoriji jer smo izvukli listu
            // Sortiranje:
            String sortProperty = pageable.getSort().iterator().next().getProperty();

            List<StudentSubject> sorted = studentsFound.stream().collect(Collectors.toList());

            // Paginacija
            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), sorted.size());
            List<StudentSubject> pageContent = start > end ? List.of() : sorted.subList(start, end);

            return new PageImpl<>(pageContent, pageable, sorted.size());

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload students: " + e.getMessage(), e);
        }
    }

    public List<StudentSubject> getStudentsFromFile(MultipartFile file, Integer subjectCode) {
        try (BufferedReader reader =
                new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            Set<String> indexesInFile = new HashSet<>();

            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;

                String[] parts = line.split(",");

                for (String part : parts) {
                    String trimmed = part.trim();
                    String clean = trimmed.replaceAll("^\"|\"$", "");
                    if (clean.matches("\\d{3,}/\\d+")) {
                        indexesInFile.add(clean);
                    }
                }
            }

            if (indexesInFile.isEmpty()) {
                return List.of(); // Prazna lista, nema podataka
            }

            List<StudentSubject> studentsFound =
                    studentSubjectRepository.findByIndexInAndSubjectCode(
                            new ArrayList<>(indexesInFile), subjectCode);

            return studentsFound;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload students: " + e.getMessage(), e);
        }
    }

    public void delete(Integer id) {
        if (!studentSubjectRepository.existsById(id)) {
            throw new RuntimeException("Student with ID " + id + " does not exist");
        }

        studentSubjectRepository.deleteById(id);
    }

    private Comparable getFieldValue(StudentSubject student, String field) {
        return switch (field) {
            case "firstName" -> student.getFirstName();
            case "lastName" -> student.getLastName();
            case "index" -> student.getIndex();
            case "group" -> student.getGroup();
            case "schoolYear" -> student.getSchoolYear();
            case "id" -> student.getId();
            default -> student.getIndex();
        };
    }
}
