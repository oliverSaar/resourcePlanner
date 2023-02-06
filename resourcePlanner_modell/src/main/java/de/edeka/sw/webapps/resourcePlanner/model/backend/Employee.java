package de.edeka.sw.webapps.resourcePlanner.model.backend;

import de.edeka.sw.webapps.resourcePlanner.model.enums.Employment;

public class Employee {

    private String employeeId;
    private String firstName;
    private String lastName;
    private String team;
    private String abteilung;
    private String bereich;
    private Employment employment;
    private int kostenstelle;

    public String getEmployeeId() {
        return employeeId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String getAbteilung() {
        return abteilung;
    }

    public void setAbteilung(String abteilung) {
        this.abteilung = abteilung;
    }

    public String getBereich() {
        return bereich;
    }

    public void setBereich(String bereich) {
        this.bereich = bereich;
    }

    public Employment getEmployment() {
        return employment;
    }

    public void setEmployment(Employment employment) {
        this.employment = employment;
    }

    public int getKostenstelle() {
        return kostenstelle;
    }

    public void setKostenstelle(int kostenstelle) {
        this.kostenstelle = kostenstelle;
    }
}
