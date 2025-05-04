package net.etfbl.examinator.parsers;

import java.util.List;
import net.etfbl.examinator.models.StudentSubject;
import java.util.function.Predicate;
import java.lang.IllegalArgumentException;

public interface Parser {
  public List<StudentSubject> ParseStudents(String source) throws IllegalArgumentException;

  public List<StudentSubject> ParseStudents(String source, Predicate<StudentSubject> filter)
      throws IllegalArgumentException;
}
