package net.etfbl.examinator.requests;

import lombok.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
public class AddActivityRequest {

    @NotNull(message = "Name must not be null")
    @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
    private String name;

    @NotNull(message = "Short name must not be null")
    @Size(min = 1, max = 100, message = "Short name must be between 1 and 100 characters")
    private String shortName;

    @NotNull(message = "Max points must not be null")
    private Integer maxPoints;

    @NotNull(message = "School year must not be null")
    private Integer schoolYear;

    @NotNull(message = "Subject must not be null")
    private Integer subjectCode;

}
