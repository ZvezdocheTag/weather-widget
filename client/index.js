// alert('HELLO')
(function() {
    var btn = document.querySelector('#btn');

    var sendData = function() {
        var xhr = new XMLHttpRequest();

        var body = JSON.stringify({
                name: "Moscow",
                lon: 30,
                lat: 59
                });

        xhr.open('POST', '/city', true)
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')

        xhr.send(body);

        xhr.onreadystatechange = function( ) {
              if (xhr.status != 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                console.log(xhr.responseText);
            }
        }
    }
    btn.addEventListener('click', sendData)
    
    
}())