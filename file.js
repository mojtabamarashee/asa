date = '98_08_14';
let getSymbolsDataFlag = 0;
let getSymbolsPageFlag = 0;
let sendTelegramFlag = 1;

var tulind = require('tulind');

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

GetBazColor = v => v.color;
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
</style>
<body>
<meta charset="UTF-8">
<br>
<table id="table" class="table table-striped table-bordered display nowrap" style="width:100%, font-family:'Courier New', Courier, monospace; font-size:250%" >
`;
htmlTail = `
</tbody>
</table>

<script type="application/javascript" >
$(document).ready(function() {
    $('#table').DataTable( {
        "order": [[ 1, "desc" ]],
        "pageLength": 100,
    } );
    document.getElementById("table_filter").style.textAlign = "center";
} );
</script>
</br>
</br>
<div style="text-align: center">
<span style="font-family:'Courier New', Courier, monospace; font-size:200%">دانلود شده از <a style="" href="https://telegram.me/filtermarket1">کانال تلگرام </a></span>
</div>
</br>
</br>
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
				v.navasan1D = change;
				cntr++;
			}
		}
	});
	return out;
}

let o = Navasan1D(allRows);
var file = fs.createWriteStream('out_' + date + '/Nav1D_' + date + '.html');
file.write(htmlHeader);
file.write(
	'<thead><tr>' + '<th>نماد</th>' + '<th>تغییر</th>' + '<th>بازار</th>' + '<th>گروه</th></tr></thead><tbody>\n',
);

o.v.sort((a, b) => a.change - b.change);
o.v.forEach((v, i) => {
	if (v.l18.match(/^([^0-9]*)$/)) {
		file.write(
			'<tr><td>' +
				v.l18 +
				'</td><td>' +
				v.navasan1D +
				'%' +
				'</td><td>' +
				v.flow +
				'</td><td>' +
				v.cs +
				'</td></tr>',
		);
	}
});
file.write(htmlTail);
file.end();

var file = fs.createWriteStream('out_' + date + '/tagh1D_' + date + '.html');
file.write(htmlHeader);
file.write(
	'<thead><tr>' + '<th>نماد</th>' + '<th>تغییر</th>' + '<th>بازار</th>' + '<th>گروه</th></tr></thead><tbody>\n',
);

allRows.sort((a, b) => a.change - b.change);
allRows.forEach((v, i) => {
	if (v.l18.match(/^([^0-9]*)$/)) {
		file.write(
			'<tr><td>' + v.l18 + '</td><td>' + v.plp + '%' + '</td><td>' + v.flow + '</td><td>' + v.cs + '</td></tr>',
		);
	}
});
file.write(htmlTail);
file.end();

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

var file = fs.createWriteStream('out_' + date + '/rsi_' + date + '.html');
file.write(htmlHeader);
file.write(
	'<thead><tr>' +
		'<th>نماد</th>' +
		'<th>RSI</th>' +
		'<th>بازار</th>' +
		'<th>گروه</th>' +
		'<th>30روز</th>' +
		'<th>س</th>' +
		'<th>t</th>' +
		'</tr></thead><tbody>\n',
);
allRows.forEach((v, i) => {
	if (v.hist && v.hist[50]) {
		if (v.l18.match(/^([^0-9]*)$/)) {
			let data = v.hist.map(v => v.PClosing).reverse();
			data[data.length] = v.pc;
			//if (v.l18 == 'شپنا') console.log(data);
			tulind.indicators.rsi.indicator([data], [14], function(err, results) {
				v.rsi = results[0];
			});

			color = GetColor(v.cs);
			let rsi = numeral(v.rsi[v.rsi.length - 1]).format();
			let bazColor = GetBazColor(v);
			if (rsi > 0) {
				file.write(
					'<tr>' +
						'<td>' +
						v.l18 +
						'</td>' +
						'<td>' +
						+rsi +
						'</td>' +
						'<td style="color:' +
						bazColor +
						'">' +
						v.flow +
						'</td>' +
						'<td style="color:#' +
						color +
						'">' +
						v.cs +
						'</td>' +
						'<td>' +
						'<img  src="http://tsetmc.com/tsev2/chart/img/Inst.aspx?i=' +
						v.inscode +
						'"/>' +
						'</td>' +
						'<td><a href="https://www.sahamyab.com/hashtag/' +
						v.l18 +
						'/post"><img src="http://smojmar.github.io/upload/sahamYab.png"> </a>' +
						'</td><td>' +
						'<a href="http://www.tsetmc.com/loader.aspx?ParTree=151311&i=' +
						v.inscode +
						'"><img src="http://smojmar.github.io/upload/tseIcon.jpg"></a>' +
						'</td>' +
						'</tr>\n',
				);
			}
		}
	}
});
file.write(htmlTail);
file.end();

