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

// Var city library will hold our information in the local storage
var cityLibrary = []
$("#current-weather").hide()
$("#forecast-weather").hide()
//Retrieve the information that is store in the local Storage
if (localStorage.getItem("cityLibrary")) {
    cityLibrary = JSON.parse(localStorage.getItem("cityLibrary"));
//    Run loop creating a button for each city that the user input.
    for (var i = 0; i < cityLibrary.length; i++) {
        var cityListEntry = $("<button>").text(cityLibrary[i]);
        cityListEntry.addClass("list-group-item list-group-item-action bg-dark city-button");
        $("#city-list").append(cityListEntry)

        $(cityListEntry).attr(
            "style",
            "color:white"
        );
    }
    $("#city-list").click(function (event) {
        event.preventDefault();

        ajaxWeather(event.target.textContent);
         $("#current-weather").show();
        $("#forecast-weather").show();
       
     })
}

//Call the functions inside the search-button
$("#search-button").click(function (event) {
    event.preventDefault();

    $("#current-weather").show();
    $("#forecast-weather").show();

    var city = $("#city-input").val();

    ajaxWeather(city);

    if (!cityLibrary.includes(city.toLowerCase())) {
        cityLibrary.push(city.toLowerCase());
        localStorage.setItem("cityLibrary", JSON.stringify(cityLibrary));
        var cityListEntry = $("<button>").text(city.toLowerCase());
        cityListEntry.addClass("list-group-item list-group-item-action bg-dark city-button ");
        $("#city-list").append(cityListEntry)
        $(cityListEntry).attr(
            "style",
            "color:white"
        );
    }
})
//Retive the information as need it from the openWheather API, and we append it to the current weather card.
function ajaxWeather(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=0e6c3174a1688eb274ee1dfce2109fc8&units=metric";

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

        var weatherIcon = $("<img>");
        weatherIcon.attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);

        $("#current-temp").text("Temperature: " + response.main.temp + " °C");
        $("#current-humidity").text("Humidity: " + response.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + response.wind.speed + " Km/h");

        latitude = response.coord.lat;
        longitude = response.coord.lon;

        var queryURL2 =
            "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=0e6c3174a1688eb274ee1dfce2109fc8&q=" +
            "&lat=" +
            latitude +
            "&lon=" +
            longitude;
        $.ajax({
            url: queryURL2,
            method: "GET"

        }).then(function (uvIndex) {

            var uvIndexDisplay = $("<p>");


            $("#current-uv").text("UV Index: ");
            $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
            $("#current-uv").attr(
                "style",
                "color:orange",
            );

            var queryURL3 = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=0e6c3174a1688eb274ee1dfce2109fc8&units=metric"

            $.ajax({
                url: queryURL3,
                method: "GET"
                // Store all of the retrieved data inside of an object called "forecast"
            }).then(function (forecast) {


                console.log(forecast)
                var forecastIndex = 0

                for (var i = 0; i < forecast.list.length; i += 8) {
                    var forecastDate = $("<h5>");


                    forecastIndex++
                    var arrayindex = i
                    console.log("#forecast-date" + forecastIndex);

                    $("#forecast-date" + forecastIndex).empty();
                    $("#forecast-date" + forecastIndex).append(
                        forecastDate.text(localTime.add(1, "days").format("M/D/YY"))
                    );

                    var forecastIcon = $("<img>");
                    forecastIcon.attr(
                        "src",
                        "https://openweathermap.org/img/w/" +
                        forecast.list[arrayindex].weather[0].icon +
                        ".png"
                    );

                    $("#forecast-icon" + forecastIndex).empty();
                    $("#forecast-icon" + forecastIndex).append(forecastIcon);



                    $("#forecast-temp" + forecastIndex).text(
                        "Temp: " + forecast.list[arrayindex].main.temp + " °C"
                    );
                    $("#forecast-humidity" + forecastIndex).text(
                        "Humidity " + forecast.list[arrayindex].main.humidity + "%"
                    );
                    console.log(arrayindex)
                    $(".forecast").attr(
                        "style",
                        "color:white"
                    );
                }        
            });
        });
    });
}