package net.etfbl.examinator.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.etfbl.examinator.models.Formula;
import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.repositories.FormulaRepository;
import net.etfbl.examinator.repositories.SubjectRepository;
import net.etfbl.examinator.requests.AddFormulaRequest;

@Service
public class FormulaService {
    @Autowired
    private FormulaRepository formulaRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public Optional<Formula> addFormula(AddFormulaRequest request) {
        String name = request.getName();
        String expression = request.getExpression();
        Integer schoolYear = request.getSchoolYear();
        Integer subjectCode = request.getSubjectCode();

        if (name == null || schoolYear == null || subjectCode == null) {
            throw new IllegalArgumentException("All fields must be provided");
        }

        Subject subject = subjectRepository.findByCode(subjectCode)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found"));

        if (formulaRepository.existsByNameAndSubjectIdAndSchoolYear(name, subject.getId(), schoolYear)) {
            throw new IllegalArgumentException(
                    "Formula with this name already exists for the given subject and school year");
        }
        if (formulaRepository.existsByExpressionAndSubjectIdAndSchoolYear(expression, subject.getId(), schoolYear)) {
            throw new IllegalArgumentException(
                    "Formula with this expression already exists for the given subject and school year");
        }

        Formula formula = new Formula();
        formula.setName(name);
        formula.setExpression(expression);
        formula.setSchoolYear(schoolYear);
        formula.setSubject(subject);

        formulaRepository.save(formula);
        return Optional.of(formula);
    }

    public void delete(Integer id) {
        if (!formulaRepository.existsById(id)) {
            throw new RuntimeException("Formula with ID " + id + " does not exist");
        }
        formulaRepository.deleteById(id);
    }

    public Optional<Formula> getById(Integer id) {
        return formulaRepository.findById(id);
    }

    public Formula update(Formula updated) {

        Integer id = updated.getId();
        Integer subjectId = updated.getSubject().getId();
        System.out.println(subjectId);

        Optional<Formula> optionalFormula = formulaRepository.findById(id);

        if (optionalFormula.isEmpty()) {
            throw new RuntimeException("Formula not found");
        }

        Formula existingFormula = optionalFormula.get();

        Optional<Subject> optionalSubject = subjectRepository.findById(subjectId);
        if (optionalSubject.isEmpty()) {
            throw new IllegalArgumentException("Subject not found");
        }

        Subject existingSubject = optionalSubject.get();
        boolean nameConflict = formulaRepository.existsByNameAndSubjectIdAndSchoolYear(updated.getName(), subjectId,
                updated.getSchoolYear());
        boolean expressionConflict = formulaRepository.existsByExpressionAndSubjectIdAndSchoolYear(
                updated.getExpression(), subjectId, updated.getSchoolYear());

        Optional<Formula> existingByName = formulaRepository.findByNameAndSubjectIdAndSchoolYear(updated.getName(),
                subjectId, updated.getSchoolYear());

        Optional<Formula> existingByExpression = formulaRepository
                .findByExpressionAndSubjectIdAndSchoolYear(updated.getExpression(), subjectId, updated.getSchoolYear());

        if (!existingByName.isEmpty()) {

            if (existingByName.get().getId() != updated.getId()) {
                throw new IllegalArgumentException("Formuila with the same name already exists");
            }
        }

        if (!existingByExpression.isEmpty()) {
            if (existingByExpression.get().getId() != updated.getId()) {
                throw new IllegalArgumentException("Formula with the same expression already exists");
            }
        }

        // if (nameConflict) {
        // throw new IllegalArgumentException("Formula with the same name already
        // exists");
        // }
        // if (expressionConflict) {
        // throw new IllegalArgumentException("Formula with the same expression already
        // exists");
        // }

        existingFormula.setName(updated.getName());
        existingFormula.setExpression(updated.getExpression());

        return formulaRepository.save(existingFormula);

    }
}
