(function() {


    function getLocation() {
        navigator.geolocation ? navigator.geolocation.getCurrentPosition(showPosition) : alert("Geolocation is not supported by this browser.");
    }
    getLocation();

    //get lat, lon - pass to getLocaion
    function showPosition(position) {
        getWeather(position.coords.latitude, position.coords.longitude); // depending on location 
    }

    function getWeather(lat, lon) {
        const url = "https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon;
        let request = new XMLHttpRequest();
        request.open('GET', url, true);

        //load data
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                const result = JSON.parse(request.response);
                //stored all used informations
                const fetchedData = {
                    skyCondition: result.weather[0].description,
                    country: result.sys.country,
                    cityName: result.name,
                    dataTime: result.dt,
                    sunRise: result.sys.sunrise,
                    sunSet: result.sys.sunset,
                    temp: result.main.temp,
                    weatherId: result.weather[0].id
                }
                //animated icons, display connected with current status of sky and day/night time
                function animatedIcons() {
                    const mappedIcons = new Map()
                        .set(2, '<canvas id="rain" width="128" height="128"></canvas>')
                        .set(3, '<canvas id="clear-day" width="128" height="128"></canvas>')
                        .set(5, '<canvas id="rain" width="128" height="128"></canvas>')
                        .set(6, '<canvas id="snow" width="128" height="128"></canvas>')
                        .set(7, '<canvas id="fog" width="128" height="128"></canvas>')
                        .set(8, '<canvas id="clear-day" width="128" height="128"></canvas>')
                        .set('night', '<canvas id="clear-night" width="128" height="128"></canvas>');

                    const iconContainerId = document.getElementById("iconContainerId");
                    const weatherIcon = Math.round(fetchedData.weatherId / 100);

                    //Check if its day - show current weather, if its night show moon 
                    function chosingIcon(e) {
                        return fetchedData.dataTime > fetchedData.sunRise && fetchedData.dataTime < fetchedData.sunSet ? e : 'night';
                    }

                    //show animated icon in DOM
                    iconContainerId.innerHTML = mappedIcons.get(chosingIcon(weatherIcon));

                    //animated icons 
                    const icons = new Skycons({ "color": "white" });
                    icons.set("clear-day", Skycons.CLEAR_DAY);
                    icons.set("clear-night", Skycons.CLEAR_NIGHT);
                    icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
                    icons.set("partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
                    icons.set("cloudy", Skycons.CLOUDY);
                    icons.set("rain", Skycons.RAIN);
                    icons.set("sleet", Skycons.SLEET);
                    icons.set("snow", Skycons.SNOW);
                    icons.set("wind", Skycons.WIND);
                    icons.set("fog", Skycons.FOG);
                    icons.play();
                }
                animatedIcons();

                function celToFah(celsius) {
                    let celTemp = celsius;
                    let celToFahr = Math.round((celTemp * 9) / 5 + 32);
                    return celToFahr;
                }

                //App data printed
                document.getElementById("sky").innerHTML = `<p> ${fetchedData.skyCondition} </p>`;
                document.querySelector(".Fah-temp").innerHTML = `<p class="tempInFah"> ${celToFah(fetchedData.temp)} &deg;F</p>`;
                document.querySelector(".Cel-temp").innerHTML = `<p class="tempInCel"> ${Math.round(fetchedData.temp)} &deg;C </p>`;
                document.getElementById("city").innerHTML = `<p> ${fetchedData.country}, ${fetchedData.cityName} </p>`;
            } else {
                console.log("We reached our target server, but it returned an error");
            }
        };
        request.onerror = function() {
            // There was a connection error of some sort
        };
        request.send();
    }
    const temperature = document.getElementById("getGeo");
    temperature.addEventListener('click', switchTemps);

    function switchTemps() {
        const fahTemp = document.querySelector(".Fah-temp");
        const celTemp = document.querySelector(".Cel-temp");
        celTemp.classList.toggle("active-temp");
        fahTemp.classList.toggle("active-temp");
    }

})();