/**
 * =============================================================
 * MINATLOU SECURITY & PROJECTS — QUOTE REQUEST MODAL
 * =============================================================
 * Preserves the original site's quote modal exactly (Formspree
 * submission + WhatsApp handoff). Injected into any page that
 * includes <div id="quote-modal-mount"></div> and a button with
 * onclick="openQuoteModal()".
 * =============================================================
 */

const QUOTE_MODAL_HTML = `
<div class="modal" id="quoteModal" onclick="closeModalOutside(event)">
  <div class="modal-box">
    <button class="modal-close" onclick="closeQuoteModal()">&times;</button>
    <div id="quoteForm">
      <h2>Get a <span>Quote</span></h2>
      <p>Fill in your details and we'll respond within 24 hours.</p>
      <div class="form-group">
        <label>Full Name *</label>
        <input type="text" id="qName" placeholder="Your name"/>
      </div>
      <div class="form-group">
        <label>Phone Number *</label>
        <input type="tel" id="qPhone" placeholder="0XX XXX XXXX"/>
      </div>
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" id="qEmail" placeholder="your@email.com"/>
      </div>
      <div class="form-group">
        <label>Service Required *</label>
        <select id="qService">
          <option value="">— Select a service —</option>
          <option>Physical Security & Guard Services</option>
          <option>Event Security</option>
          <option>VIP Protection</option>
          <option>Traditional Tours & Delegate Security</option>
          <option>Venue Protection</option>
          <option>CCTV Installation</option>
          <option>Other / Not Sure</option>
        </select>
      </div>
      <div class="form-group">
        <label>Additional Details</label>
        <textarea id="qDetails" placeholder="Tell us more about your security needs..."></textarea>
      </div>
      <button class="btn btn-primary" style="width:100%;" onclick="submitQuote()">Send Quote Request →</button>
    </div>
    <div class="success-msg" id="quoteSuccess">
      <div class="check">✅</div>
      <h3>Quote Request Sent!</h3>
      <p>Thank you! We'll contact you within 24 hours.</p>
      <p style="margin-top:0.5rem;">For urgent enquiries, WhatsApp us directly:</p>
      <a href="https://wa.me/27615254281" target="_blank" class="btn btn-primary" style="margin-top:1rem; display:inline-block;">💬 WhatsApp 061 525 4281</a>
    </div>
  </div>
</div>
`;

function openQuoteModal() {
  document.getElementById('quoteModal').classList.add('open');
  document.getElementById('quoteForm').style.display = 'block';
  document.getElementById('quoteSuccess').style.display = 'none';
  document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
  document.getElementById('quoteModal').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('quoteModal')) closeQuoteModal();
}

async function submitQuote() {
  const name = document.getElementById('qName').value.trim();
  const phone = document.getElementById('qPhone').value.trim();
  const service = document.getElementById('qService').value;
  const details = document.getElementById('qDetails').value.trim();
  const email = document.getElementById('qEmail').value.trim();

  if (!name || !phone || !service) {
    alert('Please fill in your name, phone number, and select a service.');
    return;
  }

  const btn = document.querySelector('#quoteForm .btn-primary');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    await fetch('https://formspree.io/f/mnjrokdo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email: email || 'Not provided',
        service,
        details: details || 'None',
        _subject: `Quote Request — ${service} — Minatlou Security`,
      }),
    });
  } catch (e) {
    console.warn('Formspree error:', e);
  }

  document.getElementById('quoteForm').style.display = 'none';
  document.getElementById('quoteSuccess').style.display = 'block';

  const msg = encodeURIComponent(
    `*QUOTE REQUEST — Minatlou Security*\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'Not provided'}\nService: ${service}\nDetails: ${details || 'None'}`
  );
  setTimeout(() => {
    window.open('https://wa.me/27615254281?text=' + msg, '_blank');
  }, 1200);
}

function mountQuoteModal() {
  const mount = document.getElementById('quote-modal-mount');
  if (mount) mount.innerHTML = QUOTE_MODAL_HTML;
}

document.addEventListener('DOMContentLoaded', mountQuoteModal);
