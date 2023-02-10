function fetchTextFile() {
    var response = UrlFetchApp.fetch("https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/badrecruiterdomains.txt");
    var contents = response.getContentText();
    return contents;
  }
  
  var fileContents = fetchTextFile();

  // this is version 2 .  Future plans
// * experiment with wildcards in domain names

function moveThreadsToSusSpam() {
    var domains = [fileContents]; // list of domains to filter
 
 
   var label = GmailApp.getUserLabelByName("# SusSpam/BadRecruiter");
   if (!label) {
     label = GmailApp.createLabel("# SusSpam/BadRecruiter");
   }
 
   var logs = [];
   for (var k = 0; k < domains.length; k++) {
         if (from.indexOf(domains[k]) !== -1) {
           thread.addLabel(label);
           // thread.markRead();
           // thread.moveToArchive();
           // added next line to test
           GmailApp.moveThreadToSpam(thread);
           logs.push("Domain name tested: " + k);
           // Utilities.sleep(1000);
         }
       }
     }
   }
 
   if (logs.length > 0) {
     Logger.log("The following domains were checked:");
     Logger.log(logs.join("\n"));
   } else {
     Logger.log("No threads were moved to the # SusSpam/BadRecruiter label, moved to spam, and logged.");
   }
 }
 