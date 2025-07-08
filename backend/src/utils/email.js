// Mock de envio de e-mail para notificações automáticas
module.exports = async function sendEmail(to, subject, message) {
  // Aqui você pode integrar com um serviço real (ex: nodemailer, SendGrid, etc)
  console.log(`[EMAIL MOCK] Para: ${to} | Assunto: ${subject} | Mensagem: ${message}`);
  return Promise.resolve();
}; 