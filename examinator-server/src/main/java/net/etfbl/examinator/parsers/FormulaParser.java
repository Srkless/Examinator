package net.etfbl.examinator.parsers;

import com.googlecode.aviator.AviatorEvaluator;
import lombok.*;
import java.util.*;

/**
 * <H1>
 * Simple Formula parsing class. It relies on Google Aviator Expression Language.
 * </H1>
 *
 * @author Marko Maksimovic
 * @version 1.0
 * For further information about the parsing engine, refer to: <a href="https://mvnrepository.com/artifact/com.googlecode.aviator/aviator/5.4.3">...</a>
 */
@Getter
@Setter
public class FormulaParser implements Parser {
    private String formula;

    /**
     * Constructs a FormulaParser object to parse the given formula.
     * @param formula Formula to parse.
     */
    public FormulaParser(String formula) {
        this.formula = formula;
    }

    /**
     *
     * @param studentResults map containing student results mapped to activity identifiers.
     * @return number of points a student has achieved.
     */
    public int evaluate(Map<String, Integer> studentResults) {
        Map<String, Object> env = new HashMap<>(studentResults);

        return Integer.parseInt(AviatorEvaluator.execute(formula, env).toString());
    }

}
