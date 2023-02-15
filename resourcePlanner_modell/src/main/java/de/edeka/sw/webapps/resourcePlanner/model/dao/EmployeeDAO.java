package de.edeka.sw.webapps.resourcePlanner.model.dao;

import de.edeka.sw.webapps.resourcePlanner.model.backend.EmployeeDO;

import java.util.List;

public interface EmployeeDAO {

    public void addEmployee(EmployeeDO employee);

    public void updateEmployee(EmployeeDO employee);

    public void deleteEmployee(String id);

    public EmployeeDO getEmployeeByID(String id);

    public List<EmployeeDO> getAllEmployees();

}
