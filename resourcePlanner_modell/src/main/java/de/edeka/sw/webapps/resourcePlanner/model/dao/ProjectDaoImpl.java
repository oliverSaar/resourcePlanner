package de.edeka.sw.webapps.resourcePlanner.model.dao;

import de.edeka.sw.webapps.resourcePlanner.model.backend.Project;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ProjectDaoImpl implements ProjectDAO {

    private List<Project> projects = new ArrayList<>();

    @Override
    public void addProject(Project project) {
        projects.add(project);
    }

    @Override
    public void deleteProject(String id) {
        projects.removeIf(project -> Objects.equals(project.getId(), id));
    }

    @Override
    public void updateProject(Project project) {
        int index = projects.indexOf(project);
        if (index != -1) {
            projects.set(index, project);
        }
    }

    @Override
    public Project getProjectByID(String id) {

        for (Project project : projects) {
            if (Objects.equals(project.getId(), id)) {
                return project;
            }
        }
        return null;
    }

    public List<Project> getAllProjects() {
        return projects;
    }


}
