package net.etfbl.examinator.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import net.etfbl.examinator.requests.CalculateResultsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import net.etfbl.examinator.models.Activity;
import net.etfbl.examinator.models.Result;
import net.etfbl.examinator.models.ResultId;
import net.etfbl.examinator.models.StudentSubject;
import net.etfbl.examinator.parsers.CsvResultsParser;
import net.etfbl.examinator.repositories.ActivityRepository;
import net.etfbl.examinator.repositories.StudentSubjectRepository;
import net.etfbl.examinator.requests.AddResultRequest;
import net.etfbl.examinator.requests.UpdateResultRequest;
import net.etfbl.examinator.services.ActivityService;
import net.etfbl.examinator.services.ResultService;
import net.etfbl.examinator.services.StudentSubjectService;
import net.etfbl.examinator.services.SubjectService;
import net.etfbl.examinator.requests.BatchResultRequest;

/**
 * REST controller for managing results of activities for student subjects.
 */
@RestController
@RequestMapping("/api/results")
public class ResultController {

  @Autowired
  private ResultService resultService;

  @Autowired
  private SubjectService subjectService;

  @Autowired
  private StudentSubjectService studentSubjectService;

  @Autowired
  private ActivityService activityService;

  @Autowired
  private StudentSubjectRepository studentSubjectRepository;

  @Autowired
  private ActivityRepository activityRepository;

  /**
   * Retrieves all results.
   *
   * @return List of all Result entities.
   */
  @Operation(summary = "Get all results")
  @ApiResponse(responseCode = "200", description = "List of all results", content = @Content(schema = @Schema(implementation = Result.class)))
  @GetMapping
  public ResponseEntity<List<Result>> getAllResults() {
    List<Result> list = resultService.getAllResults();
    return ResponseEntity.ok(list);
  }

