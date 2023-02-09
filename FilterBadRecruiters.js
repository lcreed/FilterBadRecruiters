// this is version 2 .  Future plans
// * experiment with wildcards in domain names

function moveThreadsToSusSpam() {
   var domains = [
      'ageatia.us',
      'agreeya.com',
      'akraya.com',
      'amiseq.com',
      'ampcus.com',
      'applabsystems.com',
      'artech.com',
      'artechinfo.com',
      'avanciers.com', // added 2/8/23
      'bravensinc.com',
      'canopusitsolution.com',
      'ceipal.com',
      'clifyx.com',
      'clouddestinations.com',
      'compunnel.com',
      'consultreellc.com',  // added 2/7/23
      'corpbizsolutions.com',
      'cynetsystems.com',
      'denkensolutions.com', // added 2/6/23
      'diamondpick.com',
      'diversant.com',
      'diverselynx.com',
      'e-solutionsinc.com',
      'emonics.com',
      'enterprisesolutioninc.com',
      'eteaminc.com',
      'exaways.com',
      'expediteinc.com', // added 2/8/23
      'futransolutions.com',
      'genesis10.com',
      'georgiait.com',
      'globalpharmatek.com',
      'gttit.com',
      'hanstaffing.com',
      'harveynash.com',
      'hiretalent.com',
      'ibusinesssolution.com', //added 2/7/23
      'iconma.com',
      'idctechnologies.com',
      'imcsgroup.net',  // added 2/8/23
      'insigmainc.com',
      'intelliswift.com',
      'mastechdigital.com>',
      'mindtree.com',
      'msrcosmos.com',
      'navitassols.com',
      'net2source.com',
      'nlbtech.com', // added 2/6/23
      'norwintechnologies.com',
      'nttdata.com',
      'pamten.com',
      'paramountsoft.net',
      'plaxonic.com',
      'pyramidci.com',
      'quantumworld.us',
      'randstadusa.com',
      'resource-logistics.com',
      'risamsoft.com',
      'rulesiq.com',
      'sales.qspinfotech.net',
      'sigconsult.com',
      'smartitframe.co',
      'softpath.net',
      'sohosqs.com',
      'spectraforce.com',
      'sumerusolutions.com',
      'sunrisesys.com',
      'talentburst.com',
      'tanishasystems.com',
      'techaffinity.com',
      'techdigitalcorp.com',
      'techgene.com',
      'tekfortune.com',
      'thedignify.com',  // added 2/8/23
      'tridentconsultinginc.com',
      'ubsolutions.com',
      'usgrpinc.com',
      'usmsystems.com',
      'v2soft.com',
      'vastika.com',
      'vbeyond.com',    
      'vdartinc.com',
      'veteranssourcinggroup.com',  // added 2/8/23
      'vitsus.com',
      'zodiac-solutions.com'
  ]; // list of domains to filter

  var label = GmailApp.getUserLabelByName("# SusSpam/BadRecruiter");
  if (!label) {
    label = GmailApp.createLabel("# SusSpam/BadRecruiter");
  }

  var logs = [];
  var threads = GmailApp.search("newer_than:7d");
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var messages = thread.getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      var from = message.getFrom();
      for (var k = 0; k < domains.length; k++) {
        if (from.indexOf(domains[k]) !== -1) {
          thread.addLabel(label);
          // thread.markRead();
          // thread.moveToArchive();
          // added next line to test
          GmailApp.moveThreadToSpam(thread);
          logs.push("Subject: " + thread.getFirstMessageSubject());
          // Utilities.sleep(1000);
        }
      }
    }
  }

  if (logs.length > 0) {
    Logger.log("The following threads were moved to the # SusSpam/BadRecruiter label, maoved to spam, and logged:");
    Logger.log(logs.join("\n"));
  } else {
    Logger.log("No threads were moved to the # SusSpam/BadRecruiter label, moved to spam, and logged.");
  }
}
