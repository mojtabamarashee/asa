async function main() {
	date = '98_11_02';
	let getSymbolsPageFlag = 0;
	let getSymbolsDataFlag = 1;
	let getSymbolsPriceHistFlag = 0;
	let commitFlag = 0;
	let sendTelegramFlag = 0;

	let outPath = '../smojmar.github.io/';
	const axios = require('axios');
	var tulind = require('tulind');
	var http = require('http');
	zlib = require('zlib');
	const fs = require('fs');

	let YEAR_DAYS = 250;

	if (!fs.existsSync(outPath + 'out_' + date)) {
		fs.mkdirSync(outPath + 'out_' + date);
	}

	let SaveAllRows = () => {
		fs.writeFileSync('../onePage/public/allRows_' + date + '.js', 'allRows=' + JSON.stringify(allRows));
		fs.writeFileSync('../smojmar.github.io/allRows_' + date + '.js', 'allRows=' + JSON.stringify(allRows));
		fs.writeFileSync('allRows_' + date + '.js', JSON.stringify(allRows));
		console.log('save');
	};

	//let h = GetHistData('27952969918967492');
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

	GetColor = num => (num * 10).toString(16);
	var numeral = require('numeral');
	numeral.defaultFormat('0,0.[00]');

	let rawdata = fs.readFileSync('files/mw_' + date + '.txt');
	//let prevBody = fs.readFileSync('files/body_' + date + '.html').toString();
	//console.log('prevBody = ', prevBody);
	let mw1 = JSON.parse(rawdata);

	let allRows;
	try {
		allRows = JSON.parse(fs.readFileSync('allRows_' + date + '.js', 'utf8'));
	} catch (err) {
		allRows = Object.values(mw1.AllRows);
	}

	//allRows.forEach(v=>v.ctHist = null);
	//fs.writeFileSync('../onePage/public/allRows_' + date + '.js', 'allRows=' + JSON.stringify(allRows));
	//fs.writeFileSync('../smojmar.github.io/allRows_' + date + '.js', 'allRows=' + JSON.stringify(allRows));
	//fs.writeFileSync('allRows_' + date + '.js', JSON.stringify(allRows));

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
	var file = fs.createWriteStream(outPath + 'out_' + date + '/Nav1D_' + date + '.html');
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

	var file = fs.createWriteStream(outPath + 'out_' + date + '/tagh1D_' + date + '.html');
	file.write(htmlHeader);
	file.write(
		'<thead><tr>' + '<th>نماد</th>' + '<th>تغییر</th>' + '<th>بازار</th>' + '<th>گروه</th></tr></thead><tbody>\n',
	);

	allRows.sort((a, b) => a.change - b.change);
	allRows.forEach((v, i) => {
		if (v.l18.match(/^([^0-9]*)$/)) {
			file.write(
				'<tr><td>' +
					v.l18 +
					'</td><td>' +
					v.plp +
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

	var file = fs.createWriteStream(outPath + 'out_' + date + '/rsi_' + date + '.html');
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
				let bazColor = GetBazColor(v);
				color = GetColor(v.cs);
				if (v.rsi > 0) {
					file.write(
						'<tr>' +
							'<td>' +
							v.l18 +
							'</td>' +
							'<td>' +
							+v.rsi +
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
	var file = fs.createWriteStream(outPath + 'out_' + date + '/sell_' + date + '.html');
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

	function SafeKharid() {
		let o = [];
		o = allRows.filter((v, i) => Math.round(v.pd1) == Math.round(v.tmax) && v.qd1 > 0);
		return o;
	}

	o = SafeKharid();
	o.sort((a, b) => a.qd1 - b.qd1);
	var file = fs.createWriteStream(outPath + 'out_' + date + '/buy_' + date + '.html');
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

	var file = fs.createWriteStream(outPath + 'out_' + date + '/1wBaz_' + date + '.html');
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

	let testI = 0;
	var file = fs.createWriteStream('ct error.txt');
	//allRows.sort((a, b) => {
	//  if (a.l18.match(/^([^0-9]*)$/) && b.l18.match(/^([^0-9]*)$/)) {
	//    if (a.ct && b.ct) {
	//      return a.ct.Buy_CountN - b.ct.Buy_CountN;
	//    } else {
	//      console.log('ct error = ', testI);
	//      if (!a.ct) file.write(a.l18.toString() + '\n');
	//      if (!b.ct) file.write(b.l18.toString() + '\n');
	//    }
	//    testI++;
	//  }
	//});

	var file = fs.createWriteStream(outPath + 'out_' + date + '/ct_' + date + '.html');
	file.write(htmlHeader);
	file.write('<thead><tr><th>نماد</th>' + '\n<th>' + 'حجم</th>' + '\n<th>' + 'تعداد</th>' + '</tr></thead><tbody>\n');
	allRows.forEach((v, i) => {
		if (v.l18.match(/^([^0-9]*)$/)) {
			if (v.ct) {
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
			} else {
				console.log('ct error = ', i);
			}
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
	allRows.forEach((v, i) => {
		v.name = v.l18
			.toString()
			.replace('ي', 'ی')
			.replace('ي', 'ی')
			.replace('ي', 'ی')
			.replace('ك', 'ک')
			.replace('ك', 'ک')
			.replace('ك', 'ک');
		v.nameFull = v.l30
			.toString()
			.replace('ي', 'ی')
			.replace('ي', 'ی')
			.replace('ي', 'ی')
			.replace('ك', 'ک')
			.replace('ك', 'ک')
			.replace('ك', 'ک');
	});

	let ready = 1;
	function getGzipped(url, callback) {
		// buffer to store the streamed decompression
		var buffer = [];

		var options = {
			host: 'www.tsetmc.com',
			path: '/loader.aspx?ParTree=151311&i=' + url,
			timeout: 200000,
		};
		var request = http
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
			.setTimeout(100000, e => {
				console.log('time');
			})
			.on('error', function(e) {
				console.log('error = ' + e);
				callback(e);
			});
	}

	let globalI = 0;
	function GetSymbolsPage() {
		var file1 = fs.createWriteStream('files/' + 'body_' + date + '.html');
		allRows.forEach((v, i) => {
			if (1) {
				ready = 0;
				if (1) {
					if (1) {
						getGzipped(v.inscode, function(err, data) {
							var regex = /LVal18AFC='(.*)',D/g;
							globalI++;
							console.log('pageOk = ', globalI);
							if (data) {
								//v.body = data;
								file1.write(data + '\n\n\n');
							}
						});
					} else {
						file1.write(v.body + '\n\n\n');
					}
				}
			}
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
		let csName = [];
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

		var ma = /بازار پايه زرد فرابورس/g;
		bodies = body.split('<!doctype html>');
		var file = fs.createWriteStream('color.txt');
		allRows.forEach((v, i) => {
			bd = bodies.find((v1, i1) => v1.match("InsCode='" + v.inscode));
			//v.body = bd;
			v.color = 'y';
			//if (v.body.match(ma)) {
			//	file.write(v.l18 + '\n');
			//}
		});

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

		var regex = /LSecVal='(.*?)',Cg/g;
		cntr = 0;
		match = regex.exec(body);
		while (match != null) {
			csName[cntr++] = match[1];
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
			} else if (match[0].match('نارنج')) {
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
			allRows[i].csName = csName[index];
			allRows[i].color = color[index];
		});
	}
	if (getSymbolsDataFlag) {
		GetSymbolsData();
	}

	var file = fs.createWriteStream(outPath + 'out_' + date + '/floatVal_' + date + '.html');
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

	var file = fs.createWriteStream(outPath + 'out_' + date + '/pe_' + date + '.html');
	file.write(htmlHeader);
	file.write(
		'<thead><tr>' +
			'<th>نماد</th>' +
			'<th>pe</th>' +
			'<th>گروهpe</th>' +
			'<th>بازار</th>' +
			'<th>س</th>' +
			'<th>t</th>' +
			'</tr></thead><tbody>\n',
	);
	allRows.forEach((v, i) => {
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
					'</td>' +
					'<td><a href="https://www.sahamyab.com/hashtag/' +
					v.l18 +
					'/post"><img src="http://smojmar.github.io/upload/sahamYab.png"> </a>' +
					'</td><td>' +
					'<a href="http://www.tsetmc.com/loader.aspx?ParTree=151311&i=' +
					v.inscode +
					'"><img src="http://smojmar.github.io/upload/tseIcon.jpg"></a>' +
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
				'.html">صف های خرید</a> \n\n' +
				'<a href="https://smojmar.github.io/out_' +
				date +
				'/sell_' +
				date +
				'.html">صف های فروش</a> \n\n' +
				'<a href="https://smojmar.github.io/out_' +
				date +
				'/ct_' +
				date +
				'.html">خرید حقوقی</a> \n\n' +
				'<a href="https://smojmar.github.io/out_' +
				date +
				'/floatVal_' +
				date +
				'.html">شناوری سهم ها</a>' +
				'\n\n' +
				'<a href="https://smojmar.github.io/out_' +
				date +
				'/tagh1D_' +
				date +
				'.html">تغییر قیمت تمامی سهم ها</a> \n\n' +
				'<a href="https://smojmar.github.io/out_' +
				date +
				'/rsi_' +
				date +
				'.html">مقادیر RSI برای تمامی سهم ها</a>' +
				'\n\n ' +
				'<a href="https://smojmar.github.io/out_' +
				date +
				'/pe_' +
				date +
				'.html">مقادیر P/E برای سهم و گروه</a>' +
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

	var file = fs.createWriteStream(outPath + 'out_' + date + '/min60D_' + date + '.html');
	file.write(htmlHeader);
	file.write(
		'<thead><tr>' +
			'<th>نماد</th>' +
			'<th>min60</th>' +
			'<th>max60</th>' +
			'<th>بازار</th>' +
			'<th>س</th>' +
			'<th>t</th>' +
			'</tr></thead><tbody>\n',
	);
	allRows.forEach((v, i) => {
		if (v.l18.match(/^([^0-9]*)$/)) {
			if (v.pc <= Math.min.apply(null, v.hist.map(v => v.PClosing))) {
				file.write(
					'<tr><td>' +
						v.l18 +
						'</td><td>' +
						Math.min.apply(null, v.hist.map(v => v.PClosing)) +
						'</td><td>' +
						Math.max.apply(null, v.hist.map(v => v.PClosing)) +
						'</td><td>' +
						v.flow +
						'</td>' +
						'<td><a href="https://www.sahamyab.com/hashtag/' +
						v.l18 +
						'/post"><img src="http://smojmar.github.io/upload/sahamYab.png"> </a>' +
						'</td><td>' +
						'<a href="http://www.tsetmc.com/loader.aspx?ParTree=151311&i=' +
						v.inscode +
						'"><img src="http://smojmar.github.io/upload/tseIcon.jpg"></a>' +
						'</td></tr>\n',
				);
			}
		}
	});
	file.write(htmlTail);
	file.end();

	var file = fs.createWriteStream(outPath + 'out_' + date + '/filter_' + date + '.txt');
	allRows
		.filter((v, i) => v.pe < 0.7 * v.sectorPE)
		.filter((v, i) => v.pe > 0)
		.filter((v, i) => v.flow < 3)
		.filter((v, i) => v.floatVal < 10)
		.filter((v, i) => v.totalVol < 400e6)
		.filter((v, i) => v.pc < 0.8 * Math.max.apply(null, v.hist.map(v => v.PClosing)))
		.forEach((v, i) => {
			file.write(v.l18 + '\n');
		});

	allRows.forEach((v, i) => {
		allRows[i].afzayeshSarmayeh = 0;
		if (v.hist) {
			for (i1 = 0; i1 < v.hist.length - 1; i1++) {
				if (Math.abs(v.hist[i1].PClosing - v.hist[i1 + 1].PClosing) / v.hist[i1 + 1].PClosing > 0.2) {
					allRows[i].afzayeshSarmayeh = 1;
				}
			}
		}
	});

	var file = fs.createWriteStream(outPath + 'out_' + date + '/rsi_' + date + '.txt');
	allRows
		.filter((v, i) => v.l18.match(/^([^0-9]*)$/))
		.filter((v, i) => v.pc < 0.8 * Math.max.apply(null, v.hist.map(v => v.PClosing)))
		.filter((v, i) => v.pe && v.pe >= 0)
		.filter((v, i) => v.afzayeshSarmayeh == 0)
		.filter((v, i) => v.pe < 0.7 * v.sectorPE)
		//.filter((v, i) => v.flow < 7)
		//.filter((v, i) => v.rsi && v.rsi < 50 && v.rsi > 0)
		//.filter((v, i) => v.totalVol < 700e6)
		//.filter((v, i) => v.floatVal < 30)
		//.sort((a, b) => {
		//	maxa = Math.max.apply(null, a.hist.map(v => a.PClosing));
		//    diffa = (max - a.pc) / max * 100;
		//})
		.forEach((v, i) => {
			max = Math.max.apply(null, v.hist.map(v => v.PClosing));
			file.write(
				v.l18 +
					',\t' +
					v.flow +
					'\t' +
					v.rsi +
					'\t' +
					v.cs +
					'\t' +
					numeral(((max - v.pc) / max) * 100).format() +
					'\n',
			);
		});

	var file = fs.createWriteStream(outPath + 'out_' + date + '/pe_' + date + '.txt');
	t = allRows
		.filter((v, i) => v.cs == 44)
		.filter((v, i) => v.pe <= v.sectorPE && v.pe > 0)
		.sort((a, b) => a.pe - b.pe)
		.forEach((v, i) => {
			file.write(v.l18 + ',\t' + v.pe + '\t' + v.flow + '\n');
		});

	//file.write(t[0].l18 + ',\t' + t[0].pe + '\n');
	//

	var file = fs.createWriteStream(outPath + 'out_' + date + '/ser_' + date + '.txt');
	//t = allRows
	//	//.filter((v, i) => v.hist.length > 10)
	//	.filter((v, j) => {
	//		flag = true;
	//		for (i = 0; i < 8; i++) {
	//			if (!(v.hist[i].PClosing < v.hist[i + 1].PClosing)) flag = false;
	//		}
	//
	//		return flag;
	//	})
	//	.forEach((v, i) => {
	//		file.write(v.l18 + ',\t' + v.pe + '\t' + v.flow + '\n');
	//	});

	let remainList = allRows.filter(v => v.l18.match(/^([^0-9]*)$/));
	var file = fs.createWriteStream('error.txt');
	maxPriceCntr = 1;
	let pr = [];
	let testt = [];
	let histSendCntr = 0;
	let histRecvCntr = 0;
	let ctSendCntr = 0;
	let ctRecvCntr = 0;

	if (getSymbolsPriceHistFlag) {
		let HistPr = new Promise((res, rej) => {
			allRows.forEach((v, i) => {
				if (v.l18.match(/^([^0-9]*)$/) && !v.pClosingHist) {
					url = 'http://tsetmc.com/tsev2/chart/data/Financial.aspx?i=' + v.inscode + '&t=ph&a=1';
					histSendCntr++;
					axios
						.get(url)
						.then(response => {
							histRecvCntr++;
							console.log('histOk = ', i);
							if (histRecvCntr == histSendCntr) {
								res(1);
							}
							v.pClosingHist = response.data
								.split(';')
								.map(v => v.split(','))
								.map(v => v[6])
								.map(v => Number(v))
								.map(v => Number(v))
								.reverse();

							v.vHist = response.data
								.split(';')
								.map(v => v.split(','))
								.map(v => v[5])
								.map(v => Number(v))
								.map(v => Number(v))
								.reverse();
						})
						.catch(error => {
							histRecvCntr++;
							if (histRecvCntr == histSendCntr) {
								res(1);
							}
							console.log('histError = ', i);
						});
				} else {
					//console.log('histExist = ', i);
				}
			});
		});

		let CTPr = new Promise((res, rej) => {
			allRows.forEach((v, i) => {
				if (v.l18.match(/^([^0-9]*)$/) && !v.ctHist) {
					url = 'http://tsetmc.com/tsev2/data/clienttype.aspx?i=' + v.inscode;
					ctSendCntr++;
					axios
						.get(url)
						.then(response => {
							ctRecvCntr++;
							console.log('ctOk = ', i);
							v.ctHist = response.data.split(';').slice(0, 30);
							ctRecvCntr % 50 == 0 ? SaveAllRows() : null;
							if (ctRecvCntr == ctSendCntr) {
								res(1);
							}
						})
						.catch(error => {
							ctRecvCntr++;
							console.log('ctRecvCntr = ', ctRecvCntr);
							if (ctRecvCntr == ctSendCntr) {
								res(1);
							}
							console.log('ctError = ', i);
						});
				} else {
					//console.log('histExist = ', i);
				}
			});
		});

		await HistPr;
		console.log('hist finished');
		await CTPr;
		console.log('ct finished');
	}

	var file = fs.createWriteStream('eee.txt');
	allRows.forEach(v => {
		if (v.pClosingHist) v.pClosingHist = v.pClosingHist.map(v1 => Number(v1));
	});
	allRows.forEach((v, i) => {
		if (v.pClosingHist) {
			max = Math.max(...v.pClosingHist.slice(0, 60));
			v.pc <= max ? (v.mm = numeral(-((max - v.pc) / max) * 100).format()) : (v.mm = 0);

			if (v.pClosingHist[YEAR_DAYS]) {
				max = Math.max(...v.pClosingHist.slice(0, YEAR_DAYS));
				v.pc <= max ? (v.mmY = numeral(Math.round(-((max - v.pc) / max) * 100)).format()) : (v.mmY = 0);
			}

			n = 5;
			if (v.hist[n]) v.d5 = -((v.pClosingHist[n] - v.pc) / v.pClosingHist[n]) * 100;
			else {
				v.d5 = 'N';
			}

			n = 10;
			if (v.hist[n]) v.d10 = -((v.pClosingHist[n] - v.pc) / v.pClosingHist[n]) * 100;
			else {
				v.d10 = 'N';
			}

			n = 30;
			if (v.hist[n]) v.d30 = -((v.pClosingHist[n] - v.pc) / v.pClosingHist[n]) * 100;
			else {
				v.d30 = 'N';
			}

			n = 59;
			if (v.hist[n]) v.d60 = -((v.pClosingHist[n] - v.pc) / v.pClosingHist[n]) * 100;
			else {
				v.d60 = 'N';
			}

			n = YEAR_DAYS;
			if (v.pClosingHist[n]) {
				let val = -(((v.pClosingHist[n] - v.pc) / v.pClosingHist[n]) * 100);
				if (true) {
					val = Math.round(val);
				}
				v.d360 = val;
			} else {
				v.d360 = 'N';
			}

			if (v.l18 == 'وبملت') {
				console.log('pcl = ', v.pClosingHist[59]);
				console.log('max = ', max);
				console.log('mm = ', v.mm);
				console.log('pc = ', v.pc);
				console.log('d60 = ', v.d60);
				v.pClosingHist.forEach(v => {
					if (v) file.write(v.toString() + ',\n');
				});
			}

			v.hist = [];
			v.per = [];
			v.perSum = [];
		}
	});

	allRows.forEach((v, i) => {
		let rsiAll = [];
		if (v.pClosingHist && v.pClosingHist[15]) {
			let data = v.pClosingHist.filter(v => v).reverse();
			data[data.length] = v.pc;
			tulind.indicators.rsi.indicator([data], [14], function(err, results) {
				rsiAll = results[0];
			});
			let rsi = numeral(rsiAll[rsiAll.length - 1]).format();
			v.rsi = rsi;
		}
	});

	const {exec} = require('child_process');

	SaveAllRows();

	if (commitFlag == 1) {
		console.log('commitFlag = ', commitFlag);
		exec('git -C ../smojmar.github.io add * ', (err, stdout, stderr) => {
			if (err) {
				console.log('err = ', err);
				return;
			}
			console.log(stdout);
		});

		exec('git -C ../smojmar.github.io commit -am ' + date, (err, stdout, stderr) => {
			if (err) {
				console.log('err = ', err);
				return;
			}
			console.log(stdout);
		});

		exec('git -C ../smojmar.github.io push --all', (err, stdout, stderr) => {
			if (err) {
				console.log('err = ', err);
				return;
			}
			console.log(stdout);
		});
		exec('git commit -am ' + date, (err, stdout, stderr) => {
			if (err) {
				console.log('err = ', err);
				return;
			}
			console.log(stdout);
		});

		exec('git push --all', (err, stdout, stderr) => {
			if (err) {
				console.log('err = ', err);
				return;
			}
			console.log(stdout);
		});

		var file = fs.createWriteStream('hist.txt');
		let globalG = 0;

		var file = fs.createWriteStream('csName.txt');
		allRows.forEach(v => {
			file.write(v.csName + '\n');
		});
	}
}

main();
