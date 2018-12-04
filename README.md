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
Automatically hiding profile pictures, and (optionally) newsfeeds, videos, and all other images
A new way of searching for potential friends
Automated sending of friend requests
Automated friend request clearing
Automatically unfriending of people based on user-defined filters
Some cosmetic adjustments


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
The background directory contains one file (*background.js*) which is a [javascript run in a background context](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Background_scripts). It exists, because it has full permissions to all browser APIs that the addon has permission for. Content Scripts, however, do not. Content Scripts are able to use the messaging APIs to send messages to the background scripts, which can in turn run otherwise unaccesible APIs. Background scripts, on the other hand, have no access to page data.

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

## Code Example
Show what the library does as concisely as possible, developers should be able to figure out **how** your project solves their problem by looking at the code example. Make sure the API you are showing off is obvious, and that your code is short and concise.

## Installation
Provide step by step series of examples and explanations about how to get a development env running.

## API Reference

Depending on the size of the project, if it is small and simple enough the reference docs can be added to the README. For medium size to larger projects it is important to at least provide a link to where the API reference docs live.

## Tests
Unit tests will be written and engineered at a later date.


## Contribute
Let people know how they can contribute into your project. A [contributing guideline](https://github.com/zulip/zulip-electron/blob/master/CONTRIBUTING.md) will be a big plus.

## Credits
Give proper credits. This could be a link to any repo which inspired you to build this project, any blogposts or links to people who contrbuted in this project. 

- The Friend Filter was inspired by and modeled on [*Search is Back!*](https://searchisback.com/). Thank you Michael Morgenstern!


#### Anything else that seems useful

## License
A short snippet describing the license (MIT, Apache etc)

MIT © [Yourname]()

