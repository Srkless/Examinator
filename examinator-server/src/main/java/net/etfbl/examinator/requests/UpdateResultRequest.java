
package net.etfbl.examinator.requests;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
public class UpdateResultRequest {
  private Integer studentSubjectId;
  private Integer activityId;
  private Integer points;

}
