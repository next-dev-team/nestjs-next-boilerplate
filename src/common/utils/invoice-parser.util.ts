export class InvoiceParserUtil {
  /**
   * Parse invoice text from Telegram messages
   * Example: "$24.00 paid by HUENG SREYMACH (*208) on Dec 11, 12:01 PM via ABA PAY at Cambodiamark by L.RIM. Trx. ID: 176542930423491, APV: 875362"
   */
  static parseInvoice(text: string): {
    amount: number;
    currency: string;
    payer: string;
    payerReference?: string;
    paymentDate: Date;
    paymentMethod?: string;
    merchant?: string;
    cashier?: string;
    transactionId?: string;
    approvalCode?: string;
  } | null {
    try {
      const result: any = {};

      // Extract amount and currency (e.g., "$24.00" or "24.00 USD")
      const amountMatch = text.match(/\$?([\d,]+\.?\d*)\s*(USD|KHR|USD|THB|\$)?/i);
      if (amountMatch) {
        result.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
        result.currency = amountMatch[2]?.toUpperCase() || 'USD';
      }

      // Extract payer name and reference
      const payerMatch = text.match(/paid by\s+([^(*]+)(?:\s*\(([^)]+)\))?/i);
      if (payerMatch) {
        result.payer = payerMatch[1].trim();
        result.payerReference = payerMatch[2]?.trim();
      }

      // Extract date and time
      const dateMatch = text.match(
        /on\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d+),?\s+(\d+:\d+\s*(?:AM|PM)?)/i
      );
      if (dateMatch) {
        const currentYear = new Date().getFullYear();
        const dateStr = `${dateMatch[1]} ${dateMatch[2]}, ${currentYear} ${dateMatch[3]}`;
        result.paymentDate = new Date(dateStr);

        // If parsed date is invalid, use current date
        if (isNaN(result.paymentDate.getTime())) {
          result.paymentDate = new Date();
        }
      } else {
        result.paymentDate = new Date();
      }

      // Extract payment method
      const paymentMethodMatch = text.match(/via\s+([^at]+?)(?:\s+at|\s+Trx)/i);
      if (paymentMethodMatch) {
        result.paymentMethod = paymentMethodMatch[1].trim();
      }

      // Extract merchant
      const merchantMatch = text.match(/at\s+([^by]+?)(?:\s+by|\s+Trx)/i);
      if (merchantMatch) {
        result.merchant = merchantMatch[1].trim();
      }

      // Extract cashier
      const cashierMatch = text.match(/by\s+([^.]+?)(?:\.|Trx)/i);
      if (cashierMatch) {
        result.cashier = cashierMatch[1].trim();
      }

      // Extract transaction ID
      const trxMatch = text.match(/(?:Trx\.?\s*ID|Transaction ID)[:\s]+(\d+)/i);
      if (trxMatch) {
        result.transactionId = trxMatch[1];
      }

      // Extract approval code (APV)
      const apvMatch = text.match(/APV[:\s]+(\d+)/i);
      if (apvMatch) {
        result.approvalCode = apvMatch[1];
      }

      // Validate that we at least have amount and payer
      if (result.amount && result.payer) {
        return result;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if text looks like an invoice
   */
  static isInvoiceMessage(text: string): boolean {
    const keywords = ['paid by', 'paid', 'payment', 'trx', 'transaction', 'invoice'];
    const hasKeyword = keywords.some(keyword => text.toLowerCase().includes(keyword));
    const hasAmount = /\$?\d+\.?\d*\s*(USD|KHR|THB|\$)?/i.test(text);

    return hasKeyword && hasAmount;
  }

  /**
   * Format currency amount
   */
  static formatAmount(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === '$' ? 'USD' : currency
    }).format(amount);
  }
}
