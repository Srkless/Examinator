package net.etfbl.examinator.controllers;

import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.etfbl.examinator.models.Formula;
import net.etfbl.examinator.requests.AddFormulaRequest;
import net.etfbl.examinator.services.ActivityService;
import net.etfbl.examinator.services.FormulaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/formula")
@RequiredArgsConstructor
public class FormulaController {

    private final FormulaService formulaService;

    @PostMapping("/add")
    public ResponseEntity<?> addFormula(
            @Parameter(description = "Formula details", required = true) @RequestBody AddFormulaRequest request) {

        try {
            Optional<Formula> result = formulaService.addFormula(request);
            return result.map(formula -> ResponseEntity.ok("Formula added successfully"))
                    .orElseGet(() -> ResponseEntity.badRequest().body("Formula could not be added"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @Parameter(description = "ID of the formula to retrieve") @PathVariable Integer id) {
        Formula formula = formulaService.getById(id)
                .orElseThrow(() -> new RuntimeException("Formula with ID " + id + " not found"));
        return ResponseEntity.ok(formula);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFormula(
            @Parameter(description = "ID of the formula to delete", required = true) @PathVariable Integer id) {

        try {
            formulaService.delete(id);
            return ResponseEntity.ok("Formula deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateFormula(
            @Parameter(description = "Updated formula Object", required = true) @RequestBody Formula updated) {
        try {
            Formula formula = formulaService.update(updated);
            return ResponseEntity.ok(formula);
        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
