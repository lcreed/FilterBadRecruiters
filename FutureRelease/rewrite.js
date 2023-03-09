function getVars(varName) {

  const scriptConfig = {
      // This is the text file that is sent in a reply to those on the bad recruiters domain list.
      urlCannedResponse: "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiterReply.txt",
      // This is the list of known bad domains that the script will search for.  The script expects this list to
      // have one domain per line.
      // urlRecruiterDomains: "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiters.txt",
      urlRecruiterDomains: "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/FutureRelease/wonkyRecruiterlist.txt",

      // This label is applied to the recruiters in the known spammers domain list
      // if it doesn't exist, the script will attempt to create it.
      badRecruiterMsgLabel: "# SusSpam/testing",

      // The searchRange variable defines the range of time to search your messages.  I.e. only search messages received in the last week 
      searchRange: "newer_than:7d",
      // searchRange = "After:2020/10/15";

      // ----------------------------------------------------------------------------------------------------------------------
      // These variables apply to messages from recruiters outside of the known bad recruiter domain list
      // These recruiters are using a known mailing list service listed in the viaDomains variable.
      viaDomains: ["jobopportunityforyou", "ceipal","bullhornmail","jobdiva","monsterspam","brassring"],
   
      // This label is applied to mail from via domains that are from agencies NOT in the known bad recruiter list
      newBadRecruiterMsgLabel: "# SusSpam/testingVia",
  };

    // The following variables are only used if email reporting is enabled
  // emailReport must be set to true if you want to receive an email report when the script runs and identifies spam
  const reportConfig = {
    emailReport: false,
    // This sets the email address of recipient to the person who owns the running script. 
    recipient: Session.getActiveUser().getEmail(),   // This is your email address
    // This sets the subject of the email report
    subject: "Filter Bad Recruiters:  Results",
    // This line precedes the list of bad recruiter spam messages identified by the script
    knownDomainsHeader: "The following messages from known bad recruiters were found:\n\n",
    // This line precedes the list of spam messages received from via domains and are from agencies NOT in the known bad recruiter list
    viaDomainsHeader: "\n\nThe following messages were received from known via domains and are from domains not currently in the known bad recruiter list:\n\n"  
  };


  // ----------------------------------------------------------------------------------------------------------------------
  // Code section:  Don't change anything below this line unless you know what you're doing.

  // The badRecruiterDomains is created by retrieving the raw contents of the bad recruiter domain text file from the web.  The
  // contents of the script are converted to lower case, and split into an array by return character.  Next the extra spaces are
  // removed from each item in the array and each item is checked to confirm it contains a string and isn't just a blank line

  // var badRecruiterDomains = UrlFetchApp.fetch(scriptConfig.urlRecruiterDomains).getContentText().toLowerCase().split("\n").filter(Boolean);
  var badRecruiterDomains = UrlFetchApp.fetch(scriptConfig.urlRecruiterDomains).getContentText().toLowerCase().split("\n").map(function(domain) { return domain.trim(); }).filter(Boolean);

  if (badRecruiterDomains.length < 1) {
    throw("The " + scriptConfig.urlRecruiterDomains + " file that should contain a list of known bad recruiter domains appears to be empty, unreachable, or formatted incorrectly")
  };



 // Logger.log(badRecruiterDomains);

  // Logger.log("\nprint knownBadRecruitersLC:\n" + knownBadRecruitersLC[1]);


  // things to ensure are checked
  // each recruiter domain is valid and not blank
  // sender email is lowercased and the domain list is lower case function to convert and validate the domain list
  return varName
}

function checkForKnownBadRecruiters(message, badRecruiterDomains) {
  // check the message and return true if it contains any of the known bad recruiter domains
  // return false if it does not contain any of the known bad recruiter domains

}

function checkForNewBadRecruiters(message, viaDomains) {
  // check the message and return true if it contains any of the known via domains
  // return false if it does not contain any of the known via domains
}

function reportResults(message, knownBadRecruitersLC, knownBadRecruiters, newBadRecruitersLC, newBadRecruiters) {
  // report the results of the script to the email report
  // email report must be set to true if you want to receive an email report when the script runs and identifies spam  
}

function processMessages() {
  // process messages
  // get script config object
  // for loop through each thread in the search range and get the first message in the thread
  // if checkForKnownBadRecruiters(message, badRecruiterDomains) is true then 
  //   do the things to the message like apply label, reply, send to spam.  Maybe do this with yet anotehr
  //  function
  // else checkforNewBadRecruiters(message, viaDomains)
  //   do the things to the message like apply label, reply, send to spam.  Maybe do this with yet anotehr
  // report here or in a different function?  only have to pass the object name
  // don't forget to add the message id to the cache
  getVars(badRecruiterDomains);
  Logger.log(badRecruiterDomains);  


}