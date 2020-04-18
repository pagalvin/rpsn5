if "%~1"=="" goto MISSING_COMMIT_MESSAGE

echo Copying build .gitignore to .gitignore
copy .gitignoreBuild .gitignore

echo Setting build version number ...

call setBuildVersion.bat

echo Creating a build...

call npm run build

echo Committing the build ...

call git add .
call git commit -m "%~1"
call git push

echo Finished. The build should begin shortly in Azure and be ready in a few minutes.
goto DONE

:MISSING_COMMIT_MESSAGE

ECHO You forgot to pass in a message to use for the commit, re-run this as: mybuild "some commit message"
GOTO DONE

:DONE
echo Exiting