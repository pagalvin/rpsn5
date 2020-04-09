set /p Build=<buildVersion.txt

echo Previous build number: %Build%

SET /A Build = %Build% + 1

echo New build number: %Build%

echo %Build% > buildVersion.txt
echo export class BuildVersion { public static readonly BUILD_VERSION = %Build%; } > src\Game\BuildVersion.ts
