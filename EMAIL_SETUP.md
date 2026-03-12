# Email Setup (Resend)

This site now posts the contact form to `/api/contact` and sends email through Resend.

## 1) Create a Resend account

- Sign up at [https://resend.com](https://resend.com)
- Generate an API key
- Verify your sending domain when ready

## 2) Configure environment variables

Set these in your hosting provider project settings:

- `RESEND_API_KEY` - your Resend API key
- `CONTACT_TO_EMAIL` - inbox that receives leads (ex: `info@promaxlending.com`)
- `CONTACT_FROM_EMAIL` - sender identity (must be allowed by Resend, ex: `ProMax Lending <noreply@yourdomain.com>`)

For local use, copy `.env.example` to `.env.local` and fill in values.

## 3) Deploy

Deploy to Vercel (or another platform that supports `/api/*` serverless routes).

## Notes

- The form includes a honeypot field (`website`) to reduce bot spam.
- If you keep `onboarding@resend.dev`, use it only for early testing.
- For production deliverability, use a verified custom domain for `CONTACT_FROM_EMAIL`.
