
var http = require('https');
const TelegramBot = require('node-telegram-bot-api');
const token = '982988089:AAHu--kbHd3Cmme4uBA1K7LQ8EPu6JrTs8A'
let p = '/bot' + token.toString() + '/sendMessage?chat_id=' + 'filtermarket1' + '&text=[MY_MESSAGE_TEXT]';
//console.log(p);
// var options = {
//    host: 'api.telegram.org',
//    path: p,
//  };
//http.get(options, res=>{
//	console.log(res);
//})


//http.get('https://api.telegram.org' + p, (resp) => {
//  let data = '';
//
//  // A chunk of data has been recieved.
//  resp.on('data', (chunk) => {
//    data += chunk;
//  });
//
//  // The whole response has been received. Print out the result.
//  resp.on('end', () => {
//    console.log(JSON.parse(data).explanation);
//  });
//
//}).on("error", (err) => {
//  console.log("Error: " + err.message);
//});





// replace the value below with the Telegram token you receive from @BotFather
//const token = '404286253:AAFSolNOB11UaVoa8ci_WqS2vdOSJNXliE8';

 //Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
let id = 118685953;
//bot.sendMessage('filtermarket1', 'Received your message\n');

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
bot.on('message', (msg) => {
  const chatId = msg.chat.id

  // send a message to the ct acknowledging receipt of their message
  bot.sendMessage('@filtermarket1',"<b>bold</b> \n <i>italic</i> \n <em>italic with em</em> \n <a href=\"http://www.example.com/\">inline URL</a> \n <code>inline fixed-width code</code> \n <pre>pre-formatted fixed-width code block</pre>" ,{parse_mode : "HTML"})
})



