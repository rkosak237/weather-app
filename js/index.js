(function() {
   function getWeather() {
       const wundergroundApiKey = '47936f4090cb92c6';
       const url = "https://api.wunderground.com/api/" + wundergroundApiKey + "/conditions/forecast/geolookup/q/autoip.json"
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        //load data
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                const result = JSON.parse(request.response);
              console.log(result);
              console.log(result.location.city);
                //stored all used informations
              const fetchedData = {
                    skyCondition: result.current_observation.weather,
                    country: result.location.country,
                    cityName: result.location.city,
                    temp: result.current_observation.temp_c,
                    weatherId: result.current_observation.icon
                }
                //animated icons, display connected with current status of sky and day/night time
                function animatedIcons() {
                    const mappedIcons = new Map()
                        .set(2, '<canvas id="rain" width="128" height="128"></canvas>')
                        .set('clear', '<canvas id="clear-day" width="128" height="128"></canvas>')
                        .set('rain', '<canvas id="rain" width="128" height="128"></canvas>')
                        .set('snow', '<canvas id="snow" width="128" height="128"></canvas>')
                        .set('partlycloudy', '<canvas id="partly-cloudy-day" width="128" height="128"></canvas>')
                        .set('cloudy', '<canvas id="cloudy" width="128" height="128"></canvas>')
                        .set('fog', '<canvas id="fog" width="128" height="128"></canvas>')
                        .set('clear', '<canvas id="clear-day" width="128" height="128"></canvas>')
                        .set('night', '<canvas id="clear-night" width="128" height="128"></canvas>');

                    const iconContainerId = document.getElementById("iconContainerId");
                    //const weatherIcon = Math.round(fetchedData.weatherId / 100);
                    

                    //Check if its day - show current weather, if its night show moon 
                    function isItNight(e) {
                      const showHour = (new Date()).getHours();
                      console.log(showHour);
                        return showHour >= 7 && showHour < 22 ? e : 'night';
                    }

                    //show animated icon in DOM
                    iconContainerId.innerHTML = mappedIcons.get(isItNight(fetchedData.weatherId));

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
 getWeather();
    const temperature = document.getElementById("getGeo");
    temperature.addEventListener('click', switchTemps);

    function switchTemps() {
        const fahTemp = document.querySelector(".Fah-temp");
        const celTemp = document.querySelector(".Cel-temp");
        celTemp.classList.toggle("active-temp");
        fahTemp.classList.toggle("active-temp");
    }

})();