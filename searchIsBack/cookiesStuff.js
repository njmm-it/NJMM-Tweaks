// add names from cookie

function addnametoselects(fid,name) {
	$('select[fillpeople=true]').each(function() {
		var thisselectbox = $(this);
		var addtoline = '';
		var addtoendofline = '';
		if (typeof thisselectbox.attr('fillpeopleadd') != 'undefined') addtoline = thisselectbox.attr('fillpeopleadd');
		if (typeof thisselectbox.attr('fillpeopleaddafter') != 'undefined') addtoendofline = thisselectbox.attr('fillpeopleaddafter');
		if (typeof thisselectbox.attr('formatfillpeople') != 'undefined')
			thisselectbox.find('option:last-child').before($("<option></option>").attr("format",thisselectbox.attr('formatfillpeople').replace('%fid',fid)).attr("value",fid).text(addtoline + name + addtoendofline)); 
		else
			thisselectbox.find('option:last-child').before($("<option></option>").attr("value",fid).text(addtoline + name)); 
	});
}

namescookie = {};

if (typeof Cookies.get('names') != 'undefined') {
	namescookie = JSON.parse(Cookies.get('names'));

	// clean up the mess
	for (var i in namescookie) {
	  if (namescookie[i] === null || namescookie[i] === undefined) {
	  // test[i] === undefined is probably not very useful here
		delete namescookie[i];
	  }
	}
	
	if($.isArray(namescookie)) namescookie = {};

	if (typeof namescookie != 'undefined') {
		// iterate over all select boxes
		$.each(namescookie, function(fid, name) {
			addnametoselects(fid, name);
		});
	}
}
else {
	namescookie = {};
}

// change name of edit box
if ( $.isEmptyObject(namescookie) ){
	$('option[value=EDIT]').text('-- Add people to this list --');
}


function updatecookie() {
	Cookies.set('names',JSON.stringify(namescookie), { expires: 90 });
}

$('select').change(function() {
	
	if($(this).find(':selected').val() == 'ANY')
		$(this).parents('label').find('.hide-if-any').hide();
	else if ( !$(this).hasClass('first-person-chooser') )
		$(this).parents('label').find('.hide-if-any').show();
	
});

personone = '';
persontwo = '';

// show person options and fill name when selected
$('.first-person-chooser select[fillpeople]').change(function() {
	if( $.inArray($(this).find(':selected').val(), ['TOP','OTHER','ANY','EDIT']) == -1 ) {
		$('.second-person-chooser').show();
		// if ($('.second-person-chooser select:visible option:selected').val ) $('.show-if-two-people').hide();
		$('.show-if-one-person').show();
		var persononename = $(this).find(':selected').text();
		$('.person-one-name').each(function() {
			$(this).text(' ' + persononename);
		});
		// hide the same option in the relationship box
		$(this).parents('form').find('.second-person-chooser select[fillpeople]').children('option').show();
		$(this).parents('form').find('.second-person-chooser select[fillpeople]').children('option[value^=' + $(this).val() + ']').hide();
		
		// select this person in every other select box
		$('.first-person-chooser select[fillpeople]').not(this).val($(this).val());
		
		// set a variable for person just to make our life easier
		personone = $(this).val();
	}
	else {
		$('.second-person-chooser').hide();
		$('.show-if-two-people').hide();
		$('.show-if-one-person').hide();
		personone = "";
	}
});

