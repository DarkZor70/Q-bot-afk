@echo off
rem Q-bot-afk installer by quangei
rem https://github.com/quangei/Q-bot-afk
setlocal

node -v 2> Nul
if not "%ERRORLEVEL%" == "0" goto errNode

cd %~dp0
set ver=1.0.0
set link=https://github.com/quangei/Q-bot-afk
title Q-bot-afk installer %ver%
echo.
echo Q-bot-afk installer by quangei
echo Version: %ver%
echo Link: %link%
echo.
echo This installer installs Q-bot-afk to the %~dp0.
echo Enter Y if you want to install, otherwise N.
set /p yn=[Y/N] : 
if /i "%yn%" == "Y" goto install
goto stop

:install
echo Installing Q-bot-afk...
call npm install mineflayer
call npm install mineflayer-armor-manager
call npm install mineflayer-auto-eat
call npm install mineflayer-pathfinder
call npm install mineflayer-web-inventory
call npm install readline
if not "%ERRORLEVEL%" == "0" goto errInstall

:finish
echo.
echo Q-bot-afk installer by quangei
echo Version: %ver%
echo.
echo Installation finished
echo Run Start.bat to run Q-bot-afk.
echo.
echo Contact: %link%
echo.
pause
goto stop

:errNode
echo No Node.js installation detected. 
echo Please install or repair Node.js.
echo.
echo Contact: %link%
pause
goto stop

:errInstall
echo There was a problem installing Q-bot-afk.
echo ERRORLEVEL: %ERRORLEVEL%
echo.
echo Contact: %link%
pause
goto stop

:stop
endlocal
exit