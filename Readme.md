https://online.agah.com/TradingView/search?limit=30&query=&type=&exchange=
<br>
https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1537678800&to=2114368200&resolution=D
https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1231563600&to=1259470800&resolution=D
https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1004158800&to=2114368200&resolution=W
https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1259470800&to=2114368200&resolution=D
https://online.agah.com/TradingView/history?symbol=IRO1BMLT0001-1&resolution=D&from=1247122718&to=1251259199&symbolType=%D8%B3%D9%87%D8%A7%D9%85
https://online.agah.com/TradingView/symbols?symbol=IRO1BMLT0001-1

```javascript
function test(){
    
console.log("salam")
const http = new XMLHttpRequest()

http.open("GET", "https://online.agah.com/TradingView/history?symbol=IRO1BMLT0001-1&resolution=D&from=1251269918&to=1262753999&symbolType=%D8%B3%D9%87%D8%A7%D9%85")
http.send()

http.onload = () => console.log(http.responseText)
};

```

```javascript
(function(console){

    console.save = function(data, filename){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = 'console.json'

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)
```


```javascript
const fs = require('fs');
let rawdata = fs.readFileSync('mw.txt');
let mw1 = JSON.parse(rawdata);
let name = [];
let allRows = Object.values(mw1.AllRows);
let instHistory = Object.values(mw1.InstHistory);
let keys = Object.keys(mw1.InstHistory);
let ct = Object.values(mw1.ClientType);
Object.values(mw1.AllRows).findIndex((v, i) => {
	name[i] = v.l18;
});
let f = name.findIndex(v => v.match('ددام'));
let insCode = allRows[f].inscode;
let index = keys.findIndex(v => v == insCode);
let hist = instHistory[index];
keys.map((v, i) => {
	index = allRows.findIndex((v1, i1) => {
		return v1.inscode == v;
	});
	if (index != -1) {
		allRows[index].hist = instHistory[i];
	}
});

allRows.map((v, i) => {
	v.per = [];
	v.perSum = [];
	for (let j = 0; j < v.hist.length; j++) {
		if (j == 0) {
			v.per[0] = ((v.pc - v.hist[0].PDrCotVal) / v.hist[0].PDrCotVal) * 100;
			v.perSum[0] = v.per[0];
		} else {
			v.per[j] = ((v.hist[j - 1].PDrCotVal - v.hist[j].PDrCotVal) / v.hist[j].PDrCotVal) * 100;
			v.perSum[j] = ((v.pc - v.hist[j - 1].PDrCotVal) / v.hist[j - 1].PDrCotVal) * 100;
			//v.perSum[j] = v.per[j] + v.per[j - 1];
		}
		v.per[j] = Math.round(v.per[j] * 100) / 100;
		v.perSum[j] = Math.round(v.perSum[j] * 100) / 100;
	}
});

var file = fs.createWriteStream('per.txt');
file.write(allRows[f].perSum[0] + ',' + allRows[f].pc + '\n');
allRows.map((v, i) => {
	let minPerSum = Math.min(...v.perSum);
	if (minPerSum < -50) file.write(v.l18 + ',' + minPerSum + '\n');
});
file.end();
```

