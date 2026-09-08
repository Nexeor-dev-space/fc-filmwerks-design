import { NextResponse } from 'next/server';

import { getResendClient } from '@/lib/resend';

interface ContactPayload {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  message?: unknown;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? 'FC Filmwerks <letstalk@fcfilmwerks.com>';
const CONTACT_TO_EMAIL =
  process.env.CONTACT_TO_EMAIL ?? 'letstalk@fcfilmwerks.com';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Receives the Contact page enquiry form and relays it via Resend. */
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

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New enquiry from ${firstName} ${lastName}`,
      text: `${firstName} ${lastName} <${email}>\n\n${message}`,
      html: `<p><strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong> &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>`,
    });

    if (error) {
      console.error('[contact] resend error', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error('[contact] failed to send', err);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
