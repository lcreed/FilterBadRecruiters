 /* 
 -----------------------------------------------------------------------------
 Version:  031623b 
 Purpose:  Manage unwanted email messages from 3rd party recruiters in gmail.
 Creator:  Laura Creed
 License:  Free for personal use.
 GitHub:  https://github.com/lcreed/FilterBadRecruiters
 Donations:   https://www.paypal.me/lcreed

   Notes:
   -  Other repositories will be added soon.
   -  Read documentation on the GitHub repository at: https://github.com/lcreed/FilterBadRecruiters
      for install and use instructions.
   -  The GAS (Google Apps Script) platform has reasonably good error reporting so I haven't (yet) added catches.
   -  The script was designed to be usuable by anyone.  You can modify it to use the GAS properties associated with your account rather than
      the current variables.
   -  To disable replies, search the script for the string "message.reply" and comment out those lines
   -  Contact me via Github with questions, suggestions, or problems.
 -----------------------------------------------------------------------------
 */
 function getConfigVars() {

    var properties = PropertiesService.getScriptProperties();
    const scriptFBRVersion = '031623b';

    // Check if the scriptFBRVersion property is already set to current version
    if (properties.getProperty('scriptFBRVersion') !== scriptFBRVersion) {
        // this version's first run, so set the scriptFBRVersion property to current version
        properties.setProperty('scriptFBRVersion', scriptFBRVersion);
        /*

        This is an excellent place to fix anything that has changed with this release.  I.e. 
        reformatting a field in the spreadsheet 

        */
        Logger.log(PropertiesService.getScriptProperties().getProperties()); // for debuggings
    }


    // This is the text file that is sent in a reply to those on the bad recruiters domain list.
    const urlCannedResponse = "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiterReply.txt";
    /* This is the list of known bad domains that the script will search for.  The script expects this list to
       have one domain per line.   */
    // urlRecruiterDomains: "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiters.txt",
    const urlRecruiterDomains = "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiters-v031023.txt";

    let scriptConfig = {
        /* This label is applied to the recruiters in the known spammers domain list
           if it doesn't exist, the script will attempt to create it.  */
        badRecruiterMsgLabel: "BadRecruiterSpam",
        // Logger.log(scriptConfig); // uncomment this line to see the scriptConfig object 
        // The searchRange variable defines the range of time to search your messages.  I.e. only search messages received in the last week 
        searchRange: "newer_than:7d",
        // searchRange = "After:2020/10/15";

        /* ----------------------------------------------------------------------------------------------------------------------
         These variables apply to messages from recruiters outside of the known bad recruiter domain list
         These recruiters are using a known mailing list service listed in the viaDomains variable.  
         you can modify this list to search for any string in the email header         */
        viaDomains: ["jobopportunityforyou", "ceipal", "bullhornmail", "jobdiva", "monsterspam", "joboppforyou","conrep"],

        // This label is applied to mail from via domains that are from agencies NOT in the known bad recruiter list
        newBadRecruiterMsgLabel: "# SusSpam/newReleaseNBR"
    };

    /* ----------------------------------------------------------------------------------------------------------------------
  Code section:  Don't change anything below this line unless you know what you're doing.

  The badRecruiterDomains is created by retrieving the raw contents of the bad recruiter domain text file from the web.  The
  contents of the script are converted to lower case, and split into an array by return character.  Next the extra spaces are
  removed from each item in the array and each item is checked to confirm it contains a string and isn't just a blank line.  The
  cleaned up list will then be inserted into the scriptConfig object.    */

    scriptConfig.badRecruiterDomains = UrlFetchApp.fetch(urlRecruiterDomains)
        .getContentText()
        .toLowerCase()
        .split("\n")
        .map(function(domain) {
            return domain.trim();
        })
        .filter(Boolean);

    // verify that the scriptConfig.badRecruiterDomains array is not empty
    if (scriptConfig.badRecruiterDomains.length < 1) {
        throw new Error("The " + urlRecruiterDomains + " file that should contain a list of known bad recruiter domains appears to be empty, unreachable, or formatted incorrectly");
    }

    scriptConfig.cannedResponse = UrlFetchApp.fetch(urlCannedResponse);

    if (scriptConfig.cannedResponse.length < 1) {
        throw new Error("The " + urlCannedResponse + " file that should contain a canned response appears to be empty, unreachable, or formatted incorrectly. It's possible that the source host for the file is not accessible.  Please check the URL and try again.");
    }

    return scriptConfig;
}

