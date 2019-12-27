https://online.agah.com/TradingView/search?limit=30&query=&type=&exchange=

https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1537678800&to=2114368200&resolution=D 

https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1231563600&to=1259470800&resolution=D 

https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1004158800&to=2114368200&resolution=W 

https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1259470800&to=2114368200&resolution=D

https://online.agah.com/TradingView/history?symbol=IRO1BMLT0001-1&resolution=D&from=1247122718&to=1251259199&symbolType=%D8%B3%D9%87%D8%A7%D9%85 https://online.agah.com/TradingView/symbols?symbol=IRO1BMLT0001-1

http://m.tsetmc.com/tsev2/data/InstTradeHistory.aspx?i=27952969918967492&Top=999999&A=0


http://www.tsetmc.com/Loader.aspx?ParTree=151311&i=12329519546621752#


```javascript
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
```

