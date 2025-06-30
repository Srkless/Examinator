package net.etfbl.examinator.parsers;

import net.etfbl.examinator.models.StudentSubject;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Arrays;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Parser implementation for parsing student subject data from CSV-formatted
 * strings.
 * <p>
 * The CSV format is currently assumed to be:
 * 
 * <pre>
 * schoolYear,index,firstName,lastName,group
 * </pre>
 * 
 * Each line corresponds to one {@link StudentSubject} object.
 * <p>
 * Note: Proper CSV parsing (e.g., handling quoted values, commas inside fields)
 * is not yet implemented.
 */
public class CsvStudentParser implements StudentParser {

  /**
   * Parses student subject data from a CSV string.
   *
   * @param source the CSV data string, with each line representing one student
   *               subject record
   * @return a list of {@link StudentSubject} objects parsed from the CSV data
   * @throws IllegalArgumentException if the school year field cannot be parsed as
   *                                  an integer
   */
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

      s.setIndex(parts[indexIndex]);
      s.setFirstName(parts[firstNameIndex]);
      s.setLastName(parts[lastNameIndex]);
      s.setGroup(parts[groupIndex]);

      return s;
    }).collect(Collectors.toList());
  }

  /**
   * Parses student subject data from a CSV string and applies a filter predicate.
   *
   * @param source the CSV data string, with each line representing one student
   *               subject record
   * @param filter a predicate to filter the parsed {@link StudentSubject} objects
   * @return a filtered list of {@link StudentSubject} objects that satisfy the
   *         predicate
   * @throws IllegalArgumentException if the school year field cannot be parsed as
   *                                  an integer
   */
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

      s.setIndex(parts[indexIndex]);
      s.setFirstName(parts[firstNameIndex]);
      s.setLastName(parts[lastNameIndex]);
      s.setGroup(parts[groupIndex]);

      return s;
    }).filter(filter).collect(Collectors.toList());
  }

  /**
   * Parses student subject data from a CSV string. This method is meant to be used to parse .csv students
   * file containing students on a specific subject.
   *
   * @param source the CSV data string, with each line representing one student
   *               subject record
   * @return a list of {@link StudentSubject} objects parsed from the CSV data
   * @throws IllegalArgumentException if the school year field cannot be parsed as
   *                                  an integer
   */
  public List<StudentSubject> parseStudentsOnSubject(String source) throws IllegalArgumentException {
    //analiza header-a
    String header = source.split("\\R")[0];
    String[] headerParts = header.split(",");
    int indexIndex = 2;
    int firstNameIndex = 1;
    int lastNameIndex = 0;
    int groupIndex = -1;

    // dinamicko trazenje idenksa u .csv-u
    for(int i = 0; i < headerParts.length; i++) {
        switch (headerParts[i]) {
            case "презиме" -> lastNameIndex = i;
            case "име" -> firstNameIndex = i;
            case "алтернативни индекс" -> indexIndex = i;
            case "група" -> groupIndex = i;
        }
    }

    final int indexIndexCopy = indexIndex;
    final int firstNameIndexCopy = firstNameIndex;
    final int groupIndexCopy = groupIndex;
    final int lastNameIndexCopy = lastNameIndex;

    // preskakanje header reda sa skip(1)!
    return Arrays.stream(source.split("\\R")).skip(1).map(line -> {
      StudentSubject s = new StudentSubject();
      String[] parts = line.split(",");


      s.setIndex(parts[indexIndexCopy]);
      s.setFirstName(parts[firstNameIndexCopy]);
      s.setLastName(parts[lastNameIndexCopy]);
      if(groupIndexCopy != -1)
        s.setGroup(parts[groupIndexCopy]);

      return s;
    }).collect(Collectors.toList());
  }
}
