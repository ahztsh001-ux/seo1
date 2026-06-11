@echo off
chcp 65001 >nul
echo ============================================
echo   SEO Pipeline - Windows 安装包一键构建
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 没有检测到 Node.js
  echo.
  echo 请先安装 Node.js（只需装一次）：
  echo   1. 打开 https://nodejs.org
  echo   2. 下载 "LTS" 版本并安装（一路下一步即可）
  echo   3. 安装完后关闭本窗口，重新双击本脚本
  echo.
  pause
  exit /b 1
)

echo [1/3] 检测到 Node.js，版本：
node -v
echo.

echo [2/3] 正在下载依赖（首次约需 3-10 分钟，请保持联网）...
call npm install
if errorlevel 1 (
  echo [错误] 依赖安装失败，请检查网络后重试
  pause
  exit /b 1
)
echo.

echo [3/3] 正在构建安装包...
call npm run build:app
if errorlevel 1 (
  echo [错误] 构建失败
  pause
  exit /b 1
)
echo.

echo ============================================
echo   构建完成！
echo   安装包在 release 文件夹里，文件名形如：
echo   "SEO Pipeline Setup 2.0.0.exe"
echo   双击它即可安装。
echo ============================================
echo.
explorer release
pause
