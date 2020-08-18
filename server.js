const express = require('express')
const config = require('./configs/config.js')
const path = require('path')
const http = require('http')
const WebSocketServer = require('ws').Server

const root = __dirname + '/dist'
const server = new express()
let userIdCounter = 0

/* http server */
server.use(express.static(root))
server.get('*', (req, res) => {
  console.log(req.method, req.url, req.query)
  res.sendFile(path.join(root + '/index.html'))
})

const httpServer = http.createServer(server)
httpServer.listen(config.serverPort)

/* ws server */
const wsServer = new WebSocketServer({ server: httpServer })

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
