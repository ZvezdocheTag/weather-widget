(function() {
    var sendData = function(lonData, latData) {
        var xhr = new XMLHttpRequest();

        var body = JSON.stringify({
                name: "Moscow",
                lon: lonData,
                lat: latData
        });

        xhr.open('POST', '/city', true)
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')

        xhr.onreadystatechange = function( ) {
            if(xhr.readyState === 4) {
                var val = JSON.parse(xhr.response);
                var oldList = document.querySelector('.weather-list');
                var list = document.createElement('ul');
                list.classList.add('weather-list');

                for(var i = 0; i < val.length; i+=1) {
                    var item = val[i];
                    var newEl = `
                        <li class="weather-item weather-list__item">
                            <div class="weather-item__date">${item.date}</div>
                            <div class="weather-item__weekday">${item.weekDay}</div>
                            <div class="weather-item__description">${item.weather.description}</div>
                            <div class="weather-item__value">${item.celsium}<span>℃</span></div>
                            <div class="weather-item__img">
                            <img src="${item.icon}"></div>
                        </li>
                    `
                    list.insertAdjacentHTML("afterBegin", newEl)
                }
                oldList.replaceWith(list)
            }
        }
        xhr.send(body);
    }

    var widgetWiew = {
        init: function() {
            var controller = document.querySelector('.form-group--widget-view');
            var widget = document.querySelector('.weather');

            controller.addEventListener('click', function(e) {
                if(e.target.checked === true) {
                     if(e.target.defaultValue === "horizontal") {
                        widget.classList.add('weather--horizontal')
                     } else {
                         widget.classList.remove('weather--horizontal')
                     }
                }
            })
        }
    }
    var filterList = {
        init: function() {
            var controller = document.querySelector('.row-radio__day-count');
            var controllerDefault = document.querySelector('.row-radio__day-count input[checked]').value;
            var weatherList = document.querySelector('.weather-list');
            var weatherListClone = weatherList.cloneNode(true);
            var valueIsNumber = +controllerDefault;
            
            this.filterItems(valueIsNumber, weatherListClone)
            var self = this;
            controller.addEventListener('click', function(e) {
                if(e.target.checked === true) {
                    var val = +e.target.defaultValue;
                    self.filterItems(val, weatherListClone)
                }
            })
        },

        filterItems: function(val, weatherListClone) {
            var weatherList = document.querySelector('.weather-list');
            var childrene = weatherList.children;
            var cloneItem;
            

            if(childrene.length > val) {
                for(var i = 0; childrene.length > val; i+=1 ) {
                    childrene[childrene.length - 1].remove()
                }

            }
            if(childrene.length < val) {
                for(var k = 0; k < val; k+=1) {
                    if(childrene.length + k !== val) {
                        if(typeof weatherListClone.children[childrene.length] !== "undefined") {
                            cloneItem = weatherListClone.children[childrene.length].cloneNode(true);
                            weatherList.appendChild(cloneItem);
                        }
                    }
                }
                    
            }
            
        }
    }

    var citySelect = {
        init: function() {
            var controller = document.querySelector('select[name="city-select"]');

            controller.addEventListener('change', function(e) {
                var selectedItem = e.target.options[e.target.options.selectedIndex];
                var lon = selectedItem.dataset.lon;
                var lat = selectedItem.dataset.lat;
            
                sendData(lon, lat)
                
            })
        }
    }

    widgetWiew.init()
    citySelect.init()
    filterList.init()

}())