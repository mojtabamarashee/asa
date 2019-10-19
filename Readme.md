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
console.save(mw, "mw.txt")
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
let f = name.findIndex(v => v.match('فسا'));
console.log('f = ', f);
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
      v.per[0] = ((v.pl - v.hist[0].PDrCotVal) / v.hist[0].PDrCotVal) * 100;
      v.perSum[0] = v.per[0];
    } else {
      v.per[j] =
        ((v.hist[j - 1].PDrCotVal - v.hist[j].PDrCotVal) /
          v.hist[j].PDrCotVal) *
        100;
      v.perSum[j] =
        ((v.pl - v.hist[j - 1].PDrCotVal) / v.hist[j - 1].PDrCotVal) * 100;
      //v.perSum[j] = v.per[j] + v.per[j - 1];
    }
    v.per[j] = Math.round(v.per[j] * 100) / 100;
    v.perSum[j] = Math.round(v.perSum[j] * 100) / 100;
  }
});

function Navasan60D() {
  var file = fs.createWriteStream('Navasan60D.txt');
  file.write(allRows[f].perSum[0] + ',' + allRows[f].pc + '\n');
  allRows.map((v, i) => {
    let minPerSum = Math.min(...v.perSum);
    if (minPerSum < -50) file.write(v.l18 + ',' + minPerSum + '\n');
  });
  file.end();
}

function Navasan1D(alR) {
  let out = [];
  out.v = [];
  out.change = [];
  let cntr = 0;
  alR.map((v, i) => {
    let change = Math.round(((v.pmax - v.pmin) / v.pmin) * 100 * 100) / 100;
    //if (v.l18.match(/^([^0-9]*)$/)) {
    // if (Math.abs(change) > 4 && v.pl == v.pmin) {
    out.v[cntr] = v;
    out.change[cntr] = change;
    cntr++;
    //}
    //}
  });
  return out;
}

let o = Navasan1D(allRows);
var file = fs.createWriteStream('Navasan1D.txt');
o.v.forEach((v, i) => {
  file.write(
    v.l18 +
      ' , ' +
      o.change[i] +
      ' , ' +
      v.flow +
      ' , ' +
      v.pe +
      ' , ' +
      Math.min(...v.perSum) +
      ' , ' +
      v.cs +
      '\n',
  );
});

var file = fs.createWriteStream('per.txt');
allRows.forEach((v, i) => {
  if (v.cs == 43) {
    //if (v.plp > -4) {
    file.write(
      v.l18 +
        ' , ' +
        v.plp +
        ' , ' +
        v.flow +
        ' , ' +
        Math.min(...v.perSum) +
        ' , ' +
        o.change[i] +
        ' , ' +
        v.pe +
        '\n',
    );
    //}
  }
});

function CalculateRSI(hist) {
  period = 14;
  var len = 60;

  for (var i = 0; i < len; i++) {
    //var rec = [ih][len - 1 - i];
    var rec = hist[len - 1 - i];
    var change = rec.PClosing - rec.PriceYesterday;
    if (change > 0) {
      rec.gain = change;
      rec.loss = 0;
    } else {
      rec.gain = 0;
      rec.loss = -change;
    }
  }

  // Calculate first "average gain" and "average loss"
  var gainSum = 0;
  var lossSum = 0;

  for (var i = 0; i < period; i++) {
    //var rec = [ih][len - 1 - i];
    var rec = hist[len - 1 - i];
    gainSum += rec.gain;
    lossSum += rec.loss;
  }

  var averageGain = gainSum / period;
  var averageLoss = lossSum / period;

  // Calculate subsequent "average gain" and "average loss" values
  for (var i = period + 1; i < len; i++) {
    //var rec = [ih][len - 1 - i];
    var rec = hist[len - 1 - i];

    averageGain = (averageGain * (period - 1) + rec.gain) / period;
    averageLoss = (averageLoss * (period - 1) + rec.loss) / period;

    rec.averageGain = averageGain;
    rec.averageLoss = averageLoss;
  }

  // Calculate RSI
  var RS = 0; // Relative strength
  var RSIndex = 0; // Relative strength index

  for (var i = period + 1; i < len; i++) {
    //var rec = [ih][len - 1 - i];
    var rec = hist[len - 1 - i];
    RS = rec.averageGain / rec.averageLoss;
    RSIndex = 100 - 100 / (1 + RS);
    rec.rsi = RSIndex;
  }
  return RSIndex;
}

var file = fs.createWriteStream('rsi.txt');
allRows.forEach((v, i) => {
  if (v.hist[50]) {
    if (v.l18.match(/^([^0-9]*)$/)) {
      let rsi = CalculateRSI(v.hist);
      file.write(v.l18 + ' , ' + rsi + '\n');
    }
  }
});
file.end();

```

