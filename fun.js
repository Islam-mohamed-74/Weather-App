const doc = {
  main: document.querySelector(".main"),
  sec1: document.querySelector(".sec1"),
  sec2: document.querySelector(".sec2"),
  row1: document.querySelector(".row-1"),
  row2: document.querySelector(".row-2"),
  row3: document.querySelector(".row-3"),
  wheatherNow: document.querySelector(".wheatherNow"),
  wheatherNowP: document.querySelector(".wheatherNow p"),
  wheatherNowH3: document.querySelector(".wheatherNow h3"),
  wheatherNowH2: document.querySelector(".wheatherNow h2"),
  wheatherNowImg: document.querySelector(".wheatherNow img"),
  containerForecast: document.querySelector(".container-forecast"),
  containerDetails: document.querySelector(".container-details"),
  sunrise: document.querySelector(".sunrise"),
  sunset: document.querySelector(".sunset"),
  chanceOfRain: document.querySelector(".Chance-of-rain"),
  wind: document.querySelector(".wind"),
  humidity: document.querySelector(".humidity"),
  fellsLike: document.querySelector(".fells-like"),
  containerDays: document.querySelector(".containerDays"),
};

document.querySelectorAll(".fc img").forEach((img) => {
  img.addEventListener("click", (e) => {
    // console.log(e.target.src);
    const unit = e.target.src.includes("°F") ? "imperial" : "metric";
    const city = document.querySelector(".inputs input").value || "cairo";
    getWeather(city, unit);
  });
});

const getWeather = function (city = "cairo", unit = "metric") {
  const getDetails = new XMLHttpRequest();
  getDetails.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=250574009d10dea06e5204701fad859d`
  );
  getDetails.send();
  getDetails.addEventListener("readystatechange", function () {
    if (getDetails.readyState == 4 && getDetails.status == 200) {
      console.log("sucess");
      state.wheatherDetails = JSON.parse(getDetails.responseText);
      state.list = state.wheatherDetails.list;
      // console.log(state.wheatherDetails);
      cityName(state);
      todayForcast(state);
      weatherDetails(state);
      SevenDays(state);
    }
    if (getDetails.status === 404) {
      document.querySelector(".error-message").textContent =
        "The city not found";
      document.querySelector(".error-message").style.display = "block";
    } else if (getDetails.status !== 200) {
      document.querySelector(".error-message").textContent =
        "Something went wrong try again";
      document.querySelector(".error-message").style.display = "block";
    }
  });
  removeSkelton();
};

const cityName = function (state) {
  doc.wheatherNowP.innerHTML = state.wheatherDetails.list[0].dt_txt;
  doc.wheatherNowH3.innerHTML = state.wheatherDetails.city.name;
  doc.wheatherNowH2.innerHTML =
    Math.round(state.wheatherDetails.list[0].main.temp) + "°C";
};
const todayForcast = function (state) {
  doc.containerForecast.innerHTML = "";
  const newData = state.list.map((item) => {
    return {
      day: item.dt_txt,
      icon: item.weather[0].icon,
      temp: item.main.temp,
    };
  });
  console.log(newData);

  for (let i = 0; i < newData.length; i++) {
    console.log(newData.length);
    const box = document.createElement("div");
    box.classList.add("box");
    const day = document.createElement("p");
    day.classList.add("body-2");
    day.classList.add("text-grey-900-60");
    day.innerHTML = newData[i].day.split(" ")[1].slice(0, 5);
    box.appendChild(day);
    const icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/w/${newData[i].icon}.png`;
    icon.alt = newData[i].icon;
    box.appendChild(icon);
    const temp = document.createElement("p");
    temp.classList.add("body-3");
    temp.classList.add("text-grey-900-87");
    temp.innerHTML = Math.round(newData[i].temp) + "°C";
    box.appendChild(temp);
    doc.containerForecast.appendChild(box);
  }
};

