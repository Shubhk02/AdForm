# Product Requirements Document (PRD)
## Ad Campaign Intake Form with AI Chatbot & Website Scraper

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** June 2026

---

## 1. Overview

### 1.1 Purpose
A multi-step, progress-driven intake form for an advertising platform that allows brands to submit campaign briefs. The form auto-populates key fields by scraping the brand's website and is accompanied by an AI chatbot that guides users through the process.

### 1.2 Goals
- Reduce time-to-brief submission from ~20 minutes (manual) to under 5 minutes
- Minimise drop-off with a conversational, guided experience
- Auto-fill up to 60% of fields using website scraping
- Produce a structured, machine-readable brief that feeds downstream campaign planning

### 1.3 Non-Goals
- Campaign execution (media buying, creative delivery) — out of scope
- CRM or billing integration in v1
- Multi-language support in v1

---

## 2. Users & Personas

| Persona | Description | Key Need |
|---|---|---|
| Brand Owner / Founder | SMB owner submitting their first campaign | Speed, simplicity, no jargon |
| Marketing Manager | Agency or in-house marketer | Control, detail, multi-product |
| Campaign Ops (Internal) | Reviews submitted briefs | Completeness, structured data |

---

## 3. Feature Requirements

### 3.1 Progress-Based Multi-Step Form

#### Sections
The form is divided into 5 sequential sections, each on its own step:

**Section 1 — About the Brand**
- F1.1: Brand name (text input, required)
- F1.2: Website URL (text input, required) → triggers website scraper on blur/submit
- F1.3: Industry / category (multi-select dropdown: F&B, Health & Wellness, Fashion, Beauty, Finance, EdTech; auto-suggested from scrape, user-editable)
- F1.4: One-line brand description (text area, max 160 chars; auto-suggested from scrape, user-editable)

**Section 2 — About the Product**
- F2.1: Product / offering to advertise (scraped dropdown + "Other / describe manually"; multi-select)
- F2.2: Active offer, discount, or CTA (Yes/No toggle → conditional free-text if Yes)

**Section 3 — Target Audience**
- F3.1: Audience persona per product (multi-select chips: Young professionals, Students, Fitness enthusiasts, Parents, HNI / affluent consumers, General audience)
- F3.2: Age range (dual-handle slider: 18–24, 25–34, 35–44, 45+)
- F3.3: Lifestyle context (optional free text with placeholder examples)

**Section 4 — Geography & Budget**
- F4.1: Target cities (multi-select: Gurgaon, Noida, South Delhi; default = Delhi NCR)
- F4.2: Specific areas / neighbourhoods (optional free text)
- F4.3: Monthly budget range (radio group: ₹10K–25K / ₹25K–50K / ₹50K–1L / ₹1L+)
- F4.4: Go-live date (date picker, min = today + 3 business days)
- F4.5: Creatives status (radio: "Yes — I'll upload them" / "No — I need help" / "I have a rough idea")

**Section 5 — Review & Submit**
- Read-only summary of all answers
- Edit button per section
- Submit CTA

#### Progress Indicator
- Horizontal step bar at top showing Section 1–5
- Active, completed, and upcoming states
- Percentage completion shown (e.g., "Step 2 of 5 — 40% complete")
- "Save & Continue Later" generates a shareable/resumable link (email-gated)

#### Validation
- Required fields block progression to next section
- Inline error messages (not modal alerts)
- URL format validation on F1.2 before scrape is triggered

---

### 3.2 Website Scraper

#### Trigger
Fired automatically when:
1. User enters a valid URL in F1.2 and clicks "Next" or tabs away
2. User explicitly clicks a "Fetch from website" button

#### Scraper Behaviour
- Sends URL to backend scraper service
- Scraper fetches public-facing pages (homepage, /about, /products, /shop, sitemap.xml)
- Extracts:
  - Brand name (from `<title>`, `<meta property="og:site_name">`, logo alt text)
  - One-line description (from `<meta name="description">`, hero headline)
  - Industry signals (from page copy keywords matched against category taxonomy)
  - Product/offering list (from nav menus, product listing pages, schema.org Product markup)
  - Existing offers/discounts (from promotional banners, hero CTAs, schema.org Offer)

#### Auto-Fill Flow
1. Scrape results appear as pre-filled suggestions in the relevant fields
2. Each auto-filled field is visually marked with a "✦ Auto-filled" badge
3. User can accept, edit, or clear each suggestion individually
4. If scrape fails or times out (>8s), fields remain blank with a soft warning: "Couldn't read this website — please fill in manually"

