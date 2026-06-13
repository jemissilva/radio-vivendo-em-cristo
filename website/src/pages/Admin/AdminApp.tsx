import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import type {
  AdminAuthResponse,
  AdminContentItem,
  AdminDashboardPayload,
  AdminEventItem,
  AdminMessage,
  AdminPrayerRequest,
  AdminProgram,
  AdminScheduleEntry,
  AdminStreamStatus,
  AdminUser,
  InteractionStatus,
  ZaraIntegrationStatus,
} from "../../types";

const ADMIN_API_BASE =
  (import.meta.env.VITE_ADMIN_API_BASE_URL as string | undefined) ??
  "https://radio-vivendo-em-cristo.onrender.com/api/admin";
const ADMIN_TOKEN_KEY = "radio-admin-token";
const ADMIN_USER_KEY = "radio-admin-user";
const ZARA_SYNC_STATUS_KEY = "radio-zara-sync-status";

type ProgramFormState = {
  name: string;
  description: string;
  hostName: string;
  active: boolean;
  coverImageUrl: string;
};

type ScheduleFormState = {
  programId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isLive: boolean;
  notes: string;
};

type ContentFormState = {
  title: string;
  description: string;
  type: AdminContentItem["type"];
  author: string;
  audioUrl: string;
  imageUrl: string;
  durationSeconds: number;
  publishedAt: string;
  status: AdminContentItem["status"];
  categoryIds: string;
  programId: string;
  tags: string;
};

type EventFormState = {
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  bannerImageUrl: string;
  externalUrl: string;
  published: boolean;
};

type StreamFormState = {
  isLive: boolean;
  streamUrl: string;
  fallbackUrl: string;
  currentTrack: string;
  bitrateKbps: number;
};

const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const contentTypeOptions: AdminContentItem["type"][] = [
  "pregacao",
  "devocional",
  "louvor",
  "podcast",
  "programa_especial",
];
const contentStatusOptions: AdminContentItem["status"][] = ["draft", "published", "archived"];
const interactionStatusOptions: InteractionStatus[] = ["new", "in_progress", "answered", "closed"];

const emptyProgramForm = (): ProgramFormState => ({
  name: "",
  description: "",
  hostName: "",
  active: true,
  coverImageUrl: "",
});

const emptyScheduleForm = (): ScheduleFormState => ({
  programId: "",
  dayOfWeek: 0,
  startTime: "08:00",
  endTime: "09:00",
  isLive: true,
  notes: "",
});

const emptyContentForm = (): ContentFormState => ({
  title: "",
  description: "",
  type: "pregacao",
  author: "",
  audioUrl: "",
  imageUrl: "",
  durationSeconds: 1800,
  publishedAt: "",
  status: "draft",
  categoryIds: "",
  programId: "",
  tags: "",
});

const emptyEventForm = (): EventFormState => ({
  title: "",
  description: "",
  location: "",
  startAt: "",
  endAt: "",
  bannerImageUrl: "",
  externalUrl: "",
  published: true,
});

const emptyStreamForm = (): StreamFormState => ({
  isLive: false,
  streamUrl: "",
  fallbackUrl: "",
  currentTrack: "",
  bitrateKbps: 128,
});