function SafeForoush() {
	let o = [];
	o = allRows.filter((v, i) => Math.round(v.po1) == Math.round(v.tmin) && v.qd1 == 0);
	return o;
}
o = SafeForoush();
o.sort((a, b) => a.qo1 - b.qo1);
var file = fs.createWriteStream('out_' + date + '/sell_' + date + '.html');
file.write(htmlHeader);
file.write(
	'<thead><tr><th>نماد</th>' +
		'\n' +
		'<th>حجم</th>' +
		'\n' +
		'<th>تعداد</th>' +
		'\n' +
		'<th>بازار</th>' +
		'\n' +
		'<th>گروه</th>' +
		'<th>30روز</th>' +
		'\n' +
		'<th>س</th>' +
		'<th>t</th>' +
		'</tr></thead><tbody>' +
		'\n',
);
o.forEach((v, i) => {
	if (v.l18.match(/^([^0-9]*)$/)) {
		color = GetColor(v.cs);
		file.write(
			'<tr><td>' +
				v.l18 +
				'</td>' +
				'\n<td data-sort="' +
				v.qo1 +
				'">' +
				numeral(v.qo1)
					.format('0a')
					.toUpperCase() +
				'</td>\n<td>' +
				v.zo1 +
				'</td>\n<td>' +
				v.flow +
				'</td><td style="color:#' +
				color +
				'">' +
				v.cs +
				'</td>' +
				'<td><img  src="http://tsetmc.com/tsev2/chart/img/Inst.aspx?i=' +
				v.inscode +
				'"/></td>' +
				'<td><a href="https://www.sahamyab.com/hashtag/' +
				v.l18 +
				'/post"><img src="http://smojmar.github.io/upload/sahamYab.png"></a>' +
				'</td><td>' +
				'<a href="http://www.tsetmc.com/loader.aspx?ParTree=151311&i=' +
				v.inscode +
				'"><img src="http://smojmar.github.io/upload/tseIcon.jpg"></a>' +
				'</td>' +
				'</tr>',
		);
	}
});
file.write(htmlTail);
file.end();

var file = fs.createWriteStream('out_' + date + '/pe_' + date + '.txt');
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
var file = fs.createWriteStream('out_' + date + '/buy_' + date + '.html');
file.write(htmlHeader);
file.write(
	'<thead><tr>' +
		'<th>نماد</th>' +
		'<th>حجم</th>' +
		'<th>تعداد</th>' +
		'<th>بازار</th>' +
		'<th>گروه</th>' +
		'<th>30\nروز</th>' +
		'<th>س</th>' +
		'<th>t</th>' +
		'</tr></thead><tbody>\n',
);
o.forEach((v, i) => {
	if (v.l18.match(/^([^0-9]*)$/)) {
		color = GetColor(v.cs);
		file.write(
			'<tr><td>' +
				v.l18 +
				'</td>' +
				'<td data-sort="' +
				v.qd1 +
				'">' +
				numeral(v.qd1)
					.format('0a')
					.toUpperCase() +
				'</td><td data-sort="' +
				v.zd1 +
				'">' +
				numeral(v.zd1)
					.format('0a')
					.toUpperCase() +
				'</td><td>' +
				v.flow +
				'</td><td style="color:#' +
				color +
				'">' +
				v.cs +
				'</td><td>' +
				'<img  src="http://tsetmc.com/tsev2/chart/img/Inst.aspx?i=' +
				v.inscode +
				'"/>' +
				'</td>' +
				'<td><a href="https://www.sahamyab.com/hashtag/' +
				v.l18 +
				'/post"><img src="http://smojmar.github.io/upload/sahamYab.png"> </a>' +
				'</td><td>' +
				'<a href="http://www.tsetmc.com/loader.aspx?ParTree=151311&i=' +
				v.inscode +
				'"><img src="http://smojmar.github.io/upload/tseIcon.jpg"></a>' +
				'</td>' +
				'</tr>\n',
		);
	}
});
file.write(htmlTail);
file.end();

