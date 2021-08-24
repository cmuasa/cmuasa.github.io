$.get(
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vTgBvOrP7YFoKMjFr8HdMZbN--xlrQodsbeVsya3MfDxvXK9dDYrzFb8OGHqrzRgYw8jH30m051AGXw/pub?gid=203246274&single=true&output=tsv',
	function (data) {
		data = data.split("\r\n")
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
		var i;
		let people = new Set();
		for (i = 1; i < data.length; i++) {
			let row = data[i].split("\t");
			console.log(row)

			let name = row[1].trim();
			let insta = row[8].toLowerCase().trim();
			let phone = row[7].trim();
			let year = row[3].trim();
			let major = row[4].trim();
			let fact = row[5].trim();
			let socials = row[9].trim();
			let where = row[6].trim();
			let photoURL;
			let key = JSON.stringify({name, insta, phone, year});
			if (!people.has(key)) {
				people.add(key)
			} else {
				console.log(`${name} repeated, skipping`)
				continue;
			}
			if (phone) {
				phone = `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`
			}
			if (insta) {
				// check if insta URL is in local storage
				if (localStorage.getItem(insta)) {
					photoURL = localStorage.getItem(insta)
					document.getElementById('contactInfo').innerHTML += format(name, insta, photoURL, phone, year, major, fact, socials, where);
					//console.log(`Found ${photoURL} for @${insta}`)
				} else {
					// getting instagram page info
					$.get('https://www.instagram.com/' + insta + '/?__a=1')
					.done(function (data) {
						try {
							let photoURL = data['graphql']['user']['profile_pic_url_hd'];
							// found photoURL
							document.getElementById('contactInfo').innerHTML += format(name, insta, photoURL, phone, year, major, fact, socials, where);
							localStorage.setItem(insta, photoURL)
							console.log(`Saving ${photoURL} for @${insta}`)
						} catch {
							// no photoURL found
							document.getElementById('contactInfo').innerHTML += format(name, insta, false, phone, year, major, fact, socials, where);
							console.log(`Could not get instagram picture for @${insta}`)
						}
					})
					.fail(function () {
						console.log(`Could not find insta page for @${insta}`);
						// couldn't find insta
						document.getElementById('contactInfo').innerHTML += format(name, insta, false, phone, year, major, fact, socials, where);
					});
				}
			} else {
				console.log(`No insta given for ${name}`);
				// no insta given
				document.getElementById('contactInfo').innerHTML += format(name, false, false, phone, year, major, fact, socials, where);
			}
		}
		//console.log(localStorage)
	}
);

function format(name, insta, photoURL, phone, year, major, fact, socials, where) {
	let output;
	let photo;

	if (phone) {
		phone = `<li><span class="font-weight-bold">Phone</span>: ${phone} </li>`;
	} else {
		phone = '';
	}
	if (socials) {
		socials = `<li><span class="font-weight-bold">Other Socials</span>: ${socials} </li>`;
	} else {
		socials = '';
	}
	if (where) {
		where = `<li><span class="font-weight-bold">Location</span>: ${where} </li>`;
	} else {
		where = '';
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
								${where}
								<li><span class="font-weight-bold"> Insta:</span> <a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener"> @${insta} </a> </li>
								${phone}
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
							${where}
							<li><span class="font-weight-bold"> Insta:</span> <a href="https://www.instagram.com/${insta}" target="_blank" rel="noopener"> @${insta} </a> </li>
							${phone}
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
						${where}
						${phone}
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
