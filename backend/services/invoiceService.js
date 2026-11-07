/**
 * Invoice Generator Service
 */
const generateInvoiceHtml = (order, settings) => {
  const store = settings || {
    storeName: 'Giriraj Homemade Gujarati Snacks',
    phone: '+91 98250 12345',
    email: 'orders@girirajnasta.com',
    address: {
      shopNo: 'Shop 4, Shreeji Complex',
      street: '150 Feet Ring Road',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: '360005',
    },
  };

  const itemsRows = order.orderItems
    .map(
      (item, idx) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong> ${item.isCombo ? '<span style="color:#741B28; font-size:11px;">[Combo]</span>' : ''}<br>
          <small style="color: #6b7280;">Weight Pack: ${item.weightLabel} | ₹${item.pricePerKg}/kg</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.calculatedUnitPrice}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">₹${item.itemSubtotal}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tax Invoice - ${order.orderNumber}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #29251F; margin: 0; padding: 24px; }
        .invoice-box { max-width: 800px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #741B28; padding-bottom: 16px; margin-bottom: 20px; }
        .brand-title { color: #741B28; font-size: 24px; font-weight: bold; margin: 0; }
        .brand-subtitle { color: #174D35; font-size: 13px; margin: 4px 0 0 0; }
        .invoice-title { font-size: 22px; font-weight: bold; color: #741B28; text-align: right; margin: 0; }
        .meta-text { font-size: 13px; color: #4b5563; }
        .table { width: 100%; border-collapse: collapse; margin-top: 24px; }
        .th { background-color: #F6EBD2; color: #741B28; padding: 10px; font-size: 13px; text-transform: uppercase; }
        .totals { margin-top: 20px; width: 100%; border-collapse: collapse; }
        .totals td { padding: 6px 12px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .paid { background-color: #d1fae5; color: #065f46; }
        .pending { background-color: #fef3c7; color: #92400e; }
        @media print {
          body { padding: 0; }
          .invoice-box { border: none; box-shadow: none; padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="max-width: 800px; margin: 0 auto 16px auto; text-align: right;">
        <button onclick="window.print()" style="background-color: #741B28; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">Print / Save as PDF</button>
      </div>
      <div class="invoice-box">
        <div class="header">
          <div>
            <h1 class="brand-title">${store.storeName}</h1>
            <p class="brand-subtitle">Authentic Homemade Gujarati Snacks & Namkeen</p>
            <p class="meta-text" style="margin-top: 8px;">
              ${store.address.shopNo}, ${store.address.street}<br>
              ${store.address.city}, ${store.address.state} - ${store.address.pincode}<br>
              Phone: ${store.phone} | Email: ${store.email}
            </p>
          </div>
          <div style="text-align: right;">
            <h2 class="invoice-title">TAX INVOICE</h2>
            <p class="meta-text" style="margin-top: 8px;">
              <strong>Invoice #:</strong> ${order.orderNumber}<br>
              <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}<br>
              <strong>Payment Status:</strong> <span class="badge ${order.paymentStatus === 'paid' ? 'paid' : 'pending'}">${order.paymentStatus}</span><br>
              <strong>Method:</strong> ${order.paymentMethod.toUpperCase()}
            </p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 13px;">
          <div style="width: 48%;">
            <strong style="color: #741B28;">Billed & Shipped To:</strong>
            <p style="margin: 4px 0 0 0; line-height: 1.5;">
              <strong>${order.shippingAddress.fullName}</strong><br>
              ${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}<br>
              ${order.shippingAddress.landmark ? 'Landmark: ' + order.shippingAddress.landmark + '<br>' : ''}
              ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
          </div>
          <div style="width: 48%; text-align: right;">
            <strong style="color: #741B28;">Order Information:</strong>
            <p style="margin: 4px 0 0 0; line-height: 1.5;">
              <strong>Delivery Mode:</strong> ${order.deliveryType.replace('_', ' ').toUpperCase()}<br>
              <strong>Order Status:</strong> ${order.orderStatus.toUpperCase()}<br>
              <strong>Total Weight:</strong> ${(order.totalWeightGrams / 1000).toFixed(2)} kg
            </p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th class="th" style="width: 5%;">#</th>
              <th class="th" style="text-align: left; width: 45%;">Snack Description</th>
              <th class="th" style="width: 15%;">Qty</th>
              <th class="th" style="text-align: right; width: 15%;">Unit Price</th>
              <th class="th" style="text-align: right; width: 20%;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
          <table style="width: 320px; font-size: 14px;">
            <tr>
              <td style="padding: 6px; color: #4b5563;">Subtotal:</td>
              <td style="padding: 6px; text-align: right; font-weight: 500;">₹${order.itemsSubtotal}</td>
            </tr>
            ${order.discountAmount > 0 ? `
            <tr>
              <td style="padding: 6px; color: #15803d;">Coupon Discount (${order.appliedCoupon?.code || ''}):</td>
              <td style="padding: 6px; text-align: right; color: #15803d; font-weight: 500;">-₹${order.discountAmount}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 6px; color: #4b5563;">Delivery Charge:</td>
              <td style="padding: 6px; text-align: right; font-weight: 500;">${order.deliveryFee === 0 ? '<span style="color: #15803d;">FREE</span>' : `₹${order.deliveryFee}`}</td>
            </tr>
            <tr style="border-top: 2px solid #741B28;">
              <td style="padding: 10px 6px; font-weight: bold; font-size: 16px; color: #741B28;">Grand Total:</td>
              <td style="padding: 10px 6px; text-align: right; font-weight: bold; font-size: 18px; color: #741B28;">₹${order.totalAmount}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 40px; border-top: 1px dashed #cbd5e1; padding-top: 16px; font-size: 12px; color: #64748b; text-align: center;">
          <p>Thank you for choosing Giriraj Homemade Gujarati Snacks! Authentic taste made fresh in Rajkot.</p>
          <p>For order queries, contact WhatsApp: ${store.phone} | This is a computer-generated invoice.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateInvoiceHtml,
};

