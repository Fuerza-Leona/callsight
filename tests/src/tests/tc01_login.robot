*** Settings ***
Documentation    Prueba de Login
Library         Browser
Resource    keywords.resource
*** Test Cases *** 

CP01 Login Successful
  Reach Login
  Login User    a00836245@tec.mx   pass1234
  Wait For Elements State    "Logout"    visible    timeout=10s
  Close Browser

CP02 Incorrect Password
  Reach Login
  Login User    a00836245@tec.mx   pass
  Click           "Log In"
  Wait For Elements State    "Invalid credentials: Invalid login credentials"    visible    timeout=10s
  Close Browser

