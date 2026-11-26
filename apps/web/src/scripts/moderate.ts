// The moderation page (pages/[locale]/moderate.astro): a moderator reads the questions and remarks, publishes, hides
// and answers them. Row-level security shows other readers' messages only to moderators, and moderate_comment()
// (supabase/migrations/20261121120000_comments.sql) refuses everyone else, so this page guards nothing by itself.
import { supabase } from "../lib/supabase-client";

type Row = {
  id: string; page: string; locale: string; body: string; display_name: string | null; anonymous: boolean;
  status: "pending" | "published" | "hidden"; reply: string | null; created_at: string;
};
type Texts = Record<string, string>;

const fill = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

export async function start() {
  const box = document.querySelector<HTMLElement>("[data-moderate]");
  if (!box) return;
  const T: Texts = JSON.parse(box.dataset.texts || "{}");
  const status = box.querySelector<HTMLElement>("[data-mod-status]")!;
  const list = box.querySelector<HTMLOListElement>("[data-mod-list]")!;
  const show = (part: "in" | "out" | null) => {
    box.querySelector<HTMLElement>("[data-show-in]")!.hidden = part !== "in";
    box.querySelector<HTMLElement>("[data-show-out]")!.hidden = part !== "out";
  };
  const date = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

  const { data } = await supabase.auth.getSession();
  if (!data.session) { status.textContent = T.signin; show("out"); box.dataset.state = "out"; return; }
  const mod = await supabase.rpc("is_moderator");
  if (mod.error || !mod.data) { status.textContent = mod.error ? fill(T.failed, { error: mod.error.message }) : T.notModerator; box.dataset.state = "no"; return; }
  show("in");
  box.dataset.state = "in";

  let tab: Row["status"] = "pending";
  const tabs = [...box.querySelectorAll<HTMLButtonElement>("[data-tab]")];
  tabs.forEach((b) => b.addEventListener("click", () => {
    tab = b.dataset.tab as Row["status"];
    tabs.forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    load();
  }));

  const waiting = async () => {
    const { count } = await supabase.from("comments").select("id", { count: "exact", head: true }).eq("status", "pending");
    box.querySelector<HTMLElement>('[data-n="pending"]')!.textContent = count ? `(${count})` : "";
  };

  const act = async (row: Row, li: HTMLElement, note: HTMLElement, args: { new_status?: string; new_reply?: string }) => {
    li.dataset.busy = "";
    const { error } = await supabase.rpc("moderate_comment", { comment_id: row.id, new_status: args.new_status ?? null, new_reply: args.new_reply ?? null });
    delete li.dataset.busy;
    note.dataset.kind = error ? "error" : "ok";
    note.textContent = error ? fill(T.failed, { error: error.message }) : T.saved;
    if (!error && args.new_status && args.new_status !== tab) { li.remove(); if (!list.children.length) status.textContent = T.empty; }
    if (!error) waiting();
  };

  const item = (row: Row) => {
    const li = el("li", "moderate-item");
    const head = el("p", "comment-head");
    head.append(el("strong", "", row.anonymous ? `${row.display_name || "—"} (${T.anonymous})` : row.display_name || "—"));
    const when = el("time", "", date.format(new Date(row.created_at)));
    when.setAttribute("datetime", row.created_at);
    head.append(when, el("span", "comment-lang", row.locale));
    const link = el("a", "moderate-page", `${row.page} · ${T.openLesson}`) as HTMLAnchorElement;
    link.href = `/${row.locale}/${row.page}/`;
    link.target = "_blank";
    link.rel = "noopener";
    const body = el("p", "comment-body", row.body);
    body.lang = row.locale;
    body.dir = "auto";
    const field = el("label", "field moderate-answer");
    field.append(el("span", "", T.answerLabel));
    const answer = el("textarea") as HTMLTextAreaElement;
    answer.rows = 3;
    answer.maxLength = 2000;
    answer.value = row.reply || "";
    field.append(answer);
    const note = el("p", "comments-form-status");
    note.setAttribute("role", "status");
    const actions = el("div", "moderate-actions");
    const button = (label: string, cls: string, run: () => void) => {
      const b = el("button", `btn ${cls}`, label) as HTMLButtonElement;
      b.type = "button";
      b.addEventListener("click", run);
      actions.append(b);
    };
    if (row.status !== "published") button(T.publish, "btn-red", () => act(row, li, note, { new_status: "published", new_reply: answer.value }));
    button(T.saveAnswer, "btn-outline", () => act(row, li, note, { new_reply: answer.value }));
    if (row.status !== "hidden") button(T.hide, "btn-outline", () => act(row, li, note, { new_status: "hidden" }));
    if (row.status !== "pending") button(T.unpublish, "btn-outline", () => act(row, li, note, { new_status: "pending" }));
    li.append(head, link, body, field, actions, note);
    return li;
  };

  const load = async () => {
    list.replaceChildren();
    status.textContent = "…";
    const { data: rows, error } = await supabase.from("comments")
      .select("id,page,locale,body,display_name,anonymous,status,reply,created_at")
      .eq("status", tab).order("created_at", { ascending: tab === "pending" }).limit(200);
    if (error) { status.textContent = fill(T.failed, { error: error.message }); return; }
    status.textContent = rows && rows.length ? "" : T.empty;
    list.replaceChildren(...((rows as Row[]) || []).map(item));
  };

  waiting();
  load();
}
