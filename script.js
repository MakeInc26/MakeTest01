(function () {
  "use strict";

  const form = document.getElementById("waitlist-form");
  const message = document.getElementById("form-message");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const STORAGE_KEY = "make_waitlist_entries";

  function loadEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveEntry(entry) {
    const entries = loadEntries();
    entries.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setMessage(text, type) {
    message.textContent = text;
    message.className = "form-message" + (type ? " " + type : "");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const hairtype = (data.get("hairtype") || "").toString().trim();

      if (!name) {
        setMessage("Please share your name.", "error");
        return;
      }
      if (!isValidEmail(email)) {
        setMessage("Please enter a valid email address.", "error");
        return;
      }

      const existing = loadEntries();
      if (existing.some((entry) => entry.email.toLowerCase() === email.toLowerCase())) {
        setMessage("You're already on the list — thank you.", "success");
        form.reset();
        return;
      }

      saveEntry({
        name: name,
        email: email,
        hairtype: hairtype,
        submittedAt: new Date().toISOString(),
      });

      setMessage("Welcome to Mäké. We'll be in touch.", "success");
      form.reset();
    });
  }
})();
