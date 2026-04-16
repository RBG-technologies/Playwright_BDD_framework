@basicControls
Feature: HYR basicControls Module

  Scenario: User registers with valid details
    Given user is on the registration page
    When user enters first name "Sai"
    And user enters last name "Teja"
    And user selects gender "Male"
    And user selects languages "English" and "Hindi"
    And user enters email "saiteja@test.com"
    And user enters password "Test@123"
    And user clicks on Register button
    Then user should be successfully registered
  # Fresh template only.
  # Add your own scenarios in this folder.
