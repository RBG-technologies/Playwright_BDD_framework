@csvdemo
Feature: Demo CSV Feature
  This feature demonstrates data-driven testing using a CSV file for the demo page.

  Scenario: Submit demo form using CSV data with fresh runs
    Given user navigates to "RBG" application
    And user loads demo data from "demoData.csv"
    When user submits the form with loaded demo data
    Then user should see "RBG" message "Submitted"
