@api
Feature: API Testing Demo
  This feature demonstrates the full-fledged API testing capabilities of the framework.

  Scenario: Get user details
    Given user prepares a GET request to "/posts/1"
    When user sends the API request
    Then the response status code should be 200
    And the response should contain post details

  Scenario: Create a new post
    Given user prepares a POST request to "/posts" with data:
      """
      {
        "title": "foo",
        "body": "bar",
        "userId": 1
      }
      """
    When user sends the API request
    Then the response status code should be 201
    And the response should contain the created post ID
