# FilterBadRecruiters
**Google Apps Script to send junk recruiter email that lands in your gmail account to spam**

I get dozens of messages a day in my GMail inbox from 3rd party recruiters trying to persuade me to send a "fresh" copy of my resume.  When they do include a job description, its often laughably out of line with my skills and experience.  At most, these incompetent spammers find a match on a single word and decide I belong in the group of however many people they're going to send the JD to.  Sometimes I ask them what the pay rate is and its always less than what I was making as a contractor in 2012.  Often these "opportunities" require you to be physically present in an office at least a few days a week. Something I'm not willing to do and they never pay relocation anyway. Not one email in the last two years from a third party recruiter has been a job I was interested in.  I realized I was wasting time every day reviewing what they sent, looking for some magic treasure that never appeared.  I started trying to figure out how to get rid of this spam.  

Initially, I followed the message's procedure every time to unsubscribe.  I noticed quite a few of the senders used a common mail site (jobopportunityforyou.com).  My guess is recruiters can pay to use this email list.  Unsubscribing has ZERO effect.  I have probably unsubscribed from net2source spam more than a dozen times and it still arives daily like the newspapers of yore. 

Next, I tried creating filters in Gmail itself.  Their filters have some pros and cons.  The pro is they are instant and process mail as soon as it arrives.  The cons include not being able to flag a message as spam, and having to create multiple filters because the sheer number of domains that need to be blocked exceed the string list.  Its just a pain.  

I wanted something that would flag a message as spam so that it will hopefully hit the Google algorithm that would result in these problem recruiter's email domains being flagged as spam for everyone.  As a nice to have, I wanted to be able to reply with a [GFY](https://letmegooglethat.com/?q=gfy+acronym) whenever they did message me.  This repo is how I solved my problem.  

## Implementation
[Install Procedure](./Install.md)

## Workflow

1. Fetches a file that contains a list of domains to be marked as spam from an external location.  (Github in the case of the default version of this script).
2. Fetches a file that contains a custom response message into a variable called *cannedResponse*. 
3. Splits the contents of the file by line and populates a variable array called domains.
4. Sets a label variable and creates the label in the user's Gmail account if it doesn't exist.  This label is set on all messages that come from one of the *domains*.  It is intended to be used as a refernce when reviewing your spam folder to determine what messages were placed there as a result of this actions of this script.
5.  Searches all the mail using the specified criteria, default is arrived in the last 7 days, and processes all messages that match.  
6. Checks all the matching messages from the previous step to see if they are sent from one of the domains listed in the domains variable or if the content of the message contains a via domain.  If matched, the script executes the following actions on the message
    * Add the specified label
    * Send the canned response via a reply
    * Mark the message as spam
    * Log message details to the scripts log output.
    * optionally sends email with report if matches are found

## New Features
Hit the Watch button to be notified of updates.

| Date |Update  |
| ------ | ------ |
| 2/9/2023 |Implemented read of domain list from external site  |
| 2/10/2023 | Added canned reply |
| 2/20/2023 | Changed some var names to make it more readable.  Also reworked so it would be easier for others to modify things for their own use. Cleaned up log output. |
| 2/22/2023 | ~~Improved logging and added functionality to allow email reports on matches at the user discretion.  Added checks for headers containing the via domains.  Via domain matches will go to spam and be reported.~~ Backed out change due to some new issues.  |


## Future Plans

* Allow wildcards in domain list
* ~~After searching new messages looking for matching known domains and message does not match from the list, also check headers to see if it was sent via a known spam domain.  If found, notify there is a new domain that needs to be added to the BadRecruiters list.  Wondering if there is a way to automate this opening a repo issue or alternatively email the recipient(s) that this domain needs to be added.~~
* ~~Turn the path to fetched files into a variable to make it easier to change for other users~~
* ~~Turn the label into a variable.  Perhaps make it optional.  Currently used to see what messages were hit by the script~~


## License
The contents of this repository are furnished free for anyone's personal use forever.  I welcome feedback and will happily add any relevant domains you have to the [bad recruiter list](./BadRecruiters.txt).  

## Additional Sources
Note: If you're looking for a list of domains that are UK specific, check out this repository  
*h/t [alaneyue](https://infosec.exchange/@alaneyue)*  


* [spammy-recruiters](https://github.com/drcongo/spammy-recruiter)

There are already several solutions I've run across on github for attempting to tackle this issue.  Here are some other resources you might be interested in:  

* [Detect Recruiter Spam](https://blog.waleedkhan.name/detect-recruiter-spam/)
* [recruiter-spam](https://github.com/jceloria/recruiter-spam)
* [gmailctl-recruiter-filter](https://github.com/skyzyx/gmailctl-recruiter-filter)



## Buy me a tea

| Paypal |BMAC  |
| ------ | ------ |
| [![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=N3F3NR73HUAQJ) | <a href="https://www.buymeacoffee.com/DigitalLaura" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

