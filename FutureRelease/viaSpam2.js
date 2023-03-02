 
// poached from https://gist.github.com/crates/230b1e10a07424ab2eba87f6199b966d
// modifying to only search the first message in each thread
// in testing as of 3/1/2023
// i don't love this workflow but I think I can integrate the other script.  Issue will be having a bunch of vars outside of the functions

var viaHeaderResults = "";
// This is the text file that is sent in a reply to those on the bad recruiters domain list
cannedResponseURL = "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiterReply.txt";
// retrieve the contents of the canned message and store in a variable
var cannedResponse = UrlFetchApp.fetch(cannedResponseURL);

function processMessages(thread, label, search) {
  var cache = CacheService.getScriptCache();

  var messages = thread.getMessages();
  var message = messages[0];

    var messageId = message.getId();

    // Check if message ID is in cache
    if (cache.get(messageId)) {
      return; // Skip this message if already processed
    }

    var body = message.getRawContent().split('Content-Type:')[0].trim();

    if (Array.isArray(search)) { // search for multiple addresses:
      for (var k = 0; k < search.length; k++) {
        if (body.toLowerCase().indexOf(search[k].toLowerCase()) >- 1) {
          thread.addLabel(label);
          viaHeaderResults += "From: " + message.getFrom() + ", Subject: " + message.getSubject() + " Using Via Header: " + search[k] + "\n";
          cache.put(messageId, 'true', 21600); // Store message ID in cache for 6 hours
          message.reply(cannedResponse);
          GmailApp.moveThreadToSpam(thread);
          break;
        }
      }
     
    }

    Utilities.sleep(50);
  //}

}


function processRecruiters(thread) {// filters all threads in the Inbox for spammy recruiters
  var label = GmailApp.getUserLabelByName("# SusSpam/NewBadRecruiter");
  var viaAddresses = [
    'bullhornmail',
    'conrep',
    'ziprecruiter',
    'joboppforyou',
    'amigainformatics',
    'jobdivabk',
    'compqsoft',
    'jobopportunityforyou',
    'ceipal',
    'monsterspam',
  ];

  processMessages(thread, label, viaAddresses);


}// processRecruiters()




function filterViaSpam() {
  var threads = GmailApp.search("newer_than:7d");
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    processRecruiters(thread);
    // processSwingShoes(thread);
    // processJobDiva(thread);
  } // for
  if (viaHeaderResults.length > 0) {
    Logger.log("The following messages were received from known via domains and are from domains not currently in the known bad recruiter list:");
    Logger.log(viaHeaderResults);
    recipient = Session.getActiveUser().getEmail();
    subject = "Bad Recruiters using Via mail lists";
    viaSpamHeader = "The following messages were received from known via domains and are from domains not currently in the known bad recruiter list:\n\n"
    repBody = + viaSpamHeader + viaHeaderResults;
    GmailApp.sendEmail(recipient, subject, repBody);

  }
}
