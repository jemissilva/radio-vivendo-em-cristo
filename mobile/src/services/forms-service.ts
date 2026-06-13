import { appConfig } from "@/src/config/app-config";
import { ContactFormState, PrayerFormState } from "@/src/types";

export async function postPrayerRequest(payload: PrayerFormState) {
  const response = await fetch(`${appConfig.apiBaseUrl}/prayer-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email || undefined,
      request: payload.request,
      privateRequest: true,
    }),
  });

  if (!response.ok) {
    throw new Error("Falha ao enviar pedido.");
  }

  return response.json();
}

export async function postContactMessage(payload: ContactFormState) {
  const response = await fetch(`${appConfig.apiBaseUrl}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Falha ao enviar contato.");
  }

  return response.json();
}