$('.second-person-chooser select[fillpeople]').change(function() {
	if( $.inArray($(this).find(':selected').val(), ['TOP','OTHER','ANY','EDIT']) == -1 ) {
		$('.show-if-one-person').hide();
		$('.show-if-two-people').show();
		var persontwoname = $(this).find(':selected').text().slice(2); // TODO make this respond to the format things
		$('.person-two-name').each(function() {
			$(this).text(' ' + persontwoname);
		});
		
		// select this person in every other select box
		$('.second-person-chooser select[fillpeople]').not(this).val($(this).val());
		$('.second-person-chooser select[fillpeople]').removeClass('looklikealink');
		
		// set a variable for person just to make our life easier
		persontwo = $(this).val();
	}
	else if ($(this).find(':selected').val() == 'EDIT') {
		$(this).removeClass('looklikealink');
		persontwo = "";
	}
	else {
		$('.second-person-chooser select[fillpeople]').not(this).val($(this).val());
		$('.second-person-chooser select[fillpeople]').addClass('looklikealink');
		$('.show-if-two-people').hide();
		$('.show-if-one-person').show();
		persontwo = "";
	}
	
	// Change name of top
	if ($(this).find(':selected').val() != 'TOP') {
		oldtext = $(this).find('option[value=TOP]').text();
		$(this).find('option[value=TOP]').text('');
	}
	else {
		$(this).find('option[value=TOP]').text(oldtext);
		$('.show-if-two-people').hide();
	}
	
	
});





// Let's implement the box that adds and removes people

