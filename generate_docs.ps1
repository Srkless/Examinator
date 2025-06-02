mvnw javadoc:javadoc

if ($LASTEXITCODE -eq 0) {
    Start-Process target\site\apidocs\index.html
} else {
    Write-Error "JavaDoc generation failed."
}
