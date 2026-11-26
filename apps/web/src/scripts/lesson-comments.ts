// Questions and remarks under a lesson (components/LessonComments.astro). Published messages are read from the view
// comments_public with a plain request, once the section comes near the screen, so a reader who never scrolls that
// far sends nothing. A signed-in reader also gets their own messages (also those still waiting) and the form; only
// then is the Supabase client loaded. Every message is put on the page as text, never as HTML.
import { AUTH_STORAGE_KEY, SUPABASE_PUBLIC } from "../config/supabase-public";

type Item = {
  id: string; locale: string; body: string; display_name: string | null; reply: string | null;
  created_at: string; status?: string; own?: boolean;
};
type Texts = Record<string, string>;

const NAME = "nahwi-comment-name";
const COLUMNS = "id,locale,body,display_name,reply,replied_at,created_at";
const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
const signedIn = () => { try { return !!localStorage.getItem(AUTH_STORAGE_KEY); } catch { return false; } };
const report = (e: unknown, where: string) => (window as unknown as { __report?: (e: unknown, w: string) => void }).__report?.(e, where);

export function start() {
  const box = document.querySelector<HTMLElement>("[data-comments]");
  if (!box) return;
  const go = () => { load(box).catch((e) => report(e, "comments")); };
  if (!("IntersectionObserver" in window)) return go();
  const seen = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { seen.disconnect(); go(); }
  }, { rootMargin: "600px 0px" });
  seen.observe(box);
}

async function publicItems(page: string): Promise<Item[]> {
  const url = `${SUPABASE_PUBLIC.url}/rest/v1/comments_public?select=${COLUMNS}&page=eq.${encodeURIComponent(page)}&order=created_at.asc&limit=200`;
  const r = await fetch(url, { headers: { apikey: SUPABASE_PUBLIC.publishableKey, accept: "application/json" } });
  if (!r.ok) throw new Error(`comments ${r.status}`);
  return r.json();
}

