https://online.agah.com/TradingView/search?limit=30&query=&type=&exchange=
https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1537678800&to=2114368200&resolution=D
https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1231563600&to=1259470800&resolution=D
https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1004158800&to=2114368200&resolution=W
https://online.agah.com/TradingView/marks?symbol=IRO1AZIN0001-1&from=1259470800&to=2114368200&resolution=D
https://online.agah.com/TradingView/history?symbol=IRO1BMLT0001-1&resolution=D&from=1247122718&to=1251259199&symbolType=%D8%B3%D9%87%D8%A7%D9%85
https://online.agah.com/TradingView/symbols?symbol=IRO1BMLT0001-1
function test(){
    
console.log("salam")
const http = new XMLHttpRequest()

http.open("GET", "https://online.agah.com/TradingView/history?symbol=IRO1BMLT0001-1&resolution=D&from=1251269918&to=1262753999&symbolType=%D8%B3%D9%87%D8%A7%D9%85")
http.send()

http.onload = () => console.log(http.responseText)
};
