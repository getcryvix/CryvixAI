// Express app setup — implementation coming next
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { askGroq } from './services/groq.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(morgan('dev'))
app.use(express.json({ limit: "1mb" }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cryvixai-api' })
})
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({
        error: 'Message is required'
      })
    }

    const reply = await askGroq(message)

    res.json({
      reply
    })

  } catch (error) {
    console.error(error)
    console.log("Gemini Error:");
console.dir(error, { depth: null });

    res.status(500).json({
      error: 'Something went wrong'
    })
  }
})

export default app
