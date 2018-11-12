 $('#posts-pronoun').change(function() {
				if( $(this).find(':selected').val() == "OTHER") {
					$('#posts-textinput input').prop( "disabled", true );
				} else {
					$('#posts-textinput input').prop( "disabled", false );
				}
			});		