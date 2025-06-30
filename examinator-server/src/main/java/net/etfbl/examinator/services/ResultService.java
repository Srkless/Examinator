package net.etfbl.examinator.services;

import java.util.*;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import net.etfbl.examinator.parsers.FormulaParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.etfbl.examinator.models.Activity;
import net.etfbl.examinator.models.Result;
import net.etfbl.examinator.models.ResultId;
import net.etfbl.examinator.models.StudentSubject;
import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.repositories.ActivityRepository;
import net.etfbl.examinator.repositories.ResultRepository;
import net.etfbl.examinator.repositories.StudentSubjectRepository;
import net.etfbl.examinator.repositories.SubjectRepository;

import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.*;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.io.source.ByteArrayOutputStream;

@Service
public class ResultService {
  @Autowired
  private ResultRepository resultRepository;

  @Autowired
  private StudentSubjectRepository studentRepository;

  @Autowired
  private SubjectRepository subjectRepository;

  @Autowired
  private ActivityRepository activityRepository;

  public List<Result> getAllResults() {
    List<Result> list = resultRepository.findAll();
    list.sort(getStudentIndexComparator());
    return list;
  }

  public List<Result> getResultsForSubject(Integer subjectId) {
    List<Result> list = resultRepository.findAll().stream().filter(r -> {
      Integer studentId = r.getId().getStudentSubjectId();
      Optional<StudentSubject> s = studentRepository.findById(studentId);
      if (s.isPresent()) {
        Integer studentSubjectId = s.get().getSubject().getId();
        return subjectId == studentSubjectId ? true : false;
      }
      return false;
    }).collect(Collectors.toList());
    list.sort(getStudentIndexComparator());

    return list;
  }

  public Optional<Result> getById(ResultId id) {
    return resultRepository.findById(id);
  }

  public Optional<Result> getById(Integer studentSubjectId, Integer activityId) {
    ResultId id = new ResultId(activityId, studentSubjectId);
    return resultRepository.findById(id);
  }

  public Result addResult(StudentSubject student, Activity activity, Integer points) {
    if (student.getId() == null || activity.getId() == null) {
      throw new IllegalArgumentException("Both studentSubject and activity must be persisted and have non-null IDs");
    }

    System.out.println("SID: " + student.getId() + " AID: " + activity.getId());

    Result r = new Result();
    r.setStudentSubject(student);
    r.setActivity(activity);
    r.setPoints(points);

    return resultRepository.save(r);
  }

  public Result addResult(Result result) {
    Result r = resultRepository.save(result);
    return r;
  }

  public Result updateResult(Result newResult) {
    ResultId id = newResult.getId();
    Result existing = resultRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Result with ID " + id + " not found"));

    existing.setPoints(newResult.getPoints());

    return resultRepository.save(existing);
  }

  public Result removeResult(ResultId id) {
    Result existing = resultRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Result with ID " + id + " not found."));

    resultRepository.deleteById(id);
    return existing;
  }

  private Comparator<Result> getStudentIndexComparator() {
    return (r1, r2) -> {
      Integer id1 = r1.getId().getStudentSubjectId();
      Integer id2 = r2.getId().getStudentSubjectId();

      Optional<StudentSubject> s1 = studentRepository.findById(id1);
      Optional<StudentSubject> s2 = studentRepository.findById(id2);

      if (s1.isPresent() && s2.isPresent()) {
        StudentSubject st1 = s1.get();
        StudentSubject st2 = s2.get();
        return st1.getIndex().compareToIgnoreCase(st2.getIndex());
      } else if (s1.isPresent()) {
        return -1;
      } else if (s2.isPresent()) {
        return 1;
      } else {
        return 0;
      }
    };
  }

