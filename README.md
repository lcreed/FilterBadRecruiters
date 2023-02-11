# FilterBadRecruiters
Google Apps Script to send junk recruiter email to spam 

## How to Install

### Prerequisites
This works with Google's GMail account and the Gmail API.  If you don't use Gmail, this script will do nothing for you.

### Implementation

1. Navigate to the following link from your browser:  [Google App Scripts Home](https://script.google.com/home)  
2. Click the New Project button  
3. Open a second tab on your browser and navigate to the [FilterBadRecruiters raw JS page](https://raw.githubusercontent.com/lcreed/FilterBadRecruiters/main/FilterBadRecruiters.js) on Github  
4. Copy the entire contents of the raw java script tab onto the clipboard 
5. Switch back to your Apps Script tab and select all the text in the body of the editor
6. Paste the contents of the clipboard into the apps script editor. This should completely replace the previous contents with the new script.  
![Example!](./media/newPaste.png)  
7. Click on the Untitled Project name at the top of the page and give your new project a name before clicking Rename.  
![Example!](./media/renameProject.png) 
8. Click the save project icon.   
![Example!](./media/saveProject.png)  

The script is now implemented in your Google Workspace.  You can modify it anyway you choose including to use your own canned response / filter list or use mine.  When you are ready to test the script, click the Run icon.  The first time you run the script you will be prompted to authorize it to access your Gmail data.  Before authorizing any script, read through it to determine what it will be doing.  For this script, you can review the workflow portion below and match it to the actual javascript.

To authorize,
1. Click Review permissions
2. Choose your Google sign in account
3. Because the copy you pasted isn't verified by Google, you will need to click the advanced link and then the link to Go to your project name.
4. Click Allow

The script will then run and flag as spam any messages from the current domain lists.  You can find these messages in your spam folder.

In order to setup the script to run automatically, you'll need to create a trigger.  

### Create a Triggre to run the script on a schedule

Note:  Unfortunately I can find no way to trigger the script to run when new mail arrives.  Google also restricts how many times the script can run in specific periods.  

To prevent issues, my trigger is set to run the script every hour.  To replicate that setup, click the Trigger icon that looks like an alarm clock.  
![Trigger Icon](./media/triggerIcon.png)  
In the lower right corner of the screen, click the Add Trigger button.  The default dialog will appear.  If you want the script to run hourly, simply click the save button.


## Workflow

when run, it does x, y and z

## New Features


| Date |Update  |
| ------ | ------ |
| 2/9/2023 |Implemented read of domain list from external site  |
| 2/10/2023 | Added canned reply |


## Future Plans

* Allow wildcards in domain list
* Turn the path to fetched files into a variable to make it easier to change for other users
* Turn the label into a variable.  Perhaps make it optional.  Currently used to see what messages were hit by the script



## Buy me a tea

| Paypal |Others  |
| ------ | ------ |
| [![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=N3F3NR73HUAQJ) | something here