package net.etfbl.examinator.requests;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class AddResultRequest {
  private Integer studentSubjectId;
  private Integer activityId;
  private Integer points;

}
