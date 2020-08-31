$.getJSON(
	'https://spreadsheets.google.com/feeds/list/1EINwSpaZT3hj8NDIdFPWdJooWbAp_8vbmqq-5eZcJvs/1/public/full?alt=json',
	function (data) {
		var localStorage = window.localStorage;

		// parse through Google Sheets data
		var sheetData = data.feed.entry;
		var i;
        let set = new Set();
        var classes = new Object();
		for (i = 0; i < sheetData.length; i++) {
            let name = data.feed.entry[i]['gsx$fullname']['$t'].trim();
            let email = data.feed.entry[i]['gsx$andrewemail']['$t'].trim();
            let phone = data.feed.entry[i]['gsx$phonenumber']['$t'].trim();
            phone = `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`
            let year = data.feed.entry[i]['gsx$year']['$t'].trim();
            let major = data.feed.entry[i]['gsx$majorcollege']['$t'].trim();
            let socials = data.feed.entry[i]['gsx$socialhandles']['$t'].trim();
            let location = data.feed.entry[i]['gsx$location']['$t'].trim();
            let course1 = data.feed.entry[i]['gsx$course1number']['$t'].trim();
            let course2 = data.feed.entry[i]['gsx$course2number']['$t'].trim();
            let course3 = data.feed.entry[i]['gsx$course3number']['$t'].trim();
            let course4 = data.feed.entry[i]['gsx$course4number']['$t'].trim();
            let course5 = data.feed.entry[i]['gsx$course5number']['$t'].trim();
            let course6 = data.feed.entry[i]['gsx$course6number']['$t'].trim();
            
            let person = {name: name, email: email, phone: phone, year: year, major: major, socials: socials, location: location};

            let courses = [course1,course2,course3,course4,course5,course6];
            for (j = 0; j < courses.length; j++) {
                let course = courses[j];
                if (course) {
                    if (!(course in classes)) { // add class to course object
                        classes[course] = [person]
                    } else {
                        classes[course].push(person);                        
                    }
                }
            }

			let key = JSON.stringify({name, email, phone, year, major, course1, course2, course3, course4, course5, course6});
			if (!set.has(key)) {
				set.add(key)
			} else {
				console.log(`${name} repeated, skipping`)
				continue;
			}
        }
        console.log(classes)
        var keys = Object.keys(classes)
        for (const course of keys) {
            document.getElementById('contactInfo').innerHTML += format(course, classes[course])
        }

		//console.log(localStorage)
	}
);

function format(course, courseObject) {
    let people = ``;
    var keys = Object.keys(courseObject);
    if (keys.length <= 1) {
        return ``
    }
    for (const key of keys) {
        let socials = ""
        if (courseObject[key]["socials"]) {
            socials = `<li><span class="font-weight-bold"> Socials:</span> ${courseObject[key]["socials"]} </li>`
        }
        people += 
        `<div class="contactCard col-6 col-md-4 col-lg-3 col-xl-2">
            <div class="card hoverable my-2">
                <div class="card-body p-1">
                    <h5 class="card-title my-3 mb-1">${courseObject[key]["name"]}</h5>
                    <p class="card-text">
                        <li><span class="font-weight-bold"> Class:</span> ${courseObject[key]["year"]} </li>
                        <li><span class="font-weight-bold"> Major:</span> ${courseObject[key]["major"]} </li>
                        <li><span class="font-weight-bold"> Phone Number:</span> ${courseObject[key]["phone"]} </li>
                        ${socials}
                        <li><span class="font-weight-bold"> Location:</span> ${courseObject[key]["location"]} </li>
                        <li><span class="font-weight-bold">Email:</span><a href="mailto:${courseObject[key]["email"]}" class="font-weight-bold"> </span> ${courseObject[key]["email"]} </a></li>
                        </p>
                </div>
            </div>
        </div>`
    }

    var settings = {
        "url": `https://apis.scottylabs.org/course/courses/courseID/${course}`,
        "method": "GET",
        "datatype": "json",
        async: false
    };

    var courseName = "";
    var courseDesc = "";
    $.ajax(settings).done(function (response) {
        courseName = response["name"]
        courseDesc = response["desc"]
        console.log(response)
    });


    let output = `
    <div class="classRow container-fluid text-center px-sm-5 mb-5"> 
        <h4>${course.slice(0, 2)}-${course.slice(2, 5)}: ${courseName}</h4>
        <h6 class="font-weight-normal mx-md-5">${courseDesc}</h6>
        <div class="row"> 
            ${people}
        </div>
    </div>
    `


    return output
}

function personSearch() {
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