function addthisperson(thisselect) {
	$('#modify-people ul li#addpeople').addClass('inprocess');
	usernamesubmit = $('#modify-people ul input').val();
	usernamesubmit = usernamesubmit.replace(/^.*?facebook\.com\//gi, '');
	usernamesubmit = usernamesubmit.replace(/[^0-9a-z.].*?$/gi,'');

	  if(usernamesubmit!='') {
			$.ajax({
				url: 'get_id.php',
				method: 'POST',
				data: {'username': usernamesubmit},
				dataType: 'json',
				success: function(data) {
					if(data['returnedallgood']=='true') {
						newfid = data['fid'];
						// add to variable
						namescookie[newfid] = usernamesubmit;
						// update the cookie
						updatecookie();
						// add to all selects
						addnametoselects(newfid,usernamesubmit)
						// add to this dialog
						$('#modify-people ul li:last-of-type').before('<li id="' + newfid + '" class="personname">' + usernamesubmit + '</li>');
						// clear this input
						$('#modify-people ul input').val('');
						// swap the display
						$('#modify-people ul li#addpeople').removeClass('inprocess');
						// select in this select box
						if (typeof thisselect !== 'undefined') {
							$(thisselect).val(newfid);
							$(thisselect).change();
						}
						// change text in all select boxes
						$('option[value=EDIT]').text('-- Edit this list --');
						// show posts-status
						$('#posts-status').show();
						// $('select[fillpeople=true]').val(newfid);
					}
					else {
						$('#modify-people ul input').val('');
						$('#modify-people ul li#addpeople').removeClass('inprocess');
						$('#modify-people ul input').focus();
					}
					
					// change
				}
				
			});
	  }
	  else {
		$('#modify-people ul input').val('');
		$('#modify-people ul li#addpeople').removeClass('inprocess');
		$('#modify-people ul input').focus();
	  }
// namescookie = namescookie.filter(function(n){ return n != undefined }); 	  

}

$('select').bind('change', function() {

	if($(this).val() == "EDIT") {
		
		// Replace the value from the old one
		var oldvalue = '';
		if (typeof $(this).attr('oldvalue') != 'undefined') oldvalue = $(this).attr('oldvalue');
		else oldvalue = $(this).prop('defaultValue');
		$(this).val(oldvalue);

		var thisselect = this;
		
		if (typeof namescookie != 'undefined') {
			// Create the modify-people dialog box. Changes to that box go here.
			$('#modify-people').html('<ul></ul>');
			$.each(namescookie, function(fid, name) {
				$('#modify-people ul').append('<li id="' + fid + '" class="personname">' + name + '</li>');
			});
			$('#modify-people ul').append('<li id="addpeople"><input></li>');
			$('#modify-people').append('<div id="addpeopledescription">Paste the username or url of the person\'s profile and hit Enter to add them.</div>');

		} else {
			namescookie = {}
			$('#modify-people ul').append('<li id="addpeople"><input></li>');
			$('#modify-people').append('<div id="addpeopledescription">Paste the username or url of the person\'s profile and hit Enter to add them.</div>');
		}
		
		$('#modify-people').on('click', 'li.personname', function() {
			// remove from variable
			delete namescookie[$(this).attr('id')];
			// update the cookie
			updatecookie();
			// remove from all selects
			$('option[value=' + $(this).attr('id') + ']').remove();
			$(this).remove();
		});

		$('#modify-people ul li input').keypress(function (e) {
			if (e.which == 13) {
				addthisperson(thisselect);
				return false; 
			}
		});
		
		$('#modify-people ul li#addpeople').click(function() {
			addthisperson(thisselect);
		});

		$('#modify-people').dialog({
			draggable: false,
			height: 680,
			width: 325,
			position: {my: 'left top', at: 'left+25 top+25'},
			show: 100,
			hide: 100,
			modal: true,
			resizable: false,
			open: function(){
				$('.ui-widget-overlay').bind('click',function(){
					$('#modify-people').dialog('close');
					$('#aboutlink').dialog('close');
				})
			}
		});
		
	}
	
	$(this).attr('oldvalue',$(this).val());

});

// Reset the form if user has hit the back button
$(window).bind("pageshow", function() {
   checkandclear();
   
	// show sub-options when radios are selected
	$('.showwhenopened').hide();
	$('#person input:checked').parent().find('.showwhenopened').show();
});

//Get updated share count
var StaticShareButtons = {
	facebookButton: document.querySelector('.share-button-facebook'),

	init: function(){
		this.injectScript('//graph.facebook.com/?id='+
			escape(this.facebookButton.dataset.shareUrl) +'&callback=StaticShareButtons.processFacebook');
	},

	injectScript: function(url){
		var script = document.createElement('script');
		script.async = true;
		script.src = url;
		document.body.appendChild(script);
	},

	processFacebook: function(data){
		if(data.share.share_count != undefined){
			var sharecount = data.share.share_count;
			if(sharecount > 999999) sharecount = (sharecount/1000000).toFixed(1) + 'm';
			else if(sharecount > 999) sharecount = (sharecount/1000).toFixed(1) + 'k';
			this.facebookButton.querySelector('.count').innerHTML = sharecount;
		}
	}
}

StaticShareButtons.init();

$(document).ready(function() {
		
	// Make share link open a nice window
	$('.share-button-facebook a').click(function(e){
 
	  //We tell our browser not to follow that link
	  e.preventDefault();
	  
	  //Send analytics
	  ga('send', 'event', 'facebook', 'share');
 
	  //We trigger a new window with the Facebook dialog, in the middle of the page
	  window.open('https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fsearchisback.com%2F', 'fbwindow', 'height=660, width=560, top='+($(window).height()/2 - 290) +', left='+($(window).width()/2 - 355)  +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
 
	});
	
	// Make ad for buffalos
	$('a#prebuffalo').click(function(e){
	
	  //We tell our browser not to follow that link
	  e.preventDefault();
	  
	  //Send analytics
	  ga('send', 'event', 'buffalo', 'click');
 
	  //We trigger a new window with the Facebook dialog, in the middle of the page
	  window.open('https://www.kickstarter.com/projects/967148916/buffalo-buffalo-magnetic-poetry-set', '_blank');
 
	});
	

  // Add the event that closes the popup and sets the cookie that tells us to
  // not show it again until one day has passed.
  $('#closepreheader').click(function() {
    $('#preheader').hide();
    $('#preheadershow').remove();
    Cookies.set('hidepreheader', true, { expires: 18 })
    return false;
  });
  
  $('#changenotify a').click(function() {
    $('#changenotify').hide();
    $('#changenotifyshow').remove();
    Cookies.set('hidechangenotify', true, { expires: 30 })
    return false;
  });

});

