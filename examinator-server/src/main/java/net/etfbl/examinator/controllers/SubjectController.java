package net.etfbl.examinator.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.models.User;
import net.etfbl.examinator.requests.AddProfessorRequest;
import net.etfbl.examinator.services.SubjectService;
import net.etfbl.examinator.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing subjects and their related operations.
 * Handles CRUD operations, user-subject associations, and subject retrieval.
 */
@RestController
@RequestMapping("/api/subjects")
@Tag(name = "Subjects", description = "Endpoints for managing subjects and assigning professors")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private UserService userService;

    /**
     * Retrieves a list of all subjects associated with the currently authenticated
     * user.
     *
     * @param principal the authenticated user making the request
     * @return a list of {@link Subject} entities
     */
    @Operation(summary = "Get all subjects for current user")
    @ApiResponse(responseCode = "200", description = "List of subjects", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Subject.class))))
    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects(Principal principal) {
        List<Subject> list = subjectService.getAll(principal);
        return ResponseEntity.ok(list);
    }

    /**
     * Retrieves a single subject by its ID.
     *
     * @param id the ID of the subject
     * @return the subject if found; 404 if not found; 500 on unexpected errors
     */
    @Operation(summary = "Get a subject by its ID")
    @ApiResponse(responseCode = "200", description = "Subject found", content = @Content(schema = @Schema(implementation = Subject.class)))
    @ApiResponse(responseCode = "404", description = "Subject not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        try {
            Subject subject = subjectService
                    .getById(id)
                    .orElseThrow(() -> new RuntimeException("Subject with ID " + id + " not found."));
            return ResponseEntity.ok(subject);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }

    /**
     * Adds a professor (user) to an existing subject.
     *
     * Expects a JSON body:
     * 
     * <pre>
     * {
     *   "username": "username",
     *   "subjectId": "5"
     * }
     * </pre>
     *
     * @param request the request containing the username and subject ID
     * @return 200 on success; 404 if user or subject not found; 500 on unexpected
     *         errors
     */
    @Operation(summary = "Add a professor (user) to a subject")
    @ApiResponse(responseCode = "200", description = "User added to subject")
    @ApiResponse(responseCode = "404", description = "User or subject not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @PostMapping("/addProfessor")
    public ResponseEntity<?> addProfessor(@RequestBody AddProfessorRequest request) {
        try {
            String username = request.getUsername();
            Integer subjectId = request.getSubjectId();

            Subject subject = subjectService.getById(subjectId)
                    .orElseThrow(() -> new RuntimeException("Subject with ID " + subjectId + " not found."));
            User user = userService.getByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User with username: " + username + " not found"));

            subjectService.addUserToSubject(username, subjectId);
            return ResponseEntity.ok("User successfully added to subject.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }

    /**
     * Adds a new subject to the authenticated user's account.
     *
     * Expects a JSON body with key-value pairs like:
     * 
     * <pre>
     * {
     *   "name": "Mathematics",
     *   "code": "MATH101"
     * }
     * </pre>
     *
     * @param body      a map of subject properties (e.g. name, code)
     * @param principal the authenticated user
     * @return 200 on success; 400 on validation failure; 500 on unexpected errors
     */
    @Operation(summary = "Add a new subject")
    @ApiResponse(responseCode = "200", description = "Subject added successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "500", description = "Failed to add subject")
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Map<String, String> body, Principal principal) {
        try {
            return subjectService
                    .add(body, principal)
                    .map(error -> ResponseEntity.badRequest().body(error))
                    .orElseGet(() -> ResponseEntity.ok("Subject added successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add subject: " + e.getMessage());
        }
    }

    /**
     * Updates an existing subject.
     *
     * Expects a full JSON representation of a {@link Subject} object.
     * The object must contain a valid ID to be updated.
     *
     * @param updated the subject with updated fields
     * @return 200 with updated subject; 400 on invalid input; 404 if subject not
     *         found; 500 on unexpected errors
     */
    @Operation(summary = "Update an existing subject")
    @ApiResponse(responseCode = "200", description = "Subject updated", content = @Content(schema = @Schema(implementation = Subject.class)))
    @ApiResponse(responseCode = "400", description = "Invalid subject data")
    @ApiResponse(responseCode = "404", description = "Subject not found")
    @ApiResponse(responseCode = "500", description = "Failed to update subject")
    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateSubject(@RequestBody Subject updated) {
        try {
            Subject subject = subjectService.update(updated);
            return ResponseEntity.ok(subject);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Subject not found: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid subject data: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update subject: " + e.getMessage());
        }
    }
}
