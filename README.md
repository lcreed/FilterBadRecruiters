# FilterBadRecruiters


FilterBadRecruiters is a [Google Apps Script](https://developers.google.com/apps-script/) that processes new messages looking for unwanted email from known third party recruiters.  When a match is found, a reply is sent informing the sender that the message is being reported as spam and will not be read. The script then logs matches to a spreadsheet and updates a pie chart displaying what percentage of these type of messages were sent from each domain. 

The script fetches the list of known third party recruiters and the contents of the email reply message from URLs specified in the [script variables](./userVariables.md).  You can easily modify these URLs to point to your own data or use mine.  

![Google Apps Script Gmail Management](https://img.shields.io/badge/Google%20Apps%20Script-Gmail%20Mgmt-orange)
## Features

* Searches your gmail account for messages that meet the search criteria, looking for sender domain matches against a list of known bad third party recruiters. 
* Searches the email headers of messages not matched to a known recruiter for a string indicating they were sent "via" a known shotgun approach mailing list service.
* Applies a label to message(s) that meet the criteria, reports the message(s) that meet the criteria as spam, sends an automatic reply, and outputs details of the message to a reporting spreadsheet,  
    * The spreadsheet is created if it doesn't exist.
* Messages that do not match the criteria are cached so they are only checked every six hours.  **However, if the number of new known recruiter domains or via domains change from the last time the script runs, the cache is cleared so that all messages in the search range are checked for the new domains.**
* The reporting spreadsheet also contains a chart tab where a pie chart displays what percentage of all the logged messages were sent from each domain.
* The script can easily be customized by changing variables to do things like use a different list of known bad third party recruiters, a different canned reply, or a different search range.  
* When run, the script creates some variables in the user section of the built in script properties that are specific to your user account.  These properties include the current version of the script you are using and the identifier of the spreadsheet in your Google Drive folder once it has been created.

## How a Bad Third Party Recruiter is Defined

Recruiter domains that send messages matching any of the following criteria qualify for the [Known Bad Recruiter domain list](./data/KnownBadRecruiters.txt):

* Sends unsolicited job postings that clearly do not match your current skills or experience
* Uses an email service mailing list for spamming thousands of candidates in an attempt to farm resumes.  _These services sometime use names, email addresses and phone nuumbers obtained from an illegal data breach including the ones inflicted on monster.com and LinkedIn._  
* Asks for editable copies of your resume and sometimes private data like your social security number.
* Attempts to follow the messages unsubscribe instructions have been futile.


## Implementation and Configuration

* [Install the Public version of the script](Install_Public.md) - This option is not editable and will default to the criteria in the Publicly available library version of the script.  User specific details like the identifier of the Google Drive reporting spreadsheet and the caching of your processed messages are only accessible by the script when run by you.
* [Install Your Own Copy of the Script](./Install_User.md) - This option allows you to  modify the script to use your own criteria.  
    * [Customizing the Script Configuration](./userVariables.md)


## Known Issues
None as of 3/27/2023

## New Features
Hit the Watch button to be notified of updates.  This release has been entirely rewritten from the original release.  It includes a number of new error checks and functionality like reporting.

## Future Plans

* Optional feature: automate submitting domains that aren't in the current known bad recruiter list that are using a "via" domain.  This would probably involve a post of a web form that then updated a spreadsheet.  I could then verify new entries on the sheet and add them to the current list.
* Optional feature: automatically file Federal Trade Commission complaint on domains that spam a user with more than x number of messages.  
* Optional feature: Attempt to automatically unsubscribe every time a known domain message is received.  

## License
The contents of this repository are furnished free for personal use.  

## Feedback
I welcome feedback and will happily add any relevant domains you have to the [bad recruiter list](./data/KnownBadRecruiters.txt).  


## Buy me a tea

If you find any of my work useful and would like to send a donation, you can use any of these options:

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg?logo=paypal&style=for-the-badge)](https://www.paypal.com/donate/?hosted_button_id=N3F3NR73HUAQJ)
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/S6S1JNPTO)
[![Donate using Liberapay](https://liberapay.com/assets/widgets/donate.svg)](https://liberapay.com/lcreed/donate)
