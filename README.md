# GUAIS website

Website for the Glasgow University AI Society. Next.js on the front, Sanity for content, hosted on Vercel.

Everything the committee changes regularly (events, team members, social links, contact emails) lives in Sanity. You edit it at `yourdomain.com/studio` and never need to touch the code.

## What you need

- A GitHub account (this repo)
- A free Sanity account (https://www.sanity.io)
- A free Vercel account (https://vercel.com)
- Node.js 20 or newer if you want to run it on your own machine

## 1. Set up Sanity

1. Go to https://www.sanity.io/manage and create a new project. Call it whatever you like. Pick the free plan and create a dataset called `production` (public).
2. Copy the **Project ID** from the top of the project page. You'll need it in the next two steps.
3. Still in the Sanity dashboard, go to **API → CORS origins** and add:
   - `http://localhost:3000` (allow credentials ticked)
   - your Vercel URL, e.g. `https://your-site.vercel.app` (allow credentials ticked)
   - your real domain once it's connected, e.g. `https://guais.co.uk`

   Without this the Studio page will refuse to log in.

That's it on the Sanity side. The content types (Event, Team Member, Site Settings) are defined in this repo under `src/sanity/schemaTypes`, so they'll appear in the Studio automatically.

## 2. Deploy to Vercel

1. Go to https://vercel.com/new and import this GitHub repo. Vercel will detect Next.js on its own, leave the build settings alone.
2. Before hitting Deploy, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | the Project ID from step 1 |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2025-06-11` |
   | `SANITY_REVALIDATE_SECRET` | any long random string, e.g. from https://generate-secret.vercel.app/32 |

3. Deploy. First build takes a couple of minutes.
4. Open `https://your-site.vercel.app/studio`, log in with your Sanity account, and start adding content. Add a **Site Settings** document first (it's pinned at the top), then team members and events.

## 3. Make the site update when content changes

The site caches pages, so by default an edit in Sanity won't show up straight away. A webhook fixes that.

1. In the Sanity dashboard go to **API → Webhooks → Create webhook**.
2. Fill in:
   - **Name:** Vercel revalidate
   - **URL:** `https://your-site.vercel.app/api/revalidate`
   - **Dataset:** production
   - **Trigger on:** create, update, delete
   - **Filter:** leave empty
   - **Projection:** `{_type}`
   - **HTTP method:** POST
   - **Secret:** the same value you used for `SANITY_REVALIDATE_SECRET` in Vercel
3. Save. Now publishing anything in the Studio refreshes the site within a second or two.

## 4. Domain

In Vercel go to your project → **Settings → Domains** and add the domain. It will tell you which DNS records to set at the registrar (GoDaddy). Usually that's an A record pointing to `76.76.21.21` and a CNAME for `www` pointing to `cname.vercel-dns.com`. Takes anywhere from a few minutes to a day to go live.

Remember to add the domain to the Sanity CORS list too (step 1.3) or the Studio won't work on it.

## Running it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Site is at http://localhost:3000, Studio at http://localhost:3000/studio.

## Where things are

```
src/app/                  pages (home, /about, /events, /events/[slug], /studio)
src/components/           UI bits
src/sanity/schemaTypes/   what fields each content type has - edit these to add fields
src/sanity/lib/queries.ts every Sanity query the site makes, in one place
src/app/api/revalidate/   the webhook endpoint from step 3
public/                   logo, fonts, icons
```

If you add a new content type, add it to `src/sanity/schemaTypes/index.ts` and `src/sanity/structure.ts` so it shows up in the Studio sidebar.