var file = fs.createWriteStream('out_' + date + '/1wBaz_' + date + '.html');
file.write(htmlHeader);
file.write(
	'<thead><tr>' + '<th>نماد</th>' + '<th>بازده</th>' + '<th>بازار</th>' + '<th>گروه</th></tr></thead><tbody>\n',
);
allRows.forEach((v, i) => {
	if (v.l18.match(/^([^0-9]*)$/)) {
		if (v.hist) {
			if (v.hist.length > 30 && v.hist[6].PDrCotVal > 0) {
				color = GetColor(v.cs);
				file.write(
					'<tr><td>' +
						v.l18 +
						'</td><td>' +
						numeral(((v.pl - v.hist[6].PDrCotVal) / v.hist[6].PDrCotVal) * 100).format() +
						'</td><td>' +
						v.flow +
						'</td><td style="color:#' +
						color +
						'">' +
						v.cs +
						'</td></tr>\n',
				);
			}
		}
	}
});
file.write(htmlTail);
file.end();

allRows.sort((a, b) => a.ct.Buy_CountN - b.ct.Buy_CountN);
var file = fs.createWriteStream('out_' + date + '/ct_' + date + '.html');
file.write(htmlHeader);
file.write('<thead><tr><th>نماد</th>' + '\n<th>' + 'حجم</th>' + '\n<th>' + 'تعداد</th>' + '</tr></thead><tbody>\n');
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
	var file = fs.createWriteStream(fileName + '.html');
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

function getGzipped(url, callback) {
	// buffer to store the streamed decompression
	var buffer = [];

	var options = {
		host: 'www.tsetmc.com',
		path: '/loader.aspx?ParTree=151311&i=' + url,
	};
	http.get(options, function(res) {
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
	}).on('error', function(e) {
		callback(e);
	});
}

var http = require('http');
zlib = require('zlib');

let globalI = 0;
function GetSymbolsPage() {
	var file1 = fs.createWriteStream('files/' + 'body_' + date + '.html');
	allRows.forEach((v, i) => {
		getGzipped(v.inscode, function(err, data) {
			var regex = /LVal18AFC='(.*)',D/g;
			globalI++;
			console.log('globalI = ', globalI);
			if (data) {
				file1.write(data + '\n\n\n');
			}
		});
	});
}
if (getSymbolsPageFlag) {
	GetSymbolsPage();
}

