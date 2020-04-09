
set /p Build=<buildVersion.txt
SET /A Build = %Build% + 1

echo "hello" %Build%

echo %Build% > buildVersion.txt
echo export class BuildVersion { public static readonly BUILD_VERSION = %Build%; } > src\Game\BuildVersion.ts

react-scripts start
