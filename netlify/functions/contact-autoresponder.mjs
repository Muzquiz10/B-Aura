const CONTACT_FORM_NAME = "contacto";
const RESEND_API_BASE_URL = "https://api.resend.com";
const CONTACT_EMAIL = "contacto@b-aura.es";
const REPLY_TO_EMAIL = "mariana03011991@gmail.com";
const DEFAULT_FROM_EMAIL = `B Aura <${CONTACT_EMAIL}>`;

function hasEmailSettings() {
	return Boolean(process.env.RESEND_API_KEY);
}

function getRecipientEmail(data) {
	const email = String(data.email || "").trim();
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function getFirstName(data) {
	const name = String(data.nombre || "").trim();
	return name || "gracias";
}

function hasMarketingConsent(data) {
	const consent = String(data.marketing_consent || "").trim().toLowerCase();
	return ["1", "on", "true", "yes", "si", "sí"].includes(consent);
}

function getMarketingContact(data) {
	const firstName = getFirstName(data);
	const lastName = String(data.apellidos || "").trim();

	return {
		first_name: firstName === "gracias" ? undefined : firstName,
		last_name: lastName || undefined,
		unsubscribed: false,
	};
}

function escapeHtml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function buildConfirmationHtml(name) {
	const escapedName = escapeHtml(name);

	return `<!DOCTYPE html>
<html lang="es">
<body style="margin:0; padding:0; background:#f7fbf6; font-family:Arial, Helvetica, sans-serif; color:#2d3430;">
	<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7fbf6; padding:28px 16px;">
		<tr>
			<td align="center">
				<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px; background:#ffffff; border:1px solid #e2eadf; border-radius:8px;">
					<tr>
						<td style="padding:32px 28px 26px;">
							<p style="margin:0 0 20px; color:#71c176; font-size:14px; font-weight:bold; letter-spacing:0.04em; text-transform:uppercase;">B Aura</p>
							<h1 style="margin:0 0 18px; font-family:Georgia, 'Times New Roman', serif; font-size:30px; line-height:1.2; font-weight:400; color:#2d3430;">Hemos recibido tu mensaje</h1>
							<p style="margin:0 0 16px; font-size:16px; line-height:1.6;">Hola ${escapedName},</p>
							<p style="margin:0 0 16px; font-size:16px; line-height:1.6;">Gracias por contactar con B Aura. Hemos recibido correctamente tu mensaje y te responderemos lo antes posible.</p>
							<p style="margin:0 0 24px; font-size:16px; line-height:1.6;">Si necesitas aportar algún detalle adicional, puedes escribirnos a <a href="mailto:${REPLY_TO_EMAIL}" style="color:#71c176;">${REPLY_TO_EMAIL}</a>.</p>
							<p style="margin:0; font-size:16px; line-height:1.6;">Un saludo,<br>Equipo B Aura</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;
}

function buildConfirmationText(name) {
	return [
		`Hola ${name},`,
		"",
		"Gracias por contactar con B Aura. Hemos recibido correctamente tu mensaje y te responderemos lo antes posible.",
		"",
		`Si necesitas aportar algún detalle adicional, puedes escribirnos a ${REPLY_TO_EMAIL}.`,
		"",
		"Un saludo,",
		"Equipo B Aura",
	].join("\n");
}

async function sendConfirmationEmail(data) {
	const to = getRecipientEmail(data);
	if (!to) {
		console.warn("Contact autoresponder skipped: missing or invalid email field.");
		return;
	}

	if (!hasEmailSettings()) {
		console.warn("Contact autoresponder skipped: RESEND_API_KEY is not configured.");
		return;
	}

	const name = getFirstName(data);

	const response = await fetch(`${RESEND_API_BASE_URL}/emails`, {
		method: "POST",
		headers: {
			authorization: `Bearer ${process.env.RESEND_API_KEY}`,
			"content-type": "application/json",
		},
		body: JSON.stringify({
			from: DEFAULT_FROM_EMAIL,
			to: [to],
			subject: "Hemos recibido tu mensaje - B Aura",
			html: buildConfirmationHtml(name),
			text: buildConfirmationText(name),
			reply_to: REPLY_TO_EMAIL,
		}),
	});

	if (!response.ok) {
		const details = await response.text();
		throw new Error(`Resend autoresponder failed with ${response.status}: ${details}`);
	}
}

async function updateExistingMarketingContact(email, contact) {
	const response = await fetch(`${RESEND_API_BASE_URL}/contacts/${encodeURIComponent(email)}`, {
		method: "PATCH",
		headers: {
			authorization: `Bearer ${process.env.RESEND_API_KEY}`,
			"content-type": "application/json",
		},
		body: JSON.stringify(contact),
	});

	if (!response.ok) {
		const details = await response.text();
		throw new Error(`Resend contact update failed with ${response.status}: ${details}`);
	}
}

async function addMarketingContactToSegment(email) {
	const segmentId = String(process.env.RESEND_CONTACT_SEGMENT_ID || "").trim();
	if (!segmentId) {
		console.warn("Marketing contact saved without segment: RESEND_CONTACT_SEGMENT_ID is not configured.");
		return;
	}

	const response = await fetch(
		`${RESEND_API_BASE_URL}/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`,
		{
			method: "POST",
			headers: {
				authorization: `Bearer ${process.env.RESEND_API_KEY}`,
				"content-type": "application/json",
			},
		},
	);

	if (!response.ok && response.status !== 409) {
		const details = await response.text();
		throw new Error(`Resend contact segment add failed with ${response.status}: ${details}`);
	}
}

async function saveMarketingContact(data) {
	if (!hasMarketingConsent(data)) {
		return;
	}

	const email = getRecipientEmail(data);
	if (!email) {
		console.warn("Marketing contact skipped: missing or invalid email field.");
		return;
	}

	if (!hasEmailSettings()) {
		console.warn("Marketing contact skipped: RESEND_API_KEY is not configured.");
		return;
	}

	const contact = {
		email,
		...getMarketingContact(data),
	};

	const response = await fetch(`${RESEND_API_BASE_URL}/contacts`, {
		method: "POST",
		headers: {
			authorization: `Bearer ${process.env.RESEND_API_KEY}`,
			"content-type": "application/json",
		},
		body: JSON.stringify(contact),
	});

	if (response.ok) {
		await addMarketingContactToSegment(email);
		console.log("Marketing contact saved in Resend.");
		return;
	}

	if (response.status === 409) {
		await updateExistingMarketingContact(email, getMarketingContact(data));
		await addMarketingContactToSegment(email);
		console.log("Existing marketing contact updated in Resend.");
		return;
	}

	const details = await response.text();
	throw new Error(`Resend contact create failed with ${response.status}: ${details}`);
}

export default {
	async formSubmitted(event) {
		const data = event.data || {};
		const formName = data["form-name"] || data.formName || data.form_name;

		if (formName && formName !== CONTACT_FORM_NAME) {
			return;
		}

		const [emailResult, contactResult] = await Promise.allSettled([
			sendConfirmationEmail(data),
			saveMarketingContact(data),
		]);

		if (contactResult.status === "rejected") {
			console.error(contactResult.reason);
		}

		if (emailResult.status === "rejected") {
			throw emailResult.reason;
		}
	},
};