async function load(box: HTMLElement) {
  const page = box.dataset.page || "";
  const locale = box.dataset.locale || "en";
  const T: Texts = JSON.parse(box.dataset.ui || "{}");
  const list = box.querySelector<HTMLOListElement>("[data-list]")!;
  const status = box.querySelector<HTMLElement>("[data-list-status]")!;
  const count = box.querySelector<HTMLElement>("[data-count]")!;
  const form = box.querySelector<HTMLFormElement>("[data-form]")!;
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  let languages: Intl.DisplayNames | null = null;
  try { languages = new Intl.DisplayNames([locale], { type: "language" }); } catch {}

  let items: Item[] = [];
  let failed = false;
  // A failed request (offline, or the database not reachable) only shows a line; it is not an error of the page.
  try { items = await publicItems(page); } catch { failed = true; }

  // Signed in: the reader's own messages (row-level security gives only those) and the form.
  let client: typeof import("../lib/supabase-client").supabase | null = null;
  let user: { id: string; name: string } | null = null;
  if (signedIn()) {
    try {
      client = (await import("../lib/supabase-client")).supabase;
      const { data } = await client.auth.getSession();
      const u = data.session?.user;
      if (u) {
        const m = (u.user_metadata || {}) as Record<string, string>;
        user = { id: u.id, name: m.full_name || m.name || "" };
        const own = await client.from("comments").select("id,locale,body,display_name,anonymous,status,reply,created_at").eq("page", page);
        if (!own.error && own.data) {
          const mine = new Map((own.data as (Item & { anonymous: boolean })[]).map((o) => [o.id, { ...o, display_name: o.anonymous ? null : o.display_name, own: true }]));
          items = items.map((i) => (mine.has(i.id) ? { ...i, ...mine.get(i.id)! } : i));
          for (const [id, o] of mine) if (!items.some((i) => i.id === id)) items.push(o);
          items.sort((a, b) => a.created_at.localeCompare(b.created_at));
          failed = false;
        }
        if (!(form.elements.namedItem("name") as HTMLInputElement).value) {
          let name = "";
          try { name = localStorage.getItem(NAME) || ""; } catch {}
          (form.elements.namedItem("name") as HTMLInputElement).value = name || user.name;
        }
        box.dataset.state = "in";
      }
    } catch (e) { report(e, "comments own"); }
  }
  if (!user) box.dataset.state = "out";

  const render = () => {
    list.replaceChildren(...items.map((i) => itemNode(i)));
    const published = items.filter((i) => !i.own || i.status === "published").length;
    count.textContent = published ? `· ${published === 1 ? T.countOne : fill(T.count, { n: published })}` : "";
    status.textContent = failed && !items.length ? T.loadFailed : items.length ? "" : T.empty;
    status.hidden = !status.textContent;
  };

  const itemNode = (i: Item) => {
    const li = document.createElement("li");
    li.className = "comment";
    li.dataset.id = i.id;
    if (i.own) li.dataset.own = "";
    if (i.status && i.status !== "published") li.dataset.status = i.status;
    const head = document.createElement("p");
    head.className = "comment-head";
    const who = document.createElement("strong");
    who.textContent = i.display_name || T.learner;
    const when = document.createElement("time");
    when.dateTime = i.created_at;
    when.textContent = date.format(new Date(i.created_at));
    head.append(who, when);
    if (i.locale !== locale && languages) {
      const lang = document.createElement("span");
      lang.className = "comment-lang";
      lang.textContent = fill(T.inLanguage, { language: languages.of(i.locale) || i.locale });
      head.append(lang);
    }
    const body = document.createElement("p");
    body.className = "comment-body";
    body.lang = i.locale;
    body.dir = "auto";
    body.textContent = i.body;
    li.append(head, body);
    if (i.status === "pending" || i.status === "hidden") {
      const note = document.createElement("p");
      note.className = "comment-note";
      note.textContent = i.status === "pending" ? T.pending : T.hiddenOwn;
      li.append(note);
    }
    if (i.reply) {
      const reply = document.createElement("div");
      reply.className = "comment-reply";
      const label = document.createElement("p");
      label.className = "eyebrow";
      label.textContent = T.answer;
      const text = document.createElement("p");
      text.dir = "auto";
      text.lang = i.locale;
      text.textContent = i.reply;
      reply.append(label, text);
      li.append(reply);
    }
    if (i.own && client) {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "comment-remove";
      del.textContent = T.remove;
      del.addEventListener("click", async () => {
        // Two steps instead of a confirm() window: the first click asks, the second deletes.
        if (!("sure" in del.dataset)) { del.dataset.sure = ""; del.textContent = T.removeSure; return; }
        del.disabled = true;
        const { error } = await client!.from("comments").delete().eq("id", i.id);
        if (error) { del.disabled = false; return; }
        items = items.filter((x) => x.id !== i.id);
        render();
      });
      li.append(del);
    }
    return li;
  };

  render();
  if (!user || !client) return;

  // The form stays folded behind one button until the reader wants to write.
  box.querySelector<HTMLButtonElement>("[data-write]")?.addEventListener("click", () => {
    box.dataset.writing = "";
    (form.elements.namedItem("body") as HTMLTextAreaElement).focus();
  });
  const formStatus = form.querySelector<HTMLElement>("[data-form-status]")!;
  const send = form.querySelector<HTMLButtonElement>("[data-send]")!;
  const anon = form.elements.namedItem("anonymous") as HTMLInputElement;
  const nameInput = form.elements.namedItem("name") as HTMLInputElement;
  const bodyInput = form.elements.namedItem("body") as HTMLTextAreaElement;
  const nameField = form.querySelector<HTMLElement>(".comments-name")!;
  const syncAnon = () => { nameField.dataset.off = anon.checked ? "1" : ""; nameInput.disabled = anon.checked; };
  anon.addEventListener("change", syncAnon);
  syncAnon();

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const text = bodyInput.value.trim();
    const name = nameInput.value.trim();
    formStatus.dataset.kind = "error";
    if (text.length < 2) { formStatus.textContent = T.tooShort; bodyInput.focus(); return; }
    if (!anon.checked && !name) { formStatus.textContent = T.needName; nameInput.focus(); return; }
    send.disabled = true;
    formStatus.dataset.kind = "";
    formStatus.textContent = T.sending;
    const { data, error } = await client!.from("comments")
      .insert({ user_id: user!.id, page, locale, body: text, display_name: anon.checked ? null : name, anonymous: anon.checked })
      .select("id,locale,body,display_name,status,reply,created_at")
      .single();
    send.disabled = false;
    if (error || !data) {
      formStatus.dataset.kind = "error";
      formStatus.textContent = /too many/i.test(error?.message || "") ? T.tooMany : T.failed;
      return;
    }
    if (!anon.checked) try { localStorage.setItem(NAME, name); } catch {}
    items.push({ ...(data as Item), own: true });
    render();
    // Only the message is emptied: the name and the choice to write without it stay for the next one.
    bodyInput.value = "";
    syncAnon();
    formStatus.dataset.kind = "ok";
    formStatus.textContent = T.sent;
  });
}
