"use client";

import { useMemo, useState, useEffect } from "react";

type TabKey = "assessment" | "proposal" | "brief" | "spec";

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

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const toggleShow = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleShow, { passive: true });
    toggleShow();
    return () => window.removeEventListener("scroll", toggleShow);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-10 sm:px-6 flex-1">
        <header className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            lebkuchen.ru — оценка и предложение
          </h1>
          <p className="text-sm text-zinc-600">
            Страница для владельца сайта: оценка, предложение по стеку и брифинг.
          </p>
        </header>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-zinc-200 p-2 sm:flex-row sm:gap-1">
            <button
              type="button"
              onClick={() => setTab("assessment")}
              className={classNames(
                "rounded-xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
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
                "rounded-xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
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
                "rounded-xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
                tab === "brief"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              )}
            >
              Брифинг
            </button>
            <button
              type="button"
              onClick={() => setTab("spec")}
              className={classNames(
                "rounded-xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
                tab === "spec"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              )}
            >
              Тех. задание
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {tab === "assessment" && (
              <section className="space-y-4">
                <h2 className="text-base font-semibold sm:text-lg">Оценка:</h2>
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
                <h2 className="text-base font-semibold sm:text-lg">Предложение:</h2>
                <div className="space-y-4 leading-7 text-zinc-800">
                  <p>
                    Сразу о конструкторах сайтов забыть, если план работать в
                    долгую и масштабироваться.
                  </p>

                  <div className="space-y-3">
                    <h3 className="font-medium text-zinc-900">Стек для ЕС-рынка</h3>
                    <p>
                      Next.js + TypeScript + React + next-intl / next-i18next
                    </p>
                    <ul className="ml-4 list-disc space-y-1 text-sm text-zinc-700">
                      <li>Более быстрая загрузка страниц</li>
                      <li>Лучшие позиции в Google</li>
                      <li>Поддержка нескольких языков для охвата рынков ЕС</li>
                      <li>Другие плюшки</li>
                    </ul>
                    <p className="text-sm text-zinc-600">
                      Можно рассмотреть и на Django, но там и стоимости выше и скорость разработки ниже.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-zinc-900">База данных</h3>
                    <p>PostgreSQL + Prisma ORM</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-zinc-900">Платежи</h3>
                    <p>Stripe — покрывает весь ЕС, стандарт для ЕС, прост в подключении</p>
                    <p className="text-sm text-zinc-600">
                      Можно рассмотреть альтернативы, но в основном используют Stripe.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-zinc-900">Дизайн и логотип</h3>
                    <p>
                      В текущем состоянии проект не имеет дизайна совсем.
                    </p>
                    <p>
                      Логотип нужно переделать, потому что он говорит, что компания занимается логистическими услугами или что-то такое.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {tab === "spec" && (
              <section className="space-y-4">
                <h2 className="text-base font-semibold sm:text-lg">Техническое задание</h2>
                <div className="space-y-4 leading-7 text-zinc-800">
                  <p>
                    <strong>Цель:</strong> повторить функциональность и UX сайта
                    lebkuchen.ru, но без CMS, на современном стеке с мультиязычностью.
                  </p>

                  <div className="space-y-2">
                    <p><strong>Языки:</strong> DE (немецкий), US (английский), RU (русский).</p>
                    <p><strong>Стек:</strong> Next.js + TypeScript + React + next-intl / next-i18next.</p>
                    <p><strong>База данных:</strong> PostgreSQL + Prisma ORM.</p>
                    <p><strong>Платежи:</strong> Stripe (покрытие ЕС).</p>
                    <p><strong>Хостинг:</strong> Vercel (Edge, CDN, CI/CD).</p>
                  </div>

                  <div className="space-y-2">
                    <p><strong>Ключевые функции:</strong></p>
                    <ul className="ml-4 list-disc space-y-1 text-sm">
                      <li>Каталог товаров с фильтрами и поиском</li>
                      <li>Корзина и оформление заказа</li>
                      <li>«Собрать свой набор» (как на текущем сайте)</li>
                      <li>Личный кабинет покупателя</li>
                      <li>Мультиязычность (URL-префиксы: /de, /en, /ru)</li>
                      <li>SEO-оптимизация для каждого языка</li>
                      <li>Интеграция с платежной системой</li>
                      <li>Админ-панель для управления товарами (без CMS)</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p><strong>Дизайн:</strong></p>
                    <ul className="ml-4 list-disc space-y-1 text-sm">
                      <li>Современный, минималистичный UI</li>
                      <li>Адаптивность (mobile-first)</li>
                      <li>Новый логотип (текущий выглядит как логистика)</li>
                      <li>Фирменный стиль: тёплые/уютные цвета, премиум-акценты</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p><strong>Технические требования:</strong></p>
                    <ul className="ml-4 list-disc space-y-1 text-sm">
                      <li>SSR/SSG для SEO и скорости</li>
                      <li>Lazy loading изображений</li>
                      <li>Web Vitals оптимизация</li>
                      <li>CDN для статики</li>
                      <li>CI/CD на Vercel</li>
                      <li>Мониторинг ошибок (Sentry)</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p><strong>Интеграции:</strong></p>
                    <ul className="ml-4 list-disc space-y-1 text-sm">
                      <li>Stripe Payments (EUR, USD, RUB)</li>
                      <li>Email-транзакции (Resend)</li>
                      <li>Аналитика (Google Analytics 4)</li>
                      <li>ERP/склад (по запросу)</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p><strong>Безопасность:</strong></p>
                    <ul className="ml-4 list-disc space-y-1 text-sm">
                      <li>HTTPS по умолчанию (Vercel Edge)</li>
                      <li>CORS-политика для API</li>
                      <li>Rate limiting на формах и API</li>
                      <li>Защита от CSRF и XSS (Next.js built-in)</li>
                      <li>Env-переменные для секретов (RESEND_API_KEY, Stripe keys)</li>
                      <li>PCI DSS compliance через Stripe</li>
                      <li>Регулярные обновления зависимостей (Dependabot)</li>
                      <li>Логирование ошибок (Sentry)</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p><strong>Сроки и этапы:</strong></p>
                    <ul className="ml-4 list-disc space-y-1 text-sm">
                      <li>Этап 1: Дизайн и прототипы (2 недели)</li>
                      <li>Этап 2: Core-функционал (каталог, корзина) (4 недели)</li>
                      <li>Этап 3: Мультиязычность и SEO (2 недели)</li>
                      <li>Этап 4: Админ-панель и интеграции (3 недели)</li>
                      <li>Этап 5: Тестирование и запуск (1 неделя)</li>
                    </ul>
                  </div>

                  <p className="text-sm text-zinc-600">
                    Итог: современный, быстрый, масштабируемый интернет-магазин с
                    мультиязычностью и премиум UX, готовый к росту в ЕС.
                  </p>
                </div>
              </section>
            )}

            {tab === "brief" && (
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-base font-semibold sm:text-lg">Брифинг</h2>
                  <p className="text-sm text-zinc-600">
                    Заполните ответы — отправим их на почту.
                  </p>
                </div>

                <form onSubmit={submitBrief} className="space-y-8">
                  {questionsBySection.map(([section, questions]) => (
                    <div key={section} className="space-y-4">
                      <h3 className="text-sm font-semibold sm:text-base">{section}</h3>
                      <div className="space-y-4">
                        {questions.map((q) => (
                          <div key={q.id} className="space-y-2">
                            <div className="text-xs font-medium text-zinc-900 sm:text-sm">
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
                              style={{ fontSize: "16px" }}
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

        {/* Footer */}
        <footer className="mt-10 border-t border-zinc-200 bg-white py-6 text-center text-xs text-zinc-500 sm:mt-12 sm:text-sm">
          Pavel Alekseev / selen.it agency / 2026 Espana
        </footer>

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-20 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 sm:bottom-6"
            aria-label="Наверх"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
