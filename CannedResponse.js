// chatGPT solution for sending canned response

function sendCannedResponse() {
    // List of domains to respond to
    var domains = [    "example1.com",    "example2.com",    "example3.net"  ];
    
    // Canned response
    var cannedResponse = "Thank you for reaching out. I'll get back to you as soon as I can.";
    
    // Get all unread messages
    var unreadThreads = GmailApp.search("is:unread");
    
    // Loop through each unread message
    for (var i = 0; i < unreadThreads.length; i++) {
      var messages = unreadThreads[i].getMessages();
      
      // Loop through each message in the thread
      for (var j = 0; j < messages.length; j++) {
        var message = messages[j];
        
        // Check if the message is from a domain in the list
        if (domains.indexOf(message.getFrom().split("@")[1]) !== -1) {
          // Reply to the message with the canned response
          message.reply(cannedResponse);
          
          // Mark the message as read
          message.markRead();
        }
      }
    }
  }