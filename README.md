# Obsidian_CustomPropPanel
Obsidian Plugin to show Properties in a side panel - featuring nested Props in Tables


This is my very first plugin - so please be aware and post any problems. 


# What is this for?
I was trying to find a good setup to use metadatamenu and meta bind in my Contact management. What i love about the properties that are possible with meta bind (a really amazing plugin!), are nested properties. I could link to another file, and add informations to it. Or build nested stuff like home and work adress, social media handles with different types etc - all neatly sorted and dynamic. 
But displaying them is impossible. I was playing around with callouts and all that kind of stuff. And dataview queries. But changing that in all my vaults files - migrating data from years of built up - it just does not work - or look good. And editing it is a mess in callouts. (i really dont like callouts) - and when you want to change something later ... uff no thank you. 

so now i built this plugin to show data from properties in a side panel, that i can neatly organize and style to my liking. filtering by tag or folder (or both) to show data stored away in the properties. and i can force a certain sort, hide props i dont need on a daily basis and make it overall look better than in plain text or YAML. it also does not matter if the yaml is sorted different - the panel always looks the same. 


# setup
please make a backup of your vault. i dont think that i wrote code that could destroy anything, but just to be sure!!

download custom-prop-panel and place it in your plugins folder, activate in community plugins after restart. 

in the settings you can set a tag, a folder or both to filter files. 
then under the properties settings choose one of the files that has the properties in the YAML (it only reads YAML, no inline props) and read in all the properties. 
YOu can now rearrange by drag and drop, show or hide the key as headers, show or hide headers for nested properties. set links as image, show or hide properties all together or even delete if you never use them. (this will not delete the properties in the files, just in the settings for teh panel)

currently the styles are inside the main.js ... i want to get them back out into a separate css later. it was just more convenient for programming this way. so style is not very nice right now


# things i want to add
- if data is not set, i want to add a little "+" to input it quickly through a modal.
- correct interpretation of phone numbers - even with spaces
- display dates as links to daily notes
- maybe even include the metadatamenu options to set a field ... i need to look into how to include that - that would be great i guess.
- better style sheet and direct access to it through setting?

# tell me what you think!
