package net.etfbl.examinator.requests;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class AddProfessorRequest {
  private Integer subjectId;
  private String username;
}
