 
// poached from https://gist.github.com/crates/230b1e10a07424ab2eba87f6199b966d
// start with filterViaSpam

var viaHeaderResults = "";

function processMessages(thread, label, search) {
  var cache = CacheService.getScriptCache();

  var messages = thread.getMessages();

  for (var j = 0; j < messages.length; j++) {
    var message = messages[j];
    var messageId = message.getId();

    // Check if message ID is in cache
    if (cache.get(messageId)) {
      continue; // Skip this message if already processed
    }

    var body = message.getRawContent().split('Content-Type:')[0].trim();

    if (typeof search === 'string') { // used for single-string searches:
      if (body.indexOf(search) > -1) {
        // none of this block will run as search is an array
        thread.addLabel(label);
        cache.put(messageId, 'true', 21600); // Store message ID in cache for 6 hours
        break;
      }
    } else if (Array.isArray(search)) { // search for multiple addresses:
      for (var k = 0; k < search.length; k++) {
        if (body.toLowerCase().indexOf(search[k].toLowerCase()) >- 1) {
          thread.addLabel(label);
          viaHeaderResults += "From: " + message.getFrom() + ", Subject: " + message.getSubject() + " Using Via Header: " + search[k] + "\n";
          // cache.put(messageId, 'true', 21600); // Store message ID in cache for 6 hours
          break;
        }
      }
     
    }

    Utilities.sleep(50);
  }

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
  }
}