  public byte[] generateActivityResultsPdf(Integer activityId) {
    List<Result> results = resultRepository.findAll().stream()
        .filter(r -> r.getActivity().getId().equals(activityId))
        .sorted(getStudentIndexComparator())
        .collect(Collectors.toList());

    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    PdfWriter writer = new PdfWriter(byteArrayOutputStream);
    PdfDocument pdf = new PdfDocument(writer);
    Document document = new Document(pdf);

    Activity act = activityRepository.findById(activityId).get();
    String subjectName = act.getSubject().getName();
    String activityName = act.getName();

    document.add(new Paragraph(subjectName).setBold().setFontSize(16).setTextAlignment(TextAlignment.CENTER));
    document.add(new Paragraph(activityName).setFontSize(14).setTextAlignment(TextAlignment.CENTER));

    Table table = new Table(UnitValue.createPercentArray(new float[] { 3, 4, 2 }));
    table.setWidth(UnitValue.createPercentValue(100));
    table.addHeaderCell("Indeks");
    table.addHeaderCell("Ime i prezime");
    table.addHeaderCell("Bodovi");

    for (Result result : results) {
      StudentSubject ss = result.getStudentSubject();
      String index = ss.getIndex();
      String name = ss.getFirstName() + " " + ss.getLastName();
      String points = result.getPoints().toString();

      table.addCell(index);
      table.addCell(name);
      table.addCell(points);
    }

    document.add(table);
    document.close();

    return byteArrayOutputStream.toByteArray();
  }

  public byte[] generateActivityResultsCsv(Integer activityId) {
    List<Result> results = resultRepository.findAll().stream()
            .filter(r -> r.getActivity().getId().equals(activityId))
            .sorted(getStudentIndexComparator())
            .collect(Collectors.toList());

    StringBuilder builder = new StringBuilder();
    builder.append("Indeks,Ime i prezime,Bodovi\n");

    for (Result result : results) {
      StudentSubject ss = result.getStudentSubject();
      String index = ss.getIndex();
      String name = ss.getFirstName() + " " + ss.getLastName();
      String points = result.getPoints().toString();

      builder.append(index).append(",").append(name).append(",").append(points).append("\n");
    }

    return builder.toString().getBytes();
  }


  // TODO implement service for generating finals results
  public byte[] generateSubjectResultsPdf(Integer subjectId, List<Integer> students) {
    if (students.size() == 0) {
    } else {

    }
    return null;
  }

  public List<Integer> calculateResults(String formula, List<String> studentIndexes, Integer subjectCode) {
    List<Integer> computedResults = new ArrayList<>();
    Set<String> activityNames = extractActivityNames(formula);
    FormulaParser formulaParser = new FormulaParser(formula);

    label: for(String studentIndex : studentIndexes) {
      Optional<StudentSubject> studentOptional = studentRepository.findByIndexAndSubject_Code(studentIndex, subjectCode);
      if (studentOptional.isPresent()) {
        StudentSubject student = studentOptional.get();
        Map<String, Integer> studentPoints = new HashMap<>();

        for(String activityName : activityNames) {
          Optional<Result> result = resultRepository.findByStudentIndexAndSubjectCodeAndActivityShortName(studentIndex, subjectCode, activityName);
          if (result.isPresent()) {
            studentPoints.put(activityName, result.get().getPoints());
          }
          else {
            // nema rezultata za studenta za datu aktivnost -> Upisujemo null za tog studenta i prelazimo na sljedeceg stud.
            computedResults.add(null);
            continue label;
          }
        }

        computedResults.add(formulaParser.evaluate(studentPoints));

      }
      else computedResults.add(null);

    }

    return computedResults;
  }

  private static Set<String> extractActivityNames(String formula) {
    Set<String> activities = new HashSet<>();

    Pattern pattern = Pattern.compile("\\b[A-Za-z][A-Za-z0-9_]*\\b");
    Matcher matcher = pattern.matcher(formula);

    Set<String> keywordsToIgnore = Set.of("true", "false");

    while (matcher.find()) {
      String token = matcher.group();
      if (!keywordsToIgnore.contains(token)) {
        activities.add(token);
      }
    }

    return activities;
  }

}
