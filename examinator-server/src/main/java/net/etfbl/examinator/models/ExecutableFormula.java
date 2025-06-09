package net.etfbl.examinator.models;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;


@Setter
@Getter
public class ExecutableFormula {
    private String prefixFormula;

    public ExecutableFormula(String prefixFormula) {
        this.prefixFormula = prefixFormula;
    }

    public int calculatePoints(Map<String, Integer> studentPoints) {
        String preparedFormula = prepareFormula(studentPoints);

        return executeFormula(preparedFormula);
    }

    private int executeFormula(String preparedFormula) {

        // TODO: implementirati izvrsavanje prefix notacije



        return 0;
    }

     String prepareFormula(Map<String, Integer> studentPoints) {
        prefixFormula = prefixFormula.replace(" ", "");
        StringBuilder formula = new StringBuilder(prefixFormula);

        studentPoints.forEach((key, value) -> {
            String oldString = formula.toString();
            formula.delete(0, oldString.length());
            formula.append(oldString.replace(key, value.toString()));
        });

        return formula.toString();
    }

}
