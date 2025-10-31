@echo off
setlocal enabledelayedexpansion

echo 正在清空MySQL数据库 knene_db...
echo.

mysql -h localhost -P 3306 -u root -p592714407 knene_db -e "SET FOREIGN_KEY_CHECKS = 0;"

mysql -h localhost -P 3306 -u root -p592714407 knene_db -e "SHOW TABLES;" > tables.txt

for /f "skip=1 tokens=1" %%i in (tables.txt) do (
    echo 删除表: %%i
    mysql -h localhost -P 3306 -u root -p592714407 knene_db -e "DROP TABLE IF EXISTS `%%i`;" 2>nul
)

del tables.txt

mysql -h localhost -P 3306 -u root -p592714407 knene_db -e "SET FOREIGN_KEY_CHECKS = 1;"

echo.
echo 数据库清空完成！

mysql -h localhost -P 3306 -u root -p592714407 knene_db -e "SHOW TABLES;" 2>nul
if %errorlevel% neq 0 (
    echo 所有表已成功删除！
) else (
    echo 仍有表存在，请检查
)

pause