function GetSymbolsData() {
	let name = [];
	let floatVal = [];
	let totalVol = [];
	let sectorPE = [];
	let insCode = [];
	let color = [];
	let cntr = 0;

	//let body = fs.readFileSync('files/body_' + date + '.html');
	let body = fs.readFileSync('files/body_' + date + '.html').toString();

	var regex = /LVal18AFC='(.*?)',D/g;
	match = regex.exec(body);
	cntr = 0;
	while (match != null) {
		name[cntr++] = match[1];
		match = regex.exec(body);
	}

	var regex = /,KAjCapValCpsIdx='(.*?)',P/g;
	cntr = 0;
	match = regex.exec(body);
	while (match != null) {
		floatVal[cntr++] = match[1];
		if (match[1]) {
		}
		match = regex.exec(body);
	}

	var regex = /,ZTitad=(.*?),CI/g;
	cntr = 0;
	match = regex.exec(body);
	while (match != null) {
		totalVol[cntr++] = match[1];
		if (match[1]) {
		}
		match = regex.exec(body);
	}

	var regex = /,InsCode='(.*?)',B/g;
	cntr = 0;
	match = regex.exec(body);
	while (match != null) {
		insCode[cntr++] = match[1];
		match = regex.exec(body);
	}

	var regex = /,SectorPE='(.*?)',KAjC/g;
	cntr = 0;
	match = regex.exec(body);
	while (match != null) {
		sectorPE[cntr++] = match[1];
		match = regex.exec(body);
	}

	var regex = /,Title='.*',Fa/g;
	cntr = 0;
	match = regex.exec(body);
	while (match != null) {
		if (match[0].match('زرد')) {
			color[cntr++] = 'yellow';
		} else if (match[0].match('قرمز')) {
			color[cntr++] = 'red';
		} else if (match[0].match('نارنجی')) {
			color[cntr++] = 'orange';
		} else {
			color[cntr++] = 'black';
		}
		match = regex.exec(body);
	}
	allRows.forEach((v, i) => {
		index = insCode.findIndex(v1 => v1 == v.inscode);
		allRows[i].floatVal = floatVal[index];
		allRows[i].totalVol = totalVol[index];
		allRows[i].sectorPE = sectorPE[index];
		allRows[i].color = color[index];
	});
}
if (getSymbolsDataFlag) {
	GetSymbolsData();
}

var file = fs.createWriteStream('out_' + date + '/floatVal_' + date + '.html');
file.write(htmlHeader);
file.write(
	'<thead><tr>' +
		'<th>نماد</th>' +
		'<th>شناوری</th>' +
		'<th>کل</th>' +
		'<th>تعداد</th>' +
		'<th>بازار</th>' +
		'<th>گروه</th>' +
		'<th>سهامیاب</th>' +
		'</tr></thead><tbody>\n',
);
allRows.forEach((v, i) => {
	if (v.l18.match(/^([^0-9]*)$/)) {
		if (v.floatVal) {
			color = GetColor(v.cs);
			file.write(
				'<tr><td>' +
					v.l18 +
					'</td><td>' +
					v.floatVal +
					'%' +
					'</td><td data-sort="' +
					v.totalVol +
					'">' +
					numeral(v.totalVol)
						.format('0a')
						.toString()
						.toUpperCase() +
					'</td><td  data-sort="' +
					(v.floatVal / 100) * v.totalVol +
					'">' +
					numeral((v.floatVal / 100) * v.totalVol)
						.format('0a')
						.toString()
						.toUpperCase() +
					'</td><td>' +
					v.flow +
					'</td><td style="color:#' +
					color +
					'">' +
					v.cs +
					'</td><td>' +
					'<a href="https://www.sahamyab.com/hashtag/' +
					v.l18 +
					'/post">سهامیاب</a>' +
					'</td></tr>\n',
			);
		}
	}
});
file.write(htmlTail);
file.end();

var file = fs.createWriteStream('out_' + date + '/drug_' + date + '.html');
file.write(htmlHeader);
file.write(
	'<thead><tr>' +
		'<th>نماد</th>' +
		'<th>pe</th>' +
		'<th>گروهpe</th>' +
		'<th>بازار</th>' +
		'<th>tsm</th>' +
		'</tr></thead><tbody>\n',
);
allRows.filter((v, i) => v.cs == 43).forEach((v, i) => {
	if (v.l18.match(/^([^0-9]*)$/) && v.pe && v.sectorPE) {
		file.write(
			'<tr><td>' +
				v.l18 +
				'</td><td>' +
				v.pe +
				'</td><td>' +
				v.sectorPE +
				'</td><td>' +
				v.flow +
				'</td><td>' +
				'<a href="http://www.tsetmc.com/loader.aspx?ParTree=151311&i=' +
				v.inscode +
				'">tsm</a>' +
				'</td></tr>\n',
		);
	}
});
file.write(htmlTail);
file.end();

