# Supabase

Database, authentication, storage, and Edge Functions for CryvixAI.

## Folders

| Path | Purpose |
|------|---------|
| `config.toml` | Local Supabase CLI settings (ports, auth URLs) |
| `migrations/` | Versioned SQL schema changes |
| `seed.sql` | Optional seed data after migrations |
| `functions/` | Deno Edge Functions (webhooks, server-side logic) |

## Commands

```bash
# Start local Supabase stack
supabase start

# Create a new migration
supabase migration new create_users_table

# Apply migrations locally
supabase db reset

# Push migrations to linked cloud project
supabase db push

# Generate TypeScript types from schema (optional)
supabase gen types typescript --local > ../frontend/src/lib/database.types.ts
```

## Auth redirect URLs

Ensure these match your frontend:

- Local: `http://localhost:5173`
- Production: your deployed frontend URL

Configure in Supabase Dashboard → Authentication → URL Configuration.
