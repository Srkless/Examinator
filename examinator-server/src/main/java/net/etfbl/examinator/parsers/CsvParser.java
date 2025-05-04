package net.etfbl.examinator.parsers;

import net.etfbl.examinator.parsers.Parser;
import net.etfbl.examinator.models.StudentSubject;
import java.util.List;
import java.util.Arrays;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class CsvParser implements Parser {

  public List<StudentSubject> ParseStudents(String source) throws IllegalArgumentException {
    // TODO parse according to proper CSV format, for now, use assumed format

    return Arrays.stream(source.split("\\R")).map(line -> {
      StudentSubject s = new StudentSubject();
      String[] parts = line.split(",");

      int schoolYearIndex = 0;
      int indexIndex = 1;
      int firstNameIndex = 2;
      int lastNameIndex = 3;
      int groupIndex = 4;

      // parse school year
      try {
        s.setSchoolYear(Integer.parseInt(parts[schoolYearIndex]));
      } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Id was not a number. Id was " + parts[0]);
      }

      // parse index
      s.setIndex(parts[1]);

      // parse first name
      s.setFirstName(parts[2]);

      // parse last name
      s.setLastName(parts[3]);

      // parse group
      s.setGroup(parts[4]);

      return s;
    }).collect(Collectors.toList());
  }

  public List<StudentSubject> ParseStudents(String source, Predicate<StudentSubject> filter) {
    // TODO parse according to proper CSV format, for now, use assumed format

    return Arrays.stream(source.split("\\R")).map(line -> {
      StudentSubject s = new StudentSubject();
      String[] parts = line.split(",");

      int schoolYearIndex = 0;
      int indexIndex = 1;
      int firstNameIndex = 2;
      int lastNameIndex = 3;
      int groupIndex = 4;

      // parse school year
      try {
        s.setSchoolYear(Integer.parseInt(parts[schoolYearIndex]));
      } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Id was not a number. Id was " + parts[0]);
      }

      // parse index
      s.setIndex(parts[1]);

      // parse first name
      s.setFirstName(parts[2]);

      // parse last name
      s.setLastName(parts[3]);

      // parse group
      s.setGroup(parts[4]);

      return s;
    }).filter(filter).collect(Collectors.toList());
  }
}
