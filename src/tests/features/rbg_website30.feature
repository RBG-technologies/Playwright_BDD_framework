@rbg30
Feature: QA Automation Practice Playground

  Background:
    Given user navigates to the application
  # SECTION 1

  Scenario: Validate basic form submission
    When user enters all basic details
    And clicks submit button
    Then user should see "Submitted"
  # SECTION 2

  Scenario: Validate button interactions
    When user performs normal click
    And user performs double click
    And user performs right click
    Then respective messages should be displayed
  # SECTION 3

  Scenario: Validate checkbox and radio buttons
    When user selects "Select All"
    And user selects radio option A
    Then all checkboxes should be selected
  # SECTION 4

  Scenario: Validate dropdowns
    When user selects "Option 1" from dropdown
    And user selects multiple values
    And user selects custom dropdown option
    Then dropdown selection should be successful
  # SECTION 5

  Scenario: Validate locator strategies
    When user identifies element using different locators
    Then element should be clickable
  # SECTION 6

  Scenario: Validate dynamic content
    When user clicks appear after delay
    And user clicks change text
    And user increments counter
    Then dynamic changes should be reflected
  # SECTION 7

  Scenario: Validate waits and synchronization
    When user triggers spinner
    And waits for completion
    Then "Data Loaded" should be displayed
  # SECTION 8

  Scenario: Validate table operations
    When user searches for "Alice"
    And user sorts table
    Then filtered results should be displayed
  # SECTION 9

  Scenario: Validate alerts handling
    When user handles simple alert
    And user handles confirmation alert
    And user handles prompt alert
    Then alert actions should be successful
  # SECTION 10

  Scenario: Validate modal popup
    When user opens modal
    And user closes modal
    Then modal should not be visible
  # SECTION 11

  Scenario: Validate iframe interaction
    When user switches to iframe
    And submits form inside iframe
    Then iframe success message should be displayed
  # SECTION 12

  Scenario: Validate shadow DOM elements
    When user interacts with shadow DOM input
    And clicks shadow button
    Then shadow button text should change
  # SECTION 13

  Scenario: Validate drag and drop
    When user drags element to drop zone
    Then drop success message should be displayed
  # SECTION 14

  Scenario: Validate hover elements
    When user hovers over menu
    And clicks submenu
    Then submenu message should be displayed
  # SECTION 15

  Scenario: Validate tooltip
    When user hovers on tooltip
    Then tooltip text should be visible
  # SECTION 16

  Scenario: Validate file upload
    When user uploads a file
    Then uploaded file name should be displayed
  # SECTION 17

  Scenario: Validate file download
    When user clicks download button
    Then file should be downloaded
  # SECTION 18

  Scenario: Validate hidden elements
    When user reveals hidden button
    Then hidden button should be visible
  # SECTION 19

  Scenario: Validate scroll functionality
    When user scrolls to bottom
    Then user should be able to click target button
  # SECTION 20

  Scenario: Validate multiple windows
    When user opens new tab
    Then new tab should be opened
  # SECTION 21

  Scenario: Validate authentication
    When user logs in with valid credentials
    Then dashboard should be displayed
  # SECTION 22

  Scenario: Validate stale element handling
    When user clicks stale element button
    Then new element should be present
  # SECTION 23

  Scenario: Validate dynamic list
    When user adds item
    And user removes item
    Then list should be updated
  # SECTION 24

  Scenario: Validate API delay simulation
    When user triggers API call
    Then API success message should be displayed
  # SECTION 25

  Scenario: Validate flaky element handling
    When user clicks flaky button multiple times
    Then result should be either success or failure
  # SECTION 26

  Scenario: Validate keyboard actions
    When user presses keyboard keys
    Then key pressed message should be displayed
  # SECTION 27

  Scenario: Validate slider functionality
    When user moves slider
    Then slider value should change
  # SECTION 28

  Scenario: Validate date picker
    When user selects a date
    Then selected date should be displayed
  # SECTION 29

  Scenario: Validate resizable element
    When user resizes the element
    Then element size should change
  # SECTION 30

  Scenario: Validate complex DOM structure
    When user clicks deeply nested button
    Then action should be successful
