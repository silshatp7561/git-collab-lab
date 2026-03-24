*** Settings ***
Documentation  HTTP API tests for full Voting App project (all endpoints 200/302)
Library    RequestsLibrary
Library    Collections

Suite Setup    Create Session  voting  http://127.0.0.1:8000

*** Test Cases ***
Test Home Page
    ${resp}=    GET On Session  voting  /
    Should Be Equal As Numbers  ${resp.status_code}  200
    Should Contain  ${resp.text}  BlockVote

Test Register Page
    ${resp}=    GET On Session  voting  /register/
    Should Be Equal As Numbers  ${resp.status_code}  200
    Should Contain  ${resp.text}  Voter Registration

Test Voter Login Page
    ${resp}=    GET On Session  voting  /voter-login/
    Should Be Equal As Numbers  ${resp.status_code}  200
    Should Contain  ${resp.text}  Login

Test Admin Login Page
    ${resp}=    GET On Session  voting  /admin-login/
    Should Be Equal As Numbers  ${resp.status_code}  200
    Should Contain  ${resp.text}  Admin Login

Test Results Page
    ${resp}=    GET On Session  voting  /results/
    Should Be Equal As Numbers  ${resp.status_code}  200
    Should Contain  ${resp.text}  Results

Test Blockchain Page (redirects to admin)
    ${resp}=    GET On Session  voting  /blockchain/
    Should Be True  '${resp.status_code}' in ['302', '200']
    Log  ${resp.headers}

Test Voter Registration API
    No Operation

Test Voter Dashboard (requires session - basic check)
    ${resp}=    GET On Session  voting  /voter-dashboard/
    Should Be True  '${resp.status_code}' == '302' or '${resp.status_code}' == '200'