#### Privacy & Legal
- Only public-facing URLs are scraped (no auth, no cookies)
- Scraper respects `robots.txt` disallow rules
- No scraped data is stored beyond the session unless the user submits the form

---

### 3.3 AI Chatbot

#### Placement
- Floating chat button (bottom-right corner) available on all form steps
- Expands to a side panel or modal overlay (does not obscure form)

#### Capabilities

| Capability | Description |
|---|---|
| Form guidance | Explains what any field means in plain language |
| Field suggestions | Offers contextual suggestions based on previously entered data (e.g., "Based on your brand, you may want to target 25–34 year olds") |
| Scrape interpreter | Summarises what was scraped and what was auto-filled |
| Offer help | If user says "No — I need help" on creatives, chatbot initiates a creative brief conversation |
| FAQ | Answers questions about pricing, timelines, campaign types |
| Form fill via chat | User can optionally complete the form entirely through the chatbot (conversational mode) |

#### Conversational Mode (Optional)
- Toggle: "Fill via chat instead" on the intro screen
- Chatbot asks questions in natural language, one at a time
- Answers are mapped to form fields in the background
- At the end, the form is pre-filled and shown for review before submission

#### Guardrails
- Chatbot does not make campaign performance promises
- Chatbot does not modify submitted briefs post-confirmation
- All chatbot interactions are logged for QA

---

## 4. User Flow Diagram

```
Landing / Entry
     │
     ▼
Section 1: Brand Info
  → URL entered → Scraper fires → Auto-fill suggestions
     │
     ▼
Section 2: Product Info
  → Products from scrape shown as options
     │
     ▼
Section 3: Target Audience
     │
     ▼
Section 4: Geography & Budget
     │
     ▼
Section 5: Review & Submit
     │
     ▼
Confirmation Screen
  → Brief sent to Campaign Ops
  → User receives email summary
```

---

## 5. Success Metrics

| Metric | Target |
|---|---|
| Form completion rate | ≥ 65% of starts |
| Time-to-submit (median) | ≤ 6 minutes |
| Auto-fill acceptance rate | ≥ 50% of scraped suggestions accepted |
| Chatbot engagement rate | ≥ 25% of sessions |
| Brief quality score (ops rating) | ≥ 4/5 average |

---

## 6. Out of Scope (v1)

- Payment / billing integration
- Creative upload and preview
- Real-time campaign dashboard
- A/B tested form variants
- Mobile-native app

---
---

# System Requirements Document (SRD)

## Ad Campaign Intake Form — Technical Specification

**Version:** 1.0

---

## 1. System Architecture

```
┌─────────────────────────────────────────┐
│              Client (Browser)           │
│  React SPA — Form UI + Chatbot Widget   │
└──────────────┬──────────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────────┐
│           API Gateway (REST)            │
│  /scrape   /chat   /submit   /session   │
└──────┬─────────────┬────────────────────┘
       │             │
┌──────▼──────┐ ┌────▼──────────────────┐
│  Scraper    │ │   AI Chat Service     │
│  Service    │ │  (LLM + form context) │
└──────┬──────┘ └────────────────────────┘
       │
┌──────▼──────────────────────────────────┐
│         Data Store                      │
│  Sessions DB (Redis)                    │
│  Submissions DB (PostgreSQL)            │
│  Scrape Cache (Redis, TTL 24h)         │
└─────────────────────────────────────────┘
```

---

## 2. Frontend

### 2.1 Stack
- Framework: React 18+ (or Next.js 14 for SSR)
- State management: Zustand or React Context (form state)
- Form library: React Hook Form with Zod validation schemas
- Styling: Tailwind CSS
- Date picker: react-datepicker or Radix UI DatePicker
- Slider: Radix UI Slider

### 2.2 Form State Schema (Zod)

```typescript
const BriefSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    url: z.string().url(),
    industries: z.array(z.enum(['F&B','Health & Wellness','Fashion','Beauty','Finance','EdTech'])).min(1),
    description: z.string().max(160),
  }),
  products: z.object({
    selected: z.array(z.string()).min(1),
    offer: z.object({
      hasOffer: z.boolean(),
      description: z.string().optional(),
    }),
  }),
  audience: z.object({
    personas: z.array(z.enum(['Young professionals','Students','Fitness enthusiasts','Parents','HNI / affluent consumers','General audience'])),
    ageRange: z.tuple([z.number().min(18), z.number().max(65)]),
    lifestyleContext: z.string().optional(),
  }),
  geography: z.object({
    cities: z.array(z.string()).default(['Delhi NCR']),
    specificAreas: z.string().optional(),
    budgetRange: z.enum(['₹10K–25K','₹25K–50K','₹50K–1L','₹1L+']),
    goLiveDate: z.string().datetime(),
    creativesStatus: z.enum(['ready','need_help','rough_idea']),
  }),
});
```

