import { FormEvent, useState } from "react";
import { api } from "../lib/api";

export function ContactSection() {
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    setStatus(null);

    try {
      await api.sendContact({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        subject: String(form.get("subject") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      event.currentTarget.reset();
      setStatus("Mensagem enviada com sucesso.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível enviar a mensagem.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contato" className="section two-columns">
      <div>
        <span className="eyebrow">Contato</span>
        <h2>Fale com a equipe da rádio</h2>
        <p>
          Envie dúvidas, testemunhos, sugestões de programação ou informações sobre
          eventos e campanhas.
        </p>
        <ul className="contact-list">
          <li>Email: contato@vivendoemcristo.org</li>
          <li>WhatsApp: (00) 00000-0000</li>
          <li>Instagram: @vivendoemcristo</li>
        </ul>
      </div>
      <form className="card form-card" onSubmit={handleSubmit}>
        <input name="name" placeholder="Seu nome" required />
        <input name="email" type="email" placeholder="Seu e-mail" required />
        <input name="phone" placeholder="Seu telefone" />
        <input name="subject" placeholder="Assunto" required />
        <textarea name="message" placeholder="Escreva sua mensagem" rows={5} required />
        <button className="button" type="submit" disabled={sending}>
          {sending ? "Enviando..." : "Enviar mensagem"}
        </button>
        {status ? <p className="form-status">{status}</p> : null}
      </form>
    </section>
  );
}