const moon = document.querySelector(".fa-moon");
const nav = document.querySelector("nav");
const backButton = document.querySelector(".back");
const backTag = document.querySelectorAll(".back a");
const countryData = document.querySelector(".country-data");
const loader = document.querySelector(".loader");

// ----lightmode variable checker--
let value = localStorage.getItem("weather");
if (value == "sun") {
  document.body.classList.toggle("active");
  moon.classList.toggle("fa-sun");
  nav.classList.toggle("lightmode");
  backButton.classList.toggle("lightmode");
  backTag.forEach((tag) => {
    tag.classList.toggle("lightmode");
  });
} else {
  document.body.classList.remove("active");
  moon.classList.remove("fa-sun");
  nav.classList.remove("lightmode");
  backButton.classList.remove("lightmode");
  backTag.forEach((tag) => {
    tag.classList.remove("lightmode");
  });
}

// ---lightmode toggler----
moon.addEventListener("click", function () {
  document.body.classList.toggle("active");
  moon.classList.toggle("fa-sun");
  nav.classList.toggle("lightmode");
  backButton.classList.toggle("lightmode");
  backTag.forEach((tag) => {
    tag.classList.toggle("lightmode");
  });
  lightmodeCheck();
  if (backButton.classList.contains("lightmode")) {
    mode = "sun";
    localStorage.setItem("weather", mode);
  } else {
    mode = "moon";
    localStorage.setItem("weather", mode);
  }
});

// ----country name passed from page1 / clicked country from page1---
let countryGotten = localStorage.getItem("country");

// ----function that renders the clicked country's details---
function searchFetcher(url) {
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      loader.classList.add("disappear");
      for (country of data) {
        console.log(country.currencies);
        let currency;
        if (country.currencies) {
          currency = Object.values(country.currencies);
        } else {
          currency = "Unknown";
        }
        let language;
        if (country.languages) {
          language = Object.values(country.languages);
        } else {
          language = "Unknown";
        }
        let popN = country.population.toLocaleString("en-US");
        countryData.innerHTML = `
         <div class="country-image">
             <img src=${country.flags.png} alt="" />
         </div>
         <div class="country-details">
            <h2 class="country-name">${country.name.common}</h2>
            <div class="content">
              <div class="left">
                <p class="native-name"><span class="sub-heading">Native Name:</span>${country.altSpellings[1]}</p>
                <p class="population"><span class="sub-heading"> Population:</span>${popN}</p>
                <p class="region"><span class="sub-heading">Region:</span>${country.continents}</p>
                <p class="sub-region"><span class="sub-heading">Sub Region:</span>${country.subregion}</p>
                <p class="capital"><span class="sub-heading">Capital:</span>${country.capital}</p>
              </div>
              <div class="left">
                <p class="top-level-domain"><span class="sub-heading">Top Level domain :</span>${country.altSpellings[0]}</p>
                <p class="currencies"><span class="sub-heading"> Currencies:</span>${currency[0].name}</p>
                <p class="languages"><span class="sub-heading">Languages:</span><span>${language}</span>
              </div>
            </div>
            <div class="border-countries">
              <h3 class="b-heading" >Border Countries:</h3>
              <div class="border">
              </div>
            </div>
          </div>
         `;
        if (!country.capital) {
          countryData.querySelector(".capital").remove();
        }
        if (!country.altSpellings[1]) {
          countryData.querySelector(".native-name").remove();
        }
        if (!country.subregion) {
          countryData.querySelector(".sub-region").remove();
        }
        if (!currency[0].name) {
          countryData.querySelector(".currencies").remove();
        }
        if (!language) {
          countryData.querySelector(".languages").remove();
        }
        if (country.borders) {
          const borderC = country.borders;
          for (const bCountry of borderC) {
            const span = document.createElement("span");
            span.className = "b-country";
            span.innerHTML = `
                <a>${bCountry}</a>
                `;
            countryClick(span);
            countryData
              .querySelector(".country-details .border-countries .border")
              .appendChild(span);
          }
        } else {
          countryData.querySelector(
            ".country-details .border-countries"
          ).innerHTML = ``;
        }
        // ---checks if prevPage had limghtmode activated--
        if (value === "sun") {
          lightmodeCheck();
        }
      }
    });
}

// ----calls the search fetcher function passing data that was gotten from the prevPage
searchFetcher(`https://restcountries.com/v3.1/name/${countryGotten}`);

