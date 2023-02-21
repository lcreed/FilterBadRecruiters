function searchEmailsAndSendResults() {
    // Set the search strings you want to look for
    var searchStrings = ["jobopportunityforyou", "ceipal","bullhornmail","jobdiva"];
    
    // Search for emails received in the last 7 days
    var threads = GmailApp.search('newer_than:7d');
    
    // Initialize an empty results string
    var results = "";
    
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
          
          // If the search string is found in the raw content of the message, add the sender email address and subject line to the results string
          if (rawContent.indexOf(searchString) !== -1) {
            var from = message.getFrom();
            var subject = message.getSubject();
            results += "Email address: " + from + ", Subject: " + subject + "\n";
            break;
          }
        }
      }
    }
    
    // If results were found, send an email to the recipient containing the results
    if (results) {
      var recipient = "laura.creed@gmail.com"; // Replace with the email address of the recipient
      var subject = "Search Results";
      var body = "The following results were found:\n\n" + results;
      GmailApp.sendEmail(recipient, subject, body);
    }
  }