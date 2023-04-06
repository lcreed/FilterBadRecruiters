/* 
search message headers in a range that contain a via domain string.  forward the matches
as attachments to the abuse reporting email address of that via domain.  Include the canned message specific
to that via domain

When integrated, this should pass the via domain string and the message id 
The script should then identify the proper reporting text and email to use to forward the message in an abuse report

*/

function abuseReport() {

    // search header for this string:  spf=fail
    var searchRange = "in:spam newer_than:1y";
    var resultsData = [];
    var threads = GmailApp.search(searchRange);
    var searchString = "ceipal"
  
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