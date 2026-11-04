// Notifications for a new lead. Each channel is optional and switches on when its environment variables are set:
//   RESEND_API_KEY + NOTIFY_TO (+ NOTIFY_FROM)  → email to the team, and a confirmation email to the visitor (AUTOREPLY=on)
//   SLACK_WEBHOOK_URL                            → a message in a Slack channel
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function resend({ to, subject, html, text, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return { skipped: true };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: process.env.NOTIFY_FROM || 'Cognexa website <onboarding@resend.dev>', to: String(to).split(',').map(s => s.trim()), subject, html, text, reply_to: replyTo }),
  });
  return { ok: r.ok, status: r.status };
}

export function leadSummary(l) {
  const rows = [['Name', l.name], ['Email', l.email], ['Organisation', l.organisation], ['Form', l.form], ['Area', l.area], ['Service', l.service], ['Preferred slot', [l.day, l.time, l.office].filter(Boolean).join(' · ')], ['Source page', l.source]].filter(([, v]) => v);
  return { rows, brief: l.brief };
}

export async function notifyTeam(l, siteUrl) {
  const { rows, brief } = leadSummary(l);
  const link = `${siteUrl || ''}/admin/leads/#${encodeURIComponent(l.id)}`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nBrief:\n${brief || '(none)'}\n\nOpen in the leads dashboard: ${link}`;
  const html = `<h2 style="font-family:sans-serif">New ${esc(l.form === 'fit-call' ? 'fit call request' : 'enquiry')}</h2><table style="font-family:sans-serif;font-size:14px">${rows.map(([k, v]) => `<tr><td style="color:#666;padding:4px 12px 4px 0">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table><p style="font-family:sans-serif;white-space:pre-wrap;border-left:3px solid #2f5bea;padding-left:12px">${esc(brief || '(no brief)')}</p><p style="font-family:sans-serif"><a href="${esc(link)}">Open in the leads dashboard</a></p>`;
  const out = {};
  out.email = await resend({ to: process.env.NOTIFY_TO, subject: `New lead: ${l.name || l.email}${l.organisation ? ` (${l.organisation})` : ''}`, html, text, replyTo: l.email }).catch(e => ({ error: e.message }));
  if (process.env.SLACK_WEBHOOK_URL) {
    out.slack = await fetch(process.env.SLACK_WEBHOOK_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: `*New lead* from ${l.name || ''} <${l.email}>${l.organisation ? `, ${l.organisation}` : ''}\n${(brief || '').slice(0, 500)}\n<${link}|Open in dashboard>` }) }).then(r => ({ ok: r.ok })).catch(e => ({ error: e.message }));
  }
  if (/^(1|on|true|yes)$/i.test(process.env.AUTOREPLY || '') && l.email) {
    out.autoreply = await resend({ to: l.email, subject: 'We have your brief', text: `Hi ${l.name || 'there'},\n\nThank you for sending us your brief. We read every one before we reply, and you will hear from us within one working day to confirm your fit call.\n\nThe Cognexa team`, html: `<p style="font-family:sans-serif">Hi ${esc(l.name || 'there')},</p><p style="font-family:sans-serif">Thank you for sending us your brief. We read every one before we reply, and you will hear from us within one working day to confirm your fit call.</p><p style="font-family:sans-serif">The Cognexa team</p>`, replyTo: process.env.NOTIFY_TO?.split(',')[0] }).catch(e => ({ error: e.message }));
  }
  return out;
}
