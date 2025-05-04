
package net.etfbl.examinator.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import net.etfbl.examinator.models.User;
import net.etfbl.examinator.repositories.UserRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
    String username = body.get("username");
    String email = body.get("email");

    if (userRepository.existsByUsername(username)) {
      return ResponseEntity.badRequest().body("Username already exists");
    }

    if (userRepository.existsByEmail(email)) {
      return ResponseEntity.badRequest().body("Email already exists");
    }

    User user = new User();
    user.setFirstName(body.get("firstName"));
    user.setLastName(body.get("lastName"));
    user.setEmail(email);
    user.setUsername(username);
    user.setPasswordHash(passwordEncoder.encode(body.get("password")));

    userRepository.save(user);

    return ResponseEntity.ok("User registered successfully");
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
    String username = body.get("username");
    String password = body.get("password");

    return userRepository.findByUsername(username)
        .map(user -> {
          if (passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.ok("Login successful");
          } else {
            return ResponseEntity.status(401).body("Invalid credentials");
          }
        })
        .orElseGet(() -> ResponseEntity.status(401).body("Invalid credentials"));
  }
}
