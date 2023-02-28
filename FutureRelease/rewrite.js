function FilterBadRecruiters() {

    const scriptConfig = {
        // This is the text file that is sent in a reply to those on the bad recruiters domain list.
        urlCannedResponse: "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiterReply.txt",
        // This is the list of known bad domains that the script will search for.  The script expects this list to
        // have one domain per line.
        urlRecruiterDomains: "https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/BadRecruiters.txt",

        // This label is applied to the recruiters in the known spammers domain list
        // if it doesn't exist, the script will attempt to create it.
        badRecruiterMsgLabel: "# SusSpam/BadRecruiter",

        // The searchRange variable defines the range of time to search your messages.  I.e. only search messages received in the last week 
        searchRange: "newer_than:7d",
        // searchRange = "After:2020/10/15";

        // ----------------------------------------------------------------------------------------------------------------------
        // These variables apply to messages from recruiters outside of the known bad recruiter domain list
        // These recruiters are using a known mailing list service listed in the viaDomains variable.
        viaDomains: ["jobopportunityforyou", "ceipal","bullhornmail","jobdiva","monsterspam"],
     
        // This label is applied to mail from via domains that are from agencies NOT in the known bad recruiter list
        newBadRecruiterMsgLabel: "# SusSpam/NewBadRecruiter",
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

    // Process the list of known bad recruiters from the contents of the URL
    const knownBadRecruitersRaw = UrlFetchApp.fetch(scriptConfig.urlRecruiterDomains).getContentText().split("\n");
    const knownBadRecruitersLC = knownBadRecruitersRaw.map(knownBadRecruitersRaw => knownBadRecruitersRaw.toLowerCase()); 

    Logger.log("print knownBadRecruitersRaw:\n" + knownBadRecruitersRaw);

    Logger.log("\nprint knownBadRecruitersLC:\n" + knownBadRecruitersLC);


    // things to ensure are checked
    // each recruiter domain is valid and not blank
    // sender email is lowercased and the domain list is lower case function to convert and validate the domain list
  }
  