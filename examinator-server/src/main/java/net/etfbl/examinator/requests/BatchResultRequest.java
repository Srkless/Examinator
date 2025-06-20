package net.etfbl.examinator.requests;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class BatchResultRequest {
  private String studentIndex;
  private Integer subjectCode;
  private Integer points;

  public BatchResultRequest(String studentIndex, Integer points, Integer subjectCode) {
    this.studentIndex = studentIndex;
    this.points = points;
    this.subjectCode = subjectCode;
  }

}
