import emailjs from '@emailjs/browser';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

if (publicKey) {
  emailjs.init({ publicKey });
}

export const sendNumberEmail = async ({ country_code, phone_number }) => {
  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      'EmailJS is not configured yet. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to your environment.',
    );
  }

  return emailjs.send(serviceId, templateId, {
    name: 'Diksha',
    country_code,
    phone_number,
    to_name: 'Kaushik',
    to_email: 'iamkaushik505@gmail.com',
    subject: 'Diksha just shared her WhatsApp number! ❤️',
    message:
      'Hey Kaushik!\n\nGood news! Diksha has voluntarily shared her WhatsApp number through your special website.\n\nName: Diksha\nCountry Code: {{country_code}}\nPhone Number: {{phone_number}}\n\nLooks like it\'s time to say hello on WhatsApp! ❤️',
  });
};
