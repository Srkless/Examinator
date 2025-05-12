package net.etfbl.examinator.services;

import net.etfbl.examinator.models.Activity;
import net.etfbl.examinator.models.Subject;
import net.etfbl.examinator.repositories.ActivityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class ActivityService {
    @Autowired private ActivityRepository activityRepository;

    // @Autowired private SubjectRepository subjectRepository;

    public Optional<Activity> addActivity(Map<String, Object> activityData) {
        String name = (String) activityData.get("name");
        String shortName = (String) activityData.get("shortName");
        Integer maxPoints = (Integer) activityData.get("maxPoints");
        Integer schoolYear = (Integer) activityData.get("schoolYear");

        Map<String, Object> subjectData = (Map<String, Object>) activityData.get("subject");

        if (name == null
                || shortName == null
                || maxPoints == null
                || schoolYear == null
                || subjectData == null) {
            throw new IllegalArgumentException("All fields must be provided");
        }

        if (activityRepository.existsByName(name)) {
            throw new IllegalArgumentException("Activity with this name already exists");
        }

        if (activityRepository.existsByShortName(shortName)) {
            throw new IllegalArgumentException("Activity with this short name already exists");
        }

        Subject subject = new Subject();
        subject.setName((String) subjectData.get("name"));
        subject.setCode((Integer) subjectData.get("code"));
        subject.setId((Integer) subjectData.get("id"));

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

    public Activity update(Activity updated) {
        Integer id = updated.getId();

        Optional<Activity> optionalActivity = activityRepository.findById(id);
        if (optionalActivity.isEmpty()) {
            throw new RuntimeException("Activity not found");
        }

        Activity existingActivity = optionalActivity.get();

        if (activityRepository.existsByName(updated.getName())
                && !existingActivity.getName().equals(updated.getName())) {
            throw new RuntimeException("Name already exists");
        }

        if (activityRepository.existsByShortName(updated.getShortName())
                && !existingActivity.getShortName().equals(updated.getShortName())) {
            throw new RuntimeException("ShortName already exists");
        }

        existingActivity.setName(updated.getName());
        existingActivity.setShortName(updated.getShortName());
        existingActivity.setMaxPoints(updated.getMaxPoints());

        return activityRepository.save(existingActivity);
    }
}
