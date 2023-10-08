import axios from "axios";

const API_KEY = "live_GymnRAQGwsneAyhiyx7kN5wvUkhJUpnOj80W6a57M8BqYRRQYypWBuJ6C9T2JgY8";
axios.defaults.headers.common["x-api-key"] = API_KEY;

const breedSelect = document.querySelector(".breed-select");
const loader = document.querySelector(".loader");
const error = document.querySelector(".error");
const catInfo = document.querySelector(".cat-info");

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

function showError() {
  error.style.display = "block";
}

function hideError() {
  error.style.display = "none";
}

function showCatInfo() {
  catInfo.style.display = "block";
}

function hideCatInfo() {
  catInfo.style.display = "none";
}

async function fetchBreeds() {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/breeds");
    const breeds = response.data;
    breedSelect.innerHTML = breeds
      .map((breed) => `<option value="${breed.id}">${breed.name}</option>`)
      .join("");
  } catch (err) {
    showError();
  }
}

async function fetchCatByBreed(breedId) {
  try {
    showLoader();
    hideCatInfo();
    hideError();
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    const catData = response.data[0];
    const catImage = document.createElement("img");
    catImage.src = catData.url;
    catImage.alt = catData.breeds[0].name;
    catImage.className = "cat-image"; 
    const catDetails = document.createElement("div");
    catDetails.className = "cat-details"; 
    const catBreed = `<p>Breed: ${catData.breeds[0].name}</p>`;
    const catDescription = `<p>Description: ${catData.breeds[0].description}</p>`;
    const catTemperament = `<p>Temperament: ${catData.breeds[0].temperament}</p>`;
    catDetails.innerHTML = catBreed + catDescription + catTemperament;
    catInfo.innerHTML = ""; 
    catInfo.appendChild(catImage);
    catInfo.appendChild(catDetails);
    showCatInfo();
  } catch (err) {
    showError();
  } finally {
    hideLoader();
  }
}

breedSelect.addEventListener("change", (event) => {
  const breedId = event.target.value;
  if (breedId) {
    fetchCatByBreed(breedId);
  } else {
    hideCatInfo();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchBreeds();
});
