# NJMM Facebook Tweaks

NJMM Facebook Tweaks is an assorted set of tools to make Facebook Proselyting safer and more effective for missionaries in the New Jersey Morristown Mission of the Church of Jesus Christ of Latter-day Saints.

It adds tools that help avoid distractions involving images and videos, that help accelerate the adding/removing of friends, accelerate the clearing of sent friend requests, and other tweaks to make proselyting easier.

## Motivation
This project was designed because there are many parts of Facebook Proselyting which can be laborious or even dangerous for the missionary. President Hess asked for a profile-picture-hiding feature. The button-pressing features were designed for two purposes--first, to increase missionary productivity, and second, to provide an incentive to use the profile-picture-hiding feature. Other features came as a matter of convenience. 

For a more complete history see the [history section](#history).


## How to use?
For add-on installation instructions on a Missionary Device, please see [the Google Doc Instructions](https://docs.google.com/document/d/1kUkHjOrEi5VA7i--fU8NDWsYWsXIjio2my3_EprIk6Q/edit?usp=drivesdk). This will eventually be duplicated here for convenience. 


## Features
The NJMM Tweaks adds a variety of tools to Facebook within the firefox browser to assist in online proselyting. These features include:

- Automatically hiding profile pictures, and (optionally) newsfeeds, videos, and all other images

- A new way of searching for potential friends

- Automated sending of friend requests

- Automated friend request clearing

- Automatically unfriending of people based on user-defined filters

- Some cosmetic adjustments


## Screenshots
Include logo/demo screenshot etc.


## History

# Developer Stuff

## Code style
Please try to match the coding style and especially comment style for each function and individual lines. This is passed down so frequently that code needs to be thoroughly explained. Remember, code written 6 months ago is indistinguishable from code written by someone else. Focus more on the *WHY* rather than the *HOW* of algorithms and functions.

## Add-on Organization

The Mozilla Developer Network will be your best friend as you dissect the Add-on. It has documentation for the Add-on technology, Javascript APIs, HTML, CSS, etc…. 

### manifest.json
Within the root directory, there is a crucial file called "manifest.json", this outlines the skeleton of the Add-on. This defines many things for the browser, including:

- Tell the browser to inject certain contentScripts (scripts that are injected in the scope of the webpage) and css files into all webpages within the facebook.com and messenger.com domains

 - injectAllPages.js is injected into all pages. This does the image blocking and other cosmetic changes. 
 
 - If it detects buttons that could be pressed, it will automatically inject the other script (newScript.js) which handles automated button-pressing.
 
- Define the content security policy. It currently allows jQuery (and anything else, I suppose) from ajax.googleapis.com

- Declare which browser permissions the Add-on needs to run its functions. These are approved by the user at install.

- Define the update_url, i.e. where the browser should automatically check for updates. This is currently linked to a publicly shared folder on Google Drive. Firefox checks for add-on updates every run (on desktop) or once daily (on mobile). If you are clever with about:config in Firefox for mobile, you can make it update upto every 2 minutes.

- Define the "Browser Action", which is just a button on the browser toolbar (on desktop) or the browser menu (on mobile). It is attached to an html page that is opened in a popup window.

- Define the "Page Action", which is just a button on the URL bar (omnibar) (on desktop) or the browser menu (on mobile). It is attached to an html page that is opened in a popup window.

- Define the Options page which is loaded when looking at the add-on's options on about:addons

- Tell the browser to run an (invisible) background page that runs background.js, which allows the contentScripts (which normally cannot access most browser APIs) to indirectly access said functions.

### background
The background directory contains one file (*background.js*) which is a [javascript run in a background context](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Background_scripts). It exists, because it has full permissions to all browser APIs that the addon has permission for. Content Scripts, however, do not. Content Scripts are able to [use the messaging APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#Communicating_with_background_scripts) to send messages to the background scripts, which can in turn run otherwise unaccesible APIs. Background scripts, on the other hand, have no access to page data.

The only currently implemented use of this dichotomy is with *injectAllPages.js*. It checks all pages on the facebook.com and messenger.com domains if there are "Add", "Undo", "Unfollow", or "Cancel" buttons. If one is detected, it asks the background page to inject *newScript.js* which controls the automated button pressing functions. This prevents a lot of screen-real spam.

### contentScripts

[Content Scripts](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Content_scripts) are javascripts injected into a web page that can manipulate and access page data. They run in a similar scope as scripts in the web page itself. See the link to see the more subtle differences between content scripts and page scripts.

#### injectAllPages.js
injectAllPages.js has multiple responsibilities.

1. Hide all profile images (i.e. changes them to another image).
			
2. Optionally hides the Newsfeed, Videos, and all other images, based on what the configurations saved in the browser storage.
			
3. Changes the Header Color of the facebook page to match the configuration in browser storage.
			
4. Check if there are add-buttons on the page. If so, ask background.js to inject newScript.js into the page.
			

#### newScript.js

This is the script that does all the magic that most users are aware of. This is also the script that is usually the culprit if the users find an error. It does most of the interfacing with facebook that is noncosmetic. It's complete function and feature lists are explained more indepth internally, but its primary responsibility is to allow the user to automatically press Add/Undo/Unfollow buttons on the facebook website.

### css
These store the stylesheets that are used in the Addons.

#### masterCSS.css 
This stores the bulk of most random, custom styles. It's injected into every facebook.com and messenger.com page, by default.

#### extension.css
Elder Berrett plays with this one to make the popup look cooler.

#### options.css
This is the default firefox CSS sheet that matches the browser UI.

### friendFilter
These are the friendFilter Tools. They are inspired by [*Search is Back!*](https://searchisback.com/), and work similarly to that webpage, with some distinct differences. The HTML page is the webpage. The CSS is its corresponding CSS. The JS is used by the page to work. Further documentation is available in those files.

### icons

These are the icons and photos that are used.
[border_big_plain.svg](icons/border_big_plain.svg) is the icon for the addon, courtesy of Elder Reyes.
[h.jpg](icons/h.jpg) is the easter egg photo to change profile pictures to.
[prof.png](icons/prof.png) is the default picture that we will change all profile pictures to.

### options
This is the options UI. It is loaded into both the BrowserAction popup and the Options UI on the about:addons page. This page allows the user to set many different configuration settings, such as their Favorite Color (which adjusts the facebook header bar color), whether to block all images, videos, and/or newsfeed, and also allows for some advanced options. This uses *a lot* of [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), so be prepared to read those.

### popup
This is the [popup](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Popups) that is triggered by the Browser Action and the Page Action.

#### popup.html
This is a menu with two panels. The first panel "Features" is a list of features (aptly named). The second, "Options", is simply an iframe that loads [](/options/options.html).

The "Features" panel has a bunch of menu items (class "panel-list-item"), which each contain an icon (which we cheated and simply made an emoji, a type (which is either "url", "urlscript",  "script", or "errorreport"), and a value (which is a link, if such is applicable). It was easier to embed these directly into the html than to try and put it in the javascript.

#### popup.js
popup.js does the appropriate action, depending on the type of item pressed on the list. It also has all of the functions necessary for generating error reports that are sent via email. There are a bunch of vestigial functions that are useful for obtaining the html of the page, but I realized that the email mailto protocol has a character limit far less than the html of any page. Perhaps they'll be of use to some future programmer at a later date.
 
### Other Stuff

#### .github and .gitignore
These only make things more convenient for working with github.

#### README.md
This is is this document. It is written in [Markdown](https://guides.github.com/features/mastering-markdown/).

## Tests
Unit tests will be written and engineered at a later date. Currently, we're not familiar enough with the technologies to know how to even approach automated testing.

## Development Environment
While theoretically, any IDE/code-editor could be used, we (as of December 2018) have been simply using github's built in code editor to write code. We test said code manually via the [Firefox Developer Tools](about:debugging) on a desktop computer. [Other helpful tools](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Development_Tools) exist for desktop. Maybe at some future date some brilliant programmer can either find or write a good in-browser IDE that will work on a Missionary device. Thus far, we've never had time. We've also never had the gumption necessary to petition the missionary department for one.

### Using about:debugging
The about:debugging page is [one of the greatest tools](https://developer.mozilla.org/en-US/docs/Tools/about:debugging) for testing the add-on on firefox. Use the link above to learn about its features.

## Publishing and Distributing the Add-on (i.e. "Pushing to the Mission")
The add-on needs to be [properly signed](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Distribution) in order for Missionary Devices to install any update. The version also needs to be logged on a file called [UpdateManifest.json](https://drive.google.com/open?id=11AA_8WuEknEfshXYA_ceonmfwmSONGQm) on the njmm.it@gmail.com Google Drive.  This is necessary, because the official [Firefox Add-on System](https://addons.mozilla.org/en-US/firefox/) is blocked on Missionary Devices (understandably). We're planning on eventually moving that to a more secure/controlled location.

In some missions (such as the NJMM), Google Drive is blocked by the web-filter on Firefox, but that is easily circumvented using a slightly modified link ("https://docs.google.com/uc?export=download&id=[INSERT GOOGLE FILE ID HERE]"). As far as we can tell, this cannot be abused for nefarious purposes, and it came via revelation, so we'll roll with it.

Missionary Devices automatically update all Firefox Add-ons at least once a day when Firefox is opened. Playing with some settings in [](about:config) can make that refresh time as small as two minutes. Figuring out how to do so is left as an exercise to the reader.

NOTE: Changing the permissions that the add-on requires forces the user to manually accept updates. On Desktop, there is a notification that pops up, but on Firefox for Android, there is no such notification. Avoid changing requested permissions when possible.

### Packaging the Add-On
1. Download the add-on, either via [Github Desktop](https://desktop.github.com/) or via the "Clone or Download">"Download Zip" buttons on https://github.com/njmm-it/NJMM-Tweaks/.

2. Decompress the zip file (if downloaded as such), and select everything in the root directory, and recompress. [Follow this link for more details](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Package_your_extension_)

### Uploading the Add-on to *Add-on Developer Hub* for Signing.
Signing the Add-on can only occur via the [*Add-on Developer Hub*](https://addons.mozilla.org/en-US/developers/).

1. Sign in with an account that is listed as a developer on [the add-on page](https://addons.mozilla.org/en-US/developers/addon/1b8e09f297e74b1d9ab6).

2. Navigate to the [the add-on's page](https://addons.mozilla.org/en-US/developers/addon/1b8e09f297e74b1d9ab6).

3. Click the ["Upload New Version" button](https://addons.mozilla.org/en-US/developers/addon/1b8e09f297e74b1d9ab6/versions/submit/) on the left column.

4. Follow the instructions to upload a new version for [**self-distribution**](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Distribution/Submitting_an_add-on#Self-distribution).

5. The website will have you download a new .xpi file, which is the signed add-on. Now when we try to install it, Firefox will recognize it as a safe add-on and will not reject it.

### Uploading the Signed Add-on to *Google Drive*
After downloading the signed Add-on, now it must be uploaded to Google Drive for distribution to missionary devices.

1. Sign into some Google Drive account with access to the [*Released Builds*](https://drive.google.com/drive/folders/1Rw31__uofyJXetBuQwa_Qup-iryx-DVb) folder.

2. Upload the signed addon .xpi file, from Mozilla's Add-On Developer Hub, to that folder.

3. Right-click, and click "Get Sharable Link"

4. Currently, the link is formated like "https://drive.google.com/open?id=1GrfWxqpR_vgX2QZIJYc1ZTi2DBzSTKyF", where "1GrfWxqpR_vgX2QZIJYc1ZTi2DBzSTKyF" is an example 33-character file ID. Take that ID, and make a new URL formated like "https://docs.google.com/uc?export=download&id=1GrfWxqpR_vgX2QZIJYc1ZTi2DBzSTKyF". This will be necessary.

5. Add a new JSON entry in UpdateManifest.json with the new "version" and "update_link" keys. Use the new URL from step 4 as the update_link value.

6. Change the link and version number in ["Firefox Add-on Installation Instructions"](https://docs.google.com/document/d/1kUkHjOrEi5VA7i--fU8NDWsYWsXIjio2my3_EprIk6Q), so that future users will automatically download the most recent version.

## Contribute
The easiest way to contribute, is to submit issues. This can be done on github directly, or via the "Send Bug Report" button in the NJMM Facebook Tweaks browser popup.

For Potential Developers, send an email to njmm.it@gmail.com, stating that you'd like to contribute. The current developer team will get back to you. Otherwise, you can create a fork.

## Credits
Give proper credits. This could be a link to any repo which inspired you to build this project, any blogposts or links to people who contrbuted in this project. 

- The Friend Filter was inspired by and modeled on [*Search is Back!*](https://searchisback.com/). Thank you Michael Morgenstern!

- The original Chrome Scripts were written by Elder Andrew P Sansom from the New Jersey Morristown Mission (NJMM) in early 2018.

- The original Firefox add-on was implemented by Elder Sansom with assistance from Elder Tyler Draughon (NJMM) in spring 2018.

- The original NJMM Tweaks logo (Missionary Shirt logo) was created by Elder Draughon.

- Elder Tyler Berrett (NJMM) provided many styling contributions and algorithm ideas.

- Elder Kai C. K. Reyes (NJMM) took over the project in December 2018 and also contributed multiple features.

- Our Holy Ghost provided the bulk of the algorithmic design and syntax correction. We were gifted a vision of what the tweaks should look like, and we put ourselves to work to make them  happen. Frequently, difficult problems were solved with direct revelation, and we learned javascript, html, and css via the Gift of Tongues more than any other thing.

> 9 And I said: Lord, whither shall I go that I may find ore to molten, that I may make tools to construct the ship after the manner which thou hast shown unto me?
>
>10 And it came to pass that the Lord told me whither I should go to find ore, that I might make tools. 
>>1 Nephi 17:9-10

## License
This add-on is licensed under the MIT License - see the [LICENSE](/LICENSE) for details.

