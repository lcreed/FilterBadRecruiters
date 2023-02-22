// this is version 4  
// modified script get canned response and reply to all matches
// easy for someone to create their own list / canned response and update the script to point to it
// to do: variable-ize the filenames fetched


function DumpBadRecruiter2Spam() {
  var response = UrlFetchApp.fetch("https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiters.txt");
  var contents = response.getContentText();
  return contents;
}

var domains = DumpBadRecruiter2Spam().split("\n");
var cannedResponse = UrlFetchApp.fetch("https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiterReply.txt");


var label = GmailApp.getUserLabelByName("# SusSpam/BadRecruiter");
if (!label) {
  label = GmailApp.createLabel("# SusSpam/BadRecruiter");
}

var logs = [];
var threads = GmailApp.search("newer_than:7d");
for (var i = 0; i < threads.length; i++) {
  var thread = threads[i];
  var messages = thread.getMessages();
  for (var j = 0; j < messages.length; j++) {
    var message = messages[j];
    var from = message.getFrom();
    for (var k = 0; k < domains.length; k++) {
      if (from.indexOf(domains[k]) !== -1) {
        thread.addLabel(label);
        message.reply(cannedResponse);
        // thread.markRead();
        // thread.moveToArchive();
        GmailApp.moveThreadToSpam(thread);
        logs.push("Subject: " + thread.getFirstMessageSubject());
      }
    }
  }
}

if (logs.length > 0) {
  Logger.log("The following threads were moved to the # SusSpam/BadRecruiter label, maoved to spam, and logged:");
  Logger.log(logs.join("\n"));
} else {
  Logger.log("No threads were moved to the # SusSpam/BadRecruiter label, moved to spam, or logged.");
}
