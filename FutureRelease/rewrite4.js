function getConfigVars() {

  // This is the text file that is sent in a reply to those on the bad recruiters domain list.
  const urlCannedResponse = "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiterReply.txt";
  /* This is the list of known bad domains that the script will search for.  The script expects this list to
     have one domain per line.   */
  // urlRecruiterDomains: "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiters.txt",
  const urlRecruiterDomains = "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/FutureRelease/wonkyRecruiterlist.txt";

  let scriptConfig = {
    /* This label is applied to the recruiters in the known spammers domain list
       if it doesn't exist, the script will attempt to create it.  */
    badRecruiterMsgLabel: "# SusSpam/testing",

    // The searchRange variable defines the range of time to search your messages.  I.e. only search messages received in the last week 
    searchRange: "newer_than:7d",
    // searchRange = "After:2020/10/15";

    /* ----------------------------------------------------------------------------------------------------------------------
     These variables apply to messages from recruiters outside of the known bad recruiter domain list
     These recruiters are using a known mailing list service listed in the viaDomains variable.  
     you can modify this list to search for any string in the email header         */
    viaDomains: ["jobopportunityforyou", "ceipal","bullhornmail","jobdiva","monsterspam","brassring","joboppforyou"],
  
    // This label is applied to mail from via domains that are from agencies NOT in the known bad recruiter list
    newBadRecruiterMsgLabel: "# SusSpam/testingVia"
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
                                    .map(function(domain) { return domain.trim(); })
                                    .filter(Boolean);

  // verify that the scriptConfig.badRecruiterDomains array is not empty
  if (scriptConfig.badRecruiterDomains.length < 1) {
    throw new Error("The " + urlRecruiterDomains + " file that should contain a list of known bad recruiter domains appears to be empty, unreachable, or formatted incorrectly");
  }

  scriptConfig.cannedResponse = UrlFetchApp.fetch(urlCannedResponse);

  if (scriptConfig.cannedResponse.length < 1) {
    throw new Error("The " + urlCannedResponse + " file that should contain a canned response appears to be empty, unreachable, or formatted incorrectly");
  }

  // Checks for the defined label and populates the var if it finds it
  var labelBR = GmailApp.getUserLabelByName(scriptConfig.badRecruiterMsgLabel);
  var labelNBR = GmailApp.getUserLabelByName(scriptConfig.newBadRecruiterMsgLabel);

  // If the label var is empty because it didn't already exist, this creates the label in your gmail 
  if (!labelBR) {
    labelBR = GmailApp.createLabel(scriptConfig.badRecruiterMsgLabel);
  }

  if (!labelNBR) {
    labelNBR = GmailApp.createLabel(scriptConfig.newBadRecruiterMsgLabel);
  }

  return scriptConfig;
}



function getReportVars() {
  
  /* The following variables are only used if email reporting is enabled emailReport must be set to true if you want to receive 
  an email report when the script runs and identifies spam  */

  let reportConfig = {
    emailReport: false,
    // This sets the email address of recipient to the person who owns the running script. 
    recipient: Session.getActiveUser().getEmail(),   // This gets your email address
    // This sets the subject of the email report
    subject: "Filter Bad Recruiters:  Results",
    // This line precedes the list of bad recruiter spam messages identified by the script
    knownDomainsHeader: "The following messages from known bad recruiters were found:\n\n",
    // This line precedes the list of spam messages received from via domains and are from agencies NOT in the known bad recruiter list
    viaDomainsHeader: "\nThe following messages were received from known via domains and are from domains not currently in the known bad recruiter list:\n\n"  
  };
  
  /* ----------------------------------------------------------------------------------------------------------------------
  Code section:  Don't change anything below this line unless you know what you're doing. 
  */

  return reportConfig;
}


function checkForKnownBadRecruiters(message, badRecruiterDomains) {
  // check the message and return true if it contains any of the known bad recruiter domains
  // return false if it does not contain any of the known bad recruiter domains

}

function checkForBadRecruitersUsingVia(message, viaDomains) {
  // check the message and return true if it contains any of the known via domains
  // return false if it does not contain any of the known via domains
}

function reportResults(message, knownBadRecruitersLC, knownBadRecruiters, newBadRecruitersLC, newBadRecruiters) {
  // report the results of the script to the email report
  // email report must be set to true if you want to receive an email report when the script runs and identifies spam  
}

function processMessages() {
  const scriptConfig = getConfigVars();
  Logger.log(scriptConfig);
    const reportConfig = getReportVars();
  Logger.log(reportConfig);

  var logs = [];
  var resultsRecruiterSpamCheck = "";
  var resultsViaSpamCheck = "";

  

  /* ----------------------------------------------------------------------------------------------------------------------
  Pseudo code: 
  get all threads in the search range
  for loop to get the first message in every thread
    if checkForKnownBadRecruiters(message, badRecruiterDomains) {
      add message details to results var for KBR
      add message id to cache and break out of loop
    else if checkForBadRecruitersUsingVia(message, viaDomains) {
      add message details to results var for BRUV
      add message id to cache and break out of loop
    }
    add m to cache 
  }

  function reportResults(vars used for rolling results) {
    // report the results of the script to the email report
    // email report must be set to true if you want to receive an email report when the script runs and identifies spam  
  }  
  */
}

