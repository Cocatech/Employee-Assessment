# Analyze Excel Structure
$excelPath = "$PSScriptRoot\docs\TRTH_Assessment_Data.xlsx"

try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    $workbook = $excel.Workbooks.Open($excelPath)
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  TRTH Assessment Data - Excel Analysis" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    # Analyze each sheet
    foreach ($sheet in $workbook.Sheets) {
        $sheetName = $sheet.Name
        $usedRange = $sheet.UsedRange
        
        Write-Host "`n========== $sheetName ==========" -ForegroundColor Yellow
        Write-Host "Rows: $($usedRange.Rows.Count), Columns: $($usedRange.Columns.Count)"
        
        # Try to find headers in first few rows
        Write-Host "`nHeaders (checking rows 1-3):" -ForegroundColor Green
        
        for ($row = 1; $row -le 3; $row++) {
            $hasContent = $false
            for ($col = 1; $col -le [Math]::Min(10, $usedRange.Columns.Count); $col++) {
                $cellValue = $sheet.Cells.Item($row, $col).Text
                if ($cellValue -and $cellValue.Trim()) {
                    $hasContent = $true
                    break
                }
            }
            
            if ($hasContent) {
                Write-Host "  Row $row`:" -NoNewline
                for ($col = 1; $col -le [Math]::Min(15, $usedRange.Columns.Count); $col++) {
                    $cellValue = $sheet.Cells.Item($row, $col).Text
                    if ($cellValue -and $cellValue.Trim()) {
                        Write-Host " [$col]$cellValue" -NoNewline
                    }
                }
                Write-Host ""
            }
        }
        
        # Show sample data from row 4-5
        if ($usedRange.Rows.Count -gt 3) {
            Write-Host "`nSample Data (Row 4):" -ForegroundColor Green
            for ($col = 1; $col -le [Math]::Min(10, $usedRange.Columns.Count); $col++) {
                $cellValue = $sheet.Cells.Item(4, $col).Text
                if ($cellValue -and $cellValue.Trim() -and $cellValue.Length -lt 50) {
                    Write-Host "  Col $col`: $cellValue"
                }
            }
        }
    }
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  Analysis Complete" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
} finally {
    if ($workbook) { $workbook.Close($false) }
    if ($excel) { 
        $excel.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    }
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
