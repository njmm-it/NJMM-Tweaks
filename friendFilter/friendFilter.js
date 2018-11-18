//Add the addEventListener that will execute the Search when the submit is pressed.
document.addEventListener("click",function (e){
    console.log("Page was clicked on ");
    console.log(e.target);
    if (e.target.classList.contains("submit")){
        //dosearch();
	executeSearch();
        return false;
    }
});

/*==========================
NAME: executeScript()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "executeScript()" generates a URL based on the criteria in the html form, saves the criteria to a json file in the browser storage, then creates a new tab with said url. 
==========================*/
function executeScript(){
}

/*FORM AUTOFILL FUNCTIONS*/
/*These functions are neded to make the page save and load its last search from JSON*/
/*==========================
NAME: convertCriteriaToJSON()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "convertCriteriaToJSON()" creates a json-string that will be passed to executeScript to save the criteria to the browser storage.
==========================*/
function convertCriteriaToJSON(){
}
/*==========================
NAME: autofillFromJSON(inputFromBrowserStorage)
INPUTS: string inputFromBrowserStorage which represents what is stored in the browser Storage.
OUTPUTS: void
DESCRIPTION: "autofillFromJSON()" takes the JSON in browser.storage and fills in the form using the data saved there.
==========================*/
function autofillFromJSON(inputFromBrowserStorage){
}
/*==========================
NAME: generateSearchURL()
INPUTS: void
OUTPUTS: string representing the search URL to redirect the browser to.
DESCRIPTION: "generateSearchURL()" creates a json-string that will be passed to executeScript to save the criteria to the browser storage.
==========================*/
function generateSearchURL(){
}


/*
 window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return (!check);
};

$(document).ready( function() {
	if ($('#events-pronoun').val() == "Show all events") {
		$('#events-verb').hide();
		$('#events-status').hide();
	}
	else {
		$('#events-verb').show();
		$('#events-status').show();	
	}
	
	function showtab(tabname) {
		$('nav li a').removeClass('selected');
		$('nav li a[to='+tabname+']').addClass('selected');
		$('form').hide();
		$('#'+tabname).show();
		window.location.hash = tabname;
	}
	
	$('nav li a').click( function(event) {
		event.preventDefault();
		showtab($(this).attr('to'));
	});
	
	if(window.location.hash.length > 0)
		showtab(window.location.hash.substr(1));
		
	if(window.mobileAndTabletcheck() == false) {
		//$('#toevents').hide();
	}
	
	$('#aboutlink').click(function(event) {
		$('#about').dialog({
			draggable: false,
			height: 450,
			width: 345,
			position: {my: 'left top', at: 'left+15 top+60'},
			show: 100,
			hide: 100,
			modal: true,
			resizable: false,
			open: function(){
				$('.ui-widget-overlay').bind('click',function(){
					$('#aboutlink').dialog('close');
					$('#modify-people').dialog('close');
				})
			}
		});

		
		event.preventDefault();
	
	});
	
	$('#aboutlink2').click(function(event) {
		$('#about').dialog({
			draggable: false,
			height: 530,
			width: 345,
			position: {my: 'left top', at: 'left+15 top+25'},
			show: 100,
			hide: 100,
			modal: true,
			resizable: false,
			open: function(){
				$('.ui-widget-overlay').bind('click',function(){
					$('#aboutlink').dialog('close');
					$('#modify-people').dialog('close');
				})
			}
		});

		
		event.preventDefault();
	
	});

});

// Set up autocompletes

function doAutocomplete(queryobject,searchfield) {
	query = queryobject["term"];
	if(query.length>2) {
		// Grab the result file
		var json = (function () {
			var json = null;
			$.ajax({
				'async': false,
				'global': false,
				'url': 'search/' + searchfield + '/' + query.substr(0,3).toLowerCase(),
				'dataType': "json",
				'success': function (data) {
					json = data;
				},
				/* error:function (xhr, ajaxOptions, thrownError){			
					if(xhr.status==404) jQuery.ajax({
						type: 'POST',
						url: 'logerror.php',
						data: { msg: query + ': ' + thrownError }
					});
				} */
			});
			return json;
		})(); 
		if(query.length==3) { return json; }
		else {
			var filtered = $.grep(json, function(item,index) {
			  //return item['label'].toLowerCase().includes(query.toLowerCase());
			  return item['label'].toLowerCase().replace(/[^a-z]/g,'').includes(query.toLowerCase().replace(/[^a-z]/g,''));
			});
			return filtered;
		}
	}
}

