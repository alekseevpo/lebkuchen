"use client";

import { useMemo, useState } from "react";

type TabKey = "assessment" | "proposal" | "brief";

type BriefQuestion = {
  id: string;
  section: string;
  number: number;
  question: string;
  placeholder?: string;
};

const briefQuestions: BriefQuestion[] = [
  {
    id: "company_name",
    section: "О проекте",
    number: 1,
    question: "Название компании / бренда",
  },
  {
    id: "current_site",
    section: "О проекте",
    number: 2,
    question: "Сайт на данный момент",
    placeholder: "lebkuchen.ru",
  },
  {
    id: "eu_markets",
    section: "О проекте",
    number: 3,
    question: "Целевые рынки ЕС",
    placeholder: "Например: Германия, Нидерланды, Франция…",
  },
  {
    id: "languages",
    section: "О проекте",
    number: 4,
    question: "Языки на новом сайте",
    placeholder: "Укажите количество и перечень языков",
  },
  {
    id: "launch_date",
    section: "О проекте",
    number: 5,
    question: "Планируемый запуск",
    placeholder: "Желаемая дата или ориентировочный срок",
  },
  {
    id: "customer",
    section: "Аудитория и конкуренты",
    number: 6,
    question: "Кто ваш покупатель?",
    placeholder: "B2C, B2B или оба сегмента",
  },
  {
    id: "market_research",
    section: "Аудитория и конкуренты",
    number: 7,
    question: "Проводился ресёрч рынка ЕС?",
    placeholder: "Если да — поделитесь результатами",
  },
  {
    id: "competitors",
    section: "Аудитория и конкуренты",
    number: 8,
    question: "Сайты конкурентов или примеры, которые нравятся",
    placeholder: "Ссылки на 2–3 сайта с комментарием что именно нравится",
  },
  {
    id: "erp_integration",
    section: "Функциональность",
    number: 9,
    question: "Нужна интеграция с ERP / складской системой?",
    placeholder: "1С, SAP, другое — или пока без интеграции",
  },
  {
    id: "clients_migration",
    section: "Функциональность",
    number: 10,
    question: "Перенос базы клиентов с текущего сайта?",
    placeholder: "Да / Нет / Уточнить",
  },
  {
    id: "bundle_builder",
    section: "Функциональность",
    number: 11,
    question: "Функция «собрать свой набор» (как на текущем сайте)?",
    placeholder: "Да / Нет / Изменить логику",
  },
  {
    id: "branding_custom_orders",
    section: "Функциональность",
    number: 12,
    question: "Брендирование / кастомизация заказов?",
    placeholder: "Да / Нет",
  },
  {
    id: "account",
    section: "Функциональность",
    number: 13,
    question: "Личный кабинет для покупателя?",
    placeholder: "Да / Нет",
  },
  {
    id: "blog",
    section: "Функциональность",
    number: 14,
    question: "Блог / статьи на сайте?",
    placeholder: "Да / Нет",
  },
  {
    id: "brandbook",
    section: "Дизайн и визуальный стиль",
    number: 15,
    question: "Фирменный стиль / брендбук существует?",
    placeholder: "Если да — приложите файлы",
  },
  {
    id: "logo",
    section: "Дизайн и визуальный стиль",
    number: 16,
    question: "Логотип нужно разработать заново?",
    placeholder: "Да / Нет / Доработать существующий",
  },
  {
    id: "style_preferences",
    section: "Дизайн и визуальный стиль",
    number: 17,
    question: "Предпочтения по стилю",
    placeholder: "Минимализм, премиум, тёплый/уютный, другое",
  },
  {
    id: "color_preferences",
    section: "Дизайн и визуальный стиль",
    number: 18,
    question: "Цветовые предпочтения",
    placeholder: "Или «оставляем на усмотрение дизайнера»",
  },
  {
    id: "nda",
    section: "Юридические и технические вопросы",
    number: 19,
    question: "NDA / договор о конфиденциальности нужен?",
    placeholder: "Да / Нет",
  },
  {
    id: "spec",
    section: "Юридические и технические вопросы",
    number: 20,
    question: "Техническое задание уже есть?",
    placeholder: "Если да — поделитесь документом",
  },
  {
    id: "hosting",
    section: "Юридические и технические вопросы",
    number: 21,
    question: "Хостинг и домен — кто обеспечивает?",
    placeholder: "Клиент / Исполнитель / Обсудить",
  },
  {
    id: "budget",
    section: "Юридические и технические вопросы",
    number: 22,
    question: "Бюджет на проект (ориентировочно)",
    placeholder: "Это поможет предложить оптимальное решение",
  },
];

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function Home() {
  const [tab, setTab] = useState<TabKey>("assessment");
  const [form, setForm] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const q of briefQuestions) initial[q.id] = q.placeholder ?? "";
    return initial;
  });
  const [status, setStatus] = useState<
    | { state: "idle" }
    | { state: "sending" }
    | { state: "success"; message: string }
    | { state: "error"; message: string }
  >({ state: "idle" });

  const questionsBySection = useMemo(() => {
    const map = new Map<string, BriefQuestion[]>();
    for (const q of briefQuestions) {
      const arr = map.get(q.section) ?? [];
      arr.push(q);
      map.set(q.section, arr);
    }
    return Array.from(map.entries());
  }, []);

  async function submitBrief(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ state: "sending" });

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: form }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; error: string }
        | null;

      if (!res.ok || !data || data.ok === false) {
        setStatus({
          state: "error",
          message: data && "error" in data ? data.error : "Ошибка отправки",
        });
        return;
      }

      setStatus({ state: "success", message: "Отправлено" });
    } catch {
      setStatus({ state: "error", message: "Ошибка отправки" });
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            lebkuchen.ru — оценка и предложение
          </h1>
          <p className="text-sm text-zinc-600">
            Страница для владельца сайта: оценка, предложение по стеку и брифинг.
          </p>
        </header>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-zinc-200 p-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setTab("assessment")}
              className={classNames(
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                tab === "assessment"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              )}
            >
              Оценка
            </button>
            <button
              type="button"
              onClick={() => setTab("proposal")}
              className={classNames(
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                tab === "proposal"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              )}
            >
              Предложение
            </button>
            <button
              type="button"
              onClick={() => setTab("brief")}
              className={classNames(
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                tab === "brief"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              )}
            >
              Брифинг
            </button>
          </div>

          <div className="p-6">
            {tab === "assessment" && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Оценка:</h2>
                <p className="leading-7 text-zinc-800">
                  По первому впечатлению сайт на CMS (Joomla, WP, OpenCart,
                  Tilda) не поворотливая система не предназначенная для большого
                  количества товаров и наплыва посетителей(как временная
                  конструкция, не рассчитанная на масштабирование).
                </p>
              </section>
            )}

            {tab === "proposal" && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Предложение:</h2>
                <p className="leading-7 text-zinc-800">
                  Сразу о конструкторах сайтов забыть, если план работать в
                  долгую и масштабироваться.
                </p>

                <div className="space-y-3 leading-7 text-zinc-800">
                  <p>
                    Стек в разработке для сегмента ЕС будет хорош: Next.js +
                    TypeScript + React + next-intl / next-i18next (Более быстрая
                    загрузка страниц, лучшие позиции в Google, поддержка
                    нескольких языков для охвата рынков ЕС и другие плюшки)
                    Можно рассмотреть и на Django, но там и стоимости выше и
                    скорость разработки ниже.
                  </p>
                  <p>База данных: PostgreSQL + Prisma ORM.</p>
                  <p>
                    Платежи: Stripe т к покрывает весь ЕС, но можно и рассмотреть
                    альтернативы(в основном используют Stripe — стандарт для ЕС,
                    да и прост в подключении)
                  </p>
                  <p>
                    (В текущем состоянии проект не имеет дизайна совсем) Логотип
                    нужно переделать потому что он говорит что компания
                    занимается логистическими услугами или что-то такое.
                  </p>
                </div>
              </section>
            )}

            {tab === "brief" && (
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Брифинг</h2>
                  <p className="text-sm text-zinc-600">
                    Заполните ответы — отправим их на почту.
                  </p>
                </div>

                <form onSubmit={submitBrief} className="space-y-8">
                  {questionsBySection.map(([section, questions]) => (
                    <div key={section} className="space-y-4">
                      <h3 className="text-base font-semibold">{section}</h3>
                      <div className="space-y-4">
                        {questions.map((q) => (
                          <div key={q.id} className="space-y-2">
                            <div className="text-sm font-medium text-zinc-900">
                              {q.number}. {q.question}
                            </div>
                            <textarea
                              value={form[q.id] ?? ""}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  [q.id]: e.target.value,
                                }))
                              }
                              rows={3}
                              className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-400"
                              placeholder={q.placeholder}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="submit"
                      disabled={status.state === "sending"}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white transition disabled:opacity-60"
                    >
                      {status.state === "sending" ? "Отправляем…" : "Отправить"}
                    </button>
                    {status.state === "success" && (
                      <div className="text-sm text-emerald-700">
                        {status.message}
                      </div>
                    )}
                    {status.state === "error" && (
                      <div className="text-sm text-red-700">
                        {status.message}
                      </div>
                    )}
                  </div>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
