// Récupération des éléments du DOM
const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const loadingDiv = document.getElementById('loading');
const locationChoicesDiv = document.getElementById('location-choices');
const weatherCard = document.getElementById('weather-card');
const errorMessageDiv = document.getElementById('error-message');

// Décodage du weathercode
function decodeWeatherCode(code, isDay) {
  if (code === 0) return isDay ? 'Ensoleillé' : 'Ciel dégagé';
  if (code === 1) return isDay ? 'Plutôt ensoleillé' : 'Ciel plutôt dégagé';
  if (code === 2) return 'Partiellement nuageux';
  if (code === 3) return 'Nuageux';
  if (code >= 45 && code <= 48) return 'Brumeux';
  if (code >= 51 && code <= 67) return 'Pluvieux';
  if (code >= 71 && code <= 77) return 'Neigeux';
  if (code >= 80 && code <= 82) return 'Pluvieux';
  if (code >= 95 && code <= 99) return 'Orageux';
  return 'Conditions inconnues';
}

// Icône météo
function getWeatherIcon(code, isDay) {
  if (code === 0 && isDay) {
    return { type: 'image', src: 'images/icon-soleil.png' };
  }
  if (code === 0) return { type: 'emoji', value: '🌙' };
  if (code === 1) return { type: 'emoji', value: isDay ? '🌤️' : '🌙' };
  if (code === 2) return { type: 'emoji', value: isDay ? '⛅' : '☁️' };
  if (code === 3) return { type: 'emoji', value: '☁️' };
  if (code >= 45 && code <= 48) return { type: 'emoji', value: '🌫️' };
  if (code >= 51 && code <= 67) return { type: 'emoji', value: '🌧️' };
  if (code >= 71 && code <= 77) return { type: 'emoji', value: '🌨️' };
  if (code >= 80 && code <= 82) return { type: 'emoji', value: '🌧️' };
  if (code >= 95 && code <= 99) return { type: 'emoji', value: '⛈️' };
  return { type: 'emoji', value: '🌡️' };
}

// description de la température
function describeTemperature(temp) {
  if (temp >= 30) return 'Très chaud';
  if (temp >= 25) return 'Chaud';
  if (temp >= 18) return 'Doux';
  if (temp >= 10) return 'Frais';
  return 'Froid';
}

// description du vent
function describeWind(speed) {
  if (speed < 6) return 'Vent calme';
  if (speed < 20) return 'Vent léger';
  if (speed < 40) return 'Vent modéré';
  if (speed < 60) return 'Vent fort';
  return 'Vent très fort';
}

// Formatage de la température et du vent
function formatTemperature(temp) {
  return `${temp.toFixed(1)}°C`;
}

function formatWindSpeed(speed) {
  return `${speed.toFixed(1)} km/h`;
}

// Gestion de l'affichage
function showLoading() {
  loadingDiv.hidden = false;
  locationChoicesDiv.hidden = true;
  weatherCard.hidden = true;
  errorMessageDiv.hidden = true;
}

function showLocationChoices() {
  loadingDiv.hidden = true;
  locationChoicesDiv.hidden = false;
  weatherCard.hidden = true;
  errorMessageDiv.hidden = true;
}

function showWeatherCard() {
  loadingDiv.hidden = true;
  locationChoicesDiv.hidden = true;
  weatherCard.hidden = false;
  errorMessageDiv.hidden = true;
}

function showError(message) {
  loadingDiv.hidden = true;
  locationChoicesDiv.hidden = true;
  weatherCard.hidden = true;
  errorMessageDiv.hidden = false;
  errorMessageDiv.textContent = message;
}

// Validation d'accessibilité du champ
function setInputInvalid(message) {
  cityInput.setAttribute('aria-invalid', 'true');
  cityInput.setAttribute('aria-describedby', 'city-error');

  // On évite de dupliquer le message d'erreur si l'utilisateur soumet plusieurs fois
  let existingError = document.getElementById('city-error');
  if (!existingError) {
    existingError = document.createElement('p');
    existingError.id = 'city-error';
    existingError.className = 'input-error';
    cityInput.insertAdjacentElement('afterend', existingError);
  }
  existingError.textContent = message;
}

function clearInputInvalid() {
  cityInput.removeAttribute('aria-invalid');
  cityInput.removeAttribute('aria-describedby');
  const existingError = document.getElementById('city-error');
  if (existingError) {
    existingError.remove();
  }
}

// Dès que l'utilisateur tape un caractère valide, on réinitialise l'état d'erreur
cityInput.addEventListener('input', () => {
  if (cityInput.value.trim().length > 0) {
    clearInputInvalid();
  }
});

