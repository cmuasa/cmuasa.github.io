$.getJSON(
	'https://spreadsheets.google.com/feeds/list/164sYoGTskq6Z8_oQGKHxt8Sk3cCUpp1BWATWdieOc-c/1/public/full?alt=json',
	function (data) {
		var localStorage = window.localStorage;
		var today = (new Date() + "").toString();
		// clear local storage if not visited on the same day
		if (localStorage.getItem('time')) {
			console.log(`Last visited ${localStorage.getItem("time").slice(0, 10)}`)
			if (localStorage.getItem("time").slice(0, 10) != today.slice(0, 10)) {
				localStorage.clear();
				console.log("Clearing storage")
			}
		}
		
		// parse through Google Sheets data
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
			let photoURL;

			if (insta) {
				// check if insta URL is in local storage
				if (localStorage.getItem(insta)) {
					photoURL = localStorage.getItem(insta)
					document.getElementById('contactInfo').innerHTML += format(name, insta, photoURL, phone, year, major, fact, socials);
					console.log(`Found ${photoURL} for @${insta}`)
				} else {
					// getting instagram page info
					$.get('https://www.instagram.com/' + insta + '/?__a=1&')
					.done(function (data) {
						try {
							let photoURL = data['graphql']['user']['profile_pic_url_hd'];
							// found photoURL
							document.getElementById('contactInfo').innerHTML += format(name, insta, photoURL, phone, year, major, fact, socials);
							localStorage.setItem(insta, photoURL)
							console.log(`Saving ${photoURL} for @${insta}`)
						} catch {
							// no photoURL found
							document.getElementById('contactInfo').innerHTML += format(name, insta, false, phone, year, major, fact, socials);
							console.log(`Could not get instagram picture for @${insta}`)
						}
					})
					.fail(function () {
						console.log(`Could not find insta page for @${insta}`);
						// couldn't find insta
						document.getElementById('contactInfo').innerHTML += format(name, insta, false, phone, year, major, fact, socials);
					});
				}
			} else {
				console.log(`No insta given for ${name}`);
				// no insta given
				document.getElementById('contactInfo').innerHTML += format(name, false, false, phone, year, major, fact, socials);
			}
		}
		localStorage.setItem("time", new Date())
		console.log(localStorage)
	}
);

function format(name, insta, photoURL, phone, year, major, fact, socials) {
	let output;
	let photo;

	if (socials) {
		socials = `<li>Other Socials: ${socials} </li>`;
	} else {
		socials = '';
	}

	if (insta) {
		if (photoURL) {
			// insta photo found
			photo =
				`<a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener">` +
				`<img class="card-img-top thumbnail hoverable img-fluid" src=${photoURL} + ></img>` +
				'</a>';
			output = 
			`<div class="col-6 col-md-4 col-lg-3">
				<div class="card hoverable my-2">
					<a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener">
						<h5 class="card-title m-0 my-3 mb-xl-1">${name}</h5>
					</a>
					<div class="row mx-lg-3">
						<div class="col-xl-4 align-self-center mb-3">
						${photo}
						</div>
						<div class="card-body col-xl-8 p-0">
							<p class="card-text m-0">
								<li class="text-center">"${fact}" </li>
								<li>Class: ${year} </li>
								<li>Major: ${major} </li>
								<li>Insta: <a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener"> @${insta} </a> </li>
								<li>Phone: ${phone} </li>
									${socials}
							</p>
						</div>
					</div>
				</div>
			</div>`
		} else {
			// no insta photo found
			output = 
			`<div class="col-6 col-md-4 col-lg-3">
				<div class="card hoverable my-2">
					<div class="card-body p-1">
						<a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener">
							<h5 class="card-title m-0 my-3 mb-xl-1">${name}</h5>
						</a>
						<p class="card-text m-0">
							<li>"${fact}" </li>
							<li>Class: ${year} </li>
							<li>Major: ${major} </li>
							<li>Insta: <a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener"> @${insta} </a> </li>
							<li>Phone: ${phone} </li>
							${socials}
						</p>
					</div>
				</div>
			</div>`
		}
	} else {
		// no insta given
		output = `<div class="col-6 col-md-4 col-lg-3">
			<div class="card hoverable my-2">
				<div class="card-body p-1">
					<h5 class="card-title m-0 my-3 mb-xl-1">${name}</h5>
				<p class="card-text m-0">
					<li>"${fact}" </li>
					<li>Class: ${year} </li>
					<li>Major: ${major} </li>
					<li>Phone: ${phone} </li>
					${socials}
				</p>
			</div>
		</div>
	</div>`;
	}
	return output;
}