package net.etfbl.examinator.controllers;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.etfbl.examinator.models.Formula;
import net.etfbl.examinator.requests.AddFormulaRequest;
import net.etfbl.examinator.services.FormulaService;

@RestController
@RequestMapping("/api/formula")
@RequiredArgsConstructor
public class FormulaController {

    private final FormulaService formulaService;

    @PostMapping("/add")
    public ResponseEntity<?> addFormula(
            @Parameter(description = "Formula details", required = true) @Valid @RequestBody AddFormulaRequest request) {

        System.out.println("recieved request " + request.getName());
        try {
            Optional<Formula> result = formulaService.addFormula(request);
            return result.map(formula -> ResponseEntity.ok("Formula added succesjsfylly"))
                    .orElseGet(() -> ResponseEntity.badRequest().body("Formula could not be added"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
