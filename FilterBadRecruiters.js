// this is version 23.2.22a  
// source repository: https://github.com/lcreed/FilterBadRecruiters
// the new version implements search for mail sent via known mailing list providers
// and improves logging and reporting

  // The following two variables can be modified to point to your own URLs

  // This is the text file that is sent in a reply to those on the bad recruiters domain list
  cannedResponseURL = "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiterReply.txt";
  
  // This is the list of domains that the script will search for 
  domainListURL = "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiters.txt";

  // These variables tags the messages sent to spam with a specific label name.  If the label doesn't already exist
  // in your gmail account, it is created.  This label is useful for seeing which messages in your spam folder were 
  // placed there by this script

  // This label is applied to the recruiters in the known spammers domain list
  badRecruiterMsgLabel = "# SusSpam/BadRecruiter";

  // This label is applied to mail from via domains that are from agencies NOT in the known bad recruiter list
  newbadRecruiterMsgLabel = "# SusSpam/NewBadRecruiter";

  // Variable to hold list of known spam mailing lists sold to other companies
  // i.e. via spam
  viaDomains = ["jobopportunityforyou", "ceipal","bullhornmail","jobdiva"];

  // searchRange variable - this defines the range of time to search your messages.  I.e. only search messages received in the last week 
  // or the last year or last hour.  The default is the last seven days.  The reason for this default is if the domain is added to the list
  // within a week, that message will still get flagged as spam.  Various options are provided below.  Simply uncomment the one you want to use 
  // by removing the two forward pointing slashes and comment out the ones you aren't using
  searchRange = "newer_than:7d";
  // searchRange = "After:2020/10/15";

  // If you want to receive an email report when the script runs and identifies spam, set the following variable value from 0 to 1
  // Mail is only sent if the value of this variable is 1 AND the recipient variable contains a valid email
  getReportEmail = "0";

  // These vars are used if email reporting is enabled
  recipient = ""; // Replace with the email address of the recipient

  subject = "Search Results";
  RecSpamHeader = "The following messages from known bad recruiters were found:\n\n";
  viaSpamHeader = "\n\nThe following messages were received from known via domains and are from domains not currently in the known bad recruiter list:\n\n"


// you shouldn't change anything after this line if you don't know javascript

function DumpBadRecruiter2Spam() {
  // Retrieve the list of bad recruiter domains 
  var getDomainList = UrlFetchApp.fetch(domainListURL);
  var badRecruiterDomains = getDomainList.getContentText();
  return badRecruiterDomains;
}

// split the bad recruiter domains file contents by return to populate the var array
var badRecruiterDomains = DumpBadRecruiter2Spam().split("\n");

// retrieve the contents of the canned message and store in a variable
var cannedResponse = UrlFetchApp.fetch(cannedResponseURL);

// Checks for the defined label and populates the var if it finds it
var label1 = GmailApp.getUserLabelByName(badRecruiterMsgLabel);
var label2 = GmailApp.getUserLabelByName(newbadRecruiterMsgLabel);

// If the label var is empty because it didn't already exist, this creates the label in your gmail 
if (!label1) {
  label1 = GmailApp.createLabel(badRecruiterMsgLabel);
}

if (!label2) {
  label2 = GmailApp.createLabel(newbadRecruiterMsgLabel);
}


var logs = [];
var RecruiterSpamCheckResults = "";
var ViaSpamCheckResults = "";

// the default search criteria here is only messages received in the last week
var threads = GmailApp.search(searchRange);
for (var i = 0; i < threads.length; i++) {
  var thread = threads[i];
  var messages = thread.getMessages();
  for (var j = 0; j < messages.length; j++) {
    var message = messages[j];
    var from = message.getFrom();
    // loop through the list of domains to see if they match this message
    for (var k = 0; k < badRecruiterDomains.length; k++) {
      if (from.indexOf(badRecruiterDomains[k]) !== -1) {
        thread.addLabel(label1);
        message.reply(cannedResponse);
        // thread.markRead();
        // thread.moveToArchive();
        GmailApp.moveThreadToSpam(thread);
        RecruiterSpamCheckResults += "From: " + message.getFrom() + ", Subject: " + message.getSubject();
        // logs.push("From: " + message.getFrom() + ", Subject: " + message.getSubject() + "BCC List: " + message.getBCC() );
      }
    }
    // Get the raw content of the message
    var rawContent = message.getRawContent(); 

    // Loop through each search string
    for (var m = 0; m < viaDomains.length; m++) {
      var viaDomain = viaDomains[m];
          
      // If the search string is found in the raw content of the message, add the sender email address and subject line to the results string
      if (rawContent.indexOf(viaDomain) !== -1) {
        var from = message.getFrom();
        var subject = message.getSubject();
        thread.addLabel(label2);
        message.reply(cannedResponse);
        GmailApp.moveThreadToSpam(thread);
        ViaSpamCheckResults += "Email address: " + from + ", Subject: " + subject + "\n";
        break;
      }
    }
   
  }
}

Logger.log("This script has completed checking for the existence of " + badRecruiterDomains.length + " different bad recruiter domains in your specified message criteria");
if (RecruiterSpamCheckResults.length > 0) {
  Logger.log("Your requested actions were taken on the following threads:");
  Logger.log(RecruiterSpamCheckResults);
} else {
  Logger.log("No new threads were found that originated from the bad recruiter domains list");
}

if (ViaSpamCheckResults.length > 0) {
  Logger.log("The following messages were received from known via domains and are from domains not currently in the known bad recruiter list:");
  Logger.log(ViaSpamCheckResults);
}


// If results were found, send an email to the recipient containing the results
   var resultsFound = (RecruiterSpamCheckResults || ViaSpamCheckResults);
   var reportRequested = (recipient.length > 1 && getReportEmail == 1);  
   if (resultsFound && reportRequested ) {
      body = + RecSpamHeader + resultsRecruiterSpamCheckResults + viaSpamHeader + ViaSpamCheckResults;
      GmailApp.sendEmail(recipient, subject, body);
   }

