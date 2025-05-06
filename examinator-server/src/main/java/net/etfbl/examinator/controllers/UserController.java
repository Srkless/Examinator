package net.etfbl.examinator.controllers;

import lombok.RequiredArgsConstructor;
import net.etfbl.examinator.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
    return userService.register(body)
        .map(error -> ResponseEntity.badRequest().body(error))
        .orElseGet(() -> ResponseEntity.ok("User registered successfully"));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
    String username = body.get("username");
    String password = body.get("password");

    if (userService.authenticate(username, password)) {
      return ResponseEntity.ok("Login successful");
    }

    return ResponseEntity.status(401).body("Invalid credentials");
  }
}
