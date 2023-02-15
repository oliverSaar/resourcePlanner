package de.edeka.sw.webapps.resourcePlanner.model.dao;

import de.edeka.sw.webapps.resourcePlanner.model.backend.EmployeeDO;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class EmployeeDaoImpl implements EmployeeDAO {


    private List<EmployeeDO> employees = new ArrayList<>();

    @Override
    public void addEmployee(EmployeeDO employee) {
        employees.add(employee);
    }

    @Override
    public void updateEmployee(EmployeeDO employee) {
        int index = employees.indexOf(employee);
        if (index != -1) {
            employees.set(index, employee);
        }
    }

    @Override
    public void deleteEmployee(String id) {
        employees.removeIf(employee -> Objects.equals(employee.getEmployeeId(), id));
    }

    @Override
    public EmployeeDO getEmployeeByID(String id) {
        for (EmployeeDO employee : employees) {
            if (Objects.equals(employee.getEmployeeId(), id)) {
                return employee;
            }
        }
        return null;
    }

    @Override
    public List<EmployeeDO> getAllEmployees() {
        return employees;
    }
}