function getReportVars() {

    /* The following variables define the way the script does reporting.  
        - If the emailReport value is true, you will get an email every time the script runs and an email from a 3rd party recruiter is identified.
          This will most likely mean you get an email every time a recruiter sends you an email telling you that you received a spam recruiter message.
          It is handy for troubleshooting and testing but it is advised to leave it set to false.
        - The Header variables are only used in the log output and when email reporting is enabled.
        - The subject variable is only used when email reporting is enabled.
        - The reportSheedID variable is a pointer to a spreadsheet where a historical record of matches are retained.  The spreadsheet
          will be accessible by a URL output in the execution log every time the script runs..  You may want to bookmark the URL to review
          what messages have been sent to spam over the lifetime run of this version of the script.
    
    */

    let reportConfig = {
        emailReport: false,
        // This sets the email address of recipient to the person who owns the running script. 
        recipient: Session.getActiveUser().getEmail(), // This gets your email address
        // This sets the subject of the email report
        subject: "The Filter Bad Recruiters script found matches in your Inbox",
        // This line precedes the list of bad recruiter spam messages identified by the script
        reportBodyHeader: "The following messages were identified as a match:\n",
        // the name of the drive folder where the spreadsheet will be saved and the title of the spreadsheet
        driveFldrName: "FBRReports",
        driveSSTitle: "FBRHistoricalRecord",
        driveSSTabName: "Log",
        /* If the reportSheetID variable is not set to a valid spreadsheet ID before the first time the script is run, 
           then the script will create a new report sheet in your Google Drive.  It will store the new spreadsheet's ID in the script properties.
           You can view the properties by clicking the cog wheel icon in the left navigator panel and scroll down to the script properties section.
           If you delete this automatically created sheet, the script will create a new spreadsheet but existing historical data will be lost

        */
        reportSheetID: ""
    };

    /* ----------------------------------------------------------------------------------------------------------------------
   Code section: Don't change anything below this line unless you know what you're doing. 
   */

    // Try and get the existing reporting spreadsheet if it exists
    if (!reportConfig.reportSheetID || !DriveApp.getFileById(reportConfig.reportSheetID)) {
        // If reportSheetID is not valid, check the script properties
        const scriptProperties = PropertiesService.getScriptProperties();
        const scriptReportSheetID = scriptProperties.getProperty("reportSheetID");

        if (scriptReportSheetID && DriveApp.getFileById(scriptReportSheetID)) {
            reportConfig.reportSheetID = scriptReportSheetID;
        } else {
            // If neither reportSheetID nor scriptReportSheetID are valid, create a new spreadsheet
            const newReportSheet = createReportSheet(reportConfig.driveSSTitle, reportConfig.driveFldrName, reportConfig.driveSSTabName);
            reportConfig.reportSheetID = newReportSheet.getId();
            scriptProperties.setProperty("reportSheetID", reportConfig.reportSheetID);
        }
    }
    return reportConfig;
}



