import nodemailer from "nodemailer";
import { festival } from "@/lib/festival";

// Single outgoing-mail transport for the whole app (contact notifications + certificate
// sends): the festival's Titan mailbox on Hostinger (info@sicilianfilmawards.com).
// The old Gmail account was compromised (2026-10) — never send through Gmail again.
export function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function createSmtpTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("SMTP_USER and SMTP_PASS env vars are required");
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST || "smtp.titan.email",
    port,
    secure: port === 465,
    auth:   { user, pass },
    // Nodemailer's defaults (2min connection, 10min socket) mean one bad SMTP connection can
    // hang a request for a very long time — with this app's limited DB connection pool, a
    // stuck request can starve every other page on the site (2026-08-05 / 08-11 incidents).
    // Fail fast instead.
    connectionTimeout: 10_000,
    greetingTimeout:   10_000,
    socketTimeout:     20_000,
  });
}

export function smtpFrom(): string {
  return `"${festival.name}" <${process.env.SMTP_USER}>`;
}