### 2.3 Auto-Fill UI Behaviour
- Auto-filled fields render with a `data-autofilled="true"` attribute
- Styled with a subtle left border accent and "✦ Auto-filled" label (12px, muted)
- On user edit: badge is removed, field treated as manually entered
- If scrape is in progress: skeleton loaders shown in relevant fields

### 2.4 Session Persistence
- Form state saved to `localStorage` on every step change
- Session ID stored in URL param (`?session=abc123`) for resume links
- Sessions expire after 7 days

---

## 3. Website Scraper Service

### 3.1 Technology
- Runtime: Node.js (Playwright for JS-rendered sites) or Python (httpx + BeautifulSoup for static)
- Fallback: fetch + cheerio for lightweight scraping when Playwright is too slow

### 3.2 API Contract

**Request**
```
POST /api/scrape
Content-Type: application/json

{
  "url": "https://example.com"
}
```

**Response**
```json
{
  "status": "success",
  "data": {
    "brandName": "Acme Co",
    "description": "Premium protein supplements for serious athletes",
    "industries": ["Health & Wellness"],
    "products": [
      { "id": "p1", "name": "Whey Protein Isolate", "url": "/products/whey" },
      { "id": "p2", "name": "Creatine Monohydrate", "url": "/products/creatine" }
    ],
    "activeOffers": [
      { "text": "20% off your first order", "cta": "Shop Now" }
    ]
  },
  "confidence": {
    "brandName": 0.95,
    "description": 0.82,
    "industries": 0.70,
    "products": 0.88,
    "activeOffers": 0.60
  },
  "scrapedAt": "2026-06-12T10:30:00Z"
}
```

**Error Response**
```json
{
  "status": "error",
  "code": "ROBOTS_DISALLOWED" | "TIMEOUT" | "FETCH_FAILED" | "PARSE_FAILED",
  "message": "Human-readable reason"
}
```

### 3.3 Extraction Logic

| Field | Primary Source | Fallback |
|---|---|---|
| Brand name | `og:site_name`, `<title>` | Logo `alt` text |
| Description | `<meta name="description">` | First `<h1>` or hero headline |
| Industries | Keyword matching against taxonomy | OpenGraph category tags |
| Products | `schema.org/Product`, nav links | `<a>` tags containing price patterns |
| Active offers | `schema.org/Offer`, banner text | Regex for discount patterns (%, ₹off) |

### 3.4 Constraints
- Max execution time: 8 seconds (hard timeout)
- Max page size fetched: 2MB
- robots.txt must be fetched and respected before scraping
- No login-gated pages; HTTP 401/403 → return `FETCH_FAILED`
- Scrape cache: keyed by URL hash, TTL 24 hours (Redis)
- Rate limiting: max 10 scrape requests per IP per minute

---

## 4. AI Chatbot Service

### 4.1 Architecture
- LLM backend: Claude claude-sonnet-4-6 via Anthropic Messages API
- Session context: form state JSON passed as system context on every turn
- Conversation history: stored in Redis, keyed by session ID, TTL 2 hours

### 4.2 System Prompt (Core)
```
You are an onboarding assistant for [Platform Name], an advertising platform.
Your job is to help brand owners complete their campaign brief.

Current form state:
{formStateJSON}

You can:
- Explain any form field in simple, friendly language
- Suggest values for incomplete fields based on the brand's profile
- Help users who need creative assistance (conversational creative brief)
- Answer questions about campaign pricing, timelines, and targeting

You cannot:
- Promise campaign outcomes or ROI
- Modify submitted briefs
- Access external systems or URLs

Always be concise. If the user is confused about a field, offer 2–3 concrete examples.
```

### 4.3 Chatbot API Contract

**Request**
```
POST /api/chat
Content-Type: application/json

{
  "sessionId": "abc123",
  "message": "What does age range mean here?",
  "formState": { ...currentFormState }
}
```

**Response**
```json
{
  "reply": "The age range lets you pick the age group most likely to buy your product...",
  "suggestedFieldUpdates": {
    "audience.ageRange": [25, 34]
  }
}
```

The `suggestedFieldUpdates` field is optional — returned only when the chatbot recommends a specific value. The frontend shows this as a "Apply suggestion?" button; the user must confirm before the field updates.

