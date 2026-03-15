# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                  # Start dev server
pnpm devsafe              # Clear .next cache and start dev server
pnpm build                # Build for production
pnpm lint                 # Run ESLint
pnpm test                 # Run all tests (integration + e2e)
pnpm test:int             # Run Vitest unit/integration tests
pnpm test:e2e             # Run Playwright e2e tests
pnpm generate:types       # Regenerate payload-types.ts after schema changes
pnpm generate:importmap   # Regenerate admin import map after adding components
npx tsc --noEmit          # Validate TypeScript correctness
```

Scripts in `/scripts/` are run directly with `tsx`:
```bash
npx tsx src/scripts/import_locations.ts
```

## Architecture

This is a **full-stack Next.js 15 + Payload CMS 3** application documenting Adi Shankaracharya pilgrimage locations across India. The frontend and CMS backend coexist in a single Next.js app using route groups.

### Route Groups

- **`src/app/(frontend)/`** — Public-facing website (homepage, location pages, expedition pages, QR lookup)
- **`src/app/(payload)/`** — Payload CMS admin panel at `/admin` and REST/GraphQL API routes

### Data Model

Five Payload collections defined in `src/collections/`:

- **Locations** — Pilgrimage sites with lat/lng coordinates, visit descriptions, state metadata, plaque status
- **Expeditions** — Journeys/yatras with itinerary (array of Location references with dates) and YouTube links
- **Photos** — Photo collection
- **Media** — File uploads (S3-backed)
- **Users** — Auth-enabled, admin panel access

The main config is `src/payload.config.ts`. Auto-generated types live in `src/payload-types.ts` — regenerate with `generate:types` after any schema change.

### Storage

- **Database**: PostgreSQL via Supabase (`@payloadcms/db-postgres`)
- **Media**: Supabase S3-compatible storage (`@payloadcms/storage-s3`)
- Credentials are in `.env` (see `.env.example` for required vars)

### Frontend Data Fetching

Server components fetch data using the Payload Local API:
```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'locations' })
```

Maps use React Leaflet. Footprints are loaded in batches of 6 (`FootprintsClient.tsx`).

### Database Migrations

Migrations live in `src/migrations/`. Run them via Payload's migration commands:
```bash
pnpm payload migrate        # Run pending migrations
pnpm payload migrate:create # Create a new migration
```

## Payload CMS Patterns

See `AGENTS.md` for comprehensive Payload CMS development patterns including:
- Security-critical Local API access control (`overrideAccess: false`)
- Transaction safety in hooks (always pass `req`)
- Hook loop prevention (use `context` flags)
- Collection/field/access control patterns

Key rule: **always run `generate:types` after schema changes** and **always run `generate:importmap` after adding custom components**.
