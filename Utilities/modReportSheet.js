/*
Script for changing the report sheet. May need to modify the two constants to get a handle on the appropriate sheet
*/

function cleanupReportSheet() {
    const scriptProps = PropertiesService.getScriptProperties();
    const logSheet = SpreadsheetApp.openById(scriptProps.getProperty("reportSheetID")).getSheetByName("Log");
    logSheet.autoResizeColumns(1, logSheet.getLastColumn() + 1);
    var range = logSheet.getRange(1, 1, logSheet.getMaxRows(), logSheet.getMaxColumns());
    range.getBandings().forEach(function(banding) {
        banding.remove();
    });
    range.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREEN);
}
