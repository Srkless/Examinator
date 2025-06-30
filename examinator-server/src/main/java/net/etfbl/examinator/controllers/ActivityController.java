package net.etfbl.examinator.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import lombok.RequiredArgsConstructor;

import net.etfbl.examinator.models.Activity;
import net.etfbl.examinator.services.ActivityService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * REST controller for managing activities. Provides endpoints to create, retrieve, update, and
 * delete Activity entities.
 */
@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    /**
     * Adds a new Activity using the provided request body.
     *
     * @param body Map containing the Activity fields and values.
     * @return HTTP 200 with success message if added; 400 with error message otherwise.
     */
    @Operation(summary = "Add a new Activity")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Activity added successfully"),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid request or Activity could not be added",
                        content = @Content(schema = @Schema(implementation = String.class)))
            })
    @PostMapping("/add")
    public ResponseEntity<?> register(
            @Parameter(description = "Activity fields as key-value pairs", required = true)
                    @RequestBody
                    Map<String, Object> body) {
        try {
            Optional<Activity> result = activityService.addActivity(body);
            return result.map(activity -> ResponseEntity.ok("Activity added successfully"))
                    .orElseGet(
                            () -> ResponseEntity.badRequest().body("Activity could not be added"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Retrieves an Activity by its ID.
     *
     * @param id the ID of the Activity to retrieve.
     * @return the Activity entity if found.
     * @throws RuntimeException if Activity with given ID does not exist.
     */
    @Operation(summary = "Get Activity by ID")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Found the Activity",
                        content = @Content(schema = @Schema(implementation = Activity.class))),
                @ApiResponse(
                        responseCode = "404",
                        description = "Activity not found",
                        content = @Content(schema = @Schema(implementation = String.class)))
            })
    @GetMapping("/{id}")
    public ResponseEntity<Activity> getById(
            @Parameter(description = "ID of the Activity to retrieve", required = true)
                    @PathVariable
                    Integer id) {
        Activity activity =
                activityService
                        .getById(id)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Activity with ID " + id + " not found."));
        return ResponseEntity.ok(activity);
    }

    /**
     * Updates an existing Activity.
     *
     * @param updated the updated Activity object.
     * @return the updated Activity on success; 400 with error message on failure.
     */
    @Operation(summary = "Update an existing Activity")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Activity updated successfully",
                        content = @Content(schema = @Schema(implementation = Activity.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid update request",
                        content = @Content(schema = @Schema(implementation = String.class)))
            })
    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateSubject(
            @Parameter(description = "Updated Activity object", required = true) @RequestBody
                    Activity updated) {
        try {
            Activity activity = activityService.update(updated);
            return ResponseEntity.ok(activity);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /**
     * Deletes an Activity by its ID.
     *
     * @param id the ID of the Activity to delete.
     * @return 200 OK if deletion successful; 400 Bad Request otherwise.
     */
    @Operation(summary = "Delete an Activity by ID")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Activity deleted successfully"),
                @ApiResponse(
                        responseCode = "400",
                        description = "Error during deletion",
                        content = @Content(schema = @Schema(implementation = String.class)))
            })
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteActivity(
            @Parameter(description = "ID of the Activity to delete", required = true) @PathVariable
                    Integer id) {
        try {
            activityService.delete(id);
            return ResponseEntity.ok("Activity deleted successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
