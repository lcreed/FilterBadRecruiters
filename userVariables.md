# User Variable Guide

The Filter Bad Recruiter script contains a number of variables that can be used to customize its behavior.  The table below describes the purpose of the variables included that can be changed.  Feel free to modify them to suit your needs.  The script will function as is but will use the criteria specified unless you modify the values.

To locate the variables, open the script in your favorite text editor and search for the variable name.  Only change the variable declaration's value.  I.e.  
_const myVariable = **"this is the value"**_

## Variables
_Notes:_  
* If a variable isn't listed here, make sure you understand its purpose before modifying.
* The URLs must be accessible globally without the need to pass credentials in order for the script to read them.
* Strings must be in quotes.  

### Variables Used to Configure the Script
These variables are all found in the function getConfigVars 

| Var Name  | Value | Description |
| ------------- |:-------------|:-------------|
| urlCannedResponse| URL | URL of a text file that will be used to reply to all matched emails|            
| urlRecruiterDomains | URL | The URL points to a text file that contains a list of domains for which the script should search. Each line of this file must contain a single domain. I.e. <br> domain1.com<br>domain2.com<br>domain3.com |
| badRecruiterMsgLabel | BadRecruiterSpam | This label will be applied to all matched messages.  If it doesn't exist in your gmail account, it will be created. |
| searchRange | "newer_than:7d" | This can be ANY [valid gmail search string](https://support.google.com/mail/answer/7190).  I.e. <br>"newer_than:6h"<br>"after:2020 before:202/01/15 in:inbox"  |
| viaDomains | string array | <p>List of strings to search for in the email headers.  The purpose of this is to help identify emails sent by third-party recruiters who use well-known services to send messages to a large number of recipients. Some of these services acquire email lists from data breaches such as Monster.com and LinkedIn.com. Most recruiters who use these services are considered "resume farms." They may request an editable version of your resume and submit it to job openings using someone else's contact information.<p>You can use this list to identify strings that were added to your email address when you signed up for one of these breached sites. For instance, if you registered at Monster as youremail+monsterspam@gmail.com, you can add "monsterspam" to the list of strings to catch emails using that address. However, you should only do this if you do not expect to receive any legitimate emails at that address.  |

### Variables Used to Configure the Script's Reporting
These variables are all found in the function getReportVars

| Var Name  | Value | Description |
| ------------- |:-------------|:-------------|
| emailReport | false | <p>If this value is set to true, you will receive an email each time the script runs and detects an email from a third-party recruiter. This will likely result in receiving an email every time a recruiter sends you a message, informing you that you have received a spam recruiter message.<p>While this feature can be useful for troubleshooting and testing purposes, it is recommended to keep it set to false. |
| subject | string | Used only for email reporting. |
| reportBodyHeader | string | Used only for email reporting. |
| driveFldrName | "FBRReports" | This is the name of your drive folder where the reporting spreadsheet will be saved |
| driveSSTitle | "FBRHistoricalRecord" | This is the name that will be assigned to the spreadsheet used for reporting. |
| driveSSTabName | "Log" | The name of the tab in the spreadsheet that will contain data about the email matches found by the script |
| driveSSChartTab | "Chart" | The name of the tab where a pie chart will display a graphical presentation of the percentage of third party recruiter spam by domain. |
| reportSheetID | empty string | Used for conditions where you already have a spreadsheet that is properly formatted to accept the data the script adds.  You should not use this unless you understand the code.  |


