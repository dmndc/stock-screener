// Import socket.io with a connection to a channel (i.e. tops)
const socket = require('socket.io-client')('https://ws-api.iextrading.com/1.0/tops')

// Listen to the channel's messages
socket.on('message', message => {
  console.log(message);
  let stockData = JSON.parse(message);
  console.log(`${stockData.symbol}: ${stockData.lastSalePrice}`);
})

// Connect to the channel
socket.on('connect', () => {

  console.log('Socket connected');

  // Subscribe to topics (i.e. appl,fb,aig+)
  socket.emit('subscribe', 'aapl')

  // Unsubscribe from topics (i.e. aig+)
  socket.emit('unsubscribe', 'aig+')
})

// Disconnect from the channel
socket.on('disconnect', () => console.log('Disconnected.'))