function searchEmails() {
    // Set the search strings you want to look for
    var searchStrings = ["jobopportunityforyou", "ceipal","bullhornmail","jobdiva"];
       
    // Search for emails received in the last 7 days
    var threads = GmailApp.search('newer_than:7d');
    
    // Loop through each thread
    for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      
      // Loop through each message in the thread
      for (var j = 0; j < messages.length; j++) {
        var message = messages[j];
        
        // Get the raw content of the message
        var rawContent = message.getRawContent();
        
        // Loop through each search string
        for (var k = 0; k < searchStrings.length; k++) {
          var searchString = searchStrings[k];
          
          // If the search string is found in the raw content of the message, log the sending email domain and subject line
          if (rawContent.indexOf(searchString) !== -1) {
            var from = message.getFrom();
            var subject = message.getSubject();
            Logger.log("Email address: " + from + ", Subject: " + subject);
            break;
          }
        }
      }
    }
  }