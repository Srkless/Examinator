package net.etfbl.examinator.requests;

import lombok.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
public class AddFormulaRequest {

    @NotNull(message = "Name must not be null")
    @Size(min = 1, max = 30, message = "Name must be between 1 and 30 characters")
    private String name;

    @NotNull(message = "Expression must not be null")
    @Size(min = 1, max = 100, message = "Expression must be between 1 and 100 characters")
    private String expression;

    @NotNull(message = "School year must not be null")
    private Integer schoolYear;

    @NotNull(message = "Subject must not be null")
    private Integer subjectCode;
}
