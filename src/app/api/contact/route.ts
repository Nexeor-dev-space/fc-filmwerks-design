import { NextResponse } from 'next/server';

interface ContactPayload {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  message?: unknown;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Receives the Contact page enquiry form. No email/CRM integration is wired
 * up yet — this validates the payload and logs it server-side so the form
 * has somewhere real to submit to until that integration exists.
 */
export async function POST(request: Request) {
  const body = (await request
    .json()
    .catch(() => null)) as ContactPayload | null;

  if (!body) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { firstName, lastName, email, message } = body;

  if (
    typeof firstName !== 'string' ||
    !firstName.trim() ||
    typeof lastName !== 'string' ||
    !lastName.trim() ||
    typeof email !== 'string' ||
    !EMAIL_PATTERN.test(email) ||
    typeof message !== 'string' ||
    !message.trim()
  ) {
    return NextResponse.json(
      { error: 'Missing or invalid fields' },
      { status: 422 },
    );
  }

  console.warn('[contact] enquiry received', { firstName, lastName, email });

  return NextResponse.json({ ok: true });
}