function parseStoredUser(): AdminUser | null {
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

async function adminRequest<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(`${ADMIN_API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Falha na requisição administrativa");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function toDatetimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  return value ? new Date(value).toISOString() : undefined;
}

function LoginPage({
  onLogin,
  loading,
  error,
}: {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}) {
  const [email, setEmail] = useState("admin@igreja.com");
  const [password, setPassword] = useState("senha123");

  return (
    <div className="admin-login-shell">
      <div className="card admin-login-card">
        <span className="eyebrow">Painel administrativo</span>
        <h1>Entrar no painel da rádio</h1>
        <p className="hero-text">Gerencie programação, conteúdos, eventos, mensagens e transmissão ao vivo.</p>
        <form
          className="form-card"
          onSubmit={async (event) => {
            event.preventDefault();
            await onLogin(email, password);
          }}
        >
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" type="email" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Senha"
            type="password"
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          {error ? <p className="form-status admin-error">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}

function AdminLayout({
  user,
  onLogout,
  children,
}: {
  user: AdminUser;
  onLogout: () => void;
  children: ReactNode;
}) {
  const location = useLocation();
  const sections = [
    { to: "/admin", label: "Dashboard", end: true },
    { to: "/admin/programs", label: "Programas" },
    { to: "/admin/schedule", label: "Programação" },
    { to: "/admin/content", label: "Conteúdos" },
    { to: "/admin/events", label: "Eventos" },
    { to: "/admin/messages", label: "Mensagens" },
    { to: "/admin/prayers", label: "Orações" },
    { to: "/admin/stream", label: "Transmissão" },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <span className="eyebrow">Admin</span>
          <h2>Vivendo em Cristo</h2>
          <p className="muted">{user.name}</p>
          <p className="muted">{user.role}</p>
        </div>
        <nav className="admin-nav">
          {sections.map((section) => (
            <NavLink
              key={section.to}
              to={section.to}
              end={section.end}
              className={({ isActive }) =>
                `admin-nav-link${isActive || location.pathname === section.to ? " active" : ""}`
              }
            >
              {section.label}
            </NavLink>
          ))}
        </nav>
        <button className="button button-secondary" onClick={onLogout} type="button">
          Sair
        </button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

function DashboardPage({ data }: { data: AdminDashboardPayload | null }) {
  if (!data) return <div className="card">Carregando dashboard...</div>;

  const stats = [
    ["Programas", data.totals.programs],
    ["Programação", data.totals.scheduleEntries],
    ["Conteúdos", data.totals.contentItems],
    ["Eventos", data.totals.events],
    ["Mensagens", data.totals.contactMessages],
    ["Pedidos de oração", data.totals.prayerRequests],
  ];

  return (
    <section className="admin-section">
      <div className="section-title">
        <span>Resumo</span>
        <h1>Dashboard</h1>
        <p>Visão geral da operação da rádio e dos últimos contatos recebidos.</p>
      </div>
      <div className="admin-stats-grid">
        {stats.map(([label, value]) => (
          <div className="card admin-stat-card" key={label}>
            <span className="muted">{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="admin-stats-grid">
        <div className="card admin-stat-card">
          <span className="muted">Ouvintes agora</span>
          <strong>{data.analytics.listenersNow}</strong>
        </div>
        <div className="card admin-stat-card">
          <span className="muted">Pico hoje</span>
          <strong>{data.analytics.peakListenersToday}</strong>
        </div>
        <div className="card admin-stat-card">
          <span className="muted">Sessão média</span>
          <strong>{data.analytics.averageSessionMinutes} min</strong>
        </div>
        <div className="card admin-stat-card">
          <span className="muted">Uptime</span>
          <strong>{data.analytics.streamUptimePercent}%</strong>
        </div>
      </div>
      <div className="admin-two-columns">
        <div className="card">
          <h3>Últimas mensagens</h3>
          <div className="admin-list">
            {data.latestMessages.length ? (
              data.latestMessages.map((message) => (
                <div className="admin-list-item" key={message.id}>
                  <strong>{message.subject}</strong>
                  <span>{message.name}</span>
                  <span className="muted">{message.status}</span>
                </div>
              ))
            ) : (
              <p className="muted">Nenhuma mensagem recebida ainda.</p>
            )}
          </div>
        </div>
        <div className="card">
          <h3>Últimos pedidos de oração</h3>
          <div className="admin-list">
            {data.latestPrayerRequests.length ? (
              data.latestPrayerRequests.map((request) => (
                <div className="admin-list-item" key={request.id}>
                  <strong>{request.name}</strong>
                  <span>{request.privateRequest ? "Privado" : "Público"}</span>
                  <span className="muted">{request.status}</span>
                </div>
              ))
            ) : (
              <p className="muted">Nenhum pedido de oração recebido ainda.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramsPage({
  items,
  onCreate,
  onUpdate,
  onDelete,
}: {
  items: AdminProgram[];
  onCreate: (payload: ProgramFormState) => Promise<void>;
  onUpdate: (id: string, payload: ProgramFormState) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [form, setForm] = useState<ProgramFormState>(emptyProgramForm());
  const [editingId, setEditingId] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) {
      await onUpdate(editingId, form);
    } else {
      await onCreate(form);
    }
    setForm(emptyProgramForm());
    setEditingId(null);
  };

  return (
    <section className="admin-section">
      <div className="section-title">
        <span>CRUD</span>
        <h1>Programas</h1>
      </div>
      <div className="admin-two-columns">
        <form className="card form-card" onSubmit={submit}>
          <h3>{editingId ? "Editar programa" : "Novo programa"}</h3>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome" />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descrição"
            rows={4}
          />
          <input
            value={form.hostName}
            onChange={(e) => setForm({ ...form, hostName: e.target.value })}
            placeholder="Apresentador"
          />
          <input
            value={form.coverImageUrl}
            onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
            placeholder="URL da capa"
          />
          <label className="checkbox">
            <input
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              type="checkbox"
            />
            <span>Programa ativo</span>
          </label>
          <div className="admin-actions">
            <button className="button" type="submit">
              {editingId ? "Salvar alterações" : "Criar programa"}
            </button>
            {editingId ? (
              <button
                className="button button-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyProgramForm());
                }}
                type="button"
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
        <div className="card admin-table-card">
          <h3>Lista de programas</h3>
          <div className="admin-table">
            {items.map((item) => (
              <div className="admin-table-row" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted">{item.hostName}</p>
                </div>
                <span className={`badge ${item.active ? "badge-live" : "badge-offline"}`}>
                  {item.active ? "Ativo" : "Inativo"}
                </span>
                <div className="admin-actions">
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({
                        name: item.name,
                        description: item.description,
                        hostName: item.hostName,
                        active: item.active,
                        coverImageUrl: item.coverImageUrl ?? "",
                      });
                    }}
                    type="button"
                  >
                    Editar
                  </button>
                  <button className="button button-danger" onClick={() => onDelete(item.id)} type="button">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SchedulePage({
  items,
  programs,
  onCreate,
  onUpdate,
  onDelete,
}: {
  items: AdminScheduleEntry[];
  programs: AdminProgram[];
  onCreate: (payload: ScheduleFormState) => Promise<void>;
  onUpdate: (id: string, payload: ScheduleFormState) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [form, setForm] = useState<ScheduleFormState>(emptyScheduleForm());
  const [editingId, setEditingId] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) {
      await onUpdate(editingId, form);
    } else {
      await onCreate(form);
    }
    setForm(emptyScheduleForm());
    setEditingId(null);
  };

  return (
    <section className="admin-section">
      <div className="section-title">
        <span>CRUD</span>
        <h1>Programação</h1>
      </div>
      <div className="admin-two-columns">
        <form className="card form-card" onSubmit={submit}>
          <h3>{editingId ? "Editar horário" : "Novo horário"}</h3>
          <select value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value })}>
            <option value="">Selecione um programa</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
          <select
            value={form.dayOfWeek}
            onChange={(e) => setForm({ ...form, dayOfWeek: Number(e.target.value) })}
          >
            {dayLabels.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
          <div className="admin-inline-grid">
            <input
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              type="time"
            />
            <input value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} type="time" />
          </div>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
          <label className="checkbox">
            <input
              checked={form.isLive}
              onChange={(e) => setForm({ ...form, isLive: e.target.checked })}
              type="checkbox"
            />
            <span>Transmissão ao vivo</span>
          </label>
          <div className="admin-actions">
            <button className="button" type="submit">
              {editingId ? "Salvar alterações" : "Criar horário"}
            </button>
            {editingId ? (
              <button
                className="button button-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyScheduleForm());
                }}
                type="button"
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
        <div className="card admin-table-card">
          <h3>Horários cadastrados</h3>
          <div className="admin-table">
            {items.map((item) => {
              const program = programs.find((entry) => entry.id === item.programId);
              return (
                <div className="admin-table-row" key={item.id}>
                  <div>
                    <strong>{program?.name ?? item.programId}</strong>
                    <p className="muted">
                      {dayLabels[item.dayOfWeek]} · {item.startTime} às {item.endTime}
                    </p>
                  </div>
                  <div className="admin-actions">
                    <button
                      className="button button-secondary"
                      onClick={() => {
                        setEditingId(item.id);
                        setForm({
                          programId: item.programId,
                          dayOfWeek: item.dayOfWeek,
                          startTime: item.startTime,
                          endTime: item.endTime,
                          isLive: item.isLive,
                          notes: item.notes ?? "",
                        });
                      }}
                      type="button"
                    >
                      Editar
                    </button>
                    <button className="button button-danger" onClick={() => onDelete(item.id)} type="button">
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentPage({
  items,
  programs,
  onCreate,
  onUpdate,
  onDelete,
}: {
  items: AdminContentItem[];
  programs: AdminProgram[];
  onCreate: (payload: ContentFormState) => Promise<void>;
  onUpdate: (id: string, payload: ContentFormState) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [form, setForm] = useState<ContentFormState>(emptyContentForm());
  const [editingId, setEditingId] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) {
      await onUpdate(editingId, form);
    } else {
      await onCreate(form);
    }
    setForm(emptyContentForm());
    setEditingId(null);
  };

  return (
    <section className="admin-section">
      <div className="section-title">
        <span>Gestão editorial</span>
        <h1>Conteúdos</h1>
      </div>
      <div className="admin-two-columns">
        <form className="card form-card" onSubmit={submit}>
          <h3>{editingId ? "Editar conteúdo" : "Novo conteúdo"}</h3>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título" />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Descrição"
          />
          <div className="admin-inline-grid">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AdminContentItem["type"] })}>
              {contentTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as AdminContentItem["status"] })}
            >
              {contentStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Autor" />
          <input value={form.audioUrl} onChange={(e) => setForm({ ...form, audioUrl: e.target.value })} placeholder="URL do áudio" />
          <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="URL da imagem" />
          <div className="admin-inline-grid">
            <input
              value={form.durationSeconds}
              onChange={(e) => setForm({ ...form, durationSeconds: Number(e.target.value) })}
              placeholder="Duração em segundos"
              type="number"
            />
            <input
              value={form.publishedAt}
              onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              type="datetime-local"
            />
          </div>
          <input
            value={form.categoryIds}
            onChange={(e) => setForm({ ...form, categoryIds: e.target.value })}
            placeholder="Categorias (IDs separados por vírgula)"
          />
          <select value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value })}>
            <option value="">Sem programa vinculado</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags separadas por vírgula" />
          <div className="admin-actions">
            <button className="button" type="submit">
              {editingId ? "Salvar alterações" : "Criar conteúdo"}
            </button>
            {editingId ? (
              <button
                className="button button-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyContentForm());
                }}
                type="button"
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
        <div className="card admin-table-card">
          <h3>Conteúdos cadastrados</h3>
          <div className="admin-table">
            {items.map((item) => (
              <div className="admin-table-row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <p className="muted">
                    {item.type} · {item.author}
                  </p>
                </div>
                <span className="badge">{item.status}</span>
                <div className="admin-actions">
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({
                        title: item.title,
                        description: item.description,
                        type: item.type,
                        author: item.author,
                        audioUrl: item.audioUrl,
                        imageUrl: item.imageUrl ?? "",
                        durationSeconds: item.durationSeconds,
                        publishedAt: toDatetimeLocal(item.publishedAt),
                        status: item.status,
                        categoryIds: item.categoryIds.join(", "),
                        programId: item.programId ?? "",
                        tags: item.tags.join(", "),
                      });
                    }}
                    type="button"
                  >
                    Editar
                  </button>
                  <button className="button button-danger" onClick={() => onDelete(item.id)} type="button">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EventsPage({
  items,
  onCreate,
  onUpdate,
  onDelete,
}: {
  items: AdminEventItem[];
  onCreate: (payload: EventFormState) => Promise<void>;
  onUpdate: (id: string, payload: EventFormState) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [form, setForm] = useState<EventFormState>(emptyEventForm());
  const [editingId, setEditingId] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) {
      await onUpdate(editingId, form);
    } else {
      await onCreate(form);
    }
    setForm(emptyEventForm());
    setEditingId(null);
  };

  return (
    <section className="admin-section">
      <div className="section-title">
        <span>Agenda</span>
        <h1>Eventos</h1>
      </div>
      <div className="admin-two-columns">
        <form className="card form-card" onSubmit={submit}>
          <h3>{editingId ? "Editar evento" : "Novo evento"}</h3>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título" />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Descrição"
          />
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Local" />
          <div className="admin-inline-grid">
            <input value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} type="datetime-local" />
            <input value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} type="datetime-local" />
          </div>
          <input
            value={form.bannerImageUrl}
            onChange={(e) => setForm({ ...form, bannerImageUrl: e.target.value })}
            placeholder="URL do banner"
          />
          <input
            value={form.externalUrl}
            onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
            placeholder="URL externa"
          />
          <label className="checkbox">
            <input
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              type="checkbox"
            />
            <span>Evento publicado</span>
          </label>
          <div className="admin-actions">
            <button className="button" type="submit">
              {editingId ? "Salvar alterações" : "Criar evento"}
            </button>
            {editingId ? (
              <button
                className="button button-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyEventForm());
                }}
                type="button"
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
        <div className="card admin-table-card">
          <h3>Eventos cadastrados</h3>
          <div className="admin-table">
            {items.map((item) => (
              <div className="admin-table-row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <p className="muted">{new Date(item.startAt).toLocaleString("pt-BR")}</p>
                </div>
                <div className="admin-actions">
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({
                        title: item.title,
                        description: item.description,
                        location: item.location ?? "",
                        startAt: toDatetimeLocal(item.startAt),
                        endAt: toDatetimeLocal(item.endAt),
                        bannerImageUrl: item.bannerImageUrl ?? "",
                        externalUrl: item.externalUrl ?? "",
                        published: item.published,
                      });
                    }}
                    type="button"
                  >
                    Editar
                  </button>
                  <button className="button button-danger" onClick={() => onDelete(item.id)} type="button">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MessagesPage({
  items,
  onUpdate,
}: {
  items: AdminMessage[];
  onUpdate: (id: string, status: InteractionStatus, classification: string) => Promise<void>;
}) {
  return (
    <section className="admin-section">
      <div className="section-title">
        <span>Atendimento</span>
        <h1>Mensagens de contato</h1>
      </div>
      <div className="card admin-table-card">
        <div className="admin-table">
          {items.length ? (
            items.map((item) => (
              <div className="admin-table-row admin-table-row-stacked" key={item.id}>
                <div>
                  <strong>{item.subject}</strong>
                  <p className="muted">
                    {item.name} · {item.email}
                  </p>
                  <p>{item.message}</p>
                </div>
                <div className="admin-inline-grid">
                  <select defaultValue={item.status} onChange={(e) => onUpdate(item.id, e.target.value as InteractionStatus, item.classification ?? "")}>
                    {interactionStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <input
                    defaultValue={item.classification ?? ""}
                    onBlur={(e) => onUpdate(item.id, item.status, e.target.value)}
                    placeholder="Classificação"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="muted">Nenhuma mensagem recebida.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function PrayersPage({
  items,
  onUpdate,
}: {
  items: AdminPrayerRequest[];
  onUpdate: (id: string, status: InteractionStatus, assignedTo: string) => Promise<void>;
}) {
  return (
    <section className="admin-section">
      <div className="section-title">
        <span>Intercessão</span>
        <h1>Pedidos de oração</h1>
      </div>
      <div className="card admin-table-card">
        <div className="admin-table">
          {items.length ? (
            items.map((item) => (
              <div className="admin-table-row admin-table-row-stacked" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted">{item.privateRequest ? "Privado" : "Público"}</p>
                  <p>{item.request}</p>
                </div>
                <div className="admin-inline-grid">
                  <select defaultValue={item.status} onChange={(e) => onUpdate(item.id, e.target.value as InteractionStatus, item.assignedTo ?? "")}>
                    {interactionStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <input
                    defaultValue={item.assignedTo ?? ""}
                    onBlur={(e) => onUpdate(item.id, item.status, e.target.value)}
                    placeholder="Responsável"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="muted">Nenhum pedido de oração recebido.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function StreamPage({
  stream,
  onSave,
}: {
  stream: AdminStreamStatus | null;
  onSave: (payload: StreamFormState) => Promise<void>;
}) {
  const [form, setForm] = useState<StreamFormState>(emptyStreamForm());
  const [zaraStatus, setZaraStatus] = useState<ZaraIntegrationStatus | null>(null);

  useEffect(() => {
    if (stream) {
      setForm({
        isLive: stream.isLive,
        streamUrl: stream.streamUrl,
        fallbackUrl: stream.fallbackUrl ?? "",
        currentTrack: stream.currentTrack,
        bitrateKbps: stream.bitrateKbps,
      });
    }
  }, [stream]);

  useEffect(() => {
    const readStatus = () => {
      const raw = localStorage.getItem(ZARA_SYNC_STATUS_KEY);
      if (!raw) {
        setZaraStatus(null);
        return;
      }
      try {
        setZaraStatus(JSON.parse(raw) as ZaraIntegrationStatus);
      } catch {
        setZaraStatus(null);
      }
    };

    readStatus();
    window.addEventListener("storage", readStatus);
    return () => window.removeEventListener("storage", readStatus);
  }, []);

  return (
    <section className="admin-section">
      <div className="section-title">
        <span>Ao vivo</span>
        <h1>Controle da transmissão</h1>
      </div>
      <form
        className="card form-card admin-stream-card"
        onSubmit={async (event) => {
          event.preventDefault();
          await onSave(form);
        }}
      >
        <label className="checkbox">
          <input
            checked={form.isLive}
            onChange={(e) => setForm({ ...form, isLive: e.target.checked })}
            type="checkbox"
          />
          <span>Transmissão ativa</span>
        </label>
        <input
          value={form.streamUrl}
          onChange={(e) => setForm({ ...form, streamUrl: e.target.value })}
          placeholder="URL principal do stream"
        />
        <input
          value={form.fallbackUrl}
          onChange={(e) => setForm({ ...form, fallbackUrl: e.target.value })}
          placeholder="URL fallback"
        />
        <input
          value={form.currentTrack}
          onChange={(e) => setForm({ ...form, currentTrack: e.target.value })}
          placeholder="Faixa atual"
        />
        <input
          value={form.bitrateKbps}
          onChange={(e) => setForm({ ...form, bitrateKbps: Number(e.target.value) })}
          placeholder="Bitrate"
          type="number"
        />
        <button className="button" type="submit">
          Salvar transmissão
        </button>
      </form>
      <div className="card admin-stream-meta">
        <h3>Integração Zara Radio</h3>
        <div className="admin-list">
          <div className="admin-list-item">
            <strong>Faixa atual</strong>
            <span>{zaraStatus?.currentTrack || stream?.currentTrack || "Sem dados"}</span>
          </div>
          <div className="admin-list-item">
            <strong>Status da conexão</strong>
            <span className={`badge ${zaraStatus?.connected ? "badge-live" : "badge-offline"}`}>
              {zaraStatus?.connected ? "Sincronizado" : "Aguardando sync"}
            </span>
          </div>
          <div className="admin-list-item">
            <strong>Última sincronização</strong>
            <span>{zaraStatus?.lastSyncTime ? new Date(zaraStatus.lastSyncTime).toLocaleString("pt-BR") : "Nunca"}</span>
          </div>
        </div>
        <div className="admin-instructions">
          <p>1. Configure o Zara Radio para gravar o arquivo <code>CurrentSong.txt</code>.</p>
          <p>2. Defina <code>ZARA_FILE_PATH</code>, <code>API_URL</code>, <code>ADMIN_EMAIL</code> e <code>ADMIN_PASSWORD</code>.</p>
          <p>3. Execute <code>node tools/zara-sync.js</code> no computador Windows onde o Zara Radio roda.</p>
        </div>
      </div>
    </section>
  );
}

export function AdminApp() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [user, setUser] = useState<AdminUser | null>(() => parseStoredUser());
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<AdminDashboardPayload | null>(null);
  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [schedule, setSchedule] = useState<AdminScheduleEntry[]>([]);
  const [content, setContent] = useState<AdminContentItem[]>([]);
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [prayers, setPrayers] = useState<AdminPrayerRequest[]>([]);
  const [stream, setStream] = useState<AdminStreamStatus | null>(null);

  const authenticated = Boolean(token && user);
  const authToken = token ?? undefined;

  const loadAll = useMemo(
    () => async (currentToken: string) => {
      setLoading(true);
      setError(null);
      try {
        const [dashboardData, programsData, scheduleData, contentData, eventsData, messagesData, prayersData, streamData] =
          await Promise.all([
            adminRequest<AdminDashboardPayload>("/dashboard", undefined, currentToken),
            adminRequest<AdminProgram[]>("/programs", undefined, currentToken),
            adminRequest<AdminScheduleEntry[]>("/schedule", undefined, currentToken),
            adminRequest<AdminContentItem[]>("/content", undefined, currentToken),
            adminRequest<AdminEventItem[]>("/events", undefined, currentToken),
            adminRequest<AdminMessage[]>("/messages", undefined, currentToken),
            adminRequest<AdminPrayerRequest[]>("/prayer-requests", undefined, currentToken),
            adminRequest<AdminStreamStatus>("/stream", undefined, currentToken),
          ]);
        setDashboard(dashboardData);
        setPrograms(programsData);
        setSchedule(scheduleData);
        setContent(contentData);
        setEvents(eventsData);
        setMessages(messagesData);
        setPrayers(prayersData);
        setStream(streamData);
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : "Falha ao carregar painel";
        setError(message);
        if (message.includes("401") || message.toLowerCase().includes("token")) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (token) {
      void loadAll(token);
    }
  }, [token, loadAll]);

  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const response = await adminRequest<AdminAuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem(ADMIN_TOKEN_KEY, response.token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      navigate("/admin");
    } catch (requestError) {
      setLoginError(requestError instanceof Error ? requestError.message : "Falha no login");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setToken(null);
    setUser(null);
    navigate("/admin");
  };

  const refresh = async () => {
    if (token) {
      await loadAll(token);
    }
  };

  const withRefresh = async (action: () => Promise<void>) => {
    await action();
    await refresh();
  };

  if (!authenticated) {
    return <LoginPage onLogin={handleLogin} loading={loginLoading} error={loginError} />;
  }

  return (
    <AdminLayout user={user!} onLogout={handleLogout}>
      {error ? <div className="card admin-error-banner">{error}</div> : null}
      {loading ? <div className="card">Sincronizando dados do painel...</div> : null}
      <Routes>
        <Route path="/" element={<DashboardPage data={dashboard} />} />
        <Route
          path="/programs"
          element={
            <ProgramsPage
              items={programs}
              onCreate={(payload) =>
                withRefresh(async () => {
                  await adminRequest(
                    "/programs",
                    {
                      method: "POST",
                      body: JSON.stringify({
                        ...payload,
                        coverImageUrl: payload.coverImageUrl || undefined,
                      }),
                    },
                    authToken,
                  );
                })
              }
              onUpdate={(id, payload) =>
                withRefresh(async () => {
                  await adminRequest(
                    `/programs/${id}`,
                    {
                      method: "PUT",
                      body: JSON.stringify({
                        ...payload,
                        coverImageUrl: payload.coverImageUrl || undefined,
                      }),
                    },
                    authToken,
                  );
                })
              }
              onDelete={(id) =>
                withRefresh(async () => {
                  await adminRequest(`/programs/${id}`, { method: "DELETE" }, authToken);
                })
              }
            />
          }
        />
        <Route
          path="/schedule"
          element={
            <SchedulePage
              items={schedule}
              programs={programs}
              onCreate={(payload) =>
                withRefresh(async () => {
                  await adminRequest("/schedule", { method: "POST", body: JSON.stringify(payload) }, authToken);
                })
              }
              onUpdate={(id, payload) =>
                withRefresh(async () => {
                  await adminRequest(`/schedule/${id}`, { method: "PUT", body: JSON.stringify(payload) }, authToken);
                })
              }
              onDelete={(id) =>
                withRefresh(async () => {
                  await adminRequest(`/schedule/${id}`, { method: "DELETE" }, authToken);
                })
              }
            />
          }
        />
        <Route
          path="/content"
          element={
            <ContentPage
              items={content}
              programs={programs}
              onCreate={(payload) =>
                withRefresh(async () => {
                  await adminRequest(
                    "/content",
                    {
                      method: "POST",
                      body: JSON.stringify({
                        ...payload,
                        imageUrl: payload.imageUrl || undefined,
                        publishedAt: fromDatetimeLocal(payload.publishedAt),
                        categoryIds: payload.categoryIds
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                        programId: payload.programId || undefined,
                        tags: payload.tags
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      }),
                    },
                    authToken,
                  );
                })
              }
              onUpdate={(id, payload) =>
                withRefresh(async () => {
                  await adminRequest(
                    `/content/${id}`,
                    {
                      method: "PUT",
                      body: JSON.stringify({
                        ...payload,
                        imageUrl: payload.imageUrl || undefined,
                        publishedAt: fromDatetimeLocal(payload.publishedAt),
                        categoryIds: payload.categoryIds
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                        programId: payload.programId || undefined,
                        tags: payload.tags
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      }),
                    },
                    authToken,
                  );
                })
              }
              onDelete={(id) =>
                withRefresh(async () => {
                  await adminRequest(`/content/${id}`, { method: "DELETE" }, authToken);
                })
              }
            />
          }
        />
        <Route
          path="/events"
          element={
            <EventsPage
              items={events}
              onCreate={(payload) =>
                withRefresh(async () => {
                  await adminRequest(
                    "/events",
                    {
                      method: "POST",
                      body: JSON.stringify({
                        ...payload,
                        location: payload.location || undefined,
                        startAt: fromDatetimeLocal(payload.startAt),
                        endAt: fromDatetimeLocal(payload.endAt),
                        bannerImageUrl: payload.bannerImageUrl || undefined,
                        externalUrl: payload.externalUrl || undefined,
                      }),
                    },
                    authToken,
                  );
                })
              }
              onUpdate={(id, payload) =>
                withRefresh(async () => {
                  await adminRequest(
                    `/events/${id}`,
                    {
                      method: "PUT",
                      body: JSON.stringify({
                        ...payload,
                        location: payload.location || undefined,
                        startAt: fromDatetimeLocal(payload.startAt),
                        endAt: fromDatetimeLocal(payload.endAt),
                        bannerImageUrl: payload.bannerImageUrl || undefined,
                        externalUrl: payload.externalUrl || undefined,
                      }),
                    },
                    authToken,
                  );
                })
              }
              onDelete={(id) =>
                withRefresh(async () => {
                  await adminRequest(`/events/${id}`, { method: "DELETE" }, authToken);
                })
              }
            />
          }
        />
        <Route
          path="/messages"
          element={
            <MessagesPage
              items={messages}
              onUpdate={(id, status, classification) =>
                withRefresh(async () => {
                  await adminRequest(
                    `/messages/${id}`,
                    {
                      method: "PATCH",
                      body: JSON.stringify({ status, classification: classification || undefined }),
                    },
                    authToken,
                  );
                })
              }
            />
          }
        />
        <Route
          path="/prayers"
          element={
            <PrayersPage
              items={prayers}
              onUpdate={(id, status, assignedTo) =>
                withRefresh(async () => {
                  await adminRequest(
                    `/prayer-requests/${id}`,
                    {
                      method: "PATCH",
                      body: JSON.stringify({ status, assignedTo: assignedTo || undefined }),
                    },
                    authToken,
                  );
                })
              }
            />
          }
        />
        <Route
          path="/stream"
          element={
            <StreamPage
              stream={stream}
              onSave={(payload) =>
                withRefresh(async () => {
                  await adminRequest(
                    "/stream",
                    {
                      method: "PATCH",
                      body: JSON.stringify({
                        ...payload,
                        fallbackUrl: payload.fallbackUrl || undefined,
                      }),
                    },
                    authToken,
                  );
                })
              }
            />
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}