// Affichage des données météo dans la carte
function renderWeatherCard(location, temperature, windSpeed, weatherStatus, weatherIcon) {
  // On vide la carte avant de la reconstruire
  weatherCard.textContent = '';

  // Construit le titre : Ville, Région/Département, Pays
  const locationParts = [location.name];
  if (location.admin1) locationParts.push(location.admin1);
  if (location.country) locationParts.push(location.country);

  const title = document.createElement('h2');
  title.textContent = locationParts.join(', ');
  weatherCard.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.className = 'weather-subtitle';
  subtitle.textContent = 'Météo actuelle';
  weatherCard.appendChild(subtitle);

  // Icône météo, affichée en grand : soit une image illustrée, soit un emoji
  const iconEl = document.createElement('div');
  iconEl.className = 'weather-icon';
  iconEl.setAttribute('aria-hidden', 'true');

  if (weatherIcon.type === 'image') {
    const img = document.createElement('img');
    img.src = weatherIcon.src;
    img.alt = '';
    img.className = 'weather-icon-img';
    iconEl.appendChild(img);
  } else {
    iconEl.textContent = weatherIcon.value;
  }

  weatherCard.appendChild(iconEl);

  const tempBlock = document.createElement('div');
  tempBlock.className = 'temp-block';

  const tempValue = document.createElement('div');
  tempValue.className = 'temp-value';
  tempValue.textContent = formatTemperature(temperature);

  const tempDescription = document.createElement('div');
  tempDescription.className = 'temp-description';
  tempDescription.textContent = describeTemperature(temperature);

  tempBlock.appendChild(tempValue);
  tempBlock.appendChild(tempDescription);
  weatherCard.appendChild(tempBlock);

  const infoRow = document.createElement('div');
  infoRow.className = 'weather-info-row';

  const statusItem = document.createElement('div');
  statusItem.className = 'info-item';
  const statusLabel = document.createElement('span');
  statusLabel.className = 'label';
  statusLabel.textContent = 'Statut';
  const statusValue = document.createElement('span');
  statusValue.className = 'value';
  statusValue.textContent = weatherStatus;
  statusItem.appendChild(statusLabel);
  statusItem.appendChild(statusValue);

  const windItem = document.createElement('div');
  windItem.className = 'info-item';
  const windLabel = document.createElement('span');
  windLabel.className = 'label';
  windLabel.textContent = 'Vent';
  const windValue = document.createElement('span');
  windValue.className = 'value';
  windValue.textContent = formatWindSpeed(windSpeed);
  const windDescription = document.createElement('span');
  windDescription.className = 'value-description';
  windDescription.textContent = describeWind(windSpeed);
  windItem.appendChild(windLabel);
  windItem.appendChild(windValue);
  windItem.appendChild(windDescription);

  infoRow.appendChild(statusItem);
  infoRow.appendChild(windItem);
  weatherCard.appendChild(infoRow);

  const updatedAt = document.createElement('p');
  updatedAt.className = 'updated-at';
  updatedAt.textContent = 'Update now';
  weatherCard.appendChild(updatedAt);
}

// Affichage de la liste de choix quand plusieurs villes correspondent
function renderLocationChoices(results) {
  locationChoicesDiv.textContent = '';

  const title = document.createElement('h2');
  title.textContent = 'Choisissez la ville correspond ?';
  locationChoicesDiv.appendChild(title);

  results.forEach((location) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'location-choice-btn';

    const mainLine = document.createElement('span');
    mainLine.className = 'choice-main';
    mainLine.textContent = location.name;

    const subParts = [];
    if (location.admin1) subParts.push(location.admin1);
    if (location.country) subParts.push(location.country);

    const subLine = document.createElement('span');
    subLine.className = 'choice-sub';
    subLine.textContent = subParts.join(', ');

    button.appendChild(mainLine);
    button.appendChild(subLine);

    button.addEventListener('click', () => {
      fetchWeatherForLocation(location);
    });

    locationChoicesDiv.appendChild(button);
  });
}

function applyDayNightBackground(isDay) {
  if (isDay) {
    document.body.classList.add('day-mode');
    document.body.classList.remove('night-mode');
  } else {
    document.body.classList.add('night-mode');
    document.body.classList.remove('day-mode');
  }
}

// Récupérer la météo pour une localité précise
async function fetchWeatherForLocation(location) {
  showLoading();

  try {
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`
    );

    if (!weatherResponse.ok) {
      showError("Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.");
      return;
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current_weather;
    const weatherStatus = decodeWeatherCode(current.weathercode, current.is_day);
    const weatherIcon = getWeatherIcon(current.weathercode, current.is_day);
    applyDayNightBackground(current.is_day);

    renderWeatherCard(location, current.temperature, current.windspeed, weatherStatus, weatherIcon);
    showWeatherCard();

  } catch (networkError) {
    showError('Connexion impossible. Veuillez vérifier votre accès à internet.');
  }
}

// Géocodage — trouver la ou les localités correspondantes
async function fetchWeatherForCity(cityName) {
  showLoading();

  try {
    // On demande un grand nombre de résultats (count=50) pour que l'utilisateur
    // puisse voir toutes les localités possibles.
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=50`
    );

    if (!geoResponse.ok) {
      showError("Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.");
      return;
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      showError("Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.");
      return;
    }

    if (geoData.results.length === 1) {

      await fetchWeatherForLocation(geoData.results[0]);
    } else {
  
      renderLocationChoices(geoData.results);
      showLocationChoices();
    }

  } catch (networkError) {
    showError('Connexion impossible. Veuillez vérifier votre accès à internet.');
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const cityName = cityInput.value.trim();

  if (cityName.length === 0) {
    setInputInvalid('Veuillez entrer le nom d\'une ville.');
    return;
  }

  clearInputInvalid();
  fetchWeatherForCity(cityName);
});