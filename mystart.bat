
echo Copying dev gitignore to .gitignore
copy .gitignoreDev .gitignore

echo Setting build version number ...

call setBuildVersion.bat

echo running react-scripts

npm run start
