require('./configs/config.js')

const express = require('express')
const path = require('path')
const http = require('http')
const webSocketServer = require('ws').Server
const app = new express()
const fs = require('fs')

const root = __dirname + '/dist'
let userIdCounter = 0
const rejectIps = new Set(fs.readFileSync('./ip-blacklist', 'utf8').split('\n'))

// show port
console.table(global.config)

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
}

function logger(req) {
  console.log(
    req.method,
    getIp(req),
    req.url,
    req.query
  )
}

/* http server */
app.use(express.static(root))
app.get('*', (req, res) => {
  if (rejectIps.has(getIp(req))) return
  if (req.method !== 'HEAD') logger(req)
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
