@echo off
rem Q-bot-afk installer by quangei
rem https://github.com/quangei/Q-bot-afk
setlocal

cd %~dp0
set ver=1.0.0
set link=https://github.com/quangei/Q-bot-afk
title Q-bot-afk starting %ver%

:Start
echo Starting Q-bot-afk...
call node bot.js
if not "%ERRORLEVEL%" == "0" goto errInstall

:errInstall
echo There was a problem installing Q-bot-afk.
echo ERRORLEVEL: %ERRORLEVEL%
echo.
echo Contact: %link%
pause
goto stop