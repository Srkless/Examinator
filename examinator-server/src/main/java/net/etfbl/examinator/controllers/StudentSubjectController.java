package net.etfbl.examinator.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import net.etfbl.examinator.models.StudentSubject;
import net.etfbl.examinator.services.StudentSubjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST controller for managing StudentSubject entities. Provides endpoints for CRUD operations with
 * optional pagination and sorting.
 */
@RestController
@RequestMapping("/api/students")
public class StudentSubjectController {

    @Autowired private StudentSubjectService studentSubjectService;

    /**
     * Retrieves all students associated with a subject without pagination.
     *
     * @param subjectCode code of the subject.
     * @param sortBy Field to sort by (default: "index").
     * @param direction Sort direction: "asc" or "desc" (default: "asc").
     * @return List of StudentSubject entities.
     */
    @Operation(summary = "Get all students for a subject without pagination")
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "List of students",
                content = @Content(schema = @Schema(implementation = StudentSubject.class)))
    })
    @GetMapping("/subject/{subjectCode}")
    public ResponseEntity<List<StudentSubject>> getAllBySubject(
            @Parameter(description = "Subject ID", required = true) @PathVariable
                    Integer subjectCode,
            @Parameter(description = "Sort field, default is 'index'")
                    @RequestParam(defaultValue = "index")
                    String sortBy,
            @Parameter(description = "Sort direction: 'asc' or 'desc', default is 'asc'")
                    @RequestParam(defaultValue = "asc")
                    String direction) {

        Sort sort =
                direction.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending();
        List<StudentSubject> list = studentSubjectService.getAllBySubjectCode(subjectCode);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/subject/years/{subjectCode}")
    public ResponseEntity<List<Integer>> getAllResultYears(@PathVariable Integer subjectCode) {
        List<Integer> list = studentSubjectService.getAllSubjectStudentYears(subjectCode);
        return ResponseEntity.ok(list);
    }

    /**
     * Adds a single student to a subject.
     *
     * @param studentSubject StudentSubject object to add.
     * @return The saved StudentSubject entity.
     */
    @Operation(summary = "Add a student to a subject")
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Student added",
                content = @Content(schema = @Schema(implementation = StudentSubject.class)))
    })
    @PostMapping("/add")
    public ResponseEntity<StudentSubject> addStudentToSubject(
            @Parameter(description = "StudentSubject to add", required = true) @RequestBody
                    StudentSubject studentSubject) {
        StudentSubject saved = studentSubjectService.addStudentToSubject(studentSubject);
        return ResponseEntity.ok(saved);
    }

    /**
     * Adds multiple students to a subject in bulk.
     *
     * @param studentSubjects List of StudentSubject objects to add.
     * @return List of saved StudentSubject entities.
     */
    @Operation(summary = "Add multiple students to a subject")
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Students added",
                content = @Content(schema = @Schema(implementation = StudentSubject.class)))
    })
    @PostMapping("/add-multiple")
    public ResponseEntity<List<StudentSubject>> addStudentsToSubject(
            @Parameter(description = "List of StudentSubjects to add", required = true) @RequestBody
                    List<StudentSubject> studentSubjects) {
        List<StudentSubject> saved = studentSubjectService.addStudentsToSubject(studentSubjects);
        return ResponseEntity.ok(saved);
    }

    /**
     * Updates an existing StudentSubject.
     *
     * @param updatedStudent StudentSubject object with updated data.
     * @return Updated StudentSubject entity.
     */
    @Operation(summary = "Update a student subject")
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Student subject updated",
                content = @Content(schema = @Schema(implementation = StudentSubject.class)))
    })
    @PutMapping("/update")
    public ResponseEntity<StudentSubject> updateStudentSubject(
            @Parameter(description = "Updated StudentSubject object", required = true) @RequestBody
                    StudentSubject updatedStudent) {
        StudentSubject updated = studentSubjectService.updateStudentSubject(updatedStudent);
        return ResponseEntity.ok(updated);
    }

    /**
     * Retrieves students for a subject with pagination, sorting, and optional search query.
     *
     * @param subjectCode code of the subject.
     * @param page Page number (default: 0).
     * @param size Page size (default: 20).
     * @param sortBy Field to sort by (default: "index").
     * @param direction Sort direction: "asc" or "desc" (default: "asc").
     * @param searchQuery Optional search query for filtering.
     * @return Paged result of StudentSubject entities.
     */
    @Operation(summary = "Get paged and filtered students for a subject")
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Paged list of students",
                content = @Content(schema = @Schema(implementation = Page.class)))
    })
    @GetMapping("/subject/{subjectCode}/paged")
    public ResponseEntity<Page<StudentSubject>> getPagedFilteredBySubject(
            @Parameter(description = "Subject Code", required = true) @PathVariable
                    Integer subjectCode,
            @Parameter(description = "Page number, default 0") @RequestParam(defaultValue = "0")
                    int page,
            @Parameter(description = "Page size, default 20") @RequestParam(defaultValue = "20")
                    int size,
            @Parameter(description = "Sort field, default 'index'")
                    @RequestParam(defaultValue = "index")
                    String sortBy,
            @Parameter(description = "Sort direction 'asc' or 'desc', default 'asc'")
                    @RequestParam(defaultValue = "asc")
                    String direction,
            @Parameter(description = "Search query for filtering, optional")
                    @RequestParam(defaultValue = "")
                    String searchQuery) {

        Sort sort =
                direction.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<StudentSubject> result =
                studentSubjectService.getFilteredAndPaged(subjectCode, pageable, searchQuery);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/subject/{subjectCode}/upload/paged")
    public ResponseEntity<Page<StudentSubject>> uploadStudentsPaged(
            @RequestParam("file") MultipartFile file,
            @PathVariable Integer subjectCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "index") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "") String searchQuery) {

        Sort sort =
                direction.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<StudentSubject> saved =
                studentSubjectService.getStudentsFromFilePaged(file, subjectCode, pageable);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/subject/{subjectCode}/upload")
    public ResponseEntity<List<StudentSubject>> uploadStudents(
            @RequestParam("file") MultipartFile file, @PathVariable Integer subjectCode) {

        List<StudentSubject> saved = studentSubjectService.getStudentsFromFile(file, subjectCode);
        return ResponseEntity.ok(saved);
    }

    /**
     * Deletes an Activity by its ID.
     *
     * @param id the ID of the Activity to delete.
     * @return 200 OK if deletion successful; 400 Bad Request otherwise.
     */
    @Operation(summary = "Delete an Student by ID")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Student deleted successfully"),
                @ApiResponse(
                        responseCode = "400",
                        description = "Error during deletion",
                        content = @Content(schema = @Schema(implementation = String.class)))
            })
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteActivity(
            @Parameter(description = "ID of the Student to delete", required = true) @PathVariable
                    Integer id) {
        try {
            studentSubjectService.delete(id);
            return ResponseEntity.ok("Student deleted successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
