package com.smkarupatti.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
        log.info("Email sent to {}", to);
    }

    public String getContactEmailTemplate(String name, String email, String phone, String message) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "  <style>\n" +
                "    body { font-family: Arial, sans-serif; background: #FDF6EC; margin: 0; padding: 20px; }\n" +
                "    .container { max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }\n" +
                "    .header { background: linear-gradient(135deg, #5C3317, #D4A017); padding: 30px; text-align: center; color: white; }\n" +
                "    .header h1 { margin: 0; font-size: 24px; }\n" +
                "    .body { padding: 30px; }\n" +
                "    .field { margin-bottom: 20px; }\n" +
                "    .label { font-weight: bold; color: #5C3317; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }\n" +
                "    .value { margin-top: 5px; padding: 10px; background: #FDF6EC; border-radius: 8px; color: #333; }\n" +
                "    .footer { background: #5C3317; color: white; text-align: center; padding: 15px; font-size: 12px; }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"container\">\n" +
                "    <div class=\"header\">\n" +
                "      <h1>🌴 New Contact Message</h1>\n" +
                "      <p>SM Original Karupatti</p>\n" +
                "    </div>\n" +
                "    <div class=\"body\">\n" +
                "      <div class=\"field\">\n" +
                "        <div class=\"label\">Name</div>\n" +
                "        <div class=\"value\">" + name + "</div>\n" +
                "      </div>\n" +
                "      <div class=\"field\">\n" +
                "        <div class=\"label\">Email</div>\n" +
                "        <div class=\"value\">" + email + "</div>\n" +
                "      </div>\n" +
                "      <div class=\"field\">\n" +
                "        <div class=\"label\">Phone</div>\n" +
                "        <div class=\"value\">" + phone + "</div>\n" +
                "      </div>\n" +
                "      <div class=\"field\">\n" +
                "        <div class=\"label\">Message</div>\n" +
                "        <div class=\"value\">" + message + "</div>\n" +
                "      </div>\n" +
                "    </div>\n" +
                "    <div class=\"footer\">\n" +
                "      SM Original Karupatti | Tisayanvilai - Udangudi Road, Thisayanvilai, Tamil Nadu - 627657\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>";
    }

    public String getResetPasswordTemplate(String resetUrl) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "  <style>\n" +
                "    body { font-family: Arial, sans-serif; background: #FDF6EC; margin: 0; padding: 20px; }\n" +
                "    .container { max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }\n" +
                "    .header { background: linear-gradient(135deg, #5C3317, #D4A017); padding: 30px; text-align: center; color: white; }\n" +
                "    .body { padding: 30px; text-align: center; }\n" +
                "    .btn { display: inline-block; background: linear-gradient(135deg, #5C3317, #D4A017); color: white !important; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }\n" +
                "    .footer { background: #5C3317; color: white; text-align: center; padding: 15px; font-size: 12px; }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"container\">\n" +
                "    <div class=\"header\">\n" +
                "      <h1>🔑 Password Reset</h1>\n" +
                "      <p>SM Original Karupatti</p>\n" +
                "    </div>\n" +
                "    <div class=\"body\">\n" +
                "      <p>You requested a password reset. Click the button below to reset your password. This link expires in 10 minutes.</p>\n" +
                "      <a href=\"" + resetUrl + "\" class=\"btn\">Reset Password</a>\n" +
                "      <p style=\"color:#999; font-size:12px;\">If you did not request this, please ignore this email.</p>\n" +
                "    </div>\n" +
                "    <div class=\"footer\">\n" +
                "      SM Original Karupatti | Tisayanvilai, Tamil Nadu\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>";
    }
}