### 4.4 Conversational Mode Flow
1. User selects "Fill via chat" on intro screen
2. Frontend sends a `mode: "conversational"` flag on first message
3. Chatbot proceeds through sections in order, asking one question at a time
4. Each answer is parsed and mapped to `suggestedFieldUpdates`
5. At the end, chatbot says "Here's your brief — does everything look right?" and frontend renders Section 5 (Review)

---

## 5. Backend API

### 5.1 Endpoints Summary

| Method | Path | Description |
|---|---|---|
| POST | /api/scrape | Trigger website scrape |
| POST | /api/chat | Send chatbot message |
| POST | /api/session | Create or resume a session |
| PUT | /api/session/:id | Update session (auto-save) |
| GET | /api/session/:id | Resume a session |
| POST | /api/brief/submit | Submit completed brief |
| GET | /api/brief/:id | Get submitted brief (ops use) |

### 5.2 Authentication
- Public users: session token (JWT, 7 days) generated on first form interaction
- Ops users: API key + RBAC for /api/brief/:id
- No user account required for brief submission in v1

### 5.3 Data Persistence

**Sessions table (PostgreSQL)**
```sql
sessions (
  id          UUID PRIMARY KEY,
  token       TEXT UNIQUE,
  form_state  JSONB,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  expires_at  TIMESTAMPTZ
)
```

**Briefs table (PostgreSQL)**
```sql
briefs (
  id              UUID PRIMARY KEY,
  session_id      UUID REFERENCES sessions(id),
  brand_name      TEXT,
  brand_url       TEXT,
  form_data       JSONB,
  scrape_data     JSONB,
  submitted_at    TIMESTAMPTZ DEFAULT now(),
  ops_status      TEXT DEFAULT 'pending'
)
```

---

## 6. Security Requirements

| Requirement | Implementation |
|---|---|
| Input sanitisation | All text inputs sanitised server-side (DOMPurify equivalent) |
| URL validation | Scraper rejects non-HTTP/HTTPS URLs, localhost, private IPs (SSRF prevention) |
| Rate limiting | 10 req/min per IP on /api/scrape; 60 req/min on /api/chat |
| CORS | Restricted to platform domain(s) only |
| Data at rest | PostgreSQL encrypted at rest (AES-256) |
| Data in transit | TLS 1.3 enforced |
| SSRF prevention | Scraper blocks requests to 10.x, 172.16.x, 192.168.x, 127.x, metadata endpoints |
| PII handling | No PII stored in scrape cache; brief data retained per privacy policy |

---

## 7. Performance Requirements

| Metric | Target |
|---|---|
| Scrape response time | P90 < 5s, hard timeout 8s |
| Chatbot first token | P90 < 1.5s |
| Form step transition | < 200ms |
| Session save (auto) | < 300ms (background, non-blocking) |
| Page load (form) | Lighthouse performance score ≥ 85 |

---

## 8. Error Handling

| Scenario | Behaviour |
|---|---|
| Scrape timeout | Show warning toast; fields remain blank; user continues manually |
| Scrape blocked by robots.txt | "This website restricts automated reading. Please fill in manually." |
| Chatbot API error | "Having trouble connecting. Try again or continue without the assistant." |
| Session expiry | Redirect to entry with "Your previous session expired" message |
| Network offline | "You appear to be offline. Your progress is saved locally." |

---

## 9. Accessibility

- WCAG 2.1 AA compliance target
- All form inputs have associated `<label>` elements
- Keyboard navigation supported across all steps
- Progress bar uses `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Chatbot panel traps focus when open, returns focus to trigger on close
- Colour is not the sole conveyor of meaning (all status indicators have text labels)

---

## 10. Integrations (v1)

| Integration | Purpose | Notes |
|---|---|---|
| Anthropic API | AI chatbot | claude-sonnet-4-6, streaming responses |
| Playwright / httpx | Website scraper | Deployed as isolated microservice |
| SendGrid / Postmark | "Save & resume" email | Transactional only |
| Slack webhook (optional) | New brief notification to ops team | Low-priority |

---

## 11. Deployment

- Frontend: Vercel / Netlify (static + edge functions)
- Scraper service: Dockerised, deployed on Railway or Fly.io (needs Chromium for Playwright)
- Backend API: Node.js or Python FastAPI on Railway / Render
- Database: Supabase (PostgreSQL + Redis via Upstash)
- All services communicate over private network or with service tokens

---

## 12. Open Questions

1. Should the chatbot support Hindi / Hinglish for Indian brand owners?
2. Should "Save & Continue Later" require email, or can it be link-only with a shareable URL?
3. Is there an existing product catalogue / CMS the scraper should sync with (beyond live scraping)?
4. What is the SLA for brief review by ops after submission?
5. Should scraped product data be cached per brand for future re-submissions?
