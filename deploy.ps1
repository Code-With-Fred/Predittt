# deploy.ps1 — Run once after `vercel login`
# Usage: .\deploy.ps1
# Prereqs: vercel CLI installed, `vercel login` already completed

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host ">> Linking Vercel project..." -ForegroundColor Cyan
vercel link --yes --cwd $projectRoot --scope code-with-freds-projects

Write-Host ">> Reading .env.local..." -ForegroundColor Cyan
$envFile = Join-Path $projectRoot ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Error ".env.local not found. Fill it in first."
    exit 1
}

# Parse .env.local (skip comments and blank lines)
$envVars = @{}
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Count -eq 2 -and $parts[1].Trim() -ne "") {
            $envVars[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
}

if ($envVars.Count -eq 0) {
    Write-Error "No env vars found in .env.local. Fill in the blank values first."
    exit 1
}

Write-Host ">> Adding $($envVars.Count) environment variables to Vercel (production + preview)..." -ForegroundColor Cyan
foreach ($key in $envVars.Keys) {
    $val = $envVars[$key]
    Write-Host "   $key" -ForegroundColor Gray
    # Add to all three environments
    "production", "preview", "development" | ForEach-Object {
        $env = $_
        $val | vercel env add $key $env --cwd $projectRoot --force 2>$null
    }
}

Write-Host ">> Deploying to production..." -ForegroundColor Cyan
vercel deploy --prod --yes --cwd $projectRoot

Write-Host ""
Write-Host "DONE. Your site is live." -ForegroundColor Green
Write-Host "Remember to set NEXT_PUBLIC_APP_URL in .env.local to your actual Vercel domain, then re-run this script." -ForegroundColor Yellow
