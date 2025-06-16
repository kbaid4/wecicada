// /api/send-invite.js
// Vercel Serverless Function for sending supplier invitation emails using Resend

import { Resend } from 'resend';

// You must set RESEND_API_KEY in your Vercel project environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, eventName, signupUrl } = req.body;
  if (!email || !eventName || !signupUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'noreply@wecicada.com', // Replace with your verified sender
      to: email,
      subject: `Invitation to ${eventName}`,
      html: `
        <p>Hello,</p>
        <p>You have been invited to participate in the event <b>"${eventName}"</b> on WeCicada.</p>
        <p>To accept this invitation, please click the link below to create your supplier account:</p>
        <p><a href="${signupUrl}">${signupUrl}</a></p>
        <p>If you did not expect this invitation, you can ignore this email.</p>
      `,
    });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
