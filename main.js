let cityB = document.getElementById('city');
let locButton=document.getElementById('location-button');
let API_KEY="ec26f2221b0b58e92391ee088381013d";


// Get weather data for the user's current location
locButton.addEventListener('click', function() {
        cityB.value = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {  
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`).
                then(response => response.json()).
                then(data => {

                    displayWeather(data);
                });

            });
            
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

cityB.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

// Get weather data for the user's entered city
async function getWeather() {
    let city=cityB.value;
    if (!city) {
        cityWarning();
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    await fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

}
// Get weather data for the user's current location
async function displayWeather(data) {
    success();
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const icons = document.getElementById('icondiv');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        document.getElementById('weather-icon').style.display = 'none';
        icons.innerHTML = '';
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        CityNotFound();
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
            <p>${data.wind.speed} Km/h</p>
            <p>${data.main.humidity} g/m</p>
        `;
          
        const iconHtml = `
            <img width="48" height="48" src="https://img.icons8.com/fluency/48/location--v1.png" alt="location--v1"/>
            <img width="48" height="48" src="https://img.icons8.com/fluency/48/barometer.png" alt="barometer"/>
            <img width="48" height="48" src="https://img.icons8.com/fluency/48/wind.png" alt="wind"/>
            <img width="48" height="48" src="https://img.icons8.com/fluency/48/hygrometer.png" alt="hygrometer"/>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        icons.innerHTML = iconHtml;

        tempDivInfo.innerHTML += `<div id="flag"></div>`;
        let flag = document.getElementById('flag');
        flag.innerHTML = `<img src="https://flagsapi.com/${data.sys.country}/flat/64.png" alt="flag" loading="lazy"/>`;
        flag.style="margin-bottom: 25px;";

        tempDivInfo.style = 'display: flex; justify-content: center; align-items: center; gap: 20px;';
        icons.style = 'display: flex; justify-content: space-evenly; align-items: center; gap: 15px;margin-top: 10px;';
        weatherInfoDiv.style = 'display: flex; justify-content: space-evenly; align-items: center; gap: 8px;margin-top: 5px;';

        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        await showImage();
    }
}


// Show the weather icon once it's loaded
async function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
    weatherIcon.style.height = '100px';
    weatherIcon.style.width = '100px';
}


// Toast Notification
let notifications = document.getElementById('notifications');
function createToast(type, icon, title, text){
    let newToast = document.createElement('div');
    newToast.innerHTML = `
        <div class="toast ${type}">
            <i class="${icon}"></i>
            <div class="content">
                <div class="title">${title}</div>
                <span>${text}</span>
            </div>
            <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
        </div>`;
    notifications.appendChild(newToast);
    newToast.timeOut = setTimeout(
        ()=>newToast.remove(), 3000
    )
}
let success=()=>{
    let type = 'success';
    let icon = 'fa-solid fa-circle-check';
    let title = 'Success';
    let text = 'Weather data Updated Successfully.';
    createToast(type, icon, title, text);
}
let cityWarning=()=>{
    let type = 'No_city_entered';
    let icon = 'fa-solid fa-triangle-exclamation';
    let title = 'Warning';
    let text = 'Please enter a city name.';
    createToast(type, icon, title, text);
}

let CityNotFound=()=>{
    let type = 'City_Not_Found';
    let icon = 'fa-solid fa-circle-exclamation';
    let title = 'Error';
    let text = 'Entered City name not found!';
    createToast(type, icon, title, text);
}