interface CardData {
  name: string;
  membershipId: string;
  bloodGroup: string;
  aadharNumber: string;
  dateOfIssue: string;
  created_at: string;
  dateOfExpiry: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  gender?: string;
}

// Kept for external callers that still pass benefits — no longer rendered in PDF
export interface PdfBenefit {
  title: string;
  description?: string;
}

function maskAadhaar(raw: string): string {
  const digits = raw.replace(/\s/g, "");
  if (digits.length < 4) return raw;
  return "**** **** " + digits.slice(-4);
}

function yearOnly(dateStr: string): string {
  const year = new Date(dateStr).getFullYear();
  return isNaN(year) ? dateStr : String(year);
}

export const generateCardHTMLWithBenefits = (
  cards: CardData[],
  _benefits: PdfBenefit[],
  _steps: string[],
  backgroundImageBase64?: string,
  logoBase64?: string,
): string => {
  const headerHTML = `
  <div class="org-header">
    ${logoBase64 ? `<img class="org-logo" src="data:image/png;base64,${logoBase64}" />` : ""}
    <div class="org-text">
      <span class="org-name">Mujtaba Helping Foundation</span>
      <span class="org-subtitle">Health Card</span>
    </div>
  </div>`;

  const cardsHTML = cards
    .map((card, index) => {
      const maskedAadhaar = maskAadhaar(card.aadharNumber);
      const validFrom = card.created_at ? yearOnly(card.created_at) : "";

      const sectionLabel = index === 0 ? "Primary Card Holder" : "Family Member";

      return `
  <div class="card-container" ${index > 0 ? 'style="page-break-before: always;"' : ""}>
    <p class="card-section-label">${sectionLabel}</p>
    <div class="card-wrapper">
      <div class="health-card">
        ${backgroundImageBase64 ? `<img class="card-bg-img" src="data:image/png;base64,${backgroundImageBase64}" />` : ""}
        <div class="card-content">
          <div class="card-top-spacer"></div>
          <div class="name-section">
            <span class="field-label">CARD HOLDER NAME</span>
            <span class="field-name">${card.name}</span>
          </div>
          <div class="fields-grid">
            <div class="field-col">
              <div class="field">
                <span class="field-label">MEMBERSHIP ID</span>
                <span class="field-value">${card.membershipId}</span>
              </div>
              <div class="field">
                <span class="field-label">AADHAR NUMBER</span>
                <span class="field-value">${maskedAadhaar}</span>
              </div>
              <div class="field">
                <span class="field-label">DATE OF ISSUE</span>
                <span class="field-value">${card.dateOfIssue}</span>
              </div>
            </div>
            <div class="field-col">
              <div class="field">
                <span class="field-label">BLOOD GROUP</span>
                <span class="field-value">${card.bloodGroup}</span>
              </div>
              <div class="field">
                <span class="field-label">VALID FROM</span>
                <span class="field-value">${validFrom}</span>
              </div>
              <div class="field">
                <span class="field-label">DATE OF EXPIRY</span>
                <span class="field-value">${card.dateOfExpiry}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #F6F7FB;
      padding: 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Organisation Header ── */
    .org-header {
      max-width: 760px;
      margin: 0 auto 24px;
      display: flex;
      align-items: center;
      gap: 14px;
      padding-bottom: 16px;
      border-bottom: 3px solid #1E3A8A;
    }

    .org-logo {
      width: 64px;
      height: 64px;
      object-fit: contain;
      flex-shrink: 0;
    }

    .org-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .org-name {
      font-size: 22px;
      font-weight: 800;
      color: #1E3A8A;
      letter-spacing: 0.3px;
      line-height: 1.2;
    }

    .org-subtitle {
      font-size: 13px;
      font-weight: 500;
      color: #06B6D4;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* ── Card section label ── */
    .card-section-label {
      font-size: 11px;
      font-weight: 700;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }

    /* ── Card container ── */
    .card-container {
      max-width: 760px;
      margin: 0 auto 28px;
    }

    /* Aspect-ratio trick: padding-bottom = 100/1.586 ≈ 63% */
    .card-wrapper {
      width: 100%;
      position: relative;
      padding-bottom: 63%;
      border-radius: 12px;
      overflow: hidden;
      background-color: #1B4968;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .health-card {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
    }

    .card-bg-img {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
    }

    .card-content {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      flex-direction: column;
      padding: 3% 4% 5% 4%;
      background-color: rgba(27, 73, 104, 0.2);
    }

    .card-top-spacer { flex: 1; }

    .name-section {
      display: flex;
      flex-direction: column;
      margin-bottom: 6px;
    }

    .fields-grid {
      display: flex;
      gap: 12px;
    }

    .field-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .field-label {
      font-size: 9px;
      font-weight: 500;
      color: #B0C4D4;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .field-value {
      font-size: 11px;
      font-weight: 600;
      color: #ffffff;
    }

    .field-name {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 2px;
    }

    /* ── Contact details (primary only) ── */
    .contact-section {
      background: #fff;
      border-radius: 10px;
      padding: 14px 16px;
      margin-top: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .contact-title {
      font-size: 13px;
      font-weight: 700;
      color: #1E3A8A;
      margin: 0 0 10px 0;
    }

    .contact-item {
      display: flex;
      gap: 8px;
      margin-bottom: 6px;
      align-items: flex-start;
    }

    .contact-label {
      font-size: 11px;
      font-weight: 600;
      color: #6B7280;
      min-width: 60px;
    }

    .contact-value {
      font-size: 11px;
      font-weight: 600;
      color: #111827;
      flex: 1;
    }

    @media print {
      body { background: white; padding: 0; }
      .card-container { margin: 0 auto 20px; page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  ${headerHTML}
  ${cardsHTML}
</body>
</html>`;
};

// Legacy function kept for compatibility
export const generateCardHTML = (cards: CardData[]): string => {
  return generateCardHTMLWithBenefits(cards, [], []);
};
