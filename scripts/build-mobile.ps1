$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting cross-platform mobile build process..." -ForegroundColor Cyan

# Check prerequisites
$prerequisites = @{
    "node" = "Node.js"
    "npm" = "NPM"
    "ionic" = "Ionic CLI"
    "xcodebuild" = "Xcode"
    "gradle" = "Gradle"
}

foreach ($tool in $prerequisites.Keys) {
    try {
        $null = Get-Command $tool -ErrorAction Stop
        Write-Host "✅ Found $($prerequisites[$tool])" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Missing $($prerequisites[$tool]). Please install it first." -ForegroundColor Red
        exit 1
    }
}

# Environment setup
$env:CAPACITOR_ANDROID_STUDIO_PATH = "C:\Program Files\Android\Android Studio\bin\studio64.exe"
$env:CAPACITOR_XCODE_PATH = "/Applications/Xcode.app"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm ci

# Build web assets
Write-Host "🏗️ Building web assets..." -ForegroundColor Cyan
npm run build

# Sync capacitor
Write-Host "🔄 Syncing Capacitor..." -ForegroundColor Cyan
npx cap sync

# Update native dependencies
Write-Host "📱 Updating native dependencies..." -ForegroundColor Cyan

# Android Build
Write-Host "🤖 Building Android..." -ForegroundColor Cyan
try {
    Set-Location android
    ./gradlew assembleDebug
    if ($LASTEXITCODE -ne 0) { throw "Android build failed" }
    Write-Host "✅ Android build completed successfully" -ForegroundColor Green
    Set-Location ..
}
catch {
    Write-Host "❌ Android build failed: $_" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# iOS Build (only on macOS)
if ($IsMacOS) {
    Write-Host "🍎 Building iOS..." -ForegroundColor Cyan
    try {
        Set-Location ios/App
        xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug build
        if ($LASTEXITCODE -ne 0) { throw "iOS build failed" }
        Write-Host "✅ iOS build completed successfully" -ForegroundColor Green
        Set-Location ../..
    }
    catch {
        Write-Host "❌ iOS build failed: $_" -ForegroundColor Red
        Set-Location ../..
        exit 1
    }
}

# Create output directory
$outputDir = "dist-mobile"
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Copy APK
if (Test-Path "android/app/build/outputs/apk/debug/app-debug.apk") {
    Copy-Item "android/app/build/outputs/apk/debug/app-debug.apk" "$outputDir/TenderBridge-debug.apk"
}

# Copy iOS IPA (if on macOS)
if ($IsMacOS -and (Test-Path "ios/App/build/Debug-iphoneos/App.app")) {
    # Create IPA
    Set-Location "ios/App/build/Debug-iphoneos"
    xcrun -sdk iphoneos PackageApplication "App.app" -o "$outputDir/TenderBridge-debug.ipa"
    Set-Location ../../../..
}

Write-Host "📱 Mobile builds completed!" -ForegroundColor Green
Write-Host "📂 Output files can be found in the '$outputDir' directory" -ForegroundColor Cyan

# Generate QR codes for easy installation (requires qrcode npm package)
npm install -g qrcode-terminal

if (Test-Path "$outputDir/TenderBridge-debug.apk") {
    Write-Host "`n📱 Android Installation QR Code:" -ForegroundColor Yellow
    qrcode-terminal "https://install.tenderbridge.com/android" --small
}

if (Test-Path "$outputDir/TenderBridge-debug.ipa") {
    Write-Host "`n🍎 iOS Installation QR Code:" -ForegroundColor Yellow
    qrcode-terminal "https://install.tenderbridge.com/ios" --small
}

Write-Host "`nDone! 🎉" -ForegroundColor Green
