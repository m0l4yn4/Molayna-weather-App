const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");
const errorMsg = document.getElementById("errorMsg");
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const historyList = document.getElementById('historyList');

    /* API */
    
const apiKey = "2f76e00b1c864a87954b5f242e1d00c5";

let history = JSON.parse(localStorage.getItem("history")) || [];

    /* load history if start web*/
    
    window.addEventListener('DOMContentLoaded', () => {
        renderHistory();
    });

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keydown", e => {
    if (e.key === "Enter") getWeather();
});

async function getWeather() {
    const city = cityInput.value.trim();
    if (city === "") {
        showError("ກະລຸນາພິມຊື່ເມືອງກ່ອນ");
        return;
    }
    
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error("ບໍ່ພົບເຫັນເມືອງນີ້");
        }
        
        const data = await res.json();
        displayWeather(data);
        addHistoy(data.name);
    } catch (err) {
        showError(err.message);
    }
}

function displayWeather(data) {
    
    errorMsg.textContent = "";
    weatherResult.classList.remove("hidden");
    
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `🌡️  ${data.main.temp.toFixed(1)} ອົງສາ°C`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `💧 ຄວາມຊື້ນ: ${data.main.humidity} %`
    wind.textContent = `🌬️ ລົມ: ${data.wind.speed} m/s`;
    pressure.textContent = `📊  ຄວາມກົດອາກາດ ${data.main.pressure} hPa`;
    sunrise.textContent = `🌅 ຕາເວັນຂື້ນ: ${new Date(data.sys.sunrise*1000).toLocaleTimeString()}`;
    sunset.textContent = `🌄  ຕາເວັນຕົກ: ${new Date(data.sys.sunset*1000).toLocaleTimeString()}`; 
    
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const condition = data.weather[0].main;
    
    changeBackground(condition);
    
    description.textContent = laoTranslate(data.weather[0].main);
}

function showError(msg) {
    weatherResult.classList.add("hidden");
    errorMsg.textContent = msg;
}

function changeBackground(condition) {
    const body = document.body;
    
    body.classList.remove("clear", "clouds", "rain", "thunder", "mist");
    
    switch (condition) {
        case 'Clear':
            body.classList.add('clear');
            break;
            
        case 'Clouds':
            body.classList.add('clouds');
            break;
            
        case 'Rain':
        case 'Drizzle':
            body.classList.add('rain');
            break;
            
        case 'Thunderstorm':
            body.classList.add('thunder');
            break;
            
        case 'Mist':
        case 'Fog':
        case 'Haze':
            body.classList.add('mist');
            break;
            
        default:
            body.classList.add('clear');
    }
}
function laoTranslate(main) {
    const map = {
        'Clear' : 'ມີແດດ',
        'Clouds' : 'ມີເມກ',
        'Rain' : 'ຝົນຕົກ',
        'Drizzle' : 'ຝົນຝອຍ',
        'Thunderstorm' : 'ພາຍຸຝົນ',
        'Mist' : 'ໝອກ',
        'Fog' : 'ໝອກໜາ',
        'Haze' : 'ໝອກຄວັນ'
    };
    return map[main] || main;
}

function addHistoy(city) {
        /* if the city is duplicated, remove it*/
    history = history.filter(c => c !== city);
    history.unshift(city);
    if (history.length > 5) history.pop();
    
    localStorage.setItem('history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    history.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => getWeather(city));
        historyList.appendChild(li);
    });
}

console.log("gg")
