@echo off
REM Build script for YouTube Playback Manager extension
REM Creates zip files for both Chrome and Firefox

echo Building YouTube Playback Manager extension...

REM Create build directory if it doesn't exist
if not exist build mkdir build

REM Chrome version
echo Building Chrome extension...
powershell -Command "Compress-Archive -Path manifest.json, background.js, content.js, popup.html, popup.js, popup.css, icons\*, README.md -DestinationPath build\youtube-playback-manager-chrome.zip -Force"

REM Firefox version
echo Building Firefox extension...
copy manifest_firefox.json manifest.json
echo Creating icons directory for Firefox...
mkdir build\temp_firefox_build 2>nul
mkdir build\temp_firefox_build\icons 2>nul
copy icons\*.png build\temp_firefox_build\icons\
copy manifest.json build\temp_firefox_build\
copy firefox_adapter.js build\temp_firefox_build\
copy background.js build\temp_firefox_build\
copy content.js build\temp_firefox_build\
copy popup.html build\temp_firefox_build\
copy popup.js build\temp_firefox_build\
copy popup.css build\temp_firefox_build\
copy README.md build\temp_firefox_build\
echo Creating Firefox extension...
cd build\temp_firefox_build
powershell -Command "$files = Get-ChildItem -Recurse -File | Select-Object -ExpandProperty FullName; $zipFile = '..\\youtube-playback-manager-firefox.zip'; if (Test-Path $zipFile) { Remove-Item $zipFile }; Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::Open($zipFile, 'Create'); foreach ($file in $files) { $relativePath = $file.Substring($PWD.Path.Length + 1).Replace('\', '/'); [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file, $relativePath) }; $zip.Dispose()"
cd ..\..
del manifest.json
echo Cleaning up temporary files...
rmdir /s /q build\temp_firefox_build

echo Build complete!
echo Chrome extension: build\youtube-playback-manager-chrome.zip
echo Firefox extension: build\youtube-playback-manager-firefox.zip
echo.
echo To install in Chrome:
echo 1. Go to chrome://extensions/
echo 2. Enable Developer Mode
echo 3. Drag and drop the zip file into the browser window
echo.
echo To install in Firefox:
echo 1. Go to about:debugging
echo 2. Click 'This Firefox'
echo 3. Click 'Load Temporary Add-on...'
echo 4. Select the zip file

pause
