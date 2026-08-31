(function () {
  const body = document.body;
  const menuButton = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-primary-nav]");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = body.classList.toggle("menu-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        body.classList.remove("menu-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("[data-contact-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("aria-controls");
      const options = targetId ? document.getElementById(targetId) : null;

      if (!options) {
        return;
      }

      const nextOpen = options.hidden;
      options.hidden = !nextOpen;
      button.setAttribute("aria-expanded", String(nextOpen));

      if (nextOpen) {
        options.querySelector("a")?.focus({ preventScroll: true });
      }
    });
  });

  document.querySelectorAll("[data-baura-contact-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    const button = form.querySelector("button[type='submit']");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const originalText = button ? button.textContent : "";

      if (button) {
        button.disabled = true;
        button.textContent = "Enviando...";
      }

      try {
        const response = await fetch(form.getAttribute("action") || window.location.pathname, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });

        if (!response.ok && response.status !== 404) {
          throw new Error("Form submission failed");
        }

        form.reset();
        if (status) {
          status.textContent = "¡Gracias por escribirme! He recibido tu mensaje y me pondré en contacto contigo lo antes posible.";
          status.classList.add("is-visible");
          status.setAttribute("tabindex", "-1");
          status.focus({ preventScroll: false });
        }
      } catch (error) {
        if (status) {
          status.textContent = "No he podido enviar el formulario ahora mismo. Puedes escribirme por WhatsApp o intentarlo de nuevo en unos minutos.";
          status.classList.add("is-visible");
        }
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    });
  });
})();
