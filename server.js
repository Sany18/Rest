require('./configs/config.js')
const express = require('express')
const path = require('path')
const http = require('http')
const webSocketServer = require('ws').Server
const app = new express()

const root = __dirname + '/dist'
let userIdCounter = 0

// logs
console.table(global.config)

/* http server */
app.use(express.static(root))
app.get('*', (req, res) => {
  // logs
  console.log(req.method, req.url, req.query)

  res.sendFile(path.join(root + '/index.html'))
})

const httpServer = http.createServer(app)
httpServer.listen(global.config.serverPort)

/* ws server */
const wsServer = new webSocketServer({ server: httpServer })

wsServer.on('connection', ws => {
  ws.on('message', runCommands)
  sendMessageToCurrentUser(ws, JSON.stringify({ __id: ++userIdCounter }))
  sendMessageToCurrentUser(ws, 'Welcome. WS is working')
})

function runCommands(message) {
  if (message == 'password') { return httpServer.close() }

  broadcast(message)
}

function wsMessageFormatter(message) { return JSON.stringify({ message, timestamp: new Date() }) }

function broadcast(message) { wsServer.clients.forEach(client => client.send(wsMessageFormatter(message))) }

function sendMessageToCurrentUser(ws, message) { ws.send(wsMessageFormatter(message)) }

/* ... */
