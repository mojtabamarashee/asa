var http = require('https');
function SendTelegram() {
    const TelegramBot = require('node-telegram-bot-api');
	const token = '982988089:AAHu--kbHd3Cmme4uBA1K7LQ8EPu6JrTs8A';
	let p = '/bot' + token.toString() + '/sendMessage?chat_id=' + 'filtermarket1' + '&text=[MY_MESSAGE_TEXT]';

	//Create a bot that uses 'polling' to fetch new updates
	const bot = new TelegramBot(token, {polling: true});
	let id = 118685953;
	//bot.sendMessage('filtermarket1', 'Received your message\n');
	//bot.sendMessage('@filtermarket1',"<a href=\"https://smojmar.github.io/out_98_08_06/buy_98_08_06.html\">صف هاس خرید</a> \n\n بیشترین حجم # \n\n @filtermarket1" ,{parse_mode : "HTML"})
	//bot.sendMessage('@filtermarket1',"<a href=\"https://smojmar.github.io/out_98_08_06/sell_98_08_06.html\">صف های فروش</a> \n\n بیشترین حجم # \n\n @filtermarket1" ,{parse_mode : "HTML"})
	//bot.sendMessage('@filtermarket1',"<a href=\"https://smojmar.github.io/out_98_08_06/ct_98_08_06.html\">خرید حقوقی</a> \n\n بیشترین حجم # \n بیشترین تعداد #\n\n @filtermarket1" ,{parse_mode : "HTML"})
	bot.sendMessage(
		id,
		'<a href="https://smojmar.github.io/out_98_08_06/ct_98_08_06.html">خرید حقوقی</a> \n\n بیشترین حجم # \n بیشترین تعداد #\n\n---\n\u{1F4c5} @filtermarket1',
		{parse_mode: 'HTML'},
	);
	bot.sendMessage(
		id,
		`<a href=\"https://smojmar.github.io/out_98_08_06/floatVal_98_08_06.html\">شناوری سهم ها</a> 

<pre>
| Tables   |      Are      |  Cool |
|----------|:-------------:|------:|
| col 1 is |  left-aligned | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |
</pre>
\u{1F4c5}
` + '\n\n کمترین حجم # \n\n @filtermarket1',
		{parse_mode: 'HTML'},
	);

	//bot.sendMessage('@filtermarket1',"<a href=\"https://smojmar.github.io/out_98_08_06/tagh1D_98_08_06.html\">تغییر قیمت تمامی سهم ها</a> \n\n بیشترین تغییر # \n\n @filtermarket1" ,{parse_mode : "HTML"})

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