const weatherDetails = function (state) {
  const newWeather = function (state) {
    return {
      sunrise: state.wheatherDetails.city.sunrise,
      sunset: state.wheatherDetails.city.sunset,
      chanceOfRain: state.wheatherDetails.list[0].pop,
      wind: state.wheatherDetails.list[0].wind.speed,
      humidity: state.wheatherDetails.list[0].main.humidity,
      fellsLike: state.wheatherDetails.list[0].main.feels_like,
    };
  };
  const newWeatherData = newWeather(state);
  const sunrise = new Date(newWeatherData.sunrise * 1000); // ضربنا ب 1000 للتحويل الى ملي ثانية
  const sunsit = new Date(newWeatherData.sunset * 1000);
  console.log(newWeatherData);
  document.querySelector(
    ".sunriseH3"
  ).innerHTML = `${sunrise.getHours()}:${sunrise.getMinutes()}`;
  document.querySelector(
    ".sunsetH3"
  ).innerHTML = `${sunsit.getHours()}:${sunsit.getMinutes()}`;
  document.querySelector(
    ".rain-h3"
  ).innerHTML = `${newWeatherData.chanceOfRain}%`;
  document.querySelector(".windH3").innerHTML = `${newWeatherData.wind}km/h`;
  document.querySelector(
    ".humidityH3"
  ).innerHTML = `${newWeatherData.humidity}%`;
  document.querySelector(".fellsH3").innerHTML = `${Math.round(
    newWeatherData.fellsLike
  )}°C`;
};

const SevenDays = function (state) {
  doc.containerDays.innerHTML = "";
  const newData = state.list.map((item) => {
    return {
      day: item.dt_txt,
      tempMin: item.main.temp_min,
      tempMax: item.main.temp_max,
      desc: item.weather[0].description,
      icon: item.weather[0].icon,
    };
  });

  for (let i = 0; i < newData.length; i += 8) {
    let day = document.createElement("div");
    const dateOnly = newData[i].day.split(" ")[0];
    const dayName = new Date(newData[i].day).toLocaleDateString("en-US", {
      weekday: "long",
    });
    day = `
           <div class="day1">
              <div class="box">
                <div class="text">
                  <h3 class="body text-grey-900-60">
                    ${dateOnly.split("-")[2]}/${dateOnly.split("-")[1]}
                   </h3>
                  <p class="body"> ${dayName}</p>
                </div>
                <div class="icon">
                  <img src="https://openweathermap.org/img/w/${
                    newData[i].icon
                  }.png" alt="" />
                  <p class="body">${newData[i].desc}</p>
                </div>
                <div class="temp">
                  <h3 class="body text-grey-900-60">${Math.round(
                    newData[i].tempMax
                  )}°C/${Math.round(newData[i].tempMin)}°C</h3>
                </div>
              </div>
            </div>
            <hr style="background-color: #1A237E29"/>
    `;
    doc.containerDays.innerHTML += day;
  }

  console.log(newData.length);
};

function fetchCitySuggestions(query) {
  if (!query) {
    document.querySelector(".suggestions").style.display = "none";
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&type=city&limit=${SUGGESTIONS_LIMIT}&apiKey=59f05fe6e930429494c8afba6e21735f`
  );
  xhr.send();
  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const suggestions = JSON.parse(xhr.responseText).features;
      console.log(suggestions);
      displaySuggestions(suggestions);
    } else {
      console.log("error");
    }
  });
}

function displaySuggestions(suggestions) {
  const suggestionsHTML = suggestions
    .map((suggestion) => {
      const city = suggestion.properties.city || "Unknown";
      return `
        <div class="suggestion" data-id="${city}">
          <p>${city}</p>
        </div>
        
      `;
    })
    .join("");
  if (suggestions.length === 0) {
    document.querySelector(".suggestions").innerHTML =
      "<p>No results found</p>";
  } else {
    document.querySelector(".suggestions").innerHTML = suggestionsHTML;
  }
  document.querySelector(".suggestions").style.display = "block";
  document.querySelectorAll(".suggestion").forEach((suggestionEl) => {
    suggestionEl.addEventListener("click", () => {
      const city = suggestionEl.getAttribute("data-id");
      document.querySelector(".inputs input").value = city;
      document.querySelector(".suggestions").style.display = "none";
      getWeather(city);
    });
  });
}

const removeSkelton = function () {
  document.querySelectorAll(".skeleton").forEach((el) => {
    el.classList.remove("skeleton");
  });
};