  /**
   * Retrieves all results for a specific subject by ID.
   * x
   * 
   * @param subjectId ID of the subject.
   * @return List of results or 404 if subject not found.
   */
  @Operation(summary = "Get results for a specific subject")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "List of results for subject", content = @Content(schema = @Schema(implementation = Result.class))),
      @ApiResponse(responseCode = "404", description = "Subject not found", content = @Content(schema = @Schema(implementation = Map.class)))
  })
  @GetMapping("/subject/{subjectId}")
  public ResponseEntity<?> getResultsForSubject(
      @Parameter(description = "ID of the subject", required = true) @PathVariable Integer subjectId) {

    if (subjectService.getById(subjectId).isEmpty()) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Subject with ID " + subjectId + " not found.");
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    List<Result> list = resultService.getResultsForSubject(subjectId);
    return ResponseEntity.ok(list);
  }

  /**
   * Retrieves a specific Result by composite key: studentSubjectId and
   * activityId.
   *
   * @param studentSubjectId ID of the student-subject relation.
   * @param activityId       ID of the activity.
   * @return Result if found, or 404 error if not.
   */
  @Operation(summary = "Get result by studentSubjectId and activityId")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Found result", content = @Content(schema = @Schema(implementation = Result.class))),
      @ApiResponse(responseCode = "404", description = "Result not found", content = @Content(schema = @Schema(implementation = Map.class)))
  })
  @GetMapping("/{studentSubjectId}/{activityId}")
  public ResponseEntity<?> getById(
      @Parameter(description = "StudentSubject ID", required = true) @PathVariable Integer studentSubjectId,
      @Parameter(description = "Activity ID", required = true) @PathVariable Integer activityId) {

    Optional<Result> result = resultService.getById(studentSubjectId, activityId);

    if (result.isEmpty()) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Result not found");
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    return ResponseEntity.ok(result.get());
  }

  /**
   * Adds a new Result.
   *
   * @param request The request body containing studentSubjectId, activityId and
   *                points.
   * @return Created Result or 400 if invalid IDs.
   */
  @Operation(summary = "Add a new result")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "Result created", content = @Content(schema = @Schema(implementation = Result.class))),
      @ApiResponse(responseCode = "400", description = "Invalid studentSubjectId or activityId", content = @Content(schema = @Schema(implementation = Map.class)))
  })
  @PostMapping("/")
  public ResponseEntity<?> addResult(
      @Parameter(description = "AddResultRequest payload", required = true) @RequestBody AddResultRequest request) {

    Optional<StudentSubject> studentOpt = studentSubjectRepository.findById(request.getStudentSubjectId());
    Optional<Activity> activityOpt = activityRepository.findById(request.getActivityId());

    if (studentOpt.isEmpty() || activityOpt.isEmpty()) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Invalid studentSubjectId or activityId");
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    Result savedResult = resultService.addResult(studentOpt.get(), activityOpt.get(), request.getPoints());
    return ResponseEntity.status(HttpStatus.CREATED).body(savedResult);
  }

  /**
   * Batch saves multiple results for an activity.
   *
   * @param activityId ID of the activity.
   * @param requests   List of result requests containing student indices and
   *                   points.
   * @return Response with saved results and any errors.
   */
  @Operation(summary = "Batch save results for an activity")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Results processed", content = @Content(schema = @Schema(implementation = Map.class))),
      @ApiResponse(responseCode = "400", description = "Invalid activity ID", content = @Content(schema = @Schema(implementation = Map.class)))
  })
  @PostMapping("/batch/{activityId}")
  public ResponseEntity<?> batchSaveResults(
      @Parameter(description = "Activity ID", required = true) @PathVariable Integer activityId,
      @Parameter(description = "List of results to save", required = true) @RequestBody List<BatchResultRequest> requests) {

    Optional<Activity> activityOpt = activityRepository.findById(activityId);
    if (activityOpt.isEmpty()) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Activity with ID " + activityId + " not found");
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    Activity activity = activityOpt.get();
    List<Result> savedResults = new ArrayList<>();
    List<String> errors = new ArrayList<>();

    for (BatchResultRequest request : requests) {
      try {
        // Find student by index
        Optional<StudentSubject> studentOpt = studentSubjectRepository
            .findByIndexAndSubject_Code(request.getStudentIndex(), request.getSubjectCode());

        if (studentOpt.isEmpty()) {
          errors.add("Student with index " + request.getStudentIndex() + " not found");
          continue;
        }

        StudentSubject studentSubject = studentOpt.get();

        Optional<Result> existingResult = resultService.getById(studentSubject.getId(), activityId);

        if (existingResult.isPresent()) {
          Result existing = existingResult.get();
          existing.setPoints(request.getPoints());
          Result updated = resultService.updateResult(existing);
          savedResults.add(updated);
        } else {
          Result newResult = resultService.addResult(studentSubject, activity, request.getPoints());
          savedResults.add(newResult);
        }

      } catch (Exception e) {
        errors.add("Error processing student " + request.getStudentIndex() + ": " + e.getMessage());
      }
    }

    Map<String, Object> response = new HashMap<>();
    response.put("savedResults", savedResults);
    response.put("errors", errors);
    response.put("totalProcessed", requests.size());
    response.put("successCount", savedResults.size());
    response.put("errorCount", errors.size());

    return ResponseEntity.ok(response);
  }

  /**
   * Updates an existing Result.
   *
   * @param request The request body containing updated result data.
   * @return Updated Result or 404 if not found.
   */
  @Operation(summary = "Update an existing result")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Result updated", content = @Content(schema = @Schema(implementation = Result.class))),
      @ApiResponse(responseCode = "404", description = "Result not found", content = @Content(schema = @Schema(implementation = String.class)))
  })
  @PutMapping("/")
  public ResponseEntity<?> updateResult(
      @Parameter(description = "UpdateResultRequest payload", required = true) @RequestBody UpdateResultRequest request) {

    ResultId id = new ResultId(request.getActivityId(), request.getStudentSubjectId());

    Result existing = resultService.getById(id)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Result with ID (" + request.getStudentSubjectId() + ", " + request.getActivityId() + ") not found"));

    existing.setPoints(request.getPoints());
    Result updated = resultService.updateResult(existing);

    return ResponseEntity.ok(updated);
  }

  /**
   * Deletes a Result by composite key.
   *
   * @param studentSubjectId ID of the student-subject relation.
   * @param activityId       ID of the activity.
   * @return Deleted Result or 404 if not found.
   */
  @Operation(summary = "Delete a result by studentSubjectId and activityId")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Result deleted", content = @Content(schema = @Schema(implementation = Result.class))),
      @ApiResponse(responseCode = "404", description = "Result not found", content = @Content(schema = @Schema(implementation = Map.class)))
  })
  @DeleteMapping("/{studentSubjectId}/{activityId}")
  public ResponseEntity<?> removeResult(
      @Parameter(description = "StudentSubject ID", required = true) @PathVariable Integer studentSubjectId,
      @Parameter(description = "Activity ID", required = true) @PathVariable Integer activityId) {

    ResultId id = new ResultId(activityId, studentSubjectId);

    try {
      Result deleted = resultService.removeResult(id);
      return ResponseEntity.ok(deleted);
    } catch (IllegalArgumentException ex) {
      Map<String, String> error = new HashMap<>();
      error.put("error", ex.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
  }

  /**
   * Generates a PDF report of results for a given activity.
   *
   * @param id Activity ID.
   * @return PDF file as byte array with content disposition inline.
   */
  @Operation(summary = "Generate PDF report of activity results")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "PDF generated", content = @Content(mediaType = "application/pdf")),
      @ApiResponse(responseCode = "404", description = "Activity or results not found")
  })
  @GetMapping(value = "/activities/{id}/results.pdf", produces = "application/pdf")
  public ResponseEntity<byte[]> getActivityResultsPdf(
      @Parameter(description = "Activity ID", required = true) @PathVariable Integer id) {

    byte[] pdf = resultService.generateActivityResultsPdf(id);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.setContentDisposition(ContentDisposition.inline().filename("activity-" + id + "-results.pdf").build());

    return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
  }

  /**
   * Generates a CSV report of results for a given activity.
   *
   * @param id Activity ID.
   * @return CSV file as byte array with content disposition attachment.
   */
  @Operation(summary = "Generate CSV report of activity results")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "CSV generated", content = @Content(mediaType = "text/csv")),
      @ApiResponse(responseCode = "404", description = "Activity or results not found")
  })
  @GetMapping(value = "/activities/{id}/results.csv", produces = "text/csv")
  public ResponseEntity<byte[]> getActivityResultsCsv(
      @Parameter(description = "Activity ID", required = true) @PathVariable Integer id) {

    byte[] csv = resultService.generateActivityResultsCsv(id);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.parseMediaType("text/csv"));
    headers.setContentDisposition(ContentDisposition.attachment() // preuzimanje CSV fajla!
        .filename("activity-" + id + "-results.csv")
        .build());

    return new ResponseEntity<>(csv, headers, HttpStatus.OK);
  }

  /**
   * Generate JSON containing results calculated by given formula for given
   * students.
   * 
   * @param request Composite request containing student index, subject code and
   *                formula.
   * @return JSON containing a list of calculated results.
   */
  @Operation(summary = "Generate calculated results for students with given indexes based on a given formula.")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Results generated", content = @Content(mediaType = "application/json")),
      @ApiResponse(responseCode = "404", description = "Activity, student or subject not found.")
  })
  @PostMapping("/calculate")
  public ResponseEntity<List<Integer>> calculateResults(
      @RequestBody CalculateResultsRequest request) {

    List<Integer> results = resultService.calculateResults(
        request.getFormula(),
        request.getStudentIndexes(),
        request.getSubjectCode());

    return ResponseEntity.ok(results);
  }

  @Operation(summary = "Upload CSV with results for a specific activity")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "CSV processed successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid activity ID or file"),
  })
  @PostMapping(value = "/upload/{activityId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> uploadCsvResults(
      @Parameter(description = "Activity ID", required = true) @PathVariable Integer activityId,
      @Parameter(description = "CSV file", required = true) @RequestPart("file") MultipartFile file) {

    Optional<Activity> activityOpt = activityRepository.findById(activityId);
    if (activityOpt.isEmpty()) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body("Activity with ID " + activityId + " not found");
    }

    byte[] csvBytes;
    try {
      csvBytes = file.getBytes();
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body("Failed to read uploaded file: " + e.getMessage());
    }
    List<Result> parsed;
    List<String> mismatched;
    try {
      CsvResultsParser csvResultsParser = new CsvResultsParser(studentSubjectService, activityService);

      parsed = csvResultsParser.parseResults(activityId, csvBytes);
      mismatched = resultService.addResultsFromList(parsed);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    StringBuilder returnMessage = new StringBuilder("Rezultati iz CSV fajla su uspješno ažurirani.");
    if (!mismatched.isEmpty()) {
      returnMessage.append(" Studenti sa indeksima: ");
      for (int i = 0; i < mismatched.size(); i++) {
        returnMessage.append(mismatched.get(i));
        if (i < mismatched.size() - 1) {
          returnMessage.append(", ");
        }
      }
      returnMessage.append(" nisu pronađeni za datu školsku godinu.");
    }

    return ResponseEntity.ok(Map.of("message", returnMessage.toString()));
  }

}
