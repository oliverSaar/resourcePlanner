package de.edeka.sw.services.resourcePlanner.backend;

import de.edeka.sw.webapps.resourcePlanner.model.backend.EmployeeDO;

import java.util.List;

public interface EmployeeDAO {

    /**
     * Aktuelle Stempel aus der DB holen und zurückgeben
     *
     * @return Stempelliste
     */
    List<EmployeeDO> getStempel();

    /**
     * Einen neuen Stempel einfügen
     *
     * @param stempel der entsprechende Stempel
     */
    void insert(EmployeeDO stempel);

    /**
     * Stempel wird je nach Wahl aktiviert bzw. deaktiviert
     *
     * @param stempel Stempel, welcher aktiviert / deaktiviert wird
     */
    void update(EmployeeDO stempel);
}
