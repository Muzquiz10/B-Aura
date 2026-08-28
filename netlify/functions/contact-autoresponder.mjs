const CONTACT_FORM_NAME = "contacto";
const RESEND_API_URL = "https://api.resend.com/emails";
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
							<p style="margin:0 0 24px; font-size:16px; line-height:1.6;">Si necesitas aportar algun detalle adicional, puedes escribirnos a ${REPLY_TO_EMAIL}.</p>
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
		`Si necesitas aportar algun detalle adicional, puedes escribirnos a ${REPLY_TO_EMAIL}.`,
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

	const response = await fetch(RESEND_API_URL, {
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
