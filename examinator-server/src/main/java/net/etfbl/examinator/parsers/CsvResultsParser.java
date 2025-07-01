package net.etfbl.examinator.parsers;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import net.etfbl.examinator.models.Activity;
import net.etfbl.examinator.models.Result;
import net.etfbl.examinator.models.ResultId;
import net.etfbl.examinator.models.StudentSubject;
import net.etfbl.examinator.services.ActivityService;
import net.etfbl.examinator.services.StudentSubjectService;

public class CsvResultsParser implements Parser {

  private final StudentSubjectService studentSubjectService;
  private final ActivityService activityService;

  public CsvResultsParser(StudentSubjectService studentSubjectService,
      ActivityService activityService) {
    this.studentSubjectService = studentSubjectService;
    this.activityService = activityService;
  }

  public List<Result> parseResults(Integer activityId, byte[] csvFile) {
    List<Result> results = new ArrayList<>();
    Activity activity = activityService.getById(activityId)
        .orElseThrow(() -> new IllegalArgumentException("Could not find activity with id: " + activityId));

    try (
        InputStream inputStream = new ByteArrayInputStream(csvFile);
        Reader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
        BufferedReader bufferedReader = new BufferedReader(reader)) {
      String line;
      boolean isFirstLine = true;

      while ((line = bufferedReader.readLine()) != null) {
        if (isFirstLine) {
          isFirstLine = false;
          continue;
        }

        String[] parts = line.split(",");

        if (parts[1] != "") {
          String index = parts[0].trim();
          Integer points = Integer.parseInt(parts[1].trim());
          Integer subjectCode = activity.getSubject().getCode();
          StudentSubject student = studentSubjectService.getByIndexAndSubjectCode(index, subjectCode);

          Result result = new Result();
          result.setActivity(activity);
          result.setStudentSubject(student);
          result.setPoints(points);

          ResultId resultId = new ResultId();
          resultId.setActivityId(activityId);
          resultId.setStudentSubjectId(student.getId());
          result.setId(resultId);

          results.add(result);
        }
      }

    } catch (IOException e) {
      throw new RuntimeException("Failed to parse CSV", e);
    }

    return results;
  }
}
