import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private enabled: boolean;

  constructor(private configService: ConfigService) {
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    
    if (smtpUser && smtpPass && smtpPass !== 'your-gmail-app-password') {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
        port: parseInt(this.configService.get<string>('SMTP_PORT') || '587'),
        secure: this.configService.get<string>('SMTP_SECURE') === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.enabled = true;
      console.log('✅ Email service initialized (Gmail SMTP)');
    } else {
      this.enabled = false;
      console.warn('⚠️  SMTP credentials not configured. Email notifications disabled. See GMAIL_SMTP_SETUP_GUIDE.md');
    }
  }

  /**
   * Send email notification to admin when user expresses interest
   */
  async notifyAdminInterestExpressed(
    listingTitle: string,
    userName: string,
    userEmail: string,
    userPhone: string,
    message: string,
  ): Promise<void> {
    if (!this.enabled) {
      console.log('[Email Disabled] Would send interest notification:', { listingTitle, userName });
      return;
    }

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const emailFrom = this.configService.get<string>('EMAIL_FROM');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">🌱 New Interest in Fresh Roots</h2>
        <p>A customer has expressed interest in one of your products:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">📦 Product</h3>
          <p style="font-size: 16px; font-weight: bold;">${listingTitle}</p>
          
          <h3 style="color: #333; margin-top: 20px;">👤 Customer Details</h3>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${userPhone}">${userPhone}</a></p>
          
          ${message ? `
            <h3 style="color: #333; margin-top: 20px;">💬 Message</h3>
            <p style="font-style: italic; background-color: white; padding: 10px; border-left: 3px solid #4CAF50;">
              "${message}"
            </p>
          ` : ''}
        </div>
        
        <p style="color: #666; font-size: 14px;">Please contact the customer to follow up on their interest.</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Fresh Roots Mauritius | Frais ek Kalite<br>
          <a href="${this.configService.get('APP_URL')}" style="color: #4CAF50;">Visit Dashboard</a>
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: emailFrom,
        to: adminEmail,
        subject: `🌱 New Interest: ${listingTitle}`,
        html: html,
      });
      console.log('✅ Interest notification email sent to admin');
    } catch (error) {
      console.error('❌ Failed to send interest notification:', error);
    }
  }

  /**
   * Send email notification to admin when order is placed
   */
  async notifyAdminOrderPlaced(
    orderNumber: string,
    userName: string,
    userEmail: string,
    userPhone: string,
    items: Array<{ productName: string; quantity: number; price: number }>,
    totalAmount: number,
    paymentMethod: string,
  ): Promise<void> {
    if (!this.enabled) {
      console.log('[Email Disabled] Would send order notification:', { orderNumber, userName });
      return;
    }

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const emailFrom = this.configService.get<string>('EMAIL_FROM');

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs ${item.price.toFixed(2)}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">🛒 New Order Received!</h2>
        <p>A new order has been placed on Fresh Roots:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">📋 Order #${orderNumber}</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0; background-color: white;">
            <thead>
              <tr style="background-color: #4CAF50; color: white;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="font-weight: bold; font-size: 16px;">
                <td colspan="2" style="padding: 15px; text-align: right;">Total:</td>
                <td style="padding: 15px; text-align: right; color: #4CAF50;">Rs ${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <h3 style="color: #333; margin-top: 20px;">💳 Payment Method</h3>
          <p><strong>${paymentMethod === 'juice' ? '📱 Juice Payment' : '💵 Cash on Delivery'}</strong></p>
          
          <h3 style="color: #333; margin-top: 20px;">👤 Customer Details</h3>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${userPhone}">${userPhone}</a></p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
          <p style="margin: 0;"><strong>⏰ Action Required:</strong> Please review and approve this order in the admin dashboard.</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Fresh Roots Mauritius | Frais ek Kalite<br>
          <a href="${this.configService.get('APP_URL')}/api-docs" style="color: #4CAF50;">View Admin Dashboard</a>
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: emailFrom,
        to: adminEmail,
        subject: `🛒 New Order #${orderNumber} - Rs ${totalAmount.toFixed(2)}`,
        html: html,
      });
      console.log('✅ Order notification email sent to admin');
    } catch (error) {
      console.error('❌ Failed to send order notification:', error);
    }
  }

  /**
   * Send order confirmation to customer
   */
  async sendOrderConfirmation(
    customerEmail: string,
    customerName: string,
    orderNumber: string,
    items: Array<{ productName: string; quantity: number; price: number }>,
    totalAmount: number,
    paymentMethod: string,
  ): Promise<void> {
    if (!this.enabled) {
      console.log('[Email Disabled] Would send order confirmation to customer');
      return;
    }

    const emailFrom = this.configService.get<string>('EMAIL_FROM');

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs ${item.price.toFixed(2)}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">✅ Mersi! Order Confirmed</h2>
        <p>Bonzour ${customerName},</p>
        <p>Your order has been received and is being processed. We'll contact you shortly with delivery details.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">📋 Order #${orderNumber}</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0; background-color: white;">
            <thead>
              <tr style="background-color: #4CAF50; color: white;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="font-weight: bold; font-size: 16px;">
                <td colspan="2" style="padding: 15px; text-align: right;">Total:</td>
                <td style="padding: 15px; text-align: right; color: #4CAF50;">Rs ${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <p><strong>💳 Payment Method:</strong> ${paymentMethod === 'juice' ? '📱 Juice Payment' : '💵 Cash on Delivery'}</p>
        </div>
        
        <p style="color: #666;">We'll contact you at <strong>${customerEmail}</strong> with further updates.</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Fresh Roots Mauritius | Frais ek Kalite 🌱🇲🇺<br>
          Fresh vegetables, delivered with care
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: emailFrom,
        to: customerEmail,
        subject: `✅ Order Confirmed #${orderNumber} - Fresh Roots`,
        html: html,
      });
      console.log('✅ Order confirmation email sent to customer');
    } catch (error) {
      console.error('❌ Failed to send order confirmation:', error);
    }
  }

  /**
   * Send registration notification to both user and admin
   */
  async notifyRegistration(
    userName: string,
    userEmail: string,
    registrationTime: Date,
    userPhone: string | null = null,
  ): Promise<void> {
    if (!this.enabled) {
      console.log('[Email Disabled] Would send registration notification:', { userName, userEmail });
      return;
    }

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const emailFrom = this.configService.get<string>('EMAIL_FROM');

    // Email to User (welcome)
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">🌱 Welcome to Fresh Roots!</h2>
        <p>Bonzour ${userName},</p>
        <p>Mersi for joining Fresh Roots! Your account has been successfully created.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Account Details</h3>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Registered:</strong> ${registrationTime.toLocaleString()}</p>
        </div>
        
        <p style="color: #666;">You can now browse fresh vegetables, express interest in products, and place orders for delivery across Mauritius.</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Fresh Roots Mauritius | Frais ek Kalite 🌱🇲🇺
        </p>
      </div>
    `;

    // Email to Admin (new user notification)
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">👤 New User Registration - Fresh Roots</h2>
        <p>A new user has registered on Fresh Roots:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">User Details</h3>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
          <p><strong>Phone:</strong> ${userPhone || 'Not provided'}</p>
          <p><strong>Registration Time:</strong> ${registrationTime.toLocaleString()}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Fresh Roots Admin Notification
        </p>
      </div>
    `;

    try {
      // Send to user
      await this.transporter.sendMail({
        from: emailFrom,
        to: userEmail,
        subject: '🌱 Welcome to Fresh Roots - Account Created',
        html: userHtml,
      });
      console.log('✅ Registration welcome email sent to user');

      // Send to admin
      await this.transporter.sendMail({
        from: emailFrom,
        to: adminEmail,
        subject: `👤 New User Registration: ${userName}`,
        html: adminHtml,
      });
      console.log('✅ Registration notification email sent to admin');
    } catch (error) {
      console.error('❌ Failed to send registration notification:', error);
    }
  }

  /**
   * Send login notification to both user and admin
   */
  async notifyLogin(
    userName: string,
    userEmail: string,
    loginTime: Date,
    userPhone: string | null = null,
  ): Promise<void> {
    if (!this.enabled) {
      console.log('[Email Disabled] Would send login notification:', { userName, userEmail });
      return;
    }

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const emailFrom = this.configService.get<string>('EMAIL_FROM');

    // Email to User (security alert)
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">🔐 Login Activity - Fresh Roots</h2>
        <p>Bonzour ${userName},</p>
        <p>We detected a successful login to your Fresh Roots account.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Login Details</h3>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Time:</strong> ${loginTime.toLocaleString()}</p>
        </div>
        
        <p style="color: #666;">If this wasn't you, please contact us immediately at ${adminEmail}</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Fresh Roots Mauritius | Frais ek Kalite 🌱🇲🇺
        </p>
      </div>
    `;

    // Email to Admin (user activity notification)
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">👤 User Login - Fresh Roots</h2>
        <p>A user has logged in to Fresh Roots:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">User Details</h3>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
          <p><strong>Phone:</strong> ${userPhone || 'Not provided'}</p>
          <p><strong>Login Time:</strong> ${loginTime.toLocaleString()}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Fresh Roots Admin Notification
        </p>
      </div>
    `;

    try {
      // Send to user
      await this.transporter.sendMail({
        from: emailFrom,
        to: userEmail,
        subject: '🔐 Login Activity - Fresh Roots',
        html: userHtml,
      });
      console.log('✅ Login notification email sent to user');

      // Send to admin
      await this.transporter.sendMail({
        from: emailFrom,
        to: adminEmail,
        subject: `👤 User Login: ${userName}`,
        html: adminHtml,
      });
      console.log('✅ Login notification email sent to admin');
    } catch (error) {
      console.error('❌ Failed to send login notification:', error);
    }
  }

  /**
   * Test email sending configuration
   */
  async sendTestEmail(to: string): Promise<void> {
    if (!this.enabled) {
      throw new Error('Email service is not configured. Please set up SMTP credentials in .env file.');
    }

    const emailFrom = this.configService.get<string>('EMAIL_FROM') || 'Fresh Roots <noreply@freshroots.mu>';

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h1 style="color: #2d8659; text-align: center; margin-bottom: 10px;">🌱 Fresh Roots 🇲🇺</h1>
          <p style="text-align: center; color: #666; font-style: italic;">Frais ek Kalite</p>
          
          <hr style="border: none; border-top: 2px solid #e8f5e9; margin: 30px 0;">
          
          <h2 style="color: #333;">✅ Email Test Successful!</h2>
          
          <p style="color: #666; line-height: 1.8;">
            Bonzour! If you're reading this, your Fresh Roots email configuration is working perfectly! 🎉
          </p>
          
          <div style="background: #f8f9fa; border-left: 4px solid #2d8659; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>Test Details:</strong></p>
            <ul style="color: #666; margin: 10px 0; padding-left: 20px;">
              <li>SMTP Server: Configured ✓</li>
              <li>Authentication: Successful ✓</li>
              <li>Email Delivery: Working ✓</li>
              <li>Time: ${new Date().toISOString()}</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.8;">
            Your Fresh Roots marketplace is now ready to send:
          </p>
          <ul style="color: #666; line-height: 1.8;">
            <li>Order confirmations to customers</li>
            <li>Order notifications to admin</li>
            <li>Interest expression alerts</li>
          </ul>
          
          <p style="color: #666; margin-top: 20px;">
            Mersi! 🌱<br>
            <strong>Fresh Roots Team</strong>
          </p>
        </div>
        
        <p style="color: white; font-size: 12px; text-align: center; margin-top: 20px;">
          Fresh Roots Mauritius | Fresh vegetables, delivered with care 🥬🥕🍅
        </p>
      </div>
    `;

    await this.transporter.sendMail({
      from: emailFrom,
      to: to,
      subject: '✅ Fresh Roots Email Test - Configuration Successful!',
      html: html,
    });

    console.log(`✅ Test email sent to ${to}`);
  }
}
