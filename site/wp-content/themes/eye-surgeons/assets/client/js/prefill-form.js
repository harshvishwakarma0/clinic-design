/**
 * Eye Surgeons — ElevenLabs Advisor: referral form pre-fill
 * -----------------------------------------------------------
 * This script does two things:
 *
 * 1. Wires the ElevenLabs widget's `open_referral_form` client tool so that
 *    when the assistant decides someone is ready to book, the browser opens
 *    the Patient Self Referral Form on /contact-us/ in a NEW TAB, carrying
 *    whatever details the visitor already gave the assistant (name, email,
 *    phone, treatment, location, message) as URL query parameters.
 *
 *    Deliberately opens a new tab rather than navigating the current one:
 *    if the visitor is on a live voice call with the assistant, a full
 *    page navigation in the same tab tears down the page and drops the
 *    call instantly. A new tab leaves the call running so they can keep
 *    talking, or ask a follow-up, while the form is ready alongside it.
 *
 * 2. On /contact-us/ itself, reads those query parameters back out and
 *    pre-fills First Name, Last Name, Email, Phone, Message, Treatment
 *    Requested, and Preferred Location — all seven fields — so the visitor
 *    lands on a form that's already filled in and just needs a final check
 *    and a click on Submit.
 *
 * Load this script site-wide (e.g. in the same template partial as the
 * widget embed snippet), after the elevenlabs-convai script tag.
 */

(function () {
  'use strict';

  var TEXT_FIELDS = {
    first_name: '#contact-name',
    last_name: '#contact-last-name',
    email: '#contact-email',
    phone: '#contact-phone',
    message: '#contact-message',
  };

  // Treatment Requested and Preferred Location aren't native <select>
  // elements — each is a div-based dropdown with a hidden input
  // (input[name="treatments"] / input[name="locations"]) that doesn't
  // actually carry the selected value, a visible <span> label, and a
  // `.dropdown-list` of `.dropdown-list-item` options that only exists in
  // the DOM once the dropdown has been opened. Simulating a real click on
  // the correct option is what actually drives the underlying component
  // state (confirmed by testing directly against the live page — the
  // visible label updates correctly), so no changes to the dropdown
  // component itself are needed.
  var DROPDOWNS = {
    treatment: 'input[name="treatments"]',
    location: 'input[name="locations"]',
  };

  // ---------------------------------------------------------------------
  // Part 1 — wire the client tool (runs on every page; the widget is
  // site-wide, so a visitor could trigger this from any page, not just
  // /contact-us/).
  // ---------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    var widget = document.querySelector('elevenlabs-convai');
    if (!widget) return;

    widget.addEventListener('elevenlabs-convai:call', function (event) {
      event.detail.config.clientTools = {
        open_referral_form: function (params) {
          params = params || {};
          var url = new URL(window.location.origin + '/contact-us/');
          var fields = {
            first_name: params.first_name,
            last_name: params.last_name,
            email: params.email,
            phone: params.phone,
            treatment: params.treatment,
            location: params.location,
            message: params.message,
          };
          Object.keys(fields).forEach(function (key) {
            var value = fields[key];
            if (value) url.searchParams.set(key, value);
          });
          window.open(url.toString(), '_blank', 'noopener');
        },
      };
    });
  });

  // ---------------------------------------------------------------------
  // Part 2 — pre-fill on /contact-us/
  // ---------------------------------------------------------------------
  if (!/\/contact-us\/?$/.test(window.location.pathname)) return;

  window.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    var hasAny = Array.from(params.keys()).length > 0;
    if (!hasAny) return;

    // React (and most modern component libraries) track input state via
    // the native property setter, not the DOM attribute. Setting `.value`
    // directly gets silently overwritten on the next render. Going through
    // the native setter and then dispatching a real `input` event lets the
    // framework's own onChange handler pick up the change correctly.
    function setNativeValue(el, value) {
      var proto =
        el.tagName === 'TEXTAREA'
          ? window.HTMLTextAreaElement.prototype
          : window.HTMLInputElement.prototype;
      var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // The same field id is reused across the inline form, the mobile
    // duplicate, and the "Book an Appointment" modal (desktop + mobile).
    // IDs should be unique but currently aren't — worth a fix on its own,
    // separate from this script. In the meantime, only touch whichever
    // instance is actually visible/rendered right now.
    function fillVisible(selector, value) {
      if (!value) return;
      document.querySelectorAll(selector).forEach(function (el) {
        if (el.offsetParent !== null) setNativeValue(el, value);
      });
    }

    fillVisible(TEXT_FIELDS.first_name, params.get('first_name'));
    fillVisible(TEXT_FIELDS.last_name, params.get('last_name'));
    fillVisible(TEXT_FIELDS.email, params.get('email'));
    fillVisible(TEXT_FIELDS.phone, params.get('phone'));
    fillVisible(TEXT_FIELDS.message, params.get('message'));

    // Select a Treatment Requested / Preferred Location option by opening
    // the dropdown and clicking the option whose text matches, the same
    // way a visitor would. Matching is case-insensitive and tolerant of
    // stray whitespace, since the agent won't always reproduce the exact
    // casing of the option list.
    function selectDropdownOption(hiddenInputSelector, desiredValue) {
      if (!desiredValue) return;
      var hiddenInputs = document.querySelectorAll(hiddenInputSelector);
      var normalizedTarget = desiredValue.trim().toLowerCase();

      hiddenInputs.forEach(function (hidden) {
        var wrapper = hidden.closest('.dropdown-wrapper');
        if (!wrapper || wrapper.offsetParent === null) return; // skip hidden duplicates

        // Open the dropdown so its option list renders into the DOM.
        wrapper.click();

        // The option list render is synchronous in testing, but give the
        // framework a tick in case it isn't always.
        setTimeout(function () {
          var list = wrapper.querySelector('.dropdown-list');
          if (!list) return;
          var items = list.querySelectorAll('.dropdown-list-item');
          var match = Array.from(items).find(function (item) {
            return item.textContent.trim().toLowerCase() === normalizedTarget;
          });
          if (match) {
            match.click(); // real click — this is what updates the component's own state
          }
          // Some of these dropdowns (Preferred Location) use checkboxes and
          // don't auto-close on selection, unlike Treatment Requested which
          // does. A click outside the dropdown reliably closes either type
          // (confirmed by testing) without risking re-opening one that
          // already auto-closed, so use that instead of re-toggling it.
          document.body.click();
        }, 0);
      });
    }

    selectDropdownOption(DROPDOWNS.treatment, params.get('treatment'));
    selectDropdownOption(DROPDOWNS.location, params.get('location'));

    // Scroll the now-filled form into view and nudge the visitor toward
    // the Submit button so pre-filling doesn't just leave them stranded
    // partway down the page.
    var visibleFirstName = Array.from(
      document.querySelectorAll(TEXT_FIELDS.first_name)
    ).find(function (el) {
      return el.offsetParent !== null;
    });
    if (visibleFirstName) {
      visibleFirstName.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
