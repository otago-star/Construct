<#
Generate projects/data/projects.json by scanning images/projects/* for image files.
Run from repository root (PowerShell):
  .\scripts\generate-projects.ps1
#>
try{
	$repoRoot = Get-Location
	$imagesDir = Join-Path $repoRoot 'images\projects'
	$outDir = Join-Path $repoRoot 'projects\data'
	$outFile = Join-Path $outDir 'projects.json'

	if(-not (Test-Path $imagesDir)){
		Write-Error "Images directory not found: $imagesDir"
		exit 1
	}

	if(-not (Test-Path $outDir)){
		New-Item -ItemType Directory -Path $outDir -Force | Out-Null
	}

	$projects = @{}
	Get-ChildItem -Path $imagesDir -Directory | ForEach-Object {
		$projName = $_.Name
		$files = Get-ChildItem -Path $_.FullName -File | Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp)$' } | Sort-Object Name | ForEach-Object { $_.Name }
		if($files.Count -gt 0){
			$projects[$projName] = $files
		}
	}

	$json = $projects | ConvertTo-Json -Depth 5
	Set-Content -Path $outFile -Value $json -Encoding UTF8
	Write-Host "Wrote manifest: $outFile"
} catch {
	Write-Error $_.Exception.Message
	exit 1
}
