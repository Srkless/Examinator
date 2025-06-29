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
}
