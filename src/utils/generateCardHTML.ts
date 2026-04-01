interface CardData {
  name: string;
  membershipId: string;
  bloodGroup: string;
  aadharNumber: string;
  dateOfIssue: string;
  created_at: string;
  dateOfExpiry: string;
}

// Note: For React Native PDF generation, pass base64Image as parameter
// Example: generateCardHTMLWithBenefits(cardsData, benefits, steps, base64ImageString)

export const generateCardHTML = (cards: CardData[]): string => {
  const cardsHTML = cards
    .map(
      (card, index) => `
    <div class="card-container" ${
      index > 0 ? 'style="page-break-before: always;"' : ""
    }>
      <div class="health-card">
        <div class="card-body">
          <div class="card-details">
            <div class="detail-row">
              <span class="label">Card Holder Name:</span>
              <span class="value">${card.name}</span>
            </div>
            
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Membership ID:</span>
                <span class="value">${card.membershipId}</span>
              </div>
              <div class="detail-item">
                <span class="label">Blood Group:</span>
                <span class="value">${card.bloodGroup}</span>
              </div>
              <div class="detail-item">
                <span class="label">Aadhar Number:</span>
                <span class="value">${card.aadharNumber}</span>
              </div>
              <div class="detail-item">
                <span class="label">Created At:</span>
                <span class="value">${card.created_at}</span>
              </div>
              <div class="detail-item">
                <span class="label">Date of Issue:</span>
                <span class="value">${card.dateOfIssue}</span>
              </div>
              <div class="detail-item">
                <span class="label">Date of Expiry:</span>
                <span class="value">${card.dateOfExpiry}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="qr-code">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="white"/>
              <rect x="5" y="5" width="15" height="15" fill="black"/>
              <rect x="60" y="5" width="15" height="15" fill="black"/>
              <rect x="5" y="60" width="15" height="15" fill="black"/>
              <rect x="25" y="10" width="5" height="5" fill="black"/>
              <rect x="35" y="10" width="5" height="5" fill="black"/>
              <rect x="45" y="10" width="5" height="5" fill="black"/>
              <rect x="25" y="25" width="10" height="10" fill="black"/>
              <rect x="45" y="25" width="10" height="10" fill="black"/>
              <rect x="10" y="35" width="5" height="5" fill="black"/>
              <rect x="25" y="45" width="10" height="10" fill="black"/>
              <rect x="45" y="45" width="5" height="5" fill="black"/>
              <rect x="60" y="45" width="10" height="10" fill="black"/>
              <rect x="35" y="60" width="15" height="15" fill="black"/>
            </svg>
          </div>
          <p class="footer-text">Scan for verification</p>
        </div>
      </div>
    </div>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Family Health Cards</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          background: #F6F7FB;
          padding: 20px;
        }
        
        .card-container {
          max-width: 800px;
          margin: 0 auto 30px;
        }
        
        .health-card {
          background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .health-card::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        
        .logo {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 18px;
        }
        
        .card-body {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }
        
        .card-image {
          flex-shrink: 0;
        }
        
        .card-details {
          flex: 1;
        }
        
        .detail-row {
          display: flex;
          margin-bottom: 12px;
          align-items: baseline;
        }
        
        .detail-row .label {
          font-weight: 600;
          min-width: 140px;
          font-size: 14px;
          opacity: 0.9;
        }
        
        .detail-row .value {
          font-weight: 700;
          font-size: 16px;
          flex: 1;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .detail-item .label {
          font-size: 12px;
          opacity: 0.8;
          font-weight: 500;
        }
        
        .detail-item .value {
          font-size: 14px;
          font-weight: 700;
        }
        
        .card-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.3);
          padding-top: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          z-index: 1;
        }
        
        .qr-code {
          background: white;
          padding: 8px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .footer-text {
          font-size: 13px;
          opacity: 0.9;
          font-weight: 500;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .card-container {
            margin: 0 auto;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      ${cardsHTML}
    </body>
    </html>
  `;
};

export const generateCardHTMLWithBenefits = (
  cards: CardData[],
  benefits: string[],
  steps: string[],
  backgroundImageBase64?: string,
): string => {
  const bgImageStyle = backgroundImageBase64
    ? `background-image: url('data:image/png;base64,${backgroundImageBase64}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
    : "background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);";

  const cardsHTML = cards
    .map(
      (card, index) => `
    <div class="card-container" ${
      index > 0 ? 'style="page-break-before: always;"' : ""
    }>
      <div class="health-card" style="${bgImageStyle}">
        <div class="card-body">
          
          <div class="card-details">
            <div class="detail-row">
              <span class="label">Card Holder Name:</span>
              <span class="value">${card.name}</span>
            </div>
            
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Membership ID:</span>
                <span class="value">${card.membershipId}</span>
              </div>
              <div class="detail-item">
                <span class="label">Blood Group:</span>
                <span class="value">${card.bloodGroup}</span>
              </div>
              <div class="detail-item">
                <span class="label">Aadhar Number:</span>
                <span class="value">${card.aadharNumber}</span>
              </div>
              <div class="detail-item">
                <span class="label">Created At:</span>
                <span class="value">${card.created_at}</span>
              </div>
              <div class="detail-item">
                <span class="label">Date of Issue:</span>
                <span class="value">${card.dateOfIssue}</span>
              </div>
              <div class="detail-item">
                <span class="label">Date of Expiry:</span>
                <span class="value">${card.dateOfExpiry}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("");

  const benefitsHTML = benefits
    .map(
      (benefit, i) => `
    <div class="benefit-item">
      <div class="check-icon">✓</div>
      <span>${benefit}</span>
    </div>
  `,
    )
    .join("");

  const stepsHTML = steps
    .map(
      (step, i) => `
    <div class="step-item">
      <div class="step-number">Step ${i + 1}</div>
      <p class="step-text">${step}</p>
    </div>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          background: #F6F7FB;
          padding: 20px;
        }
        
        .card-container {
          max-width: 800px;
          margin: 0 auto 30px;
        }
        
        .health-card {
          background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          color: white;
          position: relative;
          overflow: hidden;
          background-size: cover;
          background-position: center;
        }
        
        .health-card::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          z-index: 1;
        }
        
        .logo {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 18px;
        }
        
        .card-body {
          display: flex;
          gap: 30px;
          margin-bottom: 24px;
          position: relative;
          z-index: 2;
        }
        
        .card-details {
          flex: 1;
          margin-top: 120px;
          margin-bottom: 100px;
        }
        
        .detail-row {
          display: flex;
          margin-bottom: 12px;
          align-items: baseline;
        }
        
        .detail-row .label {
          font-weight: 600;
          min-width: 140px;
          font-size: 14px;
          opacity: 0.9;
        }
        
        .detail-row .value {
          font-weight: 700;
          font-size: 16px;
          flex: 1;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .detail-item .label {
          font-size: 12px;
          opacity: 0.8;
          font-weight: 500;
        }
        
        .detail-item .value {
          font-size: 14px;
          font-weight: 700;
        }
        
        .card-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.3);
          padding-top: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          z-index: 2;
        }
        
        .qr-code {
          background: white;
          padding: 8px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .footer-text {
          font-size: 13px;
          opacity: 0.9;
          font-weight: 500;
        }
        
        .info-section {
          max-width: 800px;
          margin: 30px auto;
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          page-break-inside: avoid;
        }
        
        .info-section h3 {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }
        
        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
          color: #374151;
        }
        
        .check-icon {
          width: 20px;
          height: 20px;
          background: #10B981;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }
        
        .step-item {
          margin-bottom: 16px;
        }
        
        .step-number {
          background: #F3F4F6;
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .step-text {
          color: #6B7280;
          font-size: 14px;
          line-height: 1.5;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .card-container, .info-section {
            margin: 0 auto 20px;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      ${cardsHTML}
      
      <div class="info-section">
        <h3>Card Benefits</h3>
        ${benefitsHTML}
      </div>
      
      <div class="info-section">
        <h3>How to Use Your Card</h3>
        ${stepsHTML}
      </div>
    </body>
    </html>
  `;
};
