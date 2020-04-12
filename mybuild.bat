echo Copying build .gitignore to .gitignore
copy .gitignoreBuild .gitignore

echo Setting build version number ...

call setBuildVersion.bat

echo Creating a build...

call npm run build

echo Committing the build ...

call git add .
call git commit -m "Build and deploy to Azure"
call git push

echo Finished. The build should begin shortly in Azure and be ready in a few minutes.


