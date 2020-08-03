// we present the homescreen to out user;
// if the users had already search for a city;
//    we get the data from our local storage;
//    and append it to our previous search container;
//we present a form to the user asking the city where he wants to see the wheather;
//   we create a variable with the city from the user input;
//we check for the data to be asing with upper case;
//   If the users input its not type in upper case,
//   then when make the input in uppper case;
//we store the input value from the user;
//   we modified the querry url city atribute of what was input on this;
// we create a ajax funciton where we get the user input data;
//   we create a variable with the geo cordanates to later obtain the uv index;
//after obtaining the info from our API;
//   we display the current:wheather icon, temp , humidity , win speed  and uv index;
//   after we create a loop for 5 days for the forecast of that city;
//   we append our diferents days to cards;
//we store the users input to our local storage
// function searchCityWeather(city){
$("#current-weather").hide()
$("#forecast-weather").hide()
$("#search-button").click(function (event) {
    event.preventDefault();
    
    $("#current-weather").show();
    $("#forecast-weather").show();

    
    var cityInput = $("#city-input").val();
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=0e6c3174a1688eb274ee1dfce2109fc8&units=metric";
    var queryURL2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid=0e6c3174a1688eb274ee1dfce2109fc8&units=metric"
    var latitude;
    var longitude;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var localTime = moment();

        var displayLocalT = $("<h3>");
        $("#searched-city").empty();
        $("#searched-city").append(
            displayLocalT.text("(" + localTime.format("M/D/YYYY") + ")")
        );

        var nameCity = $("<h3>").text(response.name);
        $("#searched-city").prepend(nameCity);
        var cityListEntry = $("<button>").text(response.name);
        cityListEntry.addClass("list-group-item list-group-item-action city-button");
        $("#city-list").append(cityListEntry)



        var weatherIcon = $("<img>");
        weatherIcon.attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);

        $("#current-temp").text("Temperature: " + response.main.temp + " °C");
        $("#current-humidity").text("Humidity: " + response.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + response.wind.speed + " Km/h");
        

        latitude = response.coord.lat;
        longitude = response.coord.lon;

        var queryURL3 =
            "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=0e6c3174a1688eb274ee1dfce2109fc8&q=" +
            "&lat=" +
            latitude +
            "&lon=" +
            longitude;
        $.ajax({
            url: queryURL3,
            method: "GET"

        }).then(function (uvIndex) {
            console.log(uvIndex);
            var uvIndexDisplay = $("<p>");
            

            $("#current-uv").text("UV Index: ");
            $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
            $("#current-uv").attr(
                "style",
                "color:orange",
            );
            console.log(uvIndex[0].value);

            $.ajax({
                url: queryURL2,
                method: "GET"
                // Store all of the retrieved data inside of an object called "forecast"
            }).then(function (forecast) {
                console.log(queryURL2);

                console.log(forecast)
                var forecastIndex = 0

                for (var i = 0; i < forecast.list.length; i++) {
                    var forecastDate = $("<h5>");

                    forecastIndex++

                    console.log("#forecast-date" + forecastIndex);

                    $("#forecast-date" + forecastIndex).empty();
                    $("#forecast-date" + forecastIndex).append(
                        forecastDate.text(localTime.add(1, "days").format("M/D/YYYY"))
                    );
                    var forecastIcon = $("<img>");
                    forecastIcon.attr(
                        "src",
                        "https://openweathermap.org/img/w/" +
                        forecast.list[i].weather[0].icon +
                        ".png"
                    );

                    $("#forecast-icon" + forecastIndex).empty();
                    $("#forecast-icon" + forecastIndex).append(forecastIcon);

                    console.log(forecast.list[i].weather[0].icon);

                    $("#forecast-temp" + forecastIndex).text(
                        "Temp: " + forecast.list[i].main.temp + " °C"
                    );
                    $("#forecast-humidity" + forecastIndex).text(
                        "Humidity " + forecast.list[i].main.humidity + "%"
                    );

                    $(".forecast").attr(
                        "style",
                        "color:white"
                    );

                    
                }
                // document.on("click", ".city-button", function(event) {
                    
                //     var cityInput = $(".city-button").val()
                // alert("cara de ")
                
                    
                //   })
            
            });
           
        });
      

    });

   




})