function createReportSheet(folderName, fileName, tabLabel) {

    var header = ["Received", "From email:", "Sender Domain", "Subject:", "Known Domain", "Via Domain"];

    // Check if the folder exists in Drive. If not, create it
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    if (folders.hasNext()) {
        folder = folders.next();
    } else {
        folder = DriveApp.createFolder(folderName);
    }

    // Check if the file exists in the folder, if so rename it with "-old" extension and timestamp
    var files = folder.getFilesByName(fileName);
    if (files.hasNext()) {
        var file = files.next();
        var timestamp = new Date().toISOString().substr(0, 19).replace('T', '-').replace(/:/g, '-');
        var newName = fileName + '-old-' + timestamp;
        file.setName(newName);
    }

    var sheet = SpreadsheetApp.create(fileName, 50, header.length + 2);
    var spreadsheet = sheet.getId();
    var file = DriveApp.getFileById(spreadsheet);
    file.getParents().next().removeFile(file);
    folder.addFile(file);
    var firstSheet = SpreadsheetApp.openById(spreadsheet).getSheets()[0];
    firstSheet.setName(tabLabel);

    // Add the header columns to the spreadsheet

    firstSheet.appendRow(header);

    // Bold everything in the first row and freeze it.  set banding theme, autoresize the columns
    firstSheet.getRange(1, 1, 1, header.length).setFontWeight("bold");
    firstSheet.autoResizeColumns(1, header.length);
    firstSheet.setFrozenRows(1);
    var range = firstSheet.getRange(firstSheet.getMaxColumns + firstSheet.getMaxRows());
    range.applyRowBanding(SpreadsheetApp.BandingTheme.TEAL);
    // available banding themes:  https://developers.google.com/apps-script/reference/spreadsheet/banding-theme


    // Make the spreadsheet visible via a URL.  
    var url = sheet.getUrl();
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    Logger.log('Spreadsheet created with URL: ' + url);
    
    // send email to user here telling them about the new spreadsheet
    const sendTo = Session.getActiveUser().getEmail(); // This gets your email address
    const sub = "Spreadsheet created for logging results of the Filter Bad Recruiters Script";
    let body = "Drive folder that contains the new spreadsheet: " + folder + "\n";
    body += "New Spreadsheet is named: " + fileName + "\n";
    body += "Spreadsheet URL:  " + url + "\n\n";
    body += "Any matches found by the script will be added to the " + tabLabel + " tab.";

    GmailApp.sendEmail(
            sendTo,
            sub,
            body
    ); 
    return sheet;
}


function checkForKnownBadRecruiters(message, badRecruiterDomains) {
    // check the message and return true if it contains any of the known bad recruiter domains
    // return false if it does not contain any of the known bad recruiter domains
    var from = message.getFrom().toLowerCase();
    // loop through the list of domains to see if they match this message
    for (var k = 0; k < badRecruiterDomains.length; k++) {
        if (from.indexOf(badRecruiterDomains[k]) !== -1) {
            return true;
        }
    }
    return false; // if the message does not contain any of the known bad recruiter domains, return false 
}

function checkForBadRecruitersUsingVia(message, headerSearchStringArray) {
    // check the message and return true if it contains any of the known via domains
    // return false if it does not contain any of the known via domains
    var headers = message.getRawContent().split('Content-Type:')[0].trim();
    for (var k = 0; k < headerSearchStringArray.length; k++) {
        if (headers.toLowerCase().indexOf(headerSearchStringArray[k].toLowerCase()) > -1) {
            return headerSearchStringArray[k]; // return the matching string that was found in the header
        }
    }
    return null; // return null if no match is found
}

function reportResults(resultsData) {
    const reportConfig = getReportVars();

    /* modify this section to format the results of the new resultsData object into an email body */

    let reportBody = '';
    if (resultsData.length > 0 && reportConfig.emailReport) {
        reportBody += reportConfig.reportBodyHeader + "\n" + resultsData.join("  ")  + "\n";
        reportBody += "\n" + "You can view the report of all matches here: " + SpreadsheetApp.openById(reportConfig.reportSheetID).getUrl();
        Logger.log(reportBody);
        GmailApp.sendEmail(
          reportConfig.recipient,
          reportConfig.subject,
          reportBody, {
              name: "Filter Bad Recruiters"
           }
        );
        Logger.log('Email sent.');
    } else {
        if (reportBody.length > 0) {
            Logger.log(reportConfig.reportBodyHeader + "\n" + resultsData);
        } else {
            Logger.log("No matches found");
        }
    }
    // Logger.log(reportConfig); // uncomment this line to see the reportConfig object
  
    // start push here
    var reportSheet = SpreadsheetApp.openById(reportConfig.reportSheetID).getSheetByName(reportConfig.driveSSTabName);
    reportSheet.getRange(reportSheet.getLastRow() + 1, 1, resultsData.length, resultsData[0].length).setValues(resultsData);
    reportSheet.autoResizeColumns(1, reportSheet.getLastColumn());
    // To Do:  add call to function to create or modify pie chart
    Logger.log("View the log here: " + SpreadsheetApp.openById(reportConfig.reportSheetID).getUrl());
}