// add autocomplete capacity to every input with an autocomplete attribute
$('input[autocompletesource]').each(function(){
	var autofield = $(this);
	autofield.autocomplete({
		source: function(request,response) { response(doAutocomplete(request,autofield.attr('autocompletesource'))); },
		select: function(event, ui) {
			$(this).attr('fid', ui.item.value );
			$(this).val(ui.item.label);
			var inputs = $(this).closest('form').find(':input');
			inputs.eq( inputs.index(this)+ 1 ).focus();
			return false;
		},
		focus: function(event, ui) {	
			$(this).removeAttr('fid');
			$(this).val(ui.item.label);
			return false;		
		}
	});
});

$('#language').autocomplete({
	source: languages,
  	select: function(event, ui) {
		$(this).attr('fid', ui.item.value );
		$(this).val(ui.item.label);
		var inputs = $(this).closest('form').find(':input');
		inputs.eq( inputs.index(this)+ 1 ).focus();
		return false;
	}
});

$('input').focus(function() {
	if( $(this).attr('fid') ) {
		$(this).removeAttr('fid');
		$(this).val('');
	}
});

function checkandclear() {
	$('[requireautocomplete]:not([fid])').each(function() {
		if($(this).val() != "") {
			$(this).val("");
		}
	});
	$('select option:selected[value=ANY]').parents('label').find('.hide-if-any').hide();
}
$('input, select, button').focusout(checkandclear);
function redirectURL(location){
    //create the new tab.
    var newTab = browser.tabs.create({
            url: location
        });
    //Inject the new script.
    newTab.then(()=>{
        browser.tabs.executeScript({
          file: "/contentScripts/newScript.js"
        });
      },()=>{alert(`I failed to open a new page.`);});
    window.close();
}

function dosearch() {


	// p1 = person one
	// p2 = person two
	// f1 = field one
	// af1 = field one, don't replace /str/
	// f2 = field two
	// f3 = field three
	// in the optional field, it has a formatremoveifempty

	checkandclear();

	var searchquery = "";
	var nomobile = false;
	
	// add each item
	$('label select:visible, label input:visible').each(function() {
		if ($(this).is('select')) {
			if(!$(this).prop('disabled')) {
				if (typeof $(this).find(':selected').attr('format') !== 'undefined') {
					searchquery += $(this).find(':selected').attr('format').replace("%f1",$(this).val());
				} else if (typeof $(this).find(':selected').attr('formatnext') !== 'undefined') {
					if ($(this).parent().find('input:visible:first').val().length > 0) {
						if (typeof $(this).parent().find('input:visible:first').attr('fid') !== 'undefined') {
							searchquery += $(this).find(':selected').attr('formatnext').replace("%f1",$(this).parent().find('input:visible:first').attr('fid'));
						}
						else {
							searchquery += $(this).find(':selected').attr('formatnext').replace("%f1","str/" + $(this).parent().find('input:visible:first').val() + "/pages-named");
						}
					}
				} else if (typeof $(this).find(':selected').attr('bornsearch') !== 'undefined') {
					// If the date is selected
					if( $(this).parent().find('input:visible:first').val() != "") {
						// If the month is selected
						if( $(this).parent().find('select:visible:first').val() != "")
							searchquery += "%f1/%f2/date-2/users-born/".replace("%f1",$(this).parent().find('input:visible:first').val()).replace("%f2",$(this).parent().find('select:first').val());
						else
							searchquery += "%f1/date/users-born/".replace("%f1",$(this).parent().find('input:visible:first').val());
					}
				}
			}
		}
		else {
			// Check if there's a format to it and value isn't empty.
			if ( (typeof $(this).attr('format') !== 'undefined') && ($(this).val().length > 0) ) {
				// Check if it has nostr defined. If so, add it without /str/.
				if (typeof $(this).attr('nostr') !== 'undefined')
					searchquery += $(this).attr('format').replace("%f1",$(this).val());
				// Then check if it has an FID. If not, treat it as a string.
				else if (typeof $(this).attr('fid') !== 'undefined') {
					searchquery += $(this).attr('format').replace("%f1",$(this).attr('fid'));
				}
				else
					searchquery += $(this).attr('format').replace("%f1","str/" + $(this).val() + "/pages-named").replace("%af1",$(this).val());
			}
		}
		
		searchurl = "https://www.facebook.com/search/"+searchquery+"intersect/";

	});
	
	console.log(searchquery);
	
	if(searchurl !== "https://www.facebook.com/search/intersect/") {
		if(window.opener) {
			redirectURL(searchurl);
		} else {
			if(window.mobileAndTabletcheck()) {
				redirectURL(searchurl);	
			}
			else {
				if (nomobile){
				    redirectURL(searchurl);
				}else{
				    redirectURL(searchurl.replace("www.facebook.com/search","m.facebook.com/graphsearch"));
				}
			}
		
		}
	
	}

}
*/
