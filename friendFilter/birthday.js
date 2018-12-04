 
		$('#bornmonth').change(function() {
			if($('#bornmonth option:selected').val() == "")
				$('#bornmonth').css('color','#777777');
			else
				$('#bornmonth').css('color','#000000');
		});	

		if($('#bornmonth option:selected').val() == "")
			$('#bornmonth').css('color','#777777');
		else
			$('#bornmonth').css('color','#000000');

		$('#bornyear').bind('input keydown', function() {
			if($('#bornyear').val() == "") {
				$('#bornmonth').css('visibility','hidden');
				$('#bornyear').removeClass('inputright');
			}
			else {
				$('#bornyear').addClass('inputright');
				$('#bornmonth').css('visibility','visible');
			}
		});

		$('#bornyear, #bornbefore, #bornafter').change(function() {
			if( $(this).val() > 16 && $(this).val() < 100)
				$(this).val('19' + $(this).val());
			if( $(this).val() < 17 && $(this).val() > 0 )
				$(this).val('20' + $(this).val());
		});

		$('#born-selector').change(function() {
			switch($('#born-selector')[0].selectedIndex) {
				case 0:
					$('#yearmonth').show();
					$('#yearrange').hide();
					break;
				case 1:
					$('#yearmonth').hide();
					$('#yearrange').show();					
					break;
			}
		});	
