package net.etfbl.examinator.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import lombok.RequiredArgsConstructor;

import net.etfbl.examinator.models.UserDTO;
import net.etfbl.examinator.security.JwtUtil;
import net.etfbl.examinator.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** REST controller for user registration and authentication. */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Autowired private JwtUtil jwtUtil;

    /**
     * Registers a new user with provided credentials.
     *
     * @param body Map containing user registration data (e.g., username, password).
     * @return 200 OK if registration successful, 400 Bad Request with error message otherwise.
     */
    @Operation(summary = "Register a new user")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User registered successfully"),
        @ApiResponse(
                responseCode = "400",
                description = "Registration failed",
                content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Parameter(description = "User registration data", required = true) @RequestBody
                    Map<String, String> body) {
        return userService
                .register(body)
                .map(error -> ResponseEntity.badRequest().body(error))
                .orElseGet(() -> ResponseEntity.ok("User registered successfully"));
    }

    @Operation(summary = "Get all users")
    @ApiResponse(
            responseCode = "200",
            description = "List of users",
            content =
                    @Content(
                            array = @ArraySchema(schema = @Schema(implementation = UserDTO.class))))
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }

    /**
     * Authenticates a user and returns a JWT token if successful.
     *
     * @param body Map containing login data: "username" and "password".
     * @return 200 OK with JWT token if authenticated, 401 Unauthorized otherwise.
     */
    @Operation(summary = "Authenticate user and generate JWT token")
    @ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Authentication successful",
                content = @Content(schema = @Schema(implementation = Map.class))),
        @ApiResponse(
                responseCode = "401",
                description = "Invalid credentials",
                content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Parameter(description = "User login data", required = true) @RequestBody
                    Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (userService.authenticate(username, password)) {
            String token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(Map.of("token", token));
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
