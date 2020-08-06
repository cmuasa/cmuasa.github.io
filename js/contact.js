$.getJSON(
	'https://spreadsheets.google.com/feeds/list/164sYoGTskq6Z8_oQGKHxt8Sk3cCUpp1BWATWdieOc-c/1/public/full?alt=json',
	function (data) {
		var sheetData = data.feed.entry;
		var i;
		for (i = 0; i < sheetData.length; i++) {
			let name = data.feed.entry[i]['gsx$name']['$t'];
			let insta = data.feed.entry[i]['gsx$instagramhandle']['$t'];
            let phone = data.feed.entry[i]['gsx$phonenumber']['$t'];
            let year = data.feed.entry[i]['gsx$class']['$t'];
            let major = data.feed.entry[i]['gsx$major']['$t'];
            let fact = data.feed.entry[i]['gsx$funfactaboutyourself']['$t'];
            let socials = data.feed.entry[i]['gsx$othersocials']['$t'];
			if (insta) {
                //console.log(insta)
                //console.log('https://www.instagram.com/' + insta + '/?__a=1')
                $.get('https://www.instagram.com/' + insta + '/?__a=1&')
					.done(function (data) {
                        //console.log(data)
                        try {
                            let photoURL = data['graphql']['user']['profile_pic_url_hd'];
                            console.log(photoURL);
                            document.getElementById('demo').innerHTML += format(name, insta, photoURL, phone, year, major, fact, socials);
                        } catch {
                            document.getElementById('demo').innerHTML += format(name, insta, false, phone, year, major, fact, socials);
                        }
					})
					.fail(function () {
						console.log('FAILED');
						document.getElementById('demo').innerHTML += format(name, insta, false, phone, year, major, fact, socials);
					});
			} else {
				console.log('no pic');
				document.getElementById('demo').innerHTML += format(name, false, false, phone, year, major, fact, socials);
			}
		}
	}
);

function format(name, insta, photoURL, phone, year, major, fact, socials) {
	let output;
	let photo;
	console.log(photoURL)
	if (insta) {
		if (photoURL) {
			photo = `<a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener">` +
			`<img class="thumbnail hoverable" src=${photoURL} + ></img>` +
		'</a>'
		}
		else {
			photo = ""
		}
		output =
			'<tr>' +
			td(photo) +
			td(name) + td(year) + td(major) + td(fact) + 
			td(`<a href="https://www.instagram.com/${insta}"target="_blank" rel="noopener"> ` + '@' + insta + '</a>') +
			td(phone) + td(socials) + 
			'</tr>';
	} else {
		output = '<tr>' + td('') + td(name) + td(year) + td(major) + td(fact) + td('N/A') + td(phone) + td(socials) + '</tr>';
	}
	return output;
}

function td(item) {
	return '<td style="font-size:14px; vertical-align:middle">' + item + '</td>';
}

