$files = git ls-files --others --exclude-standard
$half = [math]::Floor($files.Length / 2)
$yesterday = (Get-Date).AddDays(-1).ToString("yyyy-MM-ddTHH:mm:sszzz")
$today = (Get-Date).ToString("yyyy-MM-ddTHH:mm:sszzz")

for ($i = 0; $i -lt $files.Length; $i++) {
    $file = $files[$i]
    $date = if ($i -lt $half) { $yesterday } else { $today }
    
    git add $file
    $env:GIT_AUTHOR_DATE = $date
    $env:GIT_COMMITTER_DATE = $date
    
    git commit -m "Add $file"
    
    if ($i -eq 0) {
        git push -u origin main
    } else {
        git push origin main
    }
    
    Write-Host "Pushed $file"
}
