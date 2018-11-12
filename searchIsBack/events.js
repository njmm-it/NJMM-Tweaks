 $('#events-pronoun').on('change', function() {
			  // if(this.value == "I")
			  // 	$('span#events-verb').html(' am ');
			  // else
			  //   $('span#events-verb').html(' are ');
			    
			  if(this.value == "Show all events") {
			  	$('#events-verb').hide();
			  	$('#events-status').hide();
			  } else if ( (this.value == "Friends") || (this.value == "Friends of friends") ) {
			  	$('#events-verb').show();
			  	$('#events-status').show();	
			  	$('span#events-verb').html(' are ');
			  } else {
			  	$('#events-verb').show();
			  	$('#events-status').show();	
			  	$('span#events-verb').html(' is ');
			  }
			  
			});