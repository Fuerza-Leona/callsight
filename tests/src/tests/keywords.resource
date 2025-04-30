*** Settings ***
Documentation     This is a resource file, that can contain variables and keywords.
...               Keywords defined here can be used where this Keywords.resource in loaded.


*** Keywords ***
Reach Login
    New Browser    chromium    headless=False
    New Context    viewport={'width': 1280, 'height': 720}
    New Page     https://callsight.vercel.app/login
    #New Page     http://localhost:3000/login
    Wait For Elements State    css=input#email    visible    timeout=10s

Login User
    [Arguments]    ${login}    ${password}
    Fill Text        css=input#email   ${login}   
    Fill Text        css=input#password   ${password}
    Click           "Log In"