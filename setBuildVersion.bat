set /p Build=<buildVersion.txt

echo Previous build number: %Build%

SET /A Build = %Build% + 1

echo New build number: %Build%

SET BuildStamp=%Build% at %time% on %date%
echo %BuildStamp%

echo %Build%> buildVersion.txt
echo export class BuildVersion { public static readonly BUILD_VERSION = "%BuildStamp%"; } > src\Game\BuildVersion.ts
