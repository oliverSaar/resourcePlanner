package de.edeka.sw.webapps.resourcePlanner.model.dao;

import de.edeka.sw.webapps.resourcePlanner.model.backend.Project;

import java.util.List;

public interface ProjectDAO {

    public void addProject(Project project);

    public void updateProject(Project project);

    public void deleteProject(String id);

    public Project getProjectByID(String id);

    public List<Project> getAllProjects();
}
