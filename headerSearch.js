// simple script for searching headers for the recruiter mailing list spam domains 
// lets you search your entire inbox to see if there are some domains that need
// to be added to the master.  
// eventually may integrate this into the master script so even if a domain isn't in the 
// banned list, the script will move new domains using these sites to spam
function searchInbox() {
    var searchTerms = ["jobopportunityforyou", "ceipalmm"]; // List of search terms
    var threads = GmailApp.getInboxThreads();
  
    for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      for (var j = 0; j < messages.length; j++) {
        var message = messages[j];
        var messageData = message.getRawContent();
        var messageFound = false;
  
        // Check if any of the search terms are found in the message data
        for (var k = 0; k < searchTerms.length; k++) {
          if (messageData.indexOf(searchTerms[k]) > -1) {
            messageFound = true;
            break;
          }
        }
  
        // If the message contains at least one search term, log the entire message to the console
        if (messageFound) {
          Logger.log("Found message with search term(s) in thread " + threads[i].getId() + ", message " + message.getId() + ":");
          Logger.log(messageData);
        }
      }
    }
  }