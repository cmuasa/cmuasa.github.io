$.getJSON(
	'https://spreadsheets.google.com/feeds/list/164sYoGTskq6Z8_oQGKHxt8Sk3cCUpp1BWATWdieOc-c/1/public/full?alt=json',
	function (data) {
		var localStorage = window.localStorage;
		var today = (new Date()).toString();
		// clear local storage if not visited on the same day
		if (localStorage.getItem('lastUpdated')) {
			console.log(`Last visited ${localStorage.getItem("lastUpdated").slice(0, 10)}`)
			if (localStorage.getItem("lastUpdated").slice(0, 10) != today.slice(0, 10)) {
				console.log('Attempting to clear local storage...')
				$.get('https://www.instagram.com/phi.nguyenn/?__a=1')
				.done(function (data) {
					// try to access instagram
					try {
						let tmp = data['graphql']['user']['profile_pic_url_hd'];
						// able to access, and clearing storage
						console.log("local storage cleared")
						localStorage.clear();
						// after clearing, set lastUpdated
						localStorage.setItem("lastUpdated", new Date())
					} catch {
						// could not acces, not clearing storage
						console.log("Could not clear local storage")
					}
				})
			} else {
				console.log("Don't need to clear!")
			}
		} else {
			// set lastUpdated if user hasn't visited yet
			localStorage.setItem("lastUpdated", new Date())
		}
		
		// parse through Google Sheets data
		var sheetData = data.feed.entry;
		var i;
		for (i = 0; i < sheetData.length; i++) {
			let name = data.feed.entry[i]['gsx$name']['$t'];
			let insta = data.feed.entry[i]['gsx$instagramhandle']['$t'].toLowerCase();
			let phone = data.feed.entry[i]['gsx$phonenumber']['$t'];
			let year = data.feed.entry[i]['gsx$class']['$t'];
			let major = data.feed.entry[i]['gsx$major']['$t'];
			let fact = data.feed.entry[i]['gsx$funfactaboutyourself']['$t'];
			let socials = data.feed.entry[i]['gsx$othersocials']['$t'];
			let photoURL;
			phone = `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`
			if (insta) {
				// check if insta URL is in local storage
				if (localStorage.getItem(insta)) {
					photoURL = localStorage.getItem(insta)
					document.getElementById('contactInfo').innerHTML += format(name, insta, photoURL, phone, year, major, fact, socials);
					console.log(`Found ${photoURL} for @${insta}`)
				} else {
					// getting instagram page info
					$.get('https://www.instagram.com/' + insta + '/?__a=1')
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
		console.log(localStorage)
	}
);

function format(name, insta, photoURL, phone, year, major, fact, socials) {
	let output;
	let photo;

	if (socials) {
		socials = `<li><span class="font-weight-bold">Other Socials</span>: ${socials} </li>`;
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
			`<div class="contactCard col-6 col-md-4 col-lg-3 col-xl-2">
				<div class="card hoverable my-2">
					<a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener">
						<h5 class="card-title my-3 mb-1">${name}</h5>
					</a>
					<div class="mx-1">
						<div class="align-self-center mb-3 m-auto">
						${photo}
						</div>
						<div class="card-body p-1">
							<p class="card-text">
								<li class="fact mb-2">"${fact}" </li>
								<li><span class="font-weight-bold"> Class:</span> ${year} </li>
								<li><span class="font-weight-bold"> Major:</span> ${major} </li>
								<li><span class="font-weight-bold"> Insta:</span> <a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener"> @${insta} </a> </li>
								<li><span class="font-weight-bold"> Phone:</span> ${phone} </li>
								${socials}
							</p>
						</div>
					</div>
				</div>
			</div>`
		} else {
			// no insta photo found
			output = 
			`<div class="contactCard col-6 col-md-4 col-lg-3 col-xl-2">
				<div class="card hoverable my-2">
					<div class="card-body p-1">
						<a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener">
							<h5 class="card-title my-3 mb-1">${name}</h5>
						</a>
						<p class="card-text">
							<li class="fact mb-2">"${fact}" </li>
							<li><span class="font-weight-bold"> Class:</span> ${year} </li>
							<li><span class="font-weight-bold"> Major:</span> ${major} </li>
							<li><span class="font-weight-bold"> Insta:</span> <a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener"> @${insta} </a> </li>
							<li><span class="font-weight-bold"> Phone:</span> ${phone} </li>
							${socials}
						</p>
					</div>
				</div>
			</div>`
		}
	} else {
		// no insta given
		output = 
		`<div class="contactCard col-6 col-md-4 col-lg-3 col-xl-2">
			<div class="card hoverable my-2">
				<div class="card-body p-1">
					<h5 class="card-title my-3 mb-1">${name}</h5>
					<p class="card-text">
						<li class="fact mb-2">"${fact}" </li>
						<li><span class="font-weight-bold"> Class:</span> ${year} </li>
						<li><span class="font-weight-bold"> Major:</span> ${major} </li>
						<li><span class="font-weight-bold"> Phone:</span> ${phone} </li>
						${socials}
					</p>
				</div>
			</div>
		</div>`
	}
	return output;
}

function search() {
	// Declare variables
	var input, filter, ul, cards, a, i, txtValue;
	input = document.getElementById('searchInput');
	filter = input.value.toLowerCase();
	ul = document.getElementById("contactInfo");
	cards = ul.getElementsByClassName('contactCard');
	console.log(cards)

	// Loop through all list items, and hide those who don't match the search query
	for (i = 0; i < cards.length; i++) {
		a = cards[i]
		txtValue = a.textContent || a.innerText;
		if (txtValue.toLowerCase().indexOf(filter) > -1) {
			cards[i].style.display = "";
		} else {
			cards[i].style.display = "none";
		}
	}
}
