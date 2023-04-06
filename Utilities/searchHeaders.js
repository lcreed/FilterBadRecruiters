/*
Simple script for searching for strings in email headers.  
Modify the searchRange and searchString variables to match your needs
*/
function searchHeaders() {
  /*
  steal logic from fbr script to search headers for possible new via domains like amazonses
  to confirm that only bad recruiters are using them and not regular spammers
  */

  // search header for this string:  spf=fail
  var searchRange = "in:spam newer_than:1y";
  var resultsData = [];
  var threads = GmailApp.search(searchRange);
  var searchString = "onmicrosoft"

  for (var i = 0; i < threads.length; i++) {
      // Get the first message in the thread
      var message = threads[i].getMessages()[0];
      var bootMessage = false;
      var headers = message.getRawContent().split('Content-Type:')[0].trim();
      if (headers.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
          var sender = message.getFrom().replace(/^.+<([^>]+)>$/, "$1").toLowerCase();
          resultsData.push([
              message.getDate(),
              sender,
              message.getSubject()
          ]);
      }
  }
  Logger.log("The search string: " + searchString + " was found in the following messages:\n" + resultsData.join("  "));
}
