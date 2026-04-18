@demotestcase
Feature: QA Playground using Playwright

  Scenario: Validate basic form submission
    Given user navigates to "RBG" application
    When user enters "RBG" name "Your Name"
    And user enters "RBG" email "test@env.com"
    And user enters "RBG" password "test123"
    And user enters "RBG" phone "1234567890"
    And user enters "RBG" text "Demo Test Case"
    And user clicks "RBG" submit button
    Then user should see "RBG" message "Submitted"
