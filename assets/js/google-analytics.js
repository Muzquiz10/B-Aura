(() => {
  const script = document.currentScript;
  const measurementId = (script?.dataset.gaMeasurementId || "").trim();
  const consentKey = "baura_analytics_consent";
  const validMeasurementId = /^G-[A-Z0-9]+$/.test(measurementId);

  function getStoredConsent() {
    try {
      return window.localStorage?.getItem(consentKey) || null;
    } catch {
      return null;
    }
  }

  function storeConsent(value) {
    try {
      window.localStorage?.setItem(consentKey, value);
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }

  function clearStoredConsent() {
    try {
      window.localStorage?.removeItem(consentKey);
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = window.gtag || gtag;
  window.gtag("consent", "default", {
    ad_personalization: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });

  if (!validMeasurementId) {
    return;
  }

  function loadAnalytics() {
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) {
      return;
    }

    window.gtag("consent", "update", {
      analytics_storage: "granted",
    });
    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(gtagScript);
  }

  function getConsentGranted() {
    return getStoredConsent() === "granted";
  }

  function cleanValue(value, maxLength = 120) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength);
  }

  function getCtaText(element) {
    return cleanValue(
      element.getAttribute("aria-label") ||
      element.getAttribute("title") ||
      element.textContent ||
      element.querySelector("img")?.getAttribute("alt") ||
      "Sin texto"
    );
  }

  function getElementArea(element) {
    const area = element.closest("header, footer, nav, main, article, section");

    if (!area) {
      return "body";
    }

    return area.tagName.toLowerCase();
  }

  function trackEvent(eventName, parameters = {}) {
    if (!getConsentGranted()) {
      return;
    }

    window.gtag("event", eventName, {
      page_path: window.location.pathname,
      page_title: cleanValue(document.title, 200),
      transport_type: "beacon",
      ...parameters,
    });
  }

  function isWhatsAppLink(link) {
    try {
      const url = new URL(link.href, window.location.href);
      return (
        url.hostname === "wa.me" ||
        url.hostname === "wa.link" ||
        url.hostname.endsWith(".whatsapp.com")
      );
    } catch {
      return false;
    }
  }

  function trackWhatsAppClick(event) {
    const link = event.target.closest?.("a[href]");

    if (!link || !isWhatsAppLink(link)) {
      return;
    }

    const url = new URL(link.href, window.location.href);

    const eventParameters = {
      cta_text: getCtaText(link),
      cta_area: getElementArea(link),
      lead_type: "whatsapp",
      link_domain: url.hostname,
      link_url: url.href,
    };

    trackEvent("click_whatsapp_cta", eventParameters);
    trackEvent("qualify_lead", eventParameters);
  }

  function isLeadForm(form) {
    return (
      form.matches(".baura-netlify-form, .wpforms-form") ||
      form.id.startsWith("wpforms-form") ||
      form.name === "contacto" ||
      form.action.includes("/contacto/")
    );
  }

  function trackLeadFormSubmit(event) {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || !isLeadForm(form)) {
      return;
    }

    const eventParameters = {
      form_id: cleanValue(form.id || "contacto"),
      form_name: cleanValue(form.getAttribute("name") || "contacto"),
      form_destination: cleanValue(form.action || "/contacto/gracias/", 200),
      lead_type: "contact_form",
      method: "contact_form",
    };

    trackEvent("generate_lead", eventParameters);
    trackEvent("qualify_lead", eventParameters);
  }

  document.addEventListener("click", trackWhatsAppClick, true);
  document.addEventListener("submit", trackLeadFormSubmit, true);

  function hideBanner() {
    document.querySelector("[data-baura-cookie-banner]")?.remove();
  }

  function setConsent(value) {
    storeConsent(value);

    if (value === "granted") {
      loadAnalytics();
    }

    hideBanner();
  }

  window.bauraAnalytics = {
    accept: () => setConsent("granted"),
    decline: () => setConsent("denied"),
    reset: () => {
      clearStoredConsent();
      showBanner();
    },
  };

  function createStyles() {
    if (document.querySelector("#baura-cookie-banner-styles")) {
      return;
    }

    const styles = document.createElement("style");
    styles.id = "baura-cookie-banner-styles";
    styles.textContent = `
      [data-baura-cookie-banner] {
        position: fixed;
        right: 16px;
        bottom: 16px;
        left: 16px;
        z-index: 99999;
        display: flex;
        gap: 14px;
        align-items: center;
        justify-content: space-between;
        max-width: 760px;
        margin: 0 auto;
        padding: 16px;
        border: 1px solid rgba(37, 54, 44, 0.16);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 18px 40px rgba(30, 40, 35, 0.14);
        color: #25362c;
        font-family: "Open Sans", Arial, sans-serif;
        line-height: 1.45;
      }

      [data-baura-cookie-banner] p {
        margin: 0;
        font-size: 14px;
      }

      [data-baura-cookie-actions] {
        display: flex;
        flex: 0 0 auto;
        gap: 8px;
      }

      [data-baura-cookie-banner] button {
        min-width: 104px;
        padding: 10px 14px;
        border: 1px solid #71c176;
        border-radius: 4px;
        cursor: pointer;
        font: inherit;
        font-size: 14px;
        line-height: 1;
      }

      [data-baura-cookie-decline] {
        background: #fff;
        color: #25362c;
      }

      [data-baura-cookie-accept] {
        background: #71c176;
        color: #fff;
      }

      @media (max-width: 640px) {
        [data-baura-cookie-banner] {
          align-items: stretch;
          flex-direction: column;
        }

        [data-baura-cookie-actions] {
          width: 100%;
        }

        [data-baura-cookie-banner] button {
          flex: 1;
          min-width: 0;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  function showBanner() {
    if (document.querySelector("[data-baura-cookie-banner]")) {
      return;
    }

    createStyles();

    const banner = document.createElement("section");
    banner.dataset.bauraCookieBanner = "";
    banner.setAttribute("aria-label", "Preferencias de analitica");

    const message = document.createElement("p");
    message.textContent =
      "Usamos Google Analytics para entender que contenidos ayudan mas y mejorar la web. Puedes aceptar o rechazar esta medicion.";

    const actions = document.createElement("div");
    actions.dataset.bauraCookieActions = "";

    const decline = document.createElement("button");
    decline.type = "button";
    decline.dataset.bauraCookieDecline = "";
    decline.textContent = "Rechazar";
    decline.addEventListener("click", () => setConsent("denied"));

    const accept = document.createElement("button");
    accept.type = "button";
    accept.dataset.bauraCookieAccept = "";
    accept.textContent = "Aceptar";
    accept.addEventListener("click", () => setConsent("granted"));

    actions.append(decline, accept);
    banner.append(message, actions);
    document.body.appendChild(banner);
  }

  const consent = getStoredConsent();

  if (consent === "granted") {
    loadAnalytics();
  } else if (consent !== "denied") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBanner, { once: true });
    } else {
      showBanner();
    }
  }
})();
