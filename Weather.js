const apiKeyWeather = "69462d25d804b1ba0c25a97bc206474e"
const apiKeyGeo = "YjgyNTU3NzUxODY2NDhlYjgxMmI0ZTA0NTQ4NGU1N2I6ZDFlNDQzMzMtMDg2Ni00M2JjLWFmMjgtNDI1MmRjMWE2YzM4"
const input = document.querySelector("input");
const searchButton = document.querySelector(".search");
const displayContainer = document.querySelector(`.display_container`);
let weatherData = [];

const getCoordinates = async location => {
    const locationFixed = location.trim().toLowerCase();
    const request = `https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${locationFixed}&language=en&apiKey=${apiKeyGeo}`;
    const data = await fetch(request).then(response => response.json());
    const infoArray = [];
    for (i=0; i<=5 && i<data.locations.length; i++) {
        const city = data.locations[i];
        const locationLat = city.referencePosition.latitude;
        const locationLon = city.referencePosition.longitude;
        const info = {
            cityName: city.address.city,
            country: city.address.countryName,
            latitude: locationLat,
            longitude: locationLon
        }
        infoArray.push(info);
    }
    return infoArray;
}

const displaySearch = async () => {
    if (input.value !== "Enter target city" || !input.value) {
        const boxes = document.querySelectorAll(".square");
        if (boxes) {
            for (box of boxes) {
                box.remove();
            }
        }
        const location = await getCoordinates(input.value);
        displayContainer.className = `display_container${location.length}`;
        if (!document.querySelector(`.display_container${location.length}`)) {
            const body = document.querySelector(".display");
            body.appendChild(displayContainer);
        }
        input.value = null;
        for (i=0; i<location.length; i++) {
            const request = `https://api.openweathermap.org/data/2.5/weather?lat=${location[i].latitude}&lon=${location[i].longitude}&appid=${apiKeyWeather}&units=metric&lang=en`;
            const weather = await fetch(request).then(response => response.json());
            const data = {
                city: location[i].cityName,
                country: weather.sys.country,
                conditions: weather.weather[0].main,
                wind: weather.wind.speed,
                temperature: weather.main.temp,
                humidity: weather.main.humidity
            }
            weatherData.push(data);
            const container = document.createElement("div");
            container.className = "square";
            container.id = `${i}`;
            const info = document.createElement("div");
            info.className = "info";
            info.id = `${i}`;
            const heading = document.createElement("h2");
            heading.innerHTML = `${data.city}<sup class="name">${data.country}</sup>`;
            heading.id = `${i}`;
            const imgContainer = document.createElement("div");
            imgContainer.id = `${i}`;
            imgContainer.className = "img_container";
            const pic = document.createElement("i");
            if (data.conditions === "Clear") {
                pic.className = "fa-solid fa-sun";
            }
            else if (data.conditions === "Clouds") {
                pic.className = "fa-solid fa-cloud";
            }
            else if (data.conditions === "Snow") {
                pic.className = "fa-solid fa-snowflake";
            }
            else if (data.conditions === "Rain" || data.conditions === "Drizzle") {
                pic.className = "fa-solid fa-cloud-rain";
            }
            else if (data.conditions === "Thunderstorm") {
                pic.className = "fa-solid fa-bolt-lightning";
            }
            else {
                pic.className = "fa-solid fa-cloud";
            }
            pic.id = `${i}`;
            displayContainer.appendChild(container);
            container.appendChild(info);
            info.appendChild(heading);
            info.appendChild(imgContainer);
            imgContainer.appendChild(pic);
            container.addEventListener("click", () => {
                const boxes = document.querySelectorAll(".square");
                for (box of boxes) {
                    box.remove();
                }
                displayContainer.remove();
                const displayData = weatherData[container.id];
                weatherData = [];
                console.log(displayData);
            })
        }
    }
    else {
        return;
    }
}

searchButton.addEventListener("click", () => {
  displaySearch();
})

document.addEventListener("keydown", (event) => {
    let keyCode = event.key;
    if (keyCode === "Enter") {
        displaySearch();
    }
})