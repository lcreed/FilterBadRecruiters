function checkEmailHeadersForSpoofing() {
    var searchRange = "newer_than:1y";
    var resultsData = [];
    var threads = GmailApp.search(searchRange);
    for (var i = 0; i < threads.length; i++) {
      var message = threads[i].getMessages()[0];
      var headers = message.getRawContent().split('Content-Type:')[0].trim().toLowerCase();
      if (headers.indexOf("spf=fail") > -1 || headers.indexOf("dkim=fail") > -1) {
          var sender = message.getFrom().replace(/^.+<([^>]+)>$/, "$1").toLowerCase();
          resultsData.push([
              message.getDate(),
              sender,
              message.getSubject()
          ]);
        Logger.log("Found email with failed SPF or DKIM signature: " + message.getSubject());
      }
    }
    Logger.log("Matches:\n" + resultsData.join("  "));
  }