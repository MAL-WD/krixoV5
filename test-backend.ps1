# Backend Connectivity Test Script
Write-Host "Testing backend connectivity..." -ForegroundColor Green

$backendUrl = "https://gokrixo.onrender.com"

Write-Host "`n1. Testing basic connectivity to $backendUrl" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $backendUrl -Method GET -TimeoutSec 10
    Write-Host "✓ Backend is reachable" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "  Headers: $($response.Headers.Keys -join ', ')" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Backend is not reachable" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing CreateCommand endpoint" -ForegroundColor Yellow
try {
    $testData = @{
        firstName = "test"
        number = "01234567"
        service = "test service"
        workers = "1"
        start = "test start"
        distination = "test end"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$backendUrl/CreateCommand" -Method POST -Body $testData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✓ CreateCommand endpoint is working" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "  Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ CreateCommand endpoint failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing OPTIONS request (CORS preflight)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/CreateCommand" -Method OPTIONS -TimeoutSec 10
    Write-Host "✓ OPTIONS request successful" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Cyan
    
    # Check for CORS headers
    $corsHeaders = @("Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers")
    foreach ($header in $corsHeaders) {
        if ($response.Headers.ContainsKey($header)) {
            Write-Host "  $header`: $($response.Headers[$header])" -ForegroundColor Green
        } else {
            Write-Host "  $header`: Missing" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "✗ OPTIONS request failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Testing network connectivity" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://httpbin.org/get" -Method GET -TimeoutSec 10
    Write-Host "✓ Network connectivity is working" -ForegroundColor Green
} catch {
    Write-Host "✗ Network connectivity issue" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Summary ===" -ForegroundColor Magenta
Write-Host "If backend is not reachable:" -ForegroundColor Yellow
Write-Host "  - Check if the backend server is running" -ForegroundColor White
Write-Host "  - Verify the URL is correct" -ForegroundColor White
Write-Host "  - Check backend logs for errors" -ForegroundColor White
Write-Host "  - Contact your backend developer" -ForegroundColor White

Write-Host "`nIf backend is reachable but CORS fails:" -ForegroundColor Yellow
Write-Host "  - Add CORS headers to your backend" -ForegroundColor White
Write-Host "  - Check CORS configuration" -ForegroundColor White
Write-Host "  - Use the proxy solution as temporary workaround" -ForegroundColor White

Write-Host "`nTest completed!" -ForegroundColor Green 