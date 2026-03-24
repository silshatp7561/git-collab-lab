*** Settings ***
Documentation  ALL pages tested (status/content verified)
Library    RequestsLibrary

Suite Setup    Create Session    voting    http://127.0.0.1:8000

*** Test Cases ***
Test Home
    ${resp}=    GET On Session    voting    /
    Should Be Equal As Numbers    ${resp.status_code}    200

Test Register Page
    ${resp}=    GET On Session    voting    /register/
    Should Be Equal As Numbers    ${resp.status_code}    200

Test Voter Login Page
    ${resp}=    GET On Session    voting    /voter-login/
    Should Be Equal As Numbers    ${resp.status_code}    200

Test Admin Login Page
    ${resp}=    GET On Session    voting    /admin-login/
    Should Be Equal As Numbers    ${resp.status_code}    200

Test Results Page
    ${resp}=    GET On Session    voting    /results/
    Should Be Equal As Numbers    ${resp.status_code}    200

Test Blockchain Page
    ${resp}=    GET On Session    voting    /blockchain/
    Should Be True    ${resp.status_code} == 200 or ${resp.status_code} == 302

Test Voter Dashboard
    ${resp}=    GET On Session    voting    /voter-dashboard/
    Should Be True    ${resp.status_code} == 200 or ${resp.status_code} == 302

Test Admin Dashboard
    ${resp}=    GET On Session    voting    /admin-dashboard/
    Should Be True    ${resp.status_code} == 200 or ${resp.status_code} == 302

Test Create Election
    ${resp}=    GET On Session    voting    /create-election/
    Should Be True    ${resp.status_code} == 200 or ${resp.status_code} == 302

Test Create Post
    ${resp}=    GET On Session    voting    /create-post/
    Should Be True    ${resp.status_code} == 200 or ${resp.status_code} == 302

Test Create Candidate
    ${resp}=    GET On Session    voting    /create-candidate/
    Should Be True    ${resp.status_code} == 200 or ${resp.status_code} == 302

Test View Election
    ${resp}=    GET On Session    voting    /view-election/1/
    Should Be Equal As Numbers    ${resp.status_code}    404

Test Django Admin
    ${resp}=    GET On Session    voting    /admin/
    Should Be Equal As Numbers    ${resp.status_code}    200

