import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cmzfnieekeckwkigyoew.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemZuaWVla2Vja3draWd5b2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzU3MTksImV4cCI6MjEwMTk1MTcxOX0.cXdLwuoL8qeQGFCuFQKCvKJH91h0AZaHGw18zCb9mH8'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

import crypto from 'crypto'

// In-memory rate limiting map: saltedHash -> timestamps[]
const checklistRateLimitMap = new Map<string, number[]>()
const trackRateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_SALT = 'nedun_portfolio_salt_' + Date.now().toString(36)

const ALLOWED_ROLES = new Set([
  'founder',
  'cofounder',
  'developer',
  'agency',
  'other',
  'Founder',
  'Co-founder',
  'Developer',
  'Agency / Team',
  'Other',
])

const CANONICAL_ROLES: Record<string, string> = {
  'Founder': 'founder',
  'Co-founder': 'cofounder',
  'Developer': 'developer',
  'Agency / Team': 'agency',
  'Other': 'other',
  'founder': 'founder',
  'cofounder': 'cofounder',
  'developer': 'developer',
  'agency': 'agency',
  'other': 'other',
}

const ALLOWED_GOALS = new Set([
  'new_app',
  'revamp',
  'add_features',
  'manual_process',
  'exploring',
  'Build a new app / MVP',
  'Revamp or improve an existing app',
  'Add features or integrations',
  'Turn a manual process into software',
  'Just exploring',
])

const CANONICAL_GOALS: Record<string, string> = {
  'Build a new app / MVP': 'new_app',
  'Revamp or improve an existing app': 'revamp',
  'Add features or integrations': 'add_features',
  'Turn a manual process into software': 'manual_process',
  'Just exploring': 'exploring',
  'new_app': 'new_app',
  'revamp': 'revamp',
  'add_features': 'add_features',
  'manual_process': 'manual_process',
  'exploring': 'exploring',
}

const ALLOWED_EVENTS = new Set([
  'page_view',
  'cta_start_project_click',
  'cta_view_work_click',
  'intent_answered',
  'intent_skipped',
  'playbook_opened',
  'playbook_download',
  'playbook_cta_click',
  'contact_form_submit',
])

function getIpHash(ip: string): string {
  return crypto.createHash('sha256').update(ip + RATE_LIMIT_SALT).digest('hex').substring(0, 16)
}

function serverApiPlugin(): Plugin {
  return {
    name: 'server-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // ----------------------------------------------------
        // 1. TRACKING ENDPOINT: POST /api/track
        // ----------------------------------------------------
        if (req.method === 'POST' && req.url && req.url.startsWith('/api/track')) {
          try {
            const userAgent = req.headers['user-agent'] || ''
            const isBot = /bot|crawler|spider|slurp|facebookexternalhit|whatsapp|preview|lighthouse/i.test(userAgent)
            if (isBot) {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ skipped: 'bot' }))
              return
            }

            // Rate Limit: 60 requests per minute per visitor using salted hash of IP
            const rawIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1'
            const ipHash = getIpHash(rawIp)
            const now = Date.now()
            const oneMinAgo = now - 60 * 1000
            const timestamps = (trackRateLimitMap.get(ipHash) || []).filter((t) => t > oneMinAgo)
            if (timestamps.length >= 60) {
              res.statusCode = 429
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Rate limit exceeded' }))
              return
            }
            timestamps.push(now)
            trackRateLimitMap.set(ipHash, timestamps)

            // Read payload
            const chunks: Buffer[] = []
            for await (const chunk of req) {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
            }
            const bodyStr = Buffer.concat(chunks).toString('utf-8')
            let body: any = {}
            try {
              body = JSON.parse(bodyStr)
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }))
              return
            }

            const event = (body.event || '').trim()
            if (!event || !ALLOWED_EVENTS.has(event)) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid event type. Allowed events only.' }))
              return
            }

            let role: string | null = null
            let goal: string | null = null
            let ref: string | null = null
            const path: string = (body.path || '/').substring(0, 100)

            if (body.ref && typeof body.ref === 'string') {
              const cleanRef = body.ref.trim().toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 30)
              if (cleanRef) ref = cleanRef
            }

            if (body.role) {
              if (!ALLOWED_ROLES.has(body.role)) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Invalid role value' }))
                return
              }
              role = CANONICAL_ROLES[body.role] || body.role.toLowerCase()
            }

            if (body.goal) {
              if (!ALLOWED_GOALS.has(body.goal)) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Invalid goal value' }))
                return
              }
              goal = CANONICAL_GOALS[body.goal] || body.goal.toLowerCase()
            }

            // Insert into Supabase site_events
            await supabase.from('site_events').insert([
              {
                event,
                ref,
                path,
                role,
                goal,
              },
            ])

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true }))
          } catch (err: any) {
            console.error('Track API Error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Internal server error', message: err?.message }))
          }
          return
        }

        // ----------------------------------------------------
        // 2. CHECKLIST LEAD ENDPOINT: POST /api/checklist
        // ----------------------------------------------------
        if (req.method === 'POST' && req.url && req.url.startsWith('/api/checklist')) {
          try {
            const chunks: Buffer[] = []
            for await (const chunk of req) {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
            }
            const bodyStr = Buffer.concat(chunks).toString('utf-8')
            let body: any = {}
            try {
              body = JSON.parse(bodyStr)
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }))
              return
            }

            // Honeypot check
            if (body.website || body.honeypot || body.phone_number) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Spam detected' }))
              return
            }

            const name = (body.name || '').trim()
            const email = (body.email || '').trim().toLowerCase()
            const idea = (body.idea || '').trim()
            const ref = (body.ref || '').trim() || null

            // Input Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const errors: string[] = []
            if (!name) errors.push('Name is required')
            if (!email || !emailRegex.test(email)) errors.push('Valid email address is required')
            if (!idea) errors.push('Project idea / description is required')

            if (errors.length > 0) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: errors.join('. '), details: errors }))
              return
            }

            // IP Rate Limiting (5 requests per hour)
            const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1'
            const now = Date.now()
            const oneHourAgo = now - 60 * 60 * 1000

            const timestamps = (checklistRateLimitMap.get(clientIp) || []).filter((t) => t > oneHourAgo)
            if (timestamps.length >= 5) {
              res.statusCode = 429
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Rate limit exceeded. Maximum 5 submissions per hour.' }))
              return
            }

            timestamps.push(now)
            checklistRateLimitMap.set(clientIp, timestamps)

            // Insert into Supabase checklist_leads
            let insertedData: any = null
            const { data, error } = await supabase
              .from('checklist_leads')
              .insert([
                {
                  name,
                  email,
                  idea,
                  ref,
                  status: 'new',
                },
              ])
              .select()
              .single()

            if (!error && data) {
              insertedData = data
            } else {
              // Fallback
              const { data: fallbackData, error: fError } = await supabase
                .from('contact_leads')
                .insert([
                  {
                    name,
                    email,
                    project_type: 'Checklist Lead',
                    budget: 'Checklist',
                    timeline: ref || 'Direct',
                    message: idea,
                    status: 'new',
                  },
                ])
                .select()
                .single()

              if (fError) {
                console.error('Supabase fallback insert error:', fError)
              } else {
                insertedData = fallbackData
              }
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, lead: insertedData }))
          } catch (err: any) {
            console.error('Checklist API Error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Internal server error', message: err?.message }))
          }
          return
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serverApiPlugin()],
})
