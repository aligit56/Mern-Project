const cors = require('cors')
const express = require('express')
const itemRoutes = require('./routes/itemRoutes')

const app = express()
const PORT = Number(process.env.PORT) || 5000

app.disable('x-powered-by')
app.use(cors())
app.use(express.json({ limit: '10kb' }))

app.use('/api/items', itemRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', storage: 'local-json' })
})

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
})

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body contains invalid JSON' })
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request body is too large' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(error.errors).map((validationError) => validationError.message),
    })
  }

  console.error('Unhandled API error:', error)
  return res.status(500).json({ message: 'An unexpected server error occurred' })
})

const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`)
  })

  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down gracefully`)
    server.close(async (error) => {
      if (error) {
        console.error('Error closing HTTP server:', error)
        process.exitCode = 1
      }
    })
  }

  process.once('SIGINT', () => shutdown('SIGINT'))
  process.once('SIGTERM', () => shutdown('SIGTERM'))
}

if (require.main === module) {
  startServer()
}

module.exports = app
