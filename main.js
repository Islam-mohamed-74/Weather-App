// 250574009d10dea06e5204701fad859d

const state = {
  wheatherDetails: [],
  list: [],
};
const SUGGESTIONS_LIMIT = 5;
let input = document.querySelector("input");
let city;
window.addEventListener("load", function () {
  getWeather();
  document.querySelector(".inputs input").addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    fetchCitySuggestions(query);
  });
  document.querySelector(".inputs input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const city = e.target.value.toLowerCase();
      if (city) {
        document.querySelector(".suggestions").style.display = "none";
        getWeather(city);
      }
    }
  });
});
