*** Settings ***
Documentation  Full E2E tests for Voting App (Django + Blockchain)
Library    SeleniumLibrary
Library    String
Library    Collections

Suite Setup    Setup Browser
Suite Teardown    Teardown Browser

*** Variables ***
${URL}    http://127.0.0.1:8000
${BROWSER}    chrome
${ADMIN_EMAIL}    admin@example.com
${ADMIN_PASSWORD}    admin_password
${VOTER_EMAIL}    robot.test@example.com
${VOTER_PASSWORD}    RobotTest123!

*** Keywords ***
Setup Browser
    Create Webdriver    Chrome
    Set Selenium Timeout    20s
    Set Window Size    1400    1000

Teardown Browser
    Close All Browsers

Go To Page
    [Arguments]    ${page}
    Go To    ${URL}${page}
    Wait Until Page Contains Element    title    30s

*** Test Cases ***
Test Home Page Loads
    Go To Page    /
    Page Should Contain    BlockVote
    Page Should Contain    Online Voting System
    Page Should Contain    Register

Test Voter Registration Page
    Go To Page    /register/
    Page Should Contain    Voter Registration
    Element Should Be Visible    id=email
    Element Should Be Visible    input[name="password"]
    Page Should Contain Button    Register and Generate Wallet Address

Test Voter Login Page
    Go To Page    /voter-login/
    Page Should Contain    Login
    Element Should Be Visible    input[name="email"]
    Element Should Be Visible    input[name="wallet"]
    Page Should Contain Button    Login

Test Admin Login Page
    Go To Page    /admin-login/
    Page Should Contain    Admin Login
    Element Should Be Visible    input[name="email"]
    Page Should Contain Button    Login

Test Results Page
    Go To Page    /results/
    Page Should Contain    Results

Test Blockchain Page
    Go To Page    /blockchain/
    Page Should Contain    Total Transactions
