@echo off
node tests\test-quality.js || exit /b 1
node tests\test-feature-gates.js || exit /b 1
node tests\runtime-smoke.js || exit /b 1
echo.
echo All F1 Hub quality checks passed.
pause
