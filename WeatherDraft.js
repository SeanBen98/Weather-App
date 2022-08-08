let weatherArray = [];

const getCoordinates = async location => {
    const input = location.trim().toLowerCase();
    const key = "YjgyNTU3NzUxODY2NDhlYjgxMmI0ZTA0NTQ4NGU1N2I6ZDFlNDQzMzMtMDg2Ni00M2JjLWFmMjgtNDI1MmRjMWE2YzM4";
    const request = `https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${input}&language=en&apiKey=${key}`;
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

const getWeather = async array => {
    const cities = array;
    const key = "69462d25d804b1ba0c25a97bc206474e";
    const list = [];
    for (city of cities) {
        const request = `https://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&appid=${key}&units=metric&lang=en`;
        const weather = await fetch(request).then(response => response.json());
        const data = {};
        data.city = city.cityName;
        data.country = weather.sys.country;
        data.conditions = weather.weather[0].main;
        data.wind = `${weather.wind.speed}`;
        data.temperature = `${weather.main.temp}`;
        data.humidity = `${weather.main.humidity}`;
        data.time = `${weather.dt}`;
        data.sunrise = `${weather.sys.sunrise}`;
        data.sunset = `${weather.sys.sunset}`;
        list.push(data);
    }
    return list;
}

const clearAndGetData = (event) => {
    const target = event.target;
    for (i=0; i<weatherArray.length; i++) {
        if (target.id == i) {
            const data = weatherArray[i];
            const boxes = document.querySelectorAll(".entrance");
            for (box of boxes) {
                box.remove();
            }
            const displayContainer = document.querySelector("#container");
            displayContainer.className = "display_container";
            return data;
        }
    }
}

const expandBox = (event) => {
    const data = clearAndGetData(event);
    const display = document.querySelector("#container");
    const expandedContainer = document.createElement("div");
    expandedContainer.className = "expanded_container";
    const headerContainer = document.createElement("div");
    headerContainer.className = "header_container";
    const header = document.createElement("h2");
    header.className = "header";
    header.innerHTML = `${data.city}<sup class="name activated">${data.country}</sup>`;
    const headerImg = document.createElement("div");
    headerImg.className = "header_img";
    const icon = document.createElement("img");
    if (data.time >= data.sunrise && data.time < data.sunset)
        if (data.conditions === "Clear") {
            icon.src = "day.svg";
        }
        else if (data.conditions === "Clouds") {
            icon.src = "cloudy.svg";
        }
        else if (data.conditions === "Snow") {
            icon.src = "snowy-1.svg";
        }
        else if (data.conditions === "Rain" || data.conditions === "Drizzle") {
            icon.src = "rainy-5.svg";
        }
        else if (data.conditions === "Thunderstorm") {
            icon.src = "thunder.svg";
        }
        else {
            icon.src = "cloudy.svg";
        }
    else {
        if (data.conditions === "Clear") {
            icon.src = "night.svg";
        }
        else if (data.conditions === "Clouds") {
            icon.src = "cloudy-night-1.svg";
        }
        else if (data.conditions === "Snow") {
            icon.src = "snowy-5.svg";
        }
        else if (data.conditions === "Rain" || data.conditions === "Drizzle") {
            icon.src = "rainy-5.svg";
        }
        else if (data.conditions === "Thunderstorm") {
            icon.src = "thunder.svg";
        }
        else {
            icon.src = "cloudy-night-1.svg";
        }
    }
    icon.className = "img_expanded";
    const infoContainer = document.createElement("div");
    infoContainer.className = "info_container";
    const infoGrid = document.createElement("div");
    infoGrid.className = "info_grid";
    const infoBox1 = document.createElement("div");
    infoBox1.className = "info_box";
    const infoBox2 = document.createElement("div");
    infoBox2.className = "info_box";
    const infoBox3 = document.createElement("div");
    infoBox3.className = "info_box";
    const infoBox4 = document.createElement("div");
    infoBox4.className = "info_box";
    const infoHeader1 = document.createElement("h3");
    infoHeader1.innerText = "Conditions:"
    const infoHeader2 = document.createElement("h3");
    infoHeader2.innerText = "Wind:"
    const infoHeader3 = document.createElement("h3");
    infoHeader3.innerText = "Temperature:"
    const infoHeader4 = document.createElement("h3");
    infoHeader4.innerText = "Humidity:"
    const infoMain1 = document.createElement("h3");
    infoMain1.className = "important";
    infoMain1.innerHTML = `${data.conditions}`;
    const infoMain2 = document.createElement("h3");
    infoMain2.className = "important";
    infoMain2.innerHTML = `${data.wind}m/s`
    const infoMain3 = document.createElement("h3");
    infoMain3.className = "important";
    infoMain3.innerHTML = `${data.temperature}&#8451;`
    const infoMain4 = document.createElement("h3");
    infoMain4.className = "important";
    infoMain4.innerHTML = `${data.humidity}%`;
    infoBox1.appendChild(infoHeader1);
    infoBox1.appendChild(infoMain1);
    infoBox2.appendChild(infoHeader2);
    infoBox2.appendChild(infoMain2);
    infoBox3.appendChild(infoHeader3);
    infoBox3.appendChild(infoMain3);
    infoBox4.appendChild(infoHeader4);
    infoBox4.appendChild(infoMain4);
    infoGrid.appendChild(infoBox1);
    infoGrid.appendChild(infoBox2);
    infoGrid.appendChild(infoBox3);
    infoGrid.appendChild(infoBox4);
    infoContainer.appendChild(infoGrid);
    headerImg.appendChild(icon);
    headerContainer.appendChild(header);
    headerContainer.appendChild(headerImg);
    expandedContainer.appendChild(headerContainer);
    expandedContainer.appendChild(infoContainer);
    display.appendChild(expandedContainer);
}

const transitionBoxes = container => {
    setTimeout(() => {
        container.className = "entrance";
        const tags = document.querySelectorAll("sup");
        for (tag of tags) {
            tag.className = "name activated";
        }
    }, 0)
}

const displayResults = async () => {
    const form = document.querySelector("input");
    const input = form.value;
    form.value = null;
    if (!input) {
        return;
    }
    const boxes = document.querySelectorAll(".entrance");
    if (boxes) {
        for (box of boxes) {
            box.remove();
        }
    }
    const expandedContainer = document.querySelector(".expanded_container");
    if (expandedContainer) {
        expandedContainer.remove()
    }
    const coords = await getCoordinates(input);
    const weatherData = await getWeather(coords);
    weatherArray = weatherData;
    const displayContainer = document.querySelector("#container");
    displayContainer.className = `display_container${weatherData.length}`;
    for (i=0; i<weatherData.length; i++) {
        const data = weatherData[i];
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
        imgContainer.className = "img_container";
        imgContainer.id = `${i}`;
        const pic = document.createElement("img");
        if (data.time >= data.sunrise && data.time < data.sunset)
        if (data.conditions === "Clear") {
            pic.src = "day.svg";
        }
        else if (data.conditions === "Clouds") {
            pic.src = "cloudy.svg";
        }
        else if (data.conditions === "Snow") {
            pic.src = "snowy-1.svg";
        }
        else if (data.conditions === "Rain" || data.conditions === "Drizzle") {
            pic.src = "rainy-5.svg";
        }
        else if (data.conditions === "Thunderstorm") {
            pic.src = "thunder.svg";
        }
        else {
            pic.src = "cloudy.svg";
        }
    else {
        if (data.conditions === "Clear") {
            pic.src = "night.svg";
        }
        else if (data.conditions === "Clouds") {
            pic.src = "cloudy-night-1.svg";
        }
        else if (data.conditions === "Snow") {
            pic.src = "snowy-5.svg";
        }
        else if (data.conditions === "Rain" || data.conditions === "Drizzle") {
            pic.src = "rainy-5.svg";
        }
        else if (data.conditions === "Thunderstorm") {
            pic.src = "thunder.svg";
        }
        else {
            pic.src = "cloudy-night-1.svg";
        }
    }
        pic.className = "img_display";
        pic.id = `${i}`;
        displayContainer.appendChild(container);
        container.appendChild(info);
        info.appendChild(heading);
        info.appendChild(imgContainer);
        imgContainer.appendChild(pic);
        container.addEventListener ("click", (event) => {
            expandBox(event);
        })
        transitionBoxes(container);
    }
}

const searchButton = document.querySelector(".search");
searchButton.addEventListener("click", () => {
    displayResults();
})

document.addEventListener("keydown", (event) => {
    let keyCode = event.key;
    if (keyCode === "Enter") {
        displayResults();
    }
})