// ---activates lightmode for js rendered elements---
function lightmodeCheck() {
  let bCountry = countryData.querySelectorAll(".border .b-country");
  let bHeading = countryData.querySelector(".b-heading");
  if (bHeading) {
    bHeading.classList.toggle("lightmode");
  }
  let countryNameBig = countryData.querySelector(".country-name");
  let subheadingText = countryData.querySelectorAll("p .sub-heading");
  let pText = countryData.querySelectorAll("p");
  bCountry.forEach((border) => {
    border.classList.toggle("lightmode");
  });
  subheadingText.forEach((text) => {
    text.classList.toggle("lightmode");
  });
  pText.forEach((text) => {
    text.classList.toggle("lightmode");
  });
  countryNameBig.classList.toggle("lightmode");
}

// ---adds event listener to any Border country that is clicked in the country details page--
function countryClick(span) {
  span.addEventListener("click", function () {
    const countryName = span.textContent.trim();
    borderCountryRender(countryName);
  });
}

// generatess the clicked border country's data on the same page
function borderCountryRender(countryName) {
  fetch(`https://restcountries.com/v2/alpha/${countryName}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let language = Object.values(data.languages);
      let languages = [];
      for (lang of language) {
        languages.push(lang.name);
      }
      let popN = data.population.toLocaleString("en-US");
      countryData.innerHTML = `
         <div class="country-image">
             <img src=${data.flags.png} alt="" />
         </div>
         <div class="country-details">
            <h2 class="country-name">${data.name}</h2>
            <div class="content">
              <div class="left">
                <p class="native-name"><span class="sub-heading">Native Name:</span>${data.name}</p>
                <p class="population"><span class="sub-heading"> Population:</span>${popN}</p>
                <p class="region"><span class="sub-heading">Region:</span>${data.region}</p>
                <p class="sub-region"><span class="sub-heading">Sub Region:</span>${data.subregion}</p>
                <p class="capital"><span class="sub-heading">Capital:</span>${data.capital}</p>
              </div>
              <div class="left">
                <p class="top-level-domain"><span class="sub-heading">Top Level domain:</span>${data.altSpellings[0]}</p>
                <p class="currencies"><span class="sub-heading"> Currencies:</span>${data.currencies[0].name}</p>
                <p class="languages"><span class="sub-heading">Languages:</span><span>${languages}</span>
              </div>
            </div>
            <div class="border-countries">
              <h3 class="b-heading" >Border Countries:</h3>
              <div class="border">
              </div>
            </div>
          </div>
         `;
      if (!data.capital) {
        div.querySelector(".capital").remove();
      }
      if (!data.capital) {
        countryData.querySelector(".capital").remove();
      }
      if (!data.altSpellings[1]) {
        countryData.querySelector(".native-name").remove();
      }
      if (!data.subregion) {
        countryData.querySelector(".sub-region").remove();
      }
      if (!data.currencies[0].name) {
        countryData.querySelector(".currencies").remove();
      }
      if (!languages) {
        countryData.querySelector(".languages").remove();
      }
      if (data.borders) {
        const borderC = data.borders;
        for (const bCountry of borderC) {
          const span = document.createElement("span");
          span.className = "b-country";
          span.innerHTML = `
                <a>${bCountry}</a>
                `;
          countryClick(span);
          countryData
            .querySelector(".country-details .border-countries .border")
            .appendChild(span);
        }
        if (nav.classList.contains("lightmode")) {
          let bCountry = countryData.querySelectorAll(".border .b-country");
          let bHeading = countryData.querySelector(".b-heading");
          if (bHeading) {
            bHeading.classList.toggle("lightmode");
          }
          let countryNameBig = countryData.querySelector(".country-name");
          let subheadingText = countryData.querySelectorAll("p .sub-heading");
          let pText = countryData.querySelectorAll("p");
          bCountry.forEach((border) => {
            border.classList.toggle("lightmode");
          });
          subheadingText.forEach((text) => {
            text.classList.toggle("lightmode");
          });
          pText.forEach((text) => {
            text.classList.toggle("lightmode");
          });
          countryNameBig.classList.toggle("lightmode");
        }
      } else {
        countryData.querySelector(
          ".country-details .border-countries"
        ).innerHTML = ``;
      }
    });
}
