jQuery(document).ready(function () {
	function escapeSweChars(text) {
		return text
		    .replace('Å', "Å")
		    .replace('Ä', "Ä")
		    .replace('Ö', "Ö")        
		    .replace('å', "å")
		    .replace('ä', "ä")
		    .replace('ö', "ö");
	}
	var didNotFindItMessage = function(term){
		return escapeSweChars('<p class="info-box">Om du inte hittar manualen du söker <a href="mailto:info@kellfri.se?Subject=Manual för '+term+'" target="_top">maila oss</a> så hjälper vi till!</p>');
	}
	var search = function(term, result){
		jQuery('#result').empty();

		if (result.length === 0){
		  jQuery('#result').append('<p>Inga manualer hittades. Dubbelkolla produktnummer och namn.</p>'+didNotFindItMessage(term) );
		  return;
		}

		if (result.length === 1){
		  jQuery('#result').append('<p>'+escapeSweChars(term)+' matchade 1 manual.</p>');
		} else{
		  jQuery('#result').append('<p>Matchade '+result.length+' manualer.</p>');
		}

		//jQuery('#result').append('<div class="warning">Innan du tar en produkt i bruk läs säkerhetsinformationen <a href="http://manual.kellfri.se/manualer/Allm%C3%A4n_s%C3%A4kerhetsinformation_SE.pdf">här</a>.</div>');
		//jQuery('#result').append('<div class="warning">Ladda ner grundläggande checklistan vid underhåll av maskiner <a href="http://manual.kellfri.se/manualer/Checklista_grundl%C3%A4ggande_underh%C3%A5ll_av_maskiner_SE.pdf">här</a>.</div>');
		//jQuery('#result').append('<div class="warning">Ladda ner vår guide om fetter och oljor <a href="http://manual.kellfri.se/manualer/Kellfris_fetter_oljor.pdf">här</a>.</div>');
		//jQuery('#result').append('<div class="warning">Ladda ner reklamationsblankett <a href="http://manual.kellfri.se/manualer/Reklamationsblankett-SE.pdf">här</a>.</div>');

		for (var n = 0; n < result.length; n++){
		  var manual = result[n];

		  var productIDs = manual.productid;
		  var oil = "";
		  if (typeof oil === "undefined"){
		    manual.oil = "none";  
		  }
		  oil = manual.oil;
		  
		  if (Object.prototype.toString.call( manual.productid ) === '[object Array]' ){
		    productIDs = '';
		    for (var q = 0; q < manual.productid.length; q++){
		      productIDs += manual.productid[q];
		      if (q < manual.productid.length-1) productIDs += '<br>';
		    }
		  }

		  var html = '<article>'
		    +  '<div class="manual-row">'
		    +     '<div class="manual-id">'+escapeSweChars(productIDs)+'</div>'
		    +     '<div class="manual-name">'+escapeSweChars(manual.name)

		  if (manual.extra){
		    html += '<div class="manual-extra-info">'+escapeSweChars(manual.extra)+'</div>';
		  }

		  html +='</div>'
		    +     '<div class="manual-right">'
		    +       '<a href="/manualer/'+escapeSweChars(manual.pdf)+'" target="_blank"><div class="manual-button">Ladda ner PDF</div></a>'
		    +     '</div>'
		    +   '</div>';
		  
		  if (oil === "with" || oil === "without"){
		    html +=  '<div class="manual-row">';
		    if (oil === "with"){
		      html +=  '<p>Denna produkt levereras fylld med olja.</p>'
		      +'<p><strong>Vi rekommenderar att du gör löpande underhåll och service på din maskin, se instruktionsbok för din produkts behov.</strong></p>'
		      +'<p>Behöver du påfyllning finns <a href="https://www.kellfri.se/skog-ved/tillbehor/smorjfett-oljor/">olja och smörjfett här</a>.</p>';
		    }
		    else if (oil === "without"){
		      html +=  '<p>Denna produkt levereras tom på olja, men vi skickar med den olja du behöver.</p>'
   		      +'<p>Du hittar <a href="https://www.kellfri.se/skog-ved/tillbehor/smorjfett-oljor/">olja och smörjfett här</a>.';
		    }
		    html +=  '</div>';
		  }

		  html += '</article>';

		  jQuery('#result').append(html);
		}
		jQuery('#result').append(didNotFindItMessage(term));
	}

	jQuery('.filter').click(function(){
		var term = jQuery(this).text();
		var options = {
		  threshold: 0.3,
		  shouldSort: true,
		  caseSensitive: false,
		  location: 0,
		  distance: 200,
		  maxPatternLength: 50,
		  includeScore: false,
		  keys: ['tags']
		}
		var fuse = new Fuse(manuals, options);
		var result = fuse.search(term);
		search(term, result);
	});

	jQuery('#search').on("input", function() {
		var options = {
		  caseSensitive: false,
		  includeScore: false,
		  shouldSort: true,
		  threshold: 0.4,
		  location: 0,
		  distance: 200,
		  maxPatternLength: 50,
		  //keys: ["title","author.firstName"]
		  keys: ['productid', 'name'] 
		}
		var term = jQuery('#search').val(); 
		console.log(term);
		var fuse = new Fuse(manuals, options);
		var result = fuse.search(term);
		search(term, result);
	});
});