package net.etfbl.examinator.requests;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CalculateResultsRequest {
    private String formula;
    private List<String> studentIndexes;
    private Integer subjectCode;
}
