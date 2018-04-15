//IE7,8 html 5 support
if(!$.support.leadingWhitespace){var e=("abbr,article,aside,audio,canvas,datalist,details,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,time,video,figcaption,summary").split(',');for(var i=0;i<e.length;i++){document.createElement(e[i])}}

var initStyles = function( selector ){
	var context = $(selector || 'body');

	// radios
	(function(){
		var labels = context.find('label.radio');
		labels.click(function(){
			var label = $(this);
			labels.has('[name="'+label.find('input').attr('name')+'"]').removeClass('on');
			label.toggleClass('on',!!label.has(':checked').length);
		}).has(':checked').addClass('on');
	})();

	// checks
	context.find('label.check').each(function(){
		var label = $(this);
		function update(){ label.toggleClass('on',!!label.has(':checked').length) }
		update();
		var inp = label.find('input');
		inp.change(update);
	});

	// inputs hint
	context.find(':text,:password,textarea').parent(':has(.hint)').each(function(){
		var parent = $(this);
		var inp = parent.find('input:not(:submit),textarea');
		var hint = parent.find('.hint');
		hint.click( function(){hint.hide();inp.focus()} );
		inp.click( hintHide ).focus( hintHide ).blur( hintShow );
		function hintHide(){ hint.hide() }
		function hintShow(){ if( !inp.val() ) hint.show() }
		if( !!inp.val() ) hintHide();
	});
};

// function( items, posPlus, onWindowLoad, isCustomFont );
var centerizeVert = function(b,c,d,f){function e(a){var b={top:~~((a.parent().height()-a.outerHeight())/2+g)};0>$.inArray(a.css("position"),["absolute","relative"])&&(b.position="relative");a.css(b)}b=$(b);if(b.length){var g=c?~~c:0;b.each(function(){var a=$(this);if(a.height()){if(e(a),f){var b=a.css("top"),c=setInterval(function(){e(a);a.css("top")!==b&&clearInterval(c)},20);$(window).load(function(){clearInterval(c)})}}else if(a.is("img")){a.hide();var d=setInterval(function(){a.height()&&(clearInterval(d), a.show(),e(a))},20)}});d&&$(window).load(function(){centerizeVert(b,c)})}};


$(document).ready( domReady );
$(window).load( windowOnload );

