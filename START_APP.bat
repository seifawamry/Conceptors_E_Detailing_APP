@echo off
title The Conceptors Animal Health E-Detailing PWA
color 0A
cls
echo ======================================================================
echo   THE CONCEPTORS FOR ANIMAL HEALTH - E-DETAILING PWA
echo ======================================================================
echo.
echo   Starting local production server on http://localhost:3000 ...
echo   Your default web browser will open automatically in a moment.
echo.
echo   Keep this window open while using the application.
echo ======================================================================
echo.

node serve.cjs

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo [ERROR] Could not start server.
  pause
)
