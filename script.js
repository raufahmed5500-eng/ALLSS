(function () {
  "use strict";

  var WHATSAPP_NUMBER = "971553282494";

  // Footer year
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile menu
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");
  function closeMenu() {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  }
  menuBtn.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // Service cards pre-select insurance type
  var typeSelect = document.getElementById("type");
  document.querySelectorAll(".card-link").forEach(function (link) {
    link.addEventListener("click", function () {
      typeSelect.value = link.getAttribute("data-type");
      clearError(typeSelect.closest(".field"));
    });
  });

  // Form
  var form = document.getElementById("quoteForm");
  var note = document.getElementById("formNote");

  function setError(field, msg) {
    field.classList.add("invalid");
    field.querySelector(".err").textContent = msg;
  }
  function clearError(field) {
    field.classList.remove("invalid");
    field.querySelector(".err").textContent = "";
  }

  form.querySelectorAll("input,select").forEach(function (el) {
    var evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, function () { clearError(el.closest(".field")); });
  });

  function validate() {
    var f = form.elements;
    var maxYear = new Date().getFullYear() + 1;
    var ok = true;
    var firstBad = null;

    function fail(el, msg) {
      setError(el.closest(".field"), msg);
      if (!firstBad) firstBad = el;
      ok = false;
    }

    if (f.name.value.trim().length < 2) fail(f.name, "Please enter your full name.");

    var digits = f.mobile.value.replace(/[\s\-()+]/g, "");
    if (!/^\d{9,15}$/.test(digits)) fail(f.mobile, "Please enter a valid mobile number.");

    if (!f.emirate.value) fail(f.emirate, "Please select your emirate.");
    if (!f.make.value.trim()) fail(f.make, "Please enter the vehicle make.");
    if (!f.model.value.trim()) fail(f.model, "Please enter the vehicle model.");

    var y = parseInt(f.year.value, 10);
    if (isNaN(y) || y < 1980 || y > maxYear) fail(f.year, "Enter a year between 1980 and " + maxYear + ".");

    if (!f.type.value) fail(f.type, "Please choose an insurance type.");

    if (firstBad) firstBad.focus();
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    note.className = "form-note full";
    note.textContent = "";

    if (!validate()) {
      note.textContent = "Please complete the highlighted fields.";
      return;
    }

    var f = form.elements;
    var lines = [
      "Hello Indus Car insurances, I would like a car insurance quote.",
      "",
      "Full Name: " + f.name.value.trim(),
      "Mobile Number: " + f.mobile.value.trim(),
      "Emirate: " + f.emirate.value,
      "Vehicle Make: " + f.make.value.trim(),
      "Vehicle Model: " + f.model.value.trim(),
      "Vehicle Year: " + f.year.value.trim(),
      "Insurance Type: " + f.type.value
    ];
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));

    var win = window.open(url, "_blank", "noopener");
    if (!win) window.location.href = url; // popup blocked fallback

    note.classList.add("ok");
    note.textContent = "Opening WhatsApp. Press send in WhatsApp to share your details.";
  });
})();
