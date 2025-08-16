import nodemailer from "nodemailer";

let transporter = null;

if (process.env.EMAIL && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  console.warn("⚠️ Email credentials missing. Email functionality disabled.");
}

export default transporter;
