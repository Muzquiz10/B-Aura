const CONTACT_FORM_NAME = "contacto";
const EMAIL_TEMPLATE = "contact-confirmation";
const DEFAULT_FROM_EMAIL = "contacto@b-aura.es";

function hasEmailSettings() {
	return Boolean(process.env.NETLIFY_EMAILS_SECRET);
}

function getRecipientEmail(data) {
	const email = String(data.email || "").trim();
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function getFirstName(data) {
	const name = String(data.nombre || "").trim();
	return name || "gracias";
}

async function sendConfirmationEmail(data) {
	const to = getRecipientEmail(data);
	if (!to) {
		console.warn("Contact autoresponder skipped: missing or invalid email field.");
		return;
	}

	if (!hasEmailSettings()) {
		console.warn("Contact autoresponder skipped: NETLIFY_EMAILS_SECRET is not configured.");
		return;
	}

	const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;
	if (!siteUrl) {
		console.warn("Contact autoresponder skipped: site URL is not available.");
		return;
	}

	const response = await fetch(`${siteUrl}/.netlify/functions/emails/${EMAIL_TEMPLATE}`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"netlify-emails-secret": process.env.NETLIFY_EMAILS_SECRET,
		},
		body: JSON.stringify({
			from: process.env.CONTACT_AUTOREPLY_FROM || DEFAULT_FROM_EMAIL,
			to,
			subject: "Hemos recibido tu mensaje - B Aura",
			parameters: {
				name: getFirstName(data),
				email: to,
			},
		}),
	});

	if (!response.ok) {
		const details = await response.text();
		throw new Error(`Contact autoresponder failed with ${response.status}: ${details}`);
	}
}

export default {
	async formSubmitted(event) {
		const data = event.data || {};
		const formName = data["form-name"] || data.formName || data.form_name;

		if (formName && formName !== CONTACT_FORM_NAME) {
			return;
		}

		await sendConfirmationEmail(data);
	},
};
