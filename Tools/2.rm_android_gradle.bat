@echo off
REM Xóa thư mục .android
rmdir /S /Q "%USERPROFILE%\.android"

REM Xóa thư mục .gradle
rmdir /S /Q "%USERPROFILE%\.gradle"

echo Da xoa cac thu muc .android va .gradle
pause
exit