function domReady(){

	initStyles();
	
	
	// colors opacity
	$('.color-box').each(function(){
		var box = $(this);
		var opac = box.data('opac');
		var color = box.find('div.color');
		color.css('opacity',(100-opac)/100);
		var title = box.data('tooltip');
		if( title ){
			box.tooltip({
				title : title
			});
		}
	});
	
	
	// manufacturers items img centerize
	centerizeVert('div.manufacturers div.item img');
	
	// calc
	(function(){ 
		var box = $('div.calc-content');
		if( !box.length ) return;
		
		var details = box.find('div.car-details');
		var glasses = box.find('div.glass-front, div.glass-back');
		var checks = details.find('label.check');
		var price = box.find('div.price');
		var dataClass = 'otech';
		var dataBody = 'sedan';
		var dataFirm = 'llumar';
		var dataOpac = 75;
		var dataBronze = false;
		var dataLightFront = false;
		var dataLightBack = false;
		var dataFront = false;
		var dataBack = false;
		var dataFrontLine = false;
		var dataFrontSide = false;
		var dataBackSide = false;
		
		// classes selection
		(function(){
			var items = box.find('div.car-classes div.item');
			items.click(function(){
				var item = $(this);
				items.removeClass('active');
				item.addClass('active');
				dataClass = item.data('class');
				classUpdate();
				calc();
			});
		})();

		// bodies selection
		(function(){
			var items = box.find('ul.car-bodies li');
			items.click(function(){
				var item = $(this);
				items.removeClass('active');
				item.addClass('active');
				dataBody = item.data('body');
				calc();
			});
		})();
		
		// manufacturers selection
		(function(){
			var items = box.find('div.manufacturers div.item');
			items.click(function(){
				var item = $(this);
				items.removeClass('active');
				item.addClass('active');
				dataFirm = item.data('manuf');
				colorsUpdate();
				calc();
			});
		})();
		
		// colors
		function colorsUpdate(){
			var blocks = box.find('div.colors-block');
			blocks.each(function(){
				var block = $(this);
				block.toggleClass('visible', block.data('firm') === dataFirm );
				var colors = block.find('div.color-box');
				colors.unbind('click');
				select();
				function select(){
					colors.removeClass('active');
					var selected = colors.filter('[data-opac="'+dataOpac+'"]');
					if( dataBronze ) selected = selected.filter('[data-bronze="1"]');
					else selected = selected.not('[data-bronze]');
					selected.addClass('active');
				}
				colors.click(function(){
					var color = $(this);
					dataBronze = !!color.data('bronze');
					dataOpac = color.data('opac');
					select();
					opacUpdate();
					calc();
				});
			});
		}
		colorsUpdate();
		
		function classUpdate(){
			details.attr('class','car-details');
			details.addClass(dataClass);
		}
		classUpdate();
		
		function opacUpdate(){
			glasses.css('opacity',(100-dataOpac)/100);
			glasses.toggleClass('bronze',dataBronze);
		}
		opacUpdate();
		
		function frontSideUpdate(){
			glasses.filter('.glass-front').toggle(dataFrontSide);
		}
		frontSideUpdate();

		function backSideUpdate(){
			glasses.filter('.glass-back').toggle(dataBackSide);
		}
		backSideUpdate();
		
		var checkFrontSide = checks.filter('.front-side').find('input').each(checkedFrontSize);
		var checkBackSide = checks.filter('.back-side').find('input').each(checkedBackSide);
		checks.filter('.front-side').find('input').change(checkedFrontSize);
		checks.filter('.back-side').find('input').change(checkedBackSide);
		
		function checkedFrontSize(){
			updateChecksData(frontSideUpdate);
		}
		
		function checkedBackSide(){
			updateChecksData(backSideUpdate);
		}
		
		function updateChecksData( after ){
			setTimeout(update,1);
			function update(){
				dataFront = checks.filter('.front').find('input').prop('checked');
				dataBack = checks.filter('.back').find('input').prop('checked');
				dataFrontSide = checks.filter('.front-side').find('input').prop('checked');
				dataBackSide = checks.filter('.back-side').find('input').prop('checked');
				dataLightFront = checks.filter('.fara-front').find('input').prop('checked');
				dataLightBack = checks.filter('.fara-back').find('input').prop('checked');
				dataFrontLine = checks.filter('.front-line').find('input').prop('checked');
				if( typeof after !== 'undefined' ) after();
			}
		}
		updateChecksData(calc);

		checks.each(function(){
			$(this).find('input').change(function(){
				updateChecksData(calc);
			});
		});
		
		// calculate
		function calc(){
			var total = 0;
			var firmID = ['llumar','suncontrol','ultravision','sparks','aswf'].indexOf( dataFirm );
			
			function getPrice( glassType ){
				var result = 0;
				try{ result = specialPrices[dataClass][glassType][dataFirm][dataOpac] } catch (e){}
				if( !result ){
					try{ result = prices[dataClass][glassType][firmID.toString()] } catch (e){}
				}
				return result;
			}
			
			if( dataBackSide ) total += getPrice( 'backSide' );
			if( dataFrontSide ) total += getPrice( 'frontSide' );
			if( dataBack ) total += getPrice( 'back' );
			if( dataFrontLine ) total += getPrice( 'frontLine' ); 
			if( dataFront ) total += getPrice( 'front' );  
			if( dataLightFront ) total += 2500; // С†РµРЅР° С‚РѕРЅРёСЂРѕРІРєРё РїРµСЂРµРґРЅРёС… С„Р°СЂ;
			if( dataLightBack ) total += 2500;  // С†РµРЅР° С‚РѕРЅРёСЂРѕРІРєРё Р·Р°РґРЅРёС… С„Р°СЂ;
			if( dataBody == 'uni' ) total=Math.round(total*1); // 1.1 - 10% РЅР°С†РµРЅРєР° Р·Р° СѓРЅРёРІРµСЂСЃР°Р»; 
			
			
			price.html('Цена: <span>'+total+'</span>руб.*');
		}
		calc();
	})();
}

function windowOnload(){
	
}