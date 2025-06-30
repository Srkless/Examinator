package net.etfbl.examinator.services;

import net.etfbl.examinator.models.Activity;
import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.repositories.ActivityRepository;
import net.etfbl.examinator.repositories.SubjectRepository;
import net.etfbl.examinator.requests.AddActivityRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ActivityService {
    @Autowired private ActivityRepository activityRepository;

    @Autowired private SubjectRepository subjectRepository;

    public Optional<Activity> addActivity(AddActivityRequest request) {
        String name = request.getName();
        String shortName = request.getShortName();
        Integer maxPoints = request.getMaxPoints();
        Integer schoolYear = request.getSchoolYear();
        Integer subjectCode = request.getSubjectCode();

        if (name == null
                || shortName == null
                || maxPoints == null
                || schoolYear == null
                || subjectCode == null) {
            throw new IllegalArgumentException("All fields must be provided");
        }

        Subject subject =
                subjectRepository
                        .findByCode(subjectCode)
                        .orElseThrow(() -> new IllegalArgumentException("Subject not found"));

        if (activityRepository.existsByNameAndSubjectIdAndSchoolYear(
                name, subject.getId(), schoolYear)) {
            throw new IllegalArgumentException(
                    "Activity with this name already exists for the given subject and school year");
        }

        if (activityRepository.existsByShortNameAndSubjectIdAndSchoolYear(
                shortName, subject.getId(), schoolYear)) {
            throw new IllegalArgumentException(
                    "Activity with this short name already exists for the given subject and school"
                        + " year");
        }

        Activity activity = new Activity();
        activity.setName(name);
        activity.setShortName(shortName);
        activity.setMaxPoints(maxPoints);
        activity.setSchoolYear(schoolYear);
        activity.setSubject(subject);

        activityRepository.save(activity);
        return Optional.of(activity);
    }

    public Optional<Activity> getById(Integer id) {
        return activityRepository.findById(id);
    }

    public Optional<Activity> getByShortName(String shortName) {
        return activityRepository.findByShortName(shortName);
    }

    public Activity update(Activity updated) {
        Integer id = updated.getId();
        Integer subjectID = updated.getSubject().getId();

        Optional<Activity> optionalActivity = activityRepository.findById(id);
        if (optionalActivity.isEmpty()) {
            throw new RuntimeException("Activity not found");
        }

        Activity existingActivity = optionalActivity.get();

        Optional<Subject> optionalSubject = subjectRepository.findById(subjectID);

        if (optionalSubject.isEmpty()) {
            throw new IllegalArgumentException("Subject not found");
        }

        Subject existingSubject = optionalSubject.get();
        boolean nameConflict =
                activityRepository.existsByNameAndSubjectIdAndSchoolYearAndIdNot(
                        updated.getName(), subjectID, updated.getSchoolYear(), id);

        if (nameConflict) {
            throw new IllegalArgumentException(
                    "Activity with the same name already exists for this subject");
        }

        existingActivity.setName(updated.getName());
        existingActivity.setShortName(updated.getShortName());
        existingActivity.setMaxPoints(updated.getMaxPoints());

        return activityRepository.save(existingActivity);
    }

    public void delete(Integer id) {
        if (!activityRepository.existsById(id)) {
            throw new RuntimeException("Activity with ID " + id + " does not exist");
        }

        activityRepository.deleteById(id);
    }

    public List<Integer> getAllSubjectStudentYears(Integer subjectCode) {

        Subject subj =
                subjectRepository
                        .findByCode(subjectCode)
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Subject with ID " + subjectCode + " not found"));

        return activityRepository.findDistinctSchoolYearsBySubjectId(subj.getId());
    }

    public List<Activity> getActivitiesByYearAndSubject(Integer subjectCode, Integer schoolYear) {

        Subject subj =
                subjectRepository
                        .findByCode(subjectCode)
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Subject with ID " + subjectCode + " not found"));

        return activityRepository.findActivitiesByYearAndSubject(subj.getId(), schoolYear);
    }
}
