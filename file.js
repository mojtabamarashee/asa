date = '98_07_30';
function test() {
	console.log('salam');
	const http = new XMLHttpRequest();

	http.open(
		'GET',
		'https://online.agah.com/TradingView/history?symbol=IRO1BMLT0001-1&resolution=D&from=1251269918&to=1262753999&symbolType=%D8%B3%D9%87%D8%A7%D9%85',
	);
	http.send();

	http.onload = () => console.log(http.responseText);
}

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
//console.save(mw, 'mw.txt');

htmlHeader = `
<!DOCTYPE html>
<html>

<script src="https://code.jquery.com/jquery-3.4.1.min.js"/></script>
<script src="https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js"/></script>
<script src="https://cdn.datatables.net/1.10.20/js/dataTables.bootstrap4.min.js"/></script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.css">
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.20/css/dataTables.bootstrap4.min.css">
<style>
div.dataTables_wrapper {
        width: 800px;
        margin: 0 auto;
    }
</style>
<body>
<meta charset="UTF-8">
<table id="table" class="table table-striped table-bordered display nowrap" style="width:100%, font-family:'Courier New', Courier, monospace; font-size:250%" >
`;
htmlTail = `
</tbody>
</table>

<script type="application/javascript" >
$(document).ready(function() {
    $('#table').DataTable( {
        "order": [[ 3, "desc" ]],
    "scrollX":true,
        "pageLength": 100,
    } );
} );
</script>
</br>
</br>
<span>دانلود از <a href="https://telegram.me/filtermarket1">کانال تلگرام </a></span>
</body>
</html>
`;

const fs = require('fs');
GetColor = num => (num * 10).toString(16);
var numeral = require('numeral');
numeral.defaultFormat('0,0.[00]');
let rawdata = fs.readFileSync('files/mw_' + date + '.txt');
let mw1 = JSON.parse(rawdata);
let allRows = Object.values(mw1.AllRows);

let instHistory = Object.values(mw1.InstHistory);
let keys = Object.keys(mw1.InstHistory);
let index;
keys.map((v, i) => {
	index = allRows.findIndex((v1, i1) => {
		return v1.inscode == v;
	});
	if (index != -1) {
		allRows[index].hist = instHistory[i];
	}
});

let clientType = Object.values(mw1.ClientType);
keys = Object.keys(mw1.ClientType);
keys.map((v, i) => {
	index = allRows.findIndex((v1, i1) => {
		return v1.inscode == v;
	});
	if (index != -1) {
		allRows[index].ct = clientType[i];
	}
});

let name = [];
Object.values(mw1.AllRows).findIndex((v, i) => {
	name[i] = v.l18;
});
let f = name.findIndex(v => v.match('فسا'));
let insCode = allRows[f].inscode;
index = keys.findIndex(v => v == insCode);
let hist = instHistory[index];

