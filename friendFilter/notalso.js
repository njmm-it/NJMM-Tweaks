 $('#people-pronoun').change(function() {
			if($('#people-pronoun option:selected').text() == "Friends of friends")
				$('.notalso').show();
			else
				$('.notalso').hide();			
		});

		$(document).ready( function() {
		if($('#people-pronoun option:selected').text() == "Friends of friends")
			$('.notalso').show();
		else
			$('.notalso').hide();	
		});
