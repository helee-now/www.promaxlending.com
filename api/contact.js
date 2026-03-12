const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value, maxLength) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function buildPlainText(fields) {
  return [
    "New consultation request from promaxlending.com",
    "",
    `First name: ${fields.firstName}`,
    `Last name: ${fields.lastName}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone}`,
    `Consent: ${fields.contactConsent ? "Yes" : "No"}`,
    "",
    "Message:",
    fields.message,
  ].join("\n");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Method not allowed." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const firstName = sanitize(body.first_name, 80);
  const lastName = sanitize(body.last_name, 80);
  const email = sanitize(body.email, 160).toLowerCase();
  const phone = sanitize(body.phone, 40);
  const message = sanitize(body.message, 4000);
  const website = sanitize(body.website, 200);
  const contactConsent = body.contact_consent === true || body.contact_consent === "true" || body.contact_consent === "on";

  // Honeypot trap: silently accept to avoid signaling bots.
  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!firstName || !lastName || !email || !phone || !message) {
    return res.status(400).json({ ok: false, message: "Please complete all required fields." });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ ok: false, message: "Please enter a valid email address." });
  }

  if (!contactConsent) {
    return res.status(400).json({ ok: false, message: "Please provide consent before submitting." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "info@promaxlending.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "ProMax Lending <onboarding@resend.dev>";

  if (!apiKey) {
    return res.status(500).json({ ok: false, message: "Email service is not configured yet." });
  }

  const subject = `New consultation request: ${firstName} ${lastName}`;
  const textBody = buildPlainText({
    firstName,
    lastName,
    email,
    phone,
    message,
    contactConsent,
  });

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        text: textBody,
        reply_to: email,
      }),
    });

    if (!emailResponse.ok) {
      const details = await emailResponse.text();
      console.error("Resend API error:", details);
      return res.status(502).json({ ok: false, message: "Unable to send your request right now." });
    }

    return res.status(200).json({ ok: true, message: "Request submitted successfully." });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return res.status(500).json({ ok: false, message: "Unable to send your request right now." });
  }
};
