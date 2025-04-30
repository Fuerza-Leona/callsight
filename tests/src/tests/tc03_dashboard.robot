*** Settings ***
Documentation    Prueba de Login
Library         Browser
Resource    keywords.resource
*** Test Cases *** 

CP05 Dashboard Successful
  Reach Login
  Login User    cavazosvregina@gmail.com   123456
  Wait For Elements State    "Logout"    visible    timeout=10s
  Wait For Elements State    "Mi perfil"    visible    timeout=10s
  Click           "Análisis de llamadas"
  Wait For Elements State    "Dashboard"    visible    timeout=10s
  Close Browser


*** Keywords ***