function processMessages() {
    const scriptConfig = getConfigVars();
    var resultsData = [];
    var cache = CacheService.getScriptCache();
    var threads = GmailApp.search(scriptConfig.searchRange);

    // Checks for the defined label and populates the var if it finds it
    var labelBR = GmailApp.getUserLabelByName(scriptConfig.badRecruiterMsgLabel);
    
    // If the label var is empty because it didn't already exist, this creates the label in your gmail 
    if (!labelBR) {
        labelBR = GmailApp.createLabel(scriptConfig.badRecruiterMsgLabel);
    }

    for (var i = 0; i < threads.length; i++) {
        // Get the first message in the thread
        var message = threads[i].getMessages()[0];
        var bootMessage = false;


        // Check if message ID is in cache
        if (cache.get(message.getId())) {
            // Logger.log("message already in cache " + message.getSubject());
            // uncomment next line to remove all messages from cache
            // cache.remove(message.getId());
            continue; // Skip this message if already processed
        }

        //   var header = ["Received", "From email:", "Sender Domain", "Subject:", "Known Domain", "Via Domain"];

        if (checkForKnownBadRecruiters(message, scriptConfig.badRecruiterDomains)) {
            // If the message originated from one of the known bad recruiter domains, do the following:
            bootMessage = true; // bootMessage is true because the message originated from one of the known bad recruiter domains
            var sender = message.getFrom().replace(/^.+<([^>]+)>$/, "$1").toLowerCase();
            if (sender.includes('<') || sender.includes('>')) {
              sender = sender.replace(/<|>/g, '');
            }
            resultsData.push([
                message.getDate(),
                sender,
                sender.split('@')[1],
                message.getSubject(),
                'true', // message from a known domain
                ""
            ])
            Logger.log("This message is from a known KBR: " + message.getFrom() + ", Subject: " + message.getSubject()); // for debugging 

        } else if (viaDomainUsed = checkForBadRecruitersUsingVia(message, scriptConfig.viaDomains)) {
            bootMessage = true; // bootMessage is true because the message originated from one of the known viadomain strings
            var sender = message.getFrom().replace(/^.+<([^>]+)>$/, "$1").toLowerCase();
            if (sender.includes('<') || sender.includes('>')) {
              sender = sender.replace(/<|>/g, '');
            }

            resultsData.push([
                message.getDate(),
                sender,
                sender.split('@')[1],
                message.getSubject(),
                'false', // message from a known domain
                viaDomainUsed
            ])
            Logger.log("This message is from a message header string match of known via domains: " + message.getFrom() + ", Subject: " + message.getSubject() + ", Header String Match: " + viaDomainUsed); // for debugging 


        } else {
            // toss the message in the cache
            cache.put(message.getId(), 'true', 21600); // Store message ID in cache for 6 hours
        }

        if (bootMessage) {
            message.reply(scriptConfig.cannedResponse); /// reply to the message with the canned response
            threads[i].addLabel(labelBR); // add the label to the thread to indicate it was processed by this script
            GmailApp.moveThreadToSpam(threads[i]); // move the thread to the spam folder
        }
        Utilities.sleep(50);
    } // end for loop

    // call reporting function and pass it the results variables
    if (resultsData.length > 0) {
        reportResults(resultsData);
    } else {
        Logger.log("No matches found " + resultsData);
    }
}