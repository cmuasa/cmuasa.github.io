$.get(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSg0pDcZiu9N65LezHh2GLu91LU6i9purafQBriPfT6s2TSa7Xgla7SlRkE6BZRz43FiGqNTrPfVf2/pub?gid=2069243529&single=true&output=csv",
  function (data) {
    data = data.split("\r\n");

    // parse through Google Sheets data
    var i;
    let set = new Set();
    var classes = new Object();
    for (i = 0; i < data.length - 1; i++) {
      let row = data[i].split(",");

      let name = row[1].trim();
      let email = row[2].trim();
      let phone = row[3].trim();
      phone = `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
      let year = row[4].trim();
      let major = row[5].trim();
      let socials = row[2].trim();
      let location = row[13].trim();
      let course1 = row[6].trim();
      let course2 = row[7].trim();
      let course3 = row[8].trim();
      let course4 = row[9].trim();
      let course5 = row[10].trim();
      let course6 = row[11].trim();

      let person = {
        name: name,
        email: email,
        phone: phone,
        year: year,
        major: major,
        socials: socials,
        location: location,
      };

      let courses = [course1, course2, course3, course4, course5, course6];
      let key = JSON.stringify({ name, email, phone, year, major, courses });

      if (!set.has(key)) {
        set.add(key);
      } else {
        console.log(`${name} repeated, skipping`);
        continue;
      }

      for (j = 0; j < courses.length; j++) {
        let course = courses[j];
        if (course) {
          if (!(course in classes)) {
            // add class to course object
            classes[course] = [person];
          } else {
            classes[course].push(person);
          }
        }
      }
    }
    var keys = Object.keys(classes);
    for (const course of keys) {
      document.getElementById("contactInfo").innerHTML += format(
        course,
        classes[course]
      );
    }
  }
);

function format(course, courseObject) {
  let people = ``;
  var keys = Object.keys(courseObject);
  if (keys.length <= 1) {
    return ``;
  }
  for (const key of keys) {
    let socials = "";
    if (courseObject[key]["socials"]) {
      socials = `<li><span class="font-weight-bold"> Socials:</span> ${courseObject[key]["socials"]} </li>`;
    }
    people += `<div class="contactCard col-6 col-md-4 col-lg-3 col-xl-2">
            <div class="card hoverable my-2">
                <div class="card-body p-1">
                    <h5 class="card-title my-3 mb-1">${courseObject[key]["name"]}</h5>
                    <p class="card-text">
                        <li><span class="font-weight-bold"> Class:</span> ${courseObject[key]["year"]} </li>
                        <li><span class="font-weight-bold"> Major:</span> ${courseObject[key]["major"]} </li>
                        <li><span class="font-weight-bold"> Phone:</span> ${courseObject[key]["phone"]} </li>
                        ${socials}
                        <li><span class="font-weight-bold"> Location/Dorm:</span> ${courseObject[key]["location"]} </li>
                        <li><span class="font-weight-bold">Email:</span><a href="mailto:${courseObject[key]["email"]}" class="font-weight-bold"> </span> ${courseObject[key]["email"]} </a></li>
                        </p>
                </div>
            </div>
        </div>`;
  }

  var settings = {
    url: `https://apis.scottylabs.org/course/courses/courseID/${course}`,
    method: "GET",
    datatype: "json",
    async: false,
  };

  var courseName = "";
  var courseDesc = "";
  $.ajax(settings).done(function (response) {
    courseName = response["name"];
    courseDesc = response["desc"];
  });

  let output = `
    <div class="classRow container-fluid text-center px-sm-5 mb-5"> 
        <h4>${course.slice(0, 2)}-${course.slice(2, 5)}: ${courseName}</h4>
        <h6 class="description font-weight-normal mx-md-5">${courseDesc}</h6>
        <div class="row justify-content-center"> 
            ${people}
        </div>
    </div>
    `;
  return output;
}

function courseSearch() {
  var input, filter, ul, cards, a, i, txtValue;
  input = document.getElementById("courseSearchInput");
  filter = input.value.toLowerCase().trim();

  ul = document.getElementById("contactInfo");
  cards = ul.getElementsByClassName("classRow");

  for (i = 0; i < cards.length; i++) {
    a = cards[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toLowerCase().indexOf(filter) > -1) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function showDescription() {
  var desc = document.getElementsByClassName("description");
  for (i = 0; i < desc.length; i++) {
    desc[i].style.display = "";
  }
}

function hideDescription() {
  var desc = document.getElementsByClassName("description");
  for (i = 0; i < desc.length; i++) {
    desc[i].style.display = "none";
  }
}