allRows.map((v, i) => {
	v.per = [];
	v.perSum = [];
	if (v.hist) {
		for (let j = 0; j < v.hist.length; j++) {
			if (j == 0) {
				v.per[0] = ((v.pl - v.hist[0].PDrCotVal) / v.hist[0].PDrCotVal) * 100;
				v.perSum[0] = v.per[0];
			} else {
				v.per[j] = ((v.hist[j - 1].PDrCotVal - v.hist[j].PDrCotVal) / v.hist[j].PDrCotVal) * 100;
				v.perSum[j] = ((v.pl - v.hist[j - 1].PDrCotVal) / v.hist[j - 1].PDrCotVal) * 100;
				//v.perSum[j] = v.per[j] + v.per[j - 1];
			}
			v.per[j] = Math.round(v.per[j] * 100) / 100;
			v.perSum[j] = Math.round(v.perSum[j] * 100) / 100;
		}
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
	let change;
	alR.map((v, i) => {
		if (v.pmin == 0) {
			change = 0;
		} else {
			change = Math.round(((v.pmax - v.pmin) / v.pmin) * 100 * 100) / 100;
			if (v.l18.match(/^([^0-9]*)$/)) {
				//if (v.l18.match(/^([^0-9]*)$/)) {
				// if (Math.abs(change) > 4 && v.pl == v.pmin) {
				out.v[cntr] = v;
				out.change[cntr] = change;
				cntr++;
			}
		}
	});
	return out;
}

let o = Navasan1D(allRows);
var file = fs.createWriteStream('Nav1D_' + date + '.txt');
file.write('نماد' + '\t' + 'تغییر' + '\t' + 'بازار' + '\t' + 'گروه' + '\n');
o.v.sort((a, b) => a.change - b.change);
o.v.forEach((v, i) => {
	file.write(v.l18 + '\t' + o.change[i] + '\t' + v.flow + '\t' + v.cs + '\n');
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
	if (v.hist && v.hist[50]) {
		if (v.l18.match(/^([^0-9]*)$/)) {
			//let rsi = CalculateRSI(v.hist);
			//file.write(v.l18 + ' , ' + rsi + '\n');
		}
	}
});
file.end();

function SafeForoush() {
	let o = [];
	o = allRows.filter((v, i) => Math.round(v.po1) == Math.round(v.tmin) && v.qd1 == 0);
	return o;
}
o = SafeForoush();
o.sort((a, b) => a.qo1 - b.qo1);
var file = fs.createWriteStream('sell_' + date + '.html');
file.write(htmlHeader);
file.write(
	'<tr><th>نماد</th>' +
		'\n' +
		'<th>حجم</th>' +
		'\n' +
		'<th>تعداد</th>' +
		'\n' +
		'<th>بازار</th>' +
		'\n' +
		'<th>گروه</th></tr>' +
		'\n',
);
o.forEach((v, i) => {
	if (v.l18.match(/^([^0-9]*)$/)) {
		color = GetColor(v.cs);
		file.write(
			'<tr><td>' +
				v.l18 +
				'</td>' +
				'\n<td>' +
				numeral(v.qo1).format() +
				'</td>\n<td>' +
				v.zo1 +
				'</td>\n<td>' +
				v.flow +
				'</td><td style="color:#' +
				color +
				'">' +
				v.cs +
				'</td>\n</tr>',
		);
	}
});
file.write(htmlTail);
file.end();

var file = fs.createWriteStream('pe_' + date + '.txt');
file.write('نماد' + '\t' + 'p/e' + '\t' + 'بازار' + '\t' + 'گروه' + '\n');

allRows.sort((a, b) => a.cs - b.cs);
allRows.forEach((v, i) => {
	if (v.l18.match(/^([^0-9]*)$/)) {
		if (v.pe) {
			file.write(v.l18 + '\t' + v.pe + '\t' + v.flow + '\t' + v.cs + '\n');
		}
	}
});

function SafeKharid() {
	let o = [];
	o = allRows.filter((v, i) => Math.round(v.pd1) == Math.round(v.tmax) && v.qd1 > 0);
	return o;
}

o = SafeKharid();
o.sort((a, b) => a.qd1 - b.qd1);
var file = fs.createWriteStream('out/buy_' + date + '.html');
file.write(htmlHeader);
file.write(
	'<thead><tr>' +
		'<th>نماد</th>' +
		'<th>حجم</th>' +
		'<th>تعداد</th>' +
		'<th>بازار</th>' +
		'<th>گروه</th></tr></thead><tbody>\n',
);
o.forEach((v, i) => {
	if (v.l18.match(/^([^0-9]*)$/)) {
		color = GetColor(v.cs);
		file.write(
			'<tr><td>' +
				v.l18 +
				'</td><td>' +
				numeral(v.qd1).format() +
				'</td><td>' +
				v.zd1 +
				'</td><td>' +
				v.flow +
				'</td><td style="color:#' +
				color +
				'">' +
				v.cs +
				'</td></tr>\n',
		);
	}
});
file.write(htmlTail);
file.end();

allRows.sort((a, b) => a.ct.Buy_CountN - b.ct.Buy_CountN);
var file = fs.createWriteStream('ct_' + date + '.html');
file.write(htmlHeader);
file.write('<tr><th>نماد</th>' + '\n<th>' + 'حجم</th>' + '\n<th>' + 'تعداد</th>' + '</tr>\n');
allRows.forEach((v, i) => {
	if (v.l18.match(/^([^0-9]*)$/)) {
		if (v.ct.Buy_CountN)
			file.write(
				'<tr><td>' +
					v.l18 +
					'</td>\n<td>' +
					numeral(v.ct.Buy_N_Volume).format() +
					'</td>\n<td>' +
					numeral(v.ct.Buy_CountN).format() +
					'</td>\n</tr>',
			);
	}
});
file.write(htmlTail);
file.end();

let Write = (fileName, tiltle, header, data) => {
	var file = fs.createWriteStream(fileName + '.txt');
	file.write(title + '\n' + '\n' + '\n');
	title.forEach((v, i) => {
		file.write(v + '\t');
	});
	file.write('\n');
	let cntr = 0;
	data[0].forEach((v, i) => {
		file.write(data[0][i]);
		file.write('\t');

		file.write(data[0][i]);
		file.write('\t');

		file.write(data[0][i]);
		file.write('\t');
	});
};
