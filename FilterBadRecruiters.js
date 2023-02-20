// this is version 5  
// the new version makes it easier to change the urls so that someone can use their own content


function DumpBadRecruiter2Spam() {
  // The following two variables can be modified to point to your own URLs

  // This is the text file that is sent in a reply to those on the bad recruiters domain list
  cannedResponseURL = "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiterReply.txt";
  
  // This is the list of domains that the script will search for 
  domainListURL = "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiters.txt";

  // This variable tags the messages sent to spam with a specific label name.  If the label doesn't already exist
  // in your gmail account, it is created.  This label is useful for seeing which messages in your spam folder were 
  // placed there by this script
  badRecruiterMsgLabel = "# SusSpam/BadRecruiter";


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
var label = GmailApp.getUserLabelByName(badRecruiterMsgLabel);

// If the label var is empty because it didn't already exist, this creates the label in your gmail 
if (!label) {
  label = GmailApp.createLabel(badRecruiterMsgLabel);
}

var logs = [];

// the default search criteria here is only messages received in the last week
var threads = GmailApp.search("newer_than:7d");
for (var i = 0; i < threads.length; i++) {
  var thread = threads[i];
  var messages = thread.getMessages();
  for (var j = 0; j < messages.length; j++) {
    var message = messages[j];
    var from = message.getFrom();
    for (var k = 0; k < badRecruiterDomains.length; k++) {
      if (from.indexOf(badRecruiterDomains[k]) !== -1) {
        thread.addLabel(label);
        message.reply(cannedResponse);
        // thread.markRead();
        // thread.moveToArchive();
        GmailApp.moveThreadToSpam(thread);
        // you could log additional items like sender email
        logs.push("Subject: " + thread.getFirstMessageSubject());
      }
    }
  }
}

Logger.log("This script has completed checking for the existance of " + badRecruiterDomains.length + " different bad recuiter domains in your specified message criteria");
if (logs.length > 0) {
  Logger.log("Your requested actions were taken on the following threads:");
  Logger.log(logs.join("\n"));
} else {
  Logger.log("No new threads were found that originated from the bad recruiter domains list");
}
