https://online.agah.com/TradingView/search?limit=30&query=&type=&exchange=
https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1537678800&to=2114368200&resolution=D https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1231563600&to=1259470800&resolution=D https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1004158800&to=2114368200&resolution=W https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1259470800&to=2114368200&resolution=D https://online.agah.com/TradingView/history?symbol=IRO1BMLT0001-1&resolution=D&from=1247122718&to=1251259199&symbolType=%D8%B3%D9%87%D8%A7%D9%85 https://online.agah.com/TradingView/symbols?symbol=IRO1BMLT0001-1

(function(console) {
	console.save = function(data, filename) {
		if (!data) {
			console.error('Console.save: No data');
			return;
		}

		if (!filename) filename = 'console.json';

		if (typeof data === 'object') {
			data = JSON.stringify(data, undefined, 4);
		}

		var blob = new Blob([data], {type: 'text/json'}),
			e = document.createEvent('MouseEvents'),
			a = document.createElement('a');

		a.download = filename;
		a.href = window.URL.createObjectURL(blob);
		a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
		e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
})(console);
console.save(mw, 'mw.txt');

```javascript
function getGzipped(url, callback) {
  // buffer to store the streamed decompression
  var buffer = [];

  var options = {
    host: 'www.tsetmc.com',
    path: '/loader.aspx?ParTree=151311&i=' + url,
  };
  http
    .get(options, function(res) {
      // pipe the response into the gunzip to decompress
      var gunzip = zlib.createGunzip();
      res.pipe(gunzip);

      gunzip
        .on('data', function(data) {
          // decompression chunk ready, add it to the buffer
          buffer.push(data.toString());
        })
        .on('end', function() {
          // response and decompression complete, join the buffer and return

          callback(null, buffer.join(''));
        })
        .on('error', function(e) {
          callback(e);
        });
    })
    .on('error', function(e) {
      callback(e);
    });
}

var http = require('http');
zlib = require("zlib");
//var file = fs.createWriteStream('body.html');
//getGzipped(url, function(err, data) {
//  console.log(data);
//  file.write(data);
//  file.write('---------------------------------------------------\n\n\n\n');
//});

allRows.forEach((v, i) => {
	console.log("v = ", v.inscode);
	getGzipped(v.inscode, function(err, data) {
		var regex = /LVal18AFC='.*',D/g;
var found = data.match(regex);
console.log("found = ", found);

  //console.log(data);
  //file.write(data);
  //file.write('---------------------------------------------------\n\n\n\n');
})});
'''
