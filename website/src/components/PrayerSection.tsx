import { FormEvent, useState } from "react";
import { api } from "../lib/api";

export function PrayerSection() {
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    setStatus(null);

    try {
      await api.sendPrayerRequest({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        request: String(form.get("request") ?? ""),
        privateRequest: form.get("privateRequest") === "on",
      });
      event.currentTarget.reset();
      setStatus("Pedido de oração enviado com sucesso.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível enviar o pedido.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="oracao" className="section two-columns prayer-section">
      <div>
        <span className="eyebrow">Intercessão</span>
        <h2>Envie seu pedido de oração</h2>
        <p>
          Nossa equipe ministerial está pronta para interceder por você e sua família
          com amor, sigilo e cuidado pastoral.
        </p>
        <div className="card prayer-note">
          <strong>Atendimento com cuidado</strong>
          <p>
            Você pode marcar seu pedido como privado para que ele seja tratado com
            confidencialidade.
          </p>
        </div>
      </div>
      <form className="card form-card" onSubmit={handleSubmit}>
        <input name="name" placeholder="Seu nome" required />
        <input name="email" type="email" placeholder="Seu e-mail" />
        <input name="phone" placeholder="Seu telefone" />
        <textarea name="request" placeholder="Compartilhe seu pedido de oração" rows={6} required />
        <label className="checkbox">
          <input name="privateRequest" type="checkbox" />
          <span>Desejo que este pedido seja tratado como privado</span>
        </label>
        <button className="button" type="submit" disabled={sending}>
          {sending ? "Enviando..." : "Enviar pedido"}
        </button>
        {status ? <p className="form-status">{status}</p> : null}
      </form>
    </section>
  );
}