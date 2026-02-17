import nodemailer from 'nodemailer';

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

export const sendSellerIdEmail = async (sellerData) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"LunarMart Team" <${process.env.EMAIL_FROM || 'noreply@lunarmart.com'}>`,
            to: sellerData.email,
            subject: 'Seller Application Received - Your Seller ID',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        .header {
                            background: linear-gradient(135deg, #34d399, #22d3ee);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 10px 10px 0 0;
                        }
                        .content {
                            background: white;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .seller-id {
                            background: #f0fdf4;
                            border-left: 4px solid #34d399;
                            padding: 15px;
                            margin: 20px 0;
                            font-size: 18px;
                            font-weight: bold;
                            color: #166534;
                        }
                        .info-box {
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            padding: 15px;
                            margin: 15px 0;
                            border-radius: 5px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            padding-top: 20px;
                            border-top: 1px solid #e2e8f0;
                            color: #64748b;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Application Received!</h1>
                        </div>
                        <div class="content">
                            <p>Dear ${sellerData.name},</p>
                            
                            <p>Thank you for applying to become a seller on <strong>LunarMart</strong>!</p>
                            
                            <p>We have successfully received your application for <strong>${sellerData.businessName}</strong>.</p>
                            
                            <div class="seller-id">
                                Your Seller ID: ${sellerData.sellerId}
                            </div>
                            
                            <p><strong>Please save this Seller ID for your records.</strong> You will need it for future reference and communication with our team.</p>
                            
                            <div class="info-box">
                                <h3>Application Details:</h3>
                                <ul>
                                    <li><strong>Business Name:</strong> ${sellerData.businessName}</li>
                                    <li><strong>Email:</strong> ${sellerData.email}</li>
                                    <li><strong>Phone:</strong> ${sellerData.phone}</li>
                                    <li><strong>Category:</strong> ${sellerData.category}</li>
                                    <li><strong>Status:</strong> Pending Review</li>
                                </ul>
                            </div>
                            
                            <h3>What's Next?</h3>
                            <p>Our team will review your application within <strong>48 hours</strong>. We will contact you via email or phone with the next steps.</p>
                            
                            <p>If you have any questions in the meantime, please don't hesitate to reach out to us.</p>
                            
                            <p>Best regards,<br>
                            <strong>The LunarMart Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply to this message.</p>
                            <p>&copy; ${new Date().getFullYear()} LunarMart. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
Dear ${sellerData.name},

Thank you for applying to become a seller on LunarMart!

Your Seller ID: ${sellerData.sellerId}

Please save this Seller ID for your records.

Application Details:
- Business Name: ${sellerData.businessName}
- Email: ${sellerData.email}
- Phone: ${sellerData.phone}
- Category: ${sellerData.category}
- Status: Pending Review

Our team will review your application within 48 hours and contact you with the next steps.

Best regards,
The LunarMart Team
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

export default  sendSellerIdEmail ;
