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

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentSubjectService {

    @Autowired private StudentSubjectRepository studentSubjectRepository;

    @Autowired private SubjectRepository subjectRepository;

    public StudentSubject addStudentToSubject(StudentSubject studentSubject) {
        Integer subjectId = studentSubject.getSubject().getId();

        Subject subject =
                subjectRepository
                        .findById(subjectId)
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Subject with ID " + subjectId + " not found"));

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

        existing.setIndex(updated.getIndex());
        existing.setSubject(updated.getSubject());

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

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());

        List<StudentSubject> pageContent = start > end ? List.of() : filtered.subList(start, end);

        return new PageImpl<>(pageContent, pageable, filtered.size());
    }
}
