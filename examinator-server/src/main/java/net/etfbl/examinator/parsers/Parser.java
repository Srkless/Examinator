package net.etfbl.examinator.parsers;

import java.util.List;
import net.etfbl.examinator.models.StudentSubject;
import java.util.function.Predicate;

/**
 * Interface defining methods for parsing student subject data from a source
 * string.
 * Implementations are responsible for converting raw data into a list of
 * {@link StudentSubject} objects.
 */
public interface Parser {

  /**
   * Parses student subject data from the given source string.
   *
   * @param source the raw input string containing student subject data to parse
   * @return a list of {@link StudentSubject} objects parsed from the source
   * @throws IllegalArgumentException if the source is invalid or parsing fails
   */
  List<StudentSubject> ParseStudents(String source) throws IllegalArgumentException;

  /**
   * Parses student subject data from the given source string and applies a filter
   * predicate.
   *
   * @param source the raw input string containing student subject data to parse
   * @param filter a predicate used to filter the parsed {@link StudentSubject}
   *               objects
   * @return a filtered list of {@link StudentSubject} objects that satisfy the
   *         given predicate
   * @throws IllegalArgumentException if the source is invalid or parsing fails
   */
  List<StudentSubject> ParseStudents(String source, Predicate<StudentSubject> filter)
      throws IllegalArgumentException;
}
