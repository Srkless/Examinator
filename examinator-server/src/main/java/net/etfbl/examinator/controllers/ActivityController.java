package net.etfbl.examinator.controllers;

import lombok.RequiredArgsConstructor;

import net.etfbl.examinator.models.Activity;
import net.etfbl.examinator.services.ActivityService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping("/add")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        try {
            Optional<Activity> result = activityService.addActivity(body);
            return result.map(activity -> ResponseEntity.ok("Activity added successfully"))
                    .orElseGet(
                            () -> ResponseEntity.badRequest().body("Activity could not be added"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getById(@PathVariable Integer id) {
        Activity activity =
                activityService
                        .getById(id)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Activity with ID " + id + " not found."));
        return ResponseEntity.ok(activity);
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateSubject(@RequestBody Activity updated) {
        Activity activity = activityService.update(updated);
        return ResponseEntity.ok(activity);
    }

    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
    //     String username = body.get("username");
    //     String password = body.get("password");
    //
    //     if (userService.authenticate(username, password)) {
    //         return ResponseEntity.ok("Login successful");
    //     }
    //
    //     return ResponseEntity.status(401).body("Invalid credentials");
    // }
}
