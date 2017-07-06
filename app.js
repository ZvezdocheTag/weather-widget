let express = require('express');
let app = express();
let request = require('request');
let bodyParser = require('body-parser')
let pug = require('pug');
let apiKey = '78af583793ca56ea9988e33ad03c1e3a';
let requestUrldefault = `http://api.openweathermap.org/data/2.5/forecast?lat=55&lon=37&APPID=${apiKey}`;

app.use("/icons", express.static(__dirname + "/icons/world-weather-online-set/PNGs_64x64/day"));
app.use("/", express.static(__dirname));
app.set('view engine', 'pug');
app.use(bodyParser.json());

const prepareWeartherData = {
    init: function(data){  
        return this.filterWeatherData(data);
    },

    filterWeatherTime: function(list)  {
        return list.filter(item => 
            item.dt_txt.indexOf('12:00') !== -1
            );
    },

    filterWeatherData: function(list)  {
        let weatherList = this.filterWeatherTime(list);
        return weatherList.map(item => ({
                // day: item
                weather: item.weather[0],
                main: item.main,
                celsiumMIN: this.convertToCelsium(item.main.temp_min),
                celsiumMAX: this.convertToCelsium(item.main.temp_max),
                celsium: this.convertToCelsium(item.main.temp),
                date: item.dt_txt.slice(0, -9),
                weekDay: this.dayText(item.dt_txt),
                icon: `http://openweathermap.org/img/w/${item.weather[0].icon}.png`
        }))
    },

    dayText: function(day) {
        console.log(day)
        let parseDay = new Date(day);
        let getCurrent = parseDay.getDay();
        return this.dayOfWeekAsString(getCurrent)
    },

    dayOfWeekAsString: function(dayIndex) {
        return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][dayIndex]
    },

    convertToCelsium: function(kelvin) {
        return Math.round(kelvin - 273.15)
    }

}

const makeWeatherReq = (obj) => {
    let lat = obj.lat;
    let lon = obj.lon;
    let req = obj.req;
    let res = obj.res;
    let reqWeather = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${apiKey}`;

    request(reqWeather, (err, resp, body) => {
        if(!err && resp.statusCode === 200) {
            let result = JSON.parse(body);
            // console.log(result)
            let date = prepareWeartherData.init(result.list)  
            res.send(date)
        } else{
            console.log(err)
        }
    })
} 

app.get('/', function (req, res) {
    request(requestUrldefault, (err, resp, body) => {
        if(!err && resp.statusCode === 200) {
            let result = JSON.parse(body);
            let date = prepareWeartherData.init(result.list) 
            res.render('index.pug', 
                { 
                    title: result.city.name,
                    message: result.city.name, 
                    weather: date 
                })
        } else{
            console.log(err)
        }
    })
});

app.post('/city', function(req, respos) {
    let data = {
        lon: req.body.lon,
        lat: req.body.lat,
        req: req,
        res: respos
    }
    makeWeatherReq(data)
})

let server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Your app listening at http://%s:%d', 'localhost', port);
});