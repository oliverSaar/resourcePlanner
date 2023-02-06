package de.edeka.sw.webapps.resourcePlanner.model.dao;

import de.edeka.sw.webapps.resourcePlanner.model.backend.Employee;

import java.util.List;

public interface EmployeeDAO {

    public void addEmployee(Employee employee);

    public void updateEmployee(Employee employee);

    public void deleteEmployee(String id);

    public Employee getEmployeeByID(String id);

    public List<Employee> getAllEmployees();

}
