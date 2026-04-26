$ErrorActionPreference = 'Stop'

$ftpHost = 'ftp.worldapply.com'
$ftpPort = 21
$ftpUser = 'admin@dispatcher.worldapply.com'
$ftpPass = 'Flash2k1@123'
$remoteBase = '/'
$sourceRoot = (Get-Location).Path

$excludedNames = @('.git', '.sixth', '.vercel', '.ftp_upload_tmp.ps1')

function Is-ExcludedPath {
    param (
        [Parameter(Mandatory = $true)]
        [string]$RelativePath
    )

    $normalized = $RelativePath -replace '\\', '/'
    foreach ($name in $excludedNames) {
        if ($normalized -eq $name) {
            return $true
        }

        if ($normalized.StartsWith($name + '/')) {
            return $true
        }
    }

    return $false
}

function Normalize-FtpSegment {
    param (
        [Parameter(Mandatory = $true)]
        [string]$Segment
    )

    $normalized = $Segment.Normalize([System.Text.NormalizationForm]::FormD)
    $asciiOnly = [regex]::Replace($normalized, '[^\x00-\x7F]', '')
    $safe = [regex]::Replace($asciiOnly, '[^A-Za-z0-9._ -]', '-')
    $safe = [regex]::Replace($safe, '\s+', ' ')
    $safe = $safe.Trim().Trim('-')

    if ([string]::IsNullOrWhiteSpace($safe)) {
        return 'file'
    }

    return $safe
}

function Join-FtpPath {
    param (
        [Parameter(Mandatory = $true)]
        [string]$BasePath,

        [Parameter(Mandatory = $true)]
        [string]$RelativePath
    )

    $base = $BasePath.TrimEnd('/')
    if ([string]::IsNullOrWhiteSpace($base)) {
        $base = '/'
    }

    $relative = $RelativePath -replace '\\', '/'
    $segments = $relative.Split('/', [System.StringSplitOptions]::RemoveEmptyEntries) | ForEach-Object { [uri]::EscapeDataString((Normalize-FtpSegment $_)) }
    $joined = ($segments -join '/')

    if ($base -eq '/') {
        if ([string]::IsNullOrWhiteSpace($joined)) {
            return '/'
        }

        return '/' + $joined
    }

    if ([string]::IsNullOrWhiteSpace($joined)) {
        return $base
    }

    return $base + '/' + $joined
}

function New-FtpRequest {
    param (
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$Method
    )

    $uri = "ftp://$ftpHost`:$ftpPort$Path"
    $request = [System.Net.FtpWebRequest]::Create($uri)
    $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $request.Method = $Method
    $request.UseBinary = $true
    $request.UsePassive = $true
    $request.KeepAlive = $false
    return $request
}

function Ensure-RemoteDirectory {
    param (
        [Parameter(Mandatory = $true)]
        [string]$RemoteDirectory
    )

    $normalized = $RemoteDirectory -replace '\\', '/'
    if ([string]::IsNullOrWhiteSpace($normalized) -or $normalized -eq '/') {
        return
    }

    $segments = $normalized.Trim('/').Split('/', [System.StringSplitOptions]::RemoveEmptyEntries)
    $current = ''

    foreach ($segment in $segments) {
        $safeSegment = [uri]::EscapeDataString((Normalize-FtpSegment $segment))

        if ([string]::IsNullOrWhiteSpace($current)) {
            $current = '/' + $safeSegment
        }
        else {
            $current = $current + '/' + $safeSegment
        }

        try {
            $request = New-FtpRequest -Path $current -Method ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)
            $response = $request.GetResponse()
            $response.Close()
        }
        catch {
        }
    }
}

function Upload-File {
    param (
        [Parameter(Mandatory = $true)]
        [string]$LocalPath,

        [Parameter(Mandatory = $true)]
        [string]$RemotePath
    )

    $bytes = [System.IO.File]::ReadAllBytes($LocalPath)
    $request = New-FtpRequest -Path $RemotePath -Method ([System.Net.WebRequestMethods+Ftp]::UploadFile)
    $request.ContentLength = $bytes.Length

    $stream = $request.GetRequestStream()
    try {
        $stream.Write($bytes, 0, $bytes.Length)
    }
    finally {
        $stream.Close()
    }

    $response = $request.GetResponse()
    $response.Close()
}

$files = Get-ChildItem -LiteralPath $sourceRoot -Recurse -File -Force | Sort-Object FullName
$uploaded = 0
$failedUploads = @()

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($sourceRoot.Length).TrimStart('\', '/')
    if (Is-ExcludedPath -RelativePath $relativePath) {
        continue
    }

    $relativeDir = Split-Path -Path $relativePath -Parent
    if ($relativeDir -and $relativeDir -ne '.') {
        $remoteDir = Join-FtpPath -BasePath $remoteBase -RelativePath $relativeDir
        Ensure-RemoteDirectory -RemoteDirectory $remoteDir
    }

    $remoteFile = Join-FtpPath -BasePath $remoteBase -RelativePath $relativePath
    Write-Host "Uploading $relativePath -> $remoteFile"
    try {
        Upload-File -LocalPath $file.FullName -RemotePath $remoteFile
        $uploaded++
    }
    catch {
        $failedUploads += [pscustomobject]@{
            LocalPath = $relativePath
            RemotePath = $remoteFile
            Error = $_.Exception.Message
        }
        Write-Host "Failed $relativePath -> $remoteFile"
        Write-Host $_.Exception.Message
    }
}

Write-Host "Uploaded $uploaded files."

if ($failedUploads.Count -gt 0) {
    Write-Host "Failed uploads: $($failedUploads.Count)"
    $failedUploads | ForEach-Object {
        Write-Host "$($_.LocalPath) -> $($_.RemotePath) :: $($_.Error)"
    }
}