function SendTelegram() {
	const TelegramBot = require('node-telegram-bot-api');
	const token = '982988089:AAHu--kbHd3Cmme4uBA1K7LQ8EPu6JrTs8A';
	const bot = new TelegramBot(token, {polling: true});

	let sp = date.split('_');
	let tarikh = '\u{1F4c5} تاریخ : ' + sp[0] + '/' + sp[1] + '/' + sp[2] + '\n\n';
	let id;
	id = 118685953;
	id = '@filtermarket1';

	bot.sendMessage(
		id,
		tarikh +
			'<a href="https://smojmar.github.io/out_' +
			date +
			'/buy_' +
			date +
			'.html">صف های خرید</a> \n\n بیشترین حجم # \n\n @filtermarket1',
		{parse_mode: 'HTML'},
	);
	bot.sendMessage(
		id,
		tarikh +
			'<a href="https://smojmar.github.io/out_' +
			date +
			'/sell_' +
			date +
			'.html">صف های فروش</a> \n\n بیشترین حجم # \n\n @filtermarket1',
		{parse_mode: 'HTML'},
	);

	bot.sendMessage(
		id,
		tarikh +
			'<a href="https://smojmar.github.io/out_' +
			date +
			'/ct_' +
			date +
			'.html">خرید حقوقی</a> \n\n بیشترین حجم # \n بیشترین تعداد #\n\n' +
			' @filtermarket1',
		{parse_mode: 'HTML'},
	);
	bot.sendMessage(
		id,
		tarikh +
			'<a href="https://smojmar.github.io/out_' +
			date +
			'/floatVal_' +
			date +
			'.html">شناوری سهم ها</a>' +
			'\n\n کمترین حجم # \n\n @filtermarket1',
		{parse_mode: 'HTML'},
	);

	bot.sendMessage(
		id,
		tarikh +
			'<a href="https://smojmar.github.io/out_' +
			date +
			'/tagh1D_' +
			date +
			'.html">تغییر قیمت تمامی سهم ها</a> \n\n بیشترین تغییر # \n\n @filtermarket1',
		{parse_mode: 'HTML'},
	);

	bot.sendMessage(
		id,
		tarikh +
			'<a href="https://smojmar.github.io/out_' +
			date +
			'/rsi_' +
			date +
			'.html">مقادیر RSI برای تمامی سهم ها</a> \n\n بیشترین تغییر #' +
			'\n\n مقادیر کم ممکن است به علت افزایش سرمایه یاشد ' +
			'\n\n @filtermarket1',
		{parse_mode: 'HTML'},
	);

	// Matches "/echo [whatever]"
	bot.onText(/\/echo (.+)/, (msg, match) => {
		// 'msg' is the received Message from Telegram
		// 'match' is the result of executing the regexp above on the text content
		// of the message

		const chatId = msg.chat.id;
		const resp = match[1]; // the captured "whatever"

		// send back the matched "atever" to the chat
		bot.sendMessage(chatId, chId);
	});

	// Listen for any kind of meage. There are different kinds of
	// messages.
	bot.on('message', msg => {
		const chatId = msg.chat.id;

		// send a message to the ct acknowledging receipt of their message
		bot.sendMessage(
			'@filtermarket1',
			'<b>bold</b> \n <i>italic</i> \n <em>italic with em</em> \n <a href="http://www.example.com/">inline URL</a> \n <code>inline fixed-width code</code> \n <pre>pre-formatted fixed-width code block</pre>',
			{parse_mode: 'HTML'},
		);
	});
}

if (sendTelegramFlag) {
	SendTelegram();
}
