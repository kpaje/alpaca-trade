require("dotenv").config();
const Alpaca = require("@alpacahq/alpaca-trade-api");

const alpaca = new Alpaca({
	keyId: process.env.APCA_API_KEY_ID,
	secretKey: process.env.APCA_API_SECRET_KEY,
	paper: true
});

alpaca.getAccount().then(account => {
	console.log("Current Account:", account);
});

const client = alpaca.websocket;
client.onConnect(function() {
	console.log("Connected");
	client.subscribe([
		"trade_updates",
		"account_updates",
		"T.FB",
		"Q.AAPL",
		"A.FB",
		"AM.AAPL"
	]);
	setTimeout(() => {
		client.disconnect();
	}, 30 * 1000);
});
client.onDisconnect(() => {
	console.log("Disconnected");
});
client.onStateChange(newState => {
	console.log(`State changed to ${newState}`);
});
client.onOrderUpdate(data => {
	console.log(`Order updates: ${JSON.stringify(data)}`);
});
client.onAccountUpdate(data => {
	console.log(`Account updates: ${JSON.stringify(data)}`);
});
client.onStockTrades(function(subject, data) {
	console.log(`Stock trades: ${subject}, ${data}`);
});
client.onStockQuotes(function(subject, data) {
	console.log(`Stock quotes: ${subject}, ${data}`);
});
client.onStockAggSec(function(subject, data) {
	console.log(`Stock agg sec: ${subject}, ${data}`);
});
client.onStockAggMin(function(subject, data) {
	console.log(`Stock agg min: ${subject}, ${data}`);
});
client.connect();

// Apple Stocks
alpaca
	.getBars("day", "AAPL", {
		limit: 5
	})
	.then(barset => {
		const aapl_bars = barset["AAPL"];

		// See how much AAPL moved in that timeframe.
		const week_open = aapl_bars[0].o;
		const week_close = aapl_bars.slice(-1)[0].c;
		const percent_change = ((week_close - week_open) / week_open) * 100;

		console.log(`AAPL moved ${percent_change}% over the last 5 days`);
	});

// Tesla Stocks
alpaca
	.getBars("day", "TSLA", {
		limit: 5
	})
	.then(barset => {
		const tsla_bars = barset["TSLA"];

		// See how much TSLA moved in that timeframe.
		const week_open = tsla_bars[0].o;
		const week_close = tsla_bars.slice(-1)[0].c;
		const percent_change = ((week_close - week_open) / week_open) * 100;

		console.log(`TSLA moved ${percent_change}% over the last 5 days`);
	});
