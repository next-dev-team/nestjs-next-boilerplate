export class InvoiceParserUtil {
  /**
   * Parse invoice text from Telegram messages
   * Example: "$24.00 paid by HUENG SREYMACH (*208) on Dec 11, 12:01 PM via ABA PAY at Cambodiamark by L.RIM. Trx. ID: 176542930423491, APV: 875362"
   * Example KHR: "៛43,500 paid by KAO CHANNAVY (*026) on Dec 11, 10:27 AM via ABA PAY at Cambodiamark by L.RIM. Remark: Food. Trx. ID: 176542365842864, APV: 812621."
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
    notes?: string;
  } | null {
    try {
      const result: any = {};

      // Extract amount and currency (e.g., "$24.00", "24.00 USD", "100,000៛", "100000 KHR", "៛10000", "៛1,000,000", "1000៛")
      // Pattern handles: [currency symbol?] [optional space] [amount with commas/decimals] [optional space] [currency symbol/code?]
      const amountMatch = text.match(/([៛\$])\s*([\d,]+\.?\d*)|(([\d,]+\.?\d*))\s*([៛\$]|(USD|KHR|THB))/i);
      if (amountMatch) {
        // Extract amount (could be in group 2 or 4 depending on currency position)
        const amountStr = amountMatch[2] || amountMatch[4];
        result.amount = parseFloat(amountStr.replace(/,/g, ''));

        // Determine currency from symbol or text (could be before in group 1 or after in groups 5/6)
        const currencySymbol = amountMatch[1] || amountMatch[5] || amountMatch[6];
        if (currencySymbol === '៛' || currencySymbol?.toUpperCase() === 'KHR') {
          result.currency = 'KHR';
        } else if (currencySymbol === '$' || currencySymbol?.toUpperCase() === 'USD') {
          result.currency = 'USD';
        } else if (currencySymbol?.toUpperCase() === 'THB') {
          result.currency = 'THB';
        } else {
          result.currency = 'USD'; // Default fallback
        }
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

      // Extract remark/notes
      const remarkMatch = text.match(/(?:Remark|Note)[:\s]+([^.]+)(?=\.|Trx|APV|$)/i);
      if (remarkMatch) {
        result.notes = remarkMatch[1].trim();
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
    const hasAmount = /[៛\$]?\d+\.?\d*\s*(USD|KHR|THB|៛|\$)?/i.test(text);

    return hasKeyword && hasAmount;
  }

  /**
   * Format currency amount
   */
  static formatAmount(amount: number, currency: string = 'USD'): string {
    const normalizedCurrency = currency === '$' ? 'USD' : currency.toUpperCase();

    try {
      // For KHR, use no decimal places
      if (normalizedCurrency === 'KHR') {
        return new Intl.NumberFormat('km-KH', {
          style: 'currency',
          currency: 'KHR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amount);
      }

      // For other currencies, use standard formatting
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: normalizedCurrency
      }).format(amount);
    } catch (error) {
      // Fallback if currency is not supported by Intl
      return `${amount.toLocaleString()} ${normalizedCurrency}`;
    }
  }
}
