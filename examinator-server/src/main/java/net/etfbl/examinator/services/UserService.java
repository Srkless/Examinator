package net.etfbl.examinator.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

import net.etfbl.examinator.models.User;
import net.etfbl.examinator.repositories.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public Optional<String> register(Map<String, String> body) {
    String username = body.get("username");
    String email = body.get("email");

    if (userRepository.existsByUsername(username)) {
      return Optional.of("Username already exists");
    }

    if (userRepository.existsByEmail(email)) {
      return Optional.of("Email already exists");
    }

    User user = new User();
    user.setFirstName(body.get("firstName"));
    user.setLastName(body.get("lastName"));
    user.setEmail(email);
    user.setUsername(username);
    user.setPasswordHash(passwordEncoder.encode(body.get("password")));

    userRepository.save(user);
    return Optional.empty(); // no error
  }

  public boolean authenticate(String username, String password) {
    return userRepository.findByUsername(username)
        .map(user -> passwordEncoder.matches(password, user.getPasswordHash()))
        .orElse(false);
  }
}
