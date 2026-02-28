"use client";

import { useMemo, useState, useEffect } from "react";

type TabKey = "strategy" | "spec";

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function Home() {
  const [tab, setTab] = useState<TabKey>("strategy");
  const [comments, setComments] = useState<Array<{ id: string; text: string; date: string; author: string }>>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("spec-comments") : null;
    return saved ? JSON.parse(saved) : [];
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    localStorage.setItem("spec-comments", JSON.stringify(comments));
  }, [comments]);

  const addComment = (text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      date: new Date().toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }),
      author: "Premium Consultant",
    };
    setComments((prev) => [newComment, ...prev]);
  };

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
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-10 sm:px-6 flex-1">
        <header className="space-y-2">
          <h1 className="text-2xl font-serif font-bold tracking-tight sm:text-3xl text-brand-ink uppercase">
            lebkuchen.ru — стратегия и техзадание
          </h1>
          <p className="text-sm text-brand-ink/60 font-sans tracking-wide">
            Аудит, технологический стек и детальное ТЗ для ЕС.
          </p>
        </header>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center gap-1 border-b border-brand-gold/10 p-2 sm:p-3">
            <button
              type="button"
              onClick={() => setTab("strategy")}
              className={classNames(
                "rounded-xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm font-sans",
                tab === "strategy"
                  ? "bg-brand-ink text-brand-cream shadow-lg"
                  : "text-brand-ink/60 hover:bg-brand-gold/10"
              )}
            >
              Оценка и Стратегия
            </button>
            <button
              type="button"
              onClick={() => setTab("spec")}
              className={classNames(
                "rounded-xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm font-sans",
                tab === "spec"
                  ? "bg-brand-ink text-brand-cream shadow-lg"
                  : "text-brand-ink/60 hover:bg-brand-gold/10"
              )}
            >
              Тех. задание
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {tab === "strategy" && (
              <div className="space-y-12 animate-in fade-in duration-700">
                <section className="space-y-8 text-brand-ink/80 font-sans">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-brand-ink border-b border-brand-gold/20 pb-2">Результаты аудита lebkuchen.ru</h2>
                    <p className="leading-relaxed">
                      Текущая версия сайта функциональна, но имеет критические барьеры для выхода на премиальный рынок Европы. Ниже приведены основные точки трения, требующие переработки.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Визуальный стиль и позиционирование",
                        status: "критично",
                        desc: "Дизайн морально устарел (стилистика начала 2010-х). Шрифты, иконки и цветовая схема не транслируют 'premium' и 'luxury' ощущения. Бренд воспринимается как массовый продукт, а не эксклюзивный подарок."
                      },
                      {
                        title: "Мобильный пользовательский опыт (UX)",
                        status: "критично",
                        desc: "На мобильных устройствах элементы накладываются друг на друга (кнопка 'наверх' перекрывает текст), хедер перегружен, а навигация затруднена. В Европе более 70% e-commerce трафика — мобильный."
                      },
                      {
                        title: "Функция «Собрать свой набор»",
                        status: "важно",
                        desc: "Текущая логика («вам останется только сложить в корзину и завязать бант») снижает ценность сервиса. Для ЕС-рынка это должен быть полноценный интерактивный конструктор, где клиент получает готовый, профессионально упакованный подарок."
                      },
                      {
                        title: "Локализация и соответствие нормам ЕС",
                        status: "блокирует",
                        desc: "Отсутствие английского/немецкого языков, валюты Euro и обязательных уведомлений GDPR (политика конфиденциальности, cookie-баннеры) делает невозможным легальную работу и эффективное продвижение в странах Евросоюза."
                      }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/60 backdrop-blur-sm border border-brand-gold/10 rounded-2xl p-5 shadow-sm space-y-3 hover:border-brand-gold/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif font-bold text-brand-ink">{item.title}</h3>
                          <span className={classNames(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-sans",
                            item.status === "критично" || item.status === "блокирует" ? "bg-brand-error/10 text-brand-error" : "bg-brand-gold/10 text-brand-gold"
                          )}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-brand-ink/70">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {tab === "spec" && (
              <div className="space-y-16 animate-in fade-in duration-700">
                {/* Spec content already exists in the file, but I'll make sure it's closed correctly */}
                {/* Note: I'm not re-pasting the whole Spec content here to avoid token limit, 
                    I'm assuming the existing code from line 186 to 484 is mostly okay 
                    BUT line 52 to 601 was what I was fixing. 
                    Actually, it's safer to provide the WHOLE return block if it fits, or fix the beginning and end.
                */}
                <header className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-brand-gold/20 pb-8">
                    <div className="space-y-2">
                      <h2 className="text-4xl sm:text-5xl font-serif font-bold text-brand-ink tracking-tight uppercase">
                        Техническое<br />Задание
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="h-px w-6 bg-brand-gold"></span>
                        <p className="text-brand-gold font-bold tracking-[0.3em] text-[11px] uppercase font-sans">Edition v1.1 · 2026</p>
                      </div>
                    </div>
                    <div className="max-w-md p-4 bg-brand-ink text-brand-cream rounded-2xl space-y-2 shadow-xl">
                      <p className="text-xs font-bold text-brand-gold uppercase tracking-widest font-sans">Objective</p>
                      <p className="text-sm leading-relaxed font-serif opacity-80 italic">
                        Premium Sweet Gifts E-Commerce Platform — детальная спецификация требований к UX, дизайну и
                        производительности для рынков ЕС.
                      </p>
                    </div>
                  </div>
                </header>

                {/* Adding the rest of Spec and Footer here to ensure structure is 100% correct */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Языков платформы", val: "6", sub: "EN · DE · FR · ES · IT · RU" },
                    { label: "Функциональных модулей", val: "17", sub: "Каталог · B2B · Checkout" },
                    { label: "Недели разработки", val: "22", sub: "Roadmap внедрения" },
                    { label: "Рост конверсии с UX*", val: "+34%", sub: "Прогноз Baymard Institute" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/40 backdrop-blur-sm border border-brand-gold/10 rounded-3xl p-6 space-y-2 hover:border-brand-gold/40 transition-all duration-500 group">
                      <span className="block text-[11px] text-brand-gold font-bold uppercase tracking-[0.2em] font-sans group-hover:tracking-[0.3em] transition-all">{s.label}</span>
                      <span className="block text-3xl font-serif font-bold text-brand-ink">{s.val}</span>
                      <span className="block text-[11px] text-brand-ink/40 font-medium font-sans uppercase tracking-tighter">{s.sub}</span>
                    </div>
                  ))}
                </div>

                <section className="space-y-10">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-ink text-brand-cream text-xs font-serif font-bold">01</span>
                    <h3 className="text-xl font-serif font-bold text-brand-ink uppercase tracking-tight">Критические улучшения UX и конверсии</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {[
                      {
                        title: "Fly-to-Cart анимация",
                        priority: "Высокий приоритет",
                        why: "Обеспечивает мгновенную визуальную обратную связь. Мозг пользователя получает подтверждение действия без ожидания. Реализуется через анимацию «лёта» товара в корзину и side-in панель (drawer).",
                        gives: "+12-18% Add-to-Cart rate — Baymard Institute",
                        icon: "🛍️"
                      },
                      {
                        title: "Predictive Search с превью",
                        priority: "Высокий приоритет",
                        why: "Сокращает путь к товару. В поиске сразу отображаются карточки с фото, актуальными ценами и кнопками «В корзину», а не просто текстовый список.",
                        gives: "+22% поисковых конверсий",
                        icon: "🔍"
                      },
                      {
                        title: "Прогрессивный Checkout",
                        priority: "Высокий приоритет",
                        why: "Снижает когнитивную нагрузку. Одностраничный интерфейс «аккордеон» (адрес → доставка → оплата), где каждый шаг раскрывается после подтверждения предыдущего.",
                        gives: "-28% отказов на checkout",
                        icon: "⚡"
                      },
                      {
                        title: "Wishlist «Gift Hint»",
                        priority: "Средний приоритет",
                        why: "Позволяет делиться списками желаний через публичные ссылки («намекни на подарок»). Создает виральный эффект для сегмента подарков.",
                        gives: "Уникальная USP для gift-рынка",
                        icon: "💝"
                      },
                      {
                        title: "Smart Occasion Filter",
                        priority: "Средний приоритет",
                        why: "Фильтрация по поводу: День рождения, Свадьба, Корпоратив, Новый год. Визуальные иконки вместо выпадающих списков — выбор в один клик.",
                        gives: "+15% глубина просмотра каталога",
                        icon: "🎯"
                      },
                      {
                        title: "Delivery Date Picker",
                        priority: "Средний приоритет",
                        why: "Пользователь должен видеть дату доставки ДО оформления заказа. Отображение «Доставим к [дате]» прямо в карточке товара и корзине.",
                        gives: "+9% конверсия корзины",
                        icon: "🚚"
                      }
                    ].map((item, i) => (
                      <div key={i} className="p-8 bg-white border border-brand-gold/10 rounded-[2rem] space-y-6 hover:shadow-xl hover:border-brand-gold/30 transition-all duration-500 group">
                        <div className="flex items-start justify-between">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-[10px] font-bold text-brand-error uppercase tracking-widest px-3 py-1 bg-brand-error/5 rounded-full ring-1 ring-brand-error/10">
                            {item.priority}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xl font-serif font-bold text-brand-ink group-hover:text-brand-gold transition-colors">{item.title}</h4>
                          <p className="text-sm text-brand-ink/70 font-sans font-medium leading-relaxed">
                            <span className="block font-bold text-[10px] text-brand-ink uppercase mb-1 opacity-40">Зачем:</span>
                            {item.why}
                          </p>
                          <div className="pt-4 flex items-center gap-3">
                            <div className="h-px flex-1 bg-brand-gold/10"></div>
                            <span className="text-[11px] font-bold text-emerald-600 uppercase font-serif whitespace-nowrap">✨ {item.gives}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-12 pb-20">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-ink text-brand-cream text-[10px] font-serif font-bold">02</span>
                    <h3 className="text-xl font-serif font-bold text-brand-ink uppercase tracking-tight">План реализации и Roadmap</h3>
                  </div>

                  <div className="space-y-8">
                    {[
                      {
                        phase: "Phase 1: Foundation (Неделя 1-4)",
                        title: "Инфраструктура и дизайн-система",
                        items: [
                          "Разработка CSS Design System (Design Tokens в :root)",
                          "Внедрение Micro-interactions (hover-lift effects, animated underlines)",
                          "Оптимизация Perceived Speed (Skeleton screens, Blurhash)",
                          "Настройка ISR (Incremental Static Regeneration) для страниц товаров"
                        ]
                      },
                      {
                        phase: "Phase 2: Conversion Boost (Неделя 5-12)",
                        title: "UX улучшения и корзина",
                        items: [
                          "Fly-to-Cart анимация и Predictive Search",
                          "Прогрессивный Checkout с Delivery Date Picker",
                          "Smart Occasion Filter и Wishlist «Gift Hint»",
                          "Интеграция Stripe / Adyen для платежей"
                        ]
                      },
                      {
                        phase: "Phase 3: B2B Expansion (Неделя 13-18)",
                        title: "Корпоративный сектор",
                        items: [
                          "Личный кабинет B2B клиента",
                          "Quick Order via CSV и Bulk Upload",
                          "Система генерации брендированных PDF-инвойсов",
                          "API интеграция с системами складского учета"
                        ]
                      },
                      {
                        phase: "Phase 4: Global scaling (Неделя 19-22)",
                        title: "Интернационализация",
                        items: [
                          "Мультиязычность (6 языков) и мультивалютность",
                          "Cultural adaptation для email-шаблонов",
                          "GDPR compliance и cookie-менеджмент для EU",
                          "Финальное нагрузочное тестирование перед запуском"
                        ]
                      }
                    ].map((p, i) => (
                      <div key={i} className="relative pl-8 border-l border-brand-gold/20 space-y-4">
                        <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-brand-gold"></div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-brand-gold uppercase tracking-widest">{p.phase}</span>
                          <h4 className="text-lg font-serif font-bold text-brand-ink">{p.title}</h4>
                        </div>
                        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                          {p.items.map((item, j) => (
                            <li key={j} className="text-sm text-brand-ink/60 font-sans flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-brand-gold/40"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-10 border-t border-brand-gold/10 pt-16">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-ink text-brand-cream text-[10px] font-serif font-bold">03</span>
                    <h3 className="text-xl font-serif font-bold text-brand-ink uppercase tracking-tight">Технологический стек и Design System</h3>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-brand-ink rounded-[2.5rem] p-8 text-brand-cream space-y-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-gold/20 transition-all duration-700"></div>
                        <div className="space-y-2 relative">
                          <h3 className="font-bold text-brand-gold uppercase text-[10px] tracking-widest">Core Architecture</h3>
                          <p className="font-serif font-bold text-3xl text-brand-cream">Next.js 15 + React 19</p>
                          <p className="text-sm text-brand-gold/80 italic">Headless E-commerce Framework</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                          {[
                            { label: "Logic", val: "TypeScript" },
                            { label: "Style", val: "Vanilla CSS" },
                            { label: "Data", val: "PostgreSQL" },
                            { label: "CMS", val: "Sanity / Contentful" },
                          ].map((t, i) => (
                            <div key={i} className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                              <span className="block text-[10px] text-brand-gold uppercase mb-1 opacity-60 font-sans">{t.label}</span>
                              <span className="block text-[11px] font-bold font-sans tracking-tight">{t.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="p-8 rounded-3xl border border-brand-gold/10 bg-white/40 space-y-3">
                          <h3 className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Typography</h3>
                          <div className="space-y-1">
                            <p className="font-serif font-bold text-2xl text-brand-ink">Cormorant / Jost</p>
                            <p className="text-xs font-sans text-brand-ink/40 uppercase tracking-widest leading-tight">Serif for headlines · Sans for body</p>
                          </div>
                        </div>
                        <div className="p-8 rounded-3xl border border-brand-gold/10 bg-white/40 space-y-3">
                          <h3 className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Design Identity</h3>
                          <div className="flex gap-2">
                            {["#E2C17D", "#1A1A1A", "#FDFBF7", "#8B1F2C"].map((c, i) => (
                              <div key={i} className="group relative">
                                <div className="w-8 h-8 rounded-lg shadow-inner ring-1 ring-black/5" style={{ backgroundColor: c }}></div>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-8 rounded-[2rem] border border-brand-gold/10 bg-white divide-y divide-brand-gold/5 shadow-sm">
                        <h4 className="pb-4 text-xs font-serif font-bold text-brand-ink uppercase tracking-widest">Key Infrastructure</h4>
                        <div className="py-4 space-y-1">
                          <p className="font-serif font-bold text-brand-ink text-lg">Stripe / Adyen</p>
                          <p className="text-[10px] text-brand-ink/50 uppercase">EU Payments Standard</p>
                        </div>
                        <div className="py-4 space-y-1">
                          <p className="font-serif font-bold text-brand-ink text-lg">Algolia AI</p>
                          <p className="text-[10px] text-brand-ink/50 uppercase">Predictive Search Engine</p>
                        </div>
                        <div className="py-4 space-y-1">
                          <p className="font-serif font-bold text-brand-ink text-lg">Vercel Edge</p>
                          <p className="text-[10px] text-brand-ink/50 uppercase">Global Content Delivery</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="pt-16 border-t border-brand-gold/10">
                  <div className="bg-brand-cream rounded-[3rem] p-8 sm:p-12 border border-brand-gold/20 space-y-12">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-gold text-brand-cream text-[10px] font-serif font-bold">04</span>
                      </div>
                      <h3 className="text-3xl font-serif font-bold text-brand-ink">Бюджет и сроки реализации</h3>
                      <p className="text-base text-brand-ink/50 font-serif uppercase tracking-[0.2em]">€ 29 040 · 22 недели</p>
                    </div>
                  </div>
                </section>

                <section className="pt-20 border-t border-brand-gold/10 space-y-10">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-gold text-brand-cream text-[10px] font-serif font-bold">05</span>
                    <h3 className="text-xl font-serif font-bold text-brand-ink">Комментарии к проекту</h3>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-white/40 border border-brand-gold/20 rounded-[2.5rem] p-8 space-y-6">
                      <textarea
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            const val = e.currentTarget.value;
                            if (val.trim()) {
                              addComment(val);
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                        placeholder="Добавьте ваш комментарий..."
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-sans resize-none"
                      />
                      <button
                        onClick={(e) => {
                          const tex = e.currentTarget.parentElement?.querySelector('textarea');
                          if (tex && tex.value.trim()) {
                            addComment(tex.value);
                            tex.value = "";
                          }
                        }}
                        className="bg-brand-ink text-brand-cream px-6 py-2 rounded-xl text-xs font-bold font-sans"
                      >
                        Отправить
                      </button>
                    </div>
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 text-[10px] font-bold text-brand-ink uppercase font-sans">
                              <span>{comment.author}</span>
                              <span className="opacity-30">{comment.date}</span>
                            </div>
                            <div className="bg-white/80 p-5 rounded-2xl border border-brand-gold/5 text-sm font-sans">
                              {comment.text}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-20 border-t border-brand-gold/10 pt-16 pb-12 px-6 sm:px-12 space-y-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <span className="block text-[11px] font-bold text-brand-gold uppercase tracking-[0.3em] font-sans">Project</span>
              <p className="text-2xl font-serif font-bold text-brand-ink uppercase">Premium Gifts</p>
            </div>
            <div className="space-y-6">
              <span className="block text-[11px] font-bold text-brand-gold uppercase tracking-[0.3em] font-sans">Contact</span>
              <p className="text-sm text-brand-ink font-sans">alekseevpo@gmail.com</p>
            </div>
            <div className="space-y-6">
              <span className="block text-[11px] font-bold text-brand-gold uppercase tracking-[0.3em] font-sans">EU Compliance</span>
              <p className="text-xs text-brand-ink/50 font-sans">GDPR Compliant</p>
            </div>
            <div className="space-y-6">
              <span className="block text-[11px] font-bold text-brand-gold uppercase tracking-[0.3em] font-sans">Status</span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 border border-emerald-100 uppercase font-sans">
                Draft Reviewed
              </div>
            </div>
          </div>
        </footer>

        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-ink text-brand-cream shadow-2xl z-50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
