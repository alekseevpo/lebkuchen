"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";

type TabKey = "strategy" | "spec";

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginStr, setLoginStr] = useState("");
  const [passStr, setPassStr] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<TabKey>("strategy");
  const [comments, setComments] = useState<Array<{ id: string; text: string; date: string; author: string }>>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("spec-comments") : null;
    return saved ? JSON.parse(saved) : [];
  });

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartBounce, setCartBounce] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [searchText, setSearchText] = useState("");
  const searchFullText = "Пряник императорский";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setSearchText(searchFullText.slice(0, i));
      i++;
      if (i > searchFullText.length) {
        setTimeout(() => { i = 0; }, 2000);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const cartRef = useRef<HTMLButtonElement>(null);
  const productImgRef = useRef<HTMLImageElement>(null);

  const flyToCart = useCallback(() => {
    const img = productImgRef.current;
    const cart = cartRef.current;
    if (!img || !cart) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    // Create flying clone
    const clone = document.createElement('div');
    clone.style.cssText = `
      position: fixed;
      z-index: 9999;
      width: 80px;
      height: 80px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      left: ${imgRect.left + imgRect.width / 2 - 40}px;
      top: ${imgRect.top + imgRect.height / 2 - 40}px;
      transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
      pointer-events: none;
      opacity: 1;
      transform: scale(1);
    `;
    const cloneImg = document.createElement('img');
    cloneImg.src = '/pryanik.webp';
    cloneImg.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    clone.appendChild(cloneImg);
    document.body.appendChild(clone);

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        clone.style.left = `${cartRect.left + cartRect.width / 2 - 15}px`;
        clone.style.top = `${cartRect.top + cartRect.height / 2 - 15}px`;
        clone.style.width = '30px';
        clone.style.height = '30px';
        clone.style.opacity = '0.6';
        clone.style.transform = 'scale(0.3)';
        clone.style.borderRadius = '50%';
      });
    });

    // Cleanup and update cart
    setTimeout(() => {
      clone.remove();
      setCartCount(prev => prev + 1);
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 400);
    }, 850);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("site-auth") === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("spec-comments", JSON.stringify(comments));
  }, [comments]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginStr === "lebkuchen" && passStr === "premium") {
      setIsAuthenticated(true);
      sessionStorage.setItem("site-auth", "true");
    } else {
      setAuthError("Неверный логин или пароль");
    }
  };

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
    let scrollTimer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      // Hide immediately while scrolling
      setShowScrollTop(false);
      clearTimeout(scrollTimer);
      // Show after 500ms of no scrolling (if scrolled past threshold)
      scrollTimer = setTimeout(() => {
        if (window.scrollY > 300) {
          setShowScrollTop(true);
        }
      }, 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isAuthenticated === null) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream text-brand-ink p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-brand-gold/20 space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-serif font-bold text-brand-ink uppercase">Private Access</h2>
            <p className="text-[15px] font-sans text-brand-ink/60">Введите данные для входа</p>
          </div>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Логин"
                value={loginStr}
                onChange={(e) => setLoginStr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-gold/20 text-[15px] font-sans focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Пароль"
                value={passStr}
                onChange={(e) => setPassStr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-gold/20 text-[15px] font-sans focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
              />
            </div>
            {authError && <p className="text-[13px] text-brand-error font-sans text-center font-bold">{authError}</p>}
          </div>
          <button type="submit" className="w-full bg-brand-ink text-brand-cream py-3 rounded-xl text-[15px] font-bold font-sans hover:bg-brand-ink/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-ink overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-2 py-4 sm:py-10 sm:px-6 flex-1 overflow-x-hidden">
        <header className="space-y-2">
          <h1 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl text-brand-ink uppercase">
            lebkuchen.ru — стратегия и техзадание
          </h1>
          <p className="text-[15px] text-brand-ink/60 font-sans tracking-wide">
            Аудит, технологический стек и детальное ТЗ для ЕС.
          </p>
        </header>

        <div className="mt-4 sm:mt-6 rounded-2xl sm:rounded-[2.5rem] border border-brand-gold/15 bg-white shadow-2xl shadow-brand-gold/10 overflow-hidden">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 border-b border-brand-gold/15 px-4 pt-4 sm:px-10 sm:pt-6 shrink-0">
            <button
              type="button"
              onClick={() => setTab("strategy")}
              className={classNames(
                "pb-4 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.15em] transition font-sans border-b-2 relative top-[2px]",
                tab === "strategy"
                  ? "border-brand-ink text-brand-ink"
                  : "border-transparent text-brand-ink/40 hover:text-brand-ink/70 hover:border-brand-gold/30"
              )}
            >
              Оценка и Стратегия
            </button>
            <button
              type="button"
              onClick={() => setTab("spec")}
              className={classNames(
                "pb-4 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.15em] transition font-sans border-b-2 relative top-[2px]",
                tab === "spec"
                  ? "border-brand-ink text-brand-ink"
                  : "border-transparent text-brand-ink/40 hover:text-brand-ink/70 hover:border-brand-gold/30"
              )}
            >
              Тех. задание
            </button>
          </div>

          <div className="p-3 sm:p-10 lg:p-14">
            {tab === "strategy" && (
              <div className="space-y-12 animate-in fade-in duration-700">
                <section className="space-y-8 text-brand-ink/80 font-sans">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-brand-ink border-b border-brand-gold/20 pb-2">Результаты аудита lebkuchen.ru</h2>
                    <p className="text-[17px] leading-relaxed">
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
                      <div key={i} className="bg-transparent border border-brand-gold/20 rounded-2xl p-4 sm:p-8 space-y-3 sm:space-y-4 shadow-sm hover:border-brand-gold/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif font-bold text-brand-ink">{item.title}</h3>
                          <span className={classNames(
                            "text-[11px] px-2 py-0.5 rounded-full font-bold uppercase font-sans",
                            item.status === "критично" || item.status === "блокирует" ? "bg-brand-error/10 text-brand-error" : "bg-brand-gold/10 text-brand-gold"
                          )}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[15px] leading-relaxed text-brand-ink/70">{item.desc}</p>
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
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 border-b border-brand-gold/20 pb-6 sm:pb-8">
                    <div className="space-y-2">
                      <h2 className="text-3xl sm:text-5xl font-serif font-bold text-brand-ink tracking-tight uppercase">
                        Техническое<br />Задание
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="h-px w-6 bg-brand-gold"></span>
                        <p className="text-brand-gold font-bold tracking-[0.3em] text-xs uppercase font-sans">Edition v1.1 · 2026</p>
                      </div>
                    </div>
                    <div className="w-full sm:max-w-md p-4 bg-brand-ink text-brand-cream rounded-2xl space-y-2 shadow-xl">
                      <p className="text-[13px] font-bold text-brand-gold uppercase tracking-widest font-sans">Objective</p>
                      <p className="text-base leading-relaxed font-serif text-brand-cream">
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
                    { label: "Модулей", val: "17", sub: "Каталог · B2B · Checkout" },
                    { label: "Недели разработки", val: "22", sub: "Roadmap внедрения" },
                    { label: "Рост конверсии с UX*", val: "+34%", sub: "Прогноз Baymard Institute" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white border sm:border-transparent border-brand-gold/10 rounded-3xl p-6 space-y-2 hover:border-brand-gold/20 hover:bg-zinc-50/50 hover:border-brand-gold/40 transition-all duration-500 group">
                      <span className="block text-[11px] sm:text-xs text-brand-gold font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] font-sans group-hover:tracking-[0.15em] sm:group-hover:tracking-[0.2em] transition-all break-words">{s.label}</span>
                      <span className="block text-3xl font-serif font-bold text-brand-ink">{s.val}</span>
                      <span className="block text-xs text-brand-ink/40 font-medium font-sans uppercase tracking-tighter">{s.sub}</span>
                    </div>
                  ))}
                </div>

                <section className="space-y-10">
                  <div className="flex items-center gap-3 sm:gap-6 border-b border-brand-gold/10 pb-4 sm:pb-6 mb-6 sm:mb-8">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-ink text-brand-cream text-[16px] sm:text-[18px] font-serif font-bold">01</span>
                    <h3 className="text-xl font-serif font-bold text-brand-ink uppercase tracking-tight">Критические улучшения UX и конверсии</h3>
                  </div>

                  <div className="mb-8 sm:mb-16 bg-white border border-brand-gold/15 rounded-2xl sm:rounded-[2.5rem] shadow-2xl shadow-brand-gold/5 overflow-hidden flex flex-col lg:flex-row hover:shadow-brand-gold/10 transition-shadow duration-700">
                    <div className="lg:w-1/2 p-4 sm:p-12 bg-zinc-50 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                      {/* Product Card Showcase */}
                      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden border border-brand-gold/10 group relative z-10">
                        {/* Image Placeholder Area */}
                        <div className="aspect-[4/5] bg-brand-cream relative overflow-hidden flex items-center justify-center">
                          <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1 bg-brand-ink text-brand-cream text-[10px] font-bold uppercase tracking-widest rounded-full font-sans shadow-sm">Bestseller</span>
                          </div>
                          <img
                            ref={productImgRef}
                            src="/pryanik.webp"
                            alt="Императорский Пряник"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>

                        {/* Content Area */}
                        <div className="p-6 space-y-5">
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold text-brand-gold uppercase tracking-widest font-sans">Подарочный набор</p>
                            <h4 className="text-2xl font-serif font-bold text-brand-ink leading-tight group-hover:text-brand-gold transition-colors">Императорский Пряник</h4>
                          </div>

                          <div className="flex items-end justify-between">
                            <div className="space-y-0.5">
                              <p className="text-sm font-sans text-brand-ink/50 line-through decoration-brand-gold/50">€ 185</p>
                              <p className="text-2xl font-sans font-bold text-brand-ink tracking-tight">€ 145</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] font-sans text-emerald-600/80 font-bold uppercase tracking-widest flex items-center justify-end gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                В наличии
                              </p>
                              <p className="text-[10px] font-sans text-brand-ink/40 uppercase tracking-widest mt-1">Остаток: 5 шт.</p>
                            </div>
                          </div>

                          <button onClick={flyToCart} className="w-full relative group overflow-hidden py-4 rounded-2xl shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-3 transition-all duration-500">
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink to-brand-gold/90 transition-transform duration-500 group-hover:scale-x-110 origin-left"></div>

                            {/* Shine Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
                            </div>

                            {/* Text & Icon */}
                            <span className="relative z-10 font-sans font-bold text-[13px] text-brand-cream uppercase tracking-[0.2em]">В корзину</span>
                            <span className="relative z-10 text-brand-gold group-hover:text-white transition-colors duration-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-1/2 p-5 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 sm:space-y-8 bg-white z-10">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] font-sans">UX Breakdown</span>
                        <h4 className="text-2xl sm:text-3xl font-serif font-bold text-brand-ink">Архитектура премиальной карточки</h4>
                        <p className="text-[15px] leading-relaxed text-brand-ink/70 font-sans">
                          В премиум-сегменте карточка товара не должна кричать скидками. Она обязана выглядеть как витрина бутика. Мы удаляем визуальный шум и делаем акцент на эстетике продукта.
                        </p>
                      </div>

                      <div className="space-y-6">
                        {[
                          { title: "Визуальная иерархия", desc: "Строгое разделение: 60% площади отдано визуалу, 40% — информации. Это фокусирует внимание на продукте." },
                          { title: "Элегантные бейджи", desc: "Метки («Bestseller», скидки) интегрированы аккуратно, используя минималистичную типографику, а не агрессивные красные ярлыки." },
                          { title: "Контрастный CTA (Call to Action)", desc: "Кнопка «В корзину» — самый темный и массивный элемент интерфейса, контрастирующий с легким фоном. Направление взгляда автоматически ведет к ней." },
                          { title: "Micro-interactions", desc: "Плавное выравнивание продукта при наведении (hover) создает ощущение тактильности и оживляет интерфейс." },
                        ].map((feat, idx) => (
                          <div key={idx} className="flex gap-4 items-start">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-[10px] sm:text-xs">
                              {idx + 1}
                            </span>
                            <div className="space-y-1">
                              <p className="font-bold text-[14px] text-brand-ink">{feat.title}</p>
                              <p className="text-[14px] text-brand-ink/60 leading-relaxed max-w-sm">{feat.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Predictive Search Example */}
                  <div className="mb-8 sm:mb-16 bg-white border border-brand-gold/15 rounded-2xl sm:rounded-[2.5rem] shadow-2xl shadow-brand-gold/5 overflow-hidden flex flex-col lg:flex-row-reverse hover:shadow-brand-gold/10 transition-shadow duration-700">
                    {/* Search UI Showcase */}
                    <div className="lg:w-1/2 p-4 sm:p-12 bg-zinc-50 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

                      <div className="w-full max-w-md relative z-10 space-y-0">
                        {/* Search Input */}
                        <div className="bg-white rounded-t-2xl sm:rounded-t-3xl border border-brand-gold/10 border-b-0 p-3 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-lg shadow-black/5">
                          <svg className="w-5 h-5 text-brand-gold/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="font-sans text-brand-ink text-[15px]">{searchText}<span className="animate-pulse">|</span></span>
                          <span className="ml-auto text-[10px] font-sans text-brand-ink/30 uppercase tracking-widest">Esc</span>
                        </div>

                        {/* Dropdown Results */}
                        <div className="bg-white rounded-b-2xl sm:rounded-b-3xl border border-brand-gold/10 border-t border-brand-gold/5 shadow-2xl shadow-black/10 divide-y divide-brand-gold/5">
                          {[
                            { name: "Императорский Пряник", cat: "Подарочный набор", price: "€ 145", badge: "Bestseller" },
                            { name: "Императорское Ассорти", cat: "Праздничная серия", price: "€ 89", badge: null },
                            { name: "Императорский Мёд", cat: "Мёд и сладости", price: "€ 65", badge: "Новинка" },
                          ].map((r, i) => (
                            <div key={i} className={`flex items-center gap-4 p-4 hover:bg-brand-cream/50 transition-colors cursor-pointer ${i === 0 ? "bg-brand-cream/30" : ""}`}>
                              {/* Mini product thumbnail */}
                              <div className="w-12 h-12 bg-brand-cream rounded-xl border border-brand-gold/10 flex items-center justify-center shrink-0">
                                <span className="font-serif text-brand-gold/40 text-sm font-bold">L</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-serif font-bold text-[14px] text-brand-ink truncate">{r.name}</p>
                                <p className="text-[11px] font-sans text-brand-ink/40 uppercase tracking-widest">{r.cat}</p>
                              </div>
                              <div className="text-right shrink-0 space-y-1">
                                <p className="font-sans font-bold text-[14px] text-brand-ink">{r.price}</p>
                                {r.badge && (
                                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-brand-ink text-brand-cream font-sans">{r.badge}</span>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="p-3 text-center">
                            <span className="text-[11px] font-sans text-brand-gold font-bold uppercase tracking-widest cursor-pointer hover:text-brand-ink transition-colors">Показать все результаты →</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* UX Description */}
                    <div className="lg:w-1/2 p-5 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 sm:space-y-8 bg-white z-10">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] font-sans">UX Breakdown</span>
                        <h4 className="text-2xl sm:text-3xl font-serif font-bold text-brand-ink">Predictive Search с превью</h4>
                        <p className="text-[15px] leading-relaxed text-brand-ink/70 font-sans">
                          Поиск — главный инструмент конверсии. Мы превращаем обычную строку поиска в мини-витрину: пользователь видит товар, цену и фото ещё до перехода на страницу результатов.
                        </p>
                      </div>

                      <div className="space-y-6">
                        {[
                          { title: "Мгновенные результаты", desc: "Подсказки появляются после 2-го символа. Задержка ≤ 100ms благодаря Algolia — пользователь не ждёт." },
                          { title: "Визуальное превью", desc: "Каждый результат содержит миниатюру товара, категорию и цену. Это сокращает путь к покупке на 2-3 клика." },
                          { title: "Подсветка первого результата", desc: "Лучшее совпадение визуально выделено фоном — пользователь инстинктивно кликает. Это увеличивает CTR поиска на 30%." },
                          { title: "Интеграция с каталогом", desc: "Бейджи («Bestseller», «Новинка») дублируются из каталога прямо в поиск. Социальное доказательство работает везде." },
                        ].map((feat, idx) => (
                          <div key={idx} className="flex gap-4 items-start">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-[10px] sm:text-xs">
                              {idx + 1}
                            </span>
                            <div className="space-y-1">
                              <p className="font-bold text-[14px] text-brand-ink">{feat.title}</p>
                              <p className="text-[14px] text-brand-ink/60 leading-relaxed max-w-sm">{feat.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progressive Checkout Example */}
                  <div className="mb-8 sm:mb-16 bg-white border border-brand-gold/15 rounded-2xl sm:rounded-[2.5rem] shadow-2xl shadow-brand-gold/5 overflow-hidden flex flex-col lg:flex-row hover:shadow-brand-gold/10 transition-shadow duration-700">
                    {/* Checkout UI Showcase */}
                    <div className="lg:w-1/2 p-4 sm:p-12 bg-zinc-50 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                      <div className="w-full max-w-sm relative z-10 space-y-4">
                        {[
                          { id: 1, title: "1. Адрес доставки", summary: "Мадрид, Calle del Escano 36", icon: "📍" },
                          { id: 2, title: "2. Способ доставки", summary: "Курьерская (1-2 дня)", icon: "🚚" },
                          { id: 3, title: "3. Оплата", summary: "Apple Pay / Картой", icon: "💳" }
                        ].map((s) => (
                          <div
                            key={s.id}
                            onClick={() => setCheckoutStep(s.id)}
                            className={classNames(
                              "p-5 rounded-2xl border transition-all duration-500 cursor-pointer",
                              checkoutStep === s.id
                                ? "bg-white border-brand-gold shadow-lg ring-1 ring-brand-gold/20"
                                : "bg-white/40 border-brand-gold/10 grayscale-[0.5] opacity-60"
                            )}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{s.icon}</span>
                                <div className="space-y-0.5">
                                  <p className="font-serif font-bold text-[14px] text-brand-ink">{s.title}</p>
                                  {checkoutStep >= s.id && (
                                    <p className="text-[11px] font-sans text-brand-ink/40 uppercase tracking-widest">{s.summary}</p>
                                  )}
                                </div>
                              </div>
                              {checkoutStep > s.id && (
                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            {checkoutStep === s.id && s.id < 3 && (
                              <div className="mt-4 pt-4 border-t border-brand-gold/10 animate-in fade-in slide-in-from-top-2 duration-500">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setCheckoutStep(s.id + 1); }}
                                  className="w-full py-2.5 bg-brand-ink text-brand-cream rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-gold transition-colors"
                                >
                                  Далее →
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* UX Description */}
                    <div className="lg:w-1/2 p-5 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 sm:space-y-8 bg-white z-10">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] font-sans">UX Breakdown</span>
                        <h4 className="text-2xl sm:text-3xl font-serif font-bold text-brand-ink">Прогрессивный Checkout</h4>
                        <p className="text-[15px] leading-relaxed text-brand-ink/70 font-sans">
                          Мы не перегружаем клиента формой из 20 полей. Каждый следующий шаг открывается только после завершения предыдущего, сохраняя фокус и снижая процент брошенных корзин.
                        </p>
                      </div>

                      <div className="space-y-6">
                        {[
                          { title: "Туннельное зрение", desc: "Внимание пользователя сфокусировано только на одном активном шаге. Остальные блоки свернуты или показывают только краткую суть." },
                          { title: "Сохранение успеха", desc: "Галочки и краткие сводки по завершенным шагам создают у клиента «эффект прогресса», который психологически мешает бросать покупку." },
                          { title: "Zero Noise Design", desc: "Удалены все лишние ссылки, меню и баннеры. На странице чекаута существует только один путь — вперед к оплате." },
                          { title: "Мгновенная валидация", desc: "Ошибки подсвечиваются в реальном времени, не давая нажать кнопку «Далее», пока данные не введены корректно." },
                        ].map((feat, idx) => (
                          <div key={idx} className="flex gap-4 items-start">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-[10px] sm:text-xs">
                              {idx + 1}
                            </span>
                            <div className="space-y-1">
                              <p className="font-bold text-[14px] text-brand-ink">{feat.title}</p>
                              <p className="text-[14px] text-brand-ink/60 leading-relaxed max-w-sm">{feat.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-10">
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
                      <div key={i} className="p-5 sm:p-8 bg-white border border-brand-gold/10 rounded-xl sm:rounded-[2rem] space-y-4 sm:space-y-6 hover:shadow-xl hover:border-brand-gold/30 transition-all duration-500 group">
                        <div className="flex items-start justify-between">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-[11px] font-bold text-brand-error uppercase tracking-widest px-3 py-1 bg-brand-error/5 rounded-full ring-1 ring-brand-error/10">
                            {item.priority}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xl font-serif font-bold text-brand-ink group-hover:text-brand-gold transition-colors">{item.title}</h4>
                          <p className="text-[15px] text-brand-ink/70 font-sans font-medium leading-relaxed">
                            <span className="block font-bold text-[11px] text-brand-ink uppercase mb-1 opacity-40">Зачем:</span>
                            {item.why}
                          </p>
                          <div className="pt-4 flex items-center gap-3">
                            <div className="h-px flex-1 bg-brand-gold/10"></div>
                            <span className="text-[14px] sm:text-[15px] font-bold text-emerald-600 uppercase font-sans">✨ {item.gives}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-12 pb-20">
                  <div className="flex items-center gap-3 sm:gap-6 border-b border-brand-gold/10 pb-4 sm:pb-6 mb-6 sm:mb-8">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-ink text-brand-cream text-[16px] sm:text-[18px] font-serif font-bold">02</span>
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
                          <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">{p.phase}</span>
                          <h4 className="text-lg font-serif font-bold text-brand-ink">{p.title}</h4>
                        </div>
                        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                          {p.items.map((item, j) => (
                            <li key={j} className="text-[15px] text-brand-ink/60 font-sans flex items-center gap-2">
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
                  <div className="flex items-center gap-3 sm:gap-6 border-b border-brand-gold/10 pb-4 sm:pb-6 mb-6 sm:mb-8">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-ink text-brand-cream text-[16px] sm:text-[18px] font-serif font-bold">03</span>
                    <h3 className="text-xl font-serif font-bold text-brand-ink uppercase tracking-tight">Технологический стек и Design System</h3>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-brand-ink rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 text-brand-cream space-y-4 sm:space-y-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-gold/20 transition-all duration-700"></div>
                        <div className="space-y-2 relative">
                          <h3 className="font-bold text-brand-gold uppercase text-[11px] tracking-widest">Core Architecture</h3>
                          <p className="font-serif font-bold text-3xl text-brand-cream">Next.js 15 + React 19</p>
                          <p className="text-[15px] text-brand-gold/80 italic">Headless E-commerce Framework</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 pt-4">
                          {[
                            { label: "Logic", val: "TypeScript" },
                            { label: "Style", val: "Vanilla CSS" },
                            { label: "Data", val: "PostgreSQL" },
                            { label: "CMS", val: "Sanity / Contentful" },
                          ].map((t, i) => (
                            <div key={i} className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                              <span className="block text-[11px] text-brand-gold uppercase mb-1 opacity-60 font-sans">{t.label}</span>
                              <span className="block text-xs font-bold font-sans tracking-tight">{t.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-gold/10 bg-white/40 space-y-4 sm:space-y-6">
                        <h3 className="text-[11px] font-bold text-brand-gold uppercase tracking-widest">Typography Strategy</h3>
                        <div className="grid sm:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <p className="font-serif font-bold text-3xl text-brand-ink">Cormorant Garamond</p>
                            <p className="text-[10px] sm:text-[11px] text-brand-gold font-bold uppercase tracking-[0.2em] font-sans">Primary Serif · Headlines</p>
                            <p className="text-[14px] leading-relaxed text-brand-ink/70 font-sans">Классическая антиква, транслирующая эстетику высокой моды и премиальности. Ее элегантные засечки и утонченный контраст штрихов создают ощущение ручной работы, традиций и эксклюзивности — идеальное попадание в характер дорогого подарочного бренда.</p>
                          </div>
                          <div className="space-y-3">
                            <p className="font-sans font-bold text-3xl text-brand-ink tracking-tight">Jost</p>
                            <p className="text-[10px] sm:text-[11px] text-brand-gold font-bold uppercase tracking-[0.2em] font-sans">Primary Sans · Body & UI</p>
                            <p className="text-[14px] leading-relaxed text-brand-ink/70 font-sans">Современный геометрический гротеск, вдохновленный немецким дизайном 1920-х (Баухаус). Он уравновешивает историчность Cormorant Garamond своей чистотой, обеспечивая идеальную читаемость интерфейсов, кнопок и ценников на любых экранах.</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-gold/10 bg-white/40 space-y-4 sm:space-y-6">
                        <h3 className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Color Palette</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
                          {[
                            { hex: "#C5A037", name: "Brand Gold" },
                            { hex: "#E0CFA1", name: "Light Gold" },
                            { hex: "#2C1A14", name: "Dark Brown" },
                            { hex: "#F5F2ED", name: "Cream Base" },
                            { hex: "#8B1F2C", name: "Accent Red" },
                            { hex: "#1A1510", name: "Dark Base" },
                            { hex: "#FAF6EF", name: "Light Base" },
                          ].map((c, i) => (
                            <div key={i} className="flex flex-col gap-3 group">
                              <div className="h-16 w-full rounded-2xl shadow-inner ring-1 ring-black/5 transition-transform group-hover:scale-[1.03]" style={{ backgroundColor: c.hex }}></div>
                              <div>
                                <p className="text-[11px] font-bold text-brand-ink/90 whitespace-nowrap">{c.name}</p>
                                <p className="text-[10px] font-mono text-brand-ink/40 tracking-widest uppercase">
                                  {c.hex}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-brand-gold/10 bg-white divide-y divide-brand-gold/5 shadow-sm">
                        <h4 className="pb-4 text-[13px] font-serif font-bold text-brand-ink uppercase tracking-widest">Key Infrastructure</h4>
                        <div className="py-4 space-y-1">
                          <p className="font-serif font-bold text-brand-ink text-lg">Stripe / Adyen</p>
                          <p className="text-[11px] text-brand-ink/50 uppercase">EU Payments Standard</p>
                        </div>
                        <div className="py-4 space-y-1">
                          <p className="font-serif font-bold text-brand-ink text-lg">Algolia AI</p>
                          <p className="text-[11px] text-brand-ink/50 uppercase">Predictive Search Engine</p>
                        </div>
                        <div className="py-4 space-y-1">
                          <p className="font-serif font-bold text-brand-ink text-lg">Vercel Edge</p>
                          <p className="text-[11px] text-brand-ink/50 uppercase">Global Content Delivery</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="pt-16 border-t border-brand-gold/10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-ink text-brand-cream text-[16px] sm:text-[18px] font-serif font-bold">04</span>
                    <h3 className="text-xl font-serif font-bold text-brand-ink uppercase tracking-tight">Бюджет, сроки и команда</h3>
                  </div>

                  <div className="bg-brand-ink rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-16 text-brand-cream space-y-8 sm:space-y-16 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-brand-gold/20 transition-all duration-1000"></div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 relative">
                      {[
                        { label: "Общий бюджет", val: "€ 29 040" },
                        { label: "Сроки проекта", val: "22 недели" },
                        { label: "Трудозатраты", val: "1320 часов" },
                        { label: "Команда", val: "3 специалиста" },
                      ].map((stat, idx) => (
                        <div key={idx} className="space-y-2">
                          <span className="block text-[11px] text-brand-gold uppercase tracking-widest font-sans">{stat.label}</span>
                          <span className="block text-2xl font-serif font-bold">{stat.val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 relative">
                      {[
                        {
                          role: "Разработчик 1 (Frontend)",
                          hours: "512ч",
                          price: "€ 11 264",
                          tasks: [
                            "Next.js, UI, Design System",
                            "Анимации, Карточки, Поиск",
                            "B2B Dashboard, Quick Order",
                            "Мультиязычность, i18n UX"
                          ]
                        },
                        {
                          role: "Разработчик 2 (Backend)",
                          hours: "512ч",
                          price: "€ 11 264",
                          tasks: [
                            "NestJS API, Sanity CMS",
                            "Checkout API, Algolia",
                            "B2B API, PDF Инвойсы",
                            "Интеграции, деплой"
                          ]
                        },
                        {
                          role: "UI/UX Дизайнер",
                          hours: "296ч",
                          price: "€ 6 512",
                          tasks: [
                            "Figma Kit, Design Tokens",
                            "Motion-design, Checkout UI",
                            "B2B Dashboard дизайн",
                            "Locale banner, Email"
                          ]
                        }
                      ].map((member, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 hover:bg-white/10 transition-colors">
                          <div className="space-y-1 border-b border-white/10 pb-4">
                            <h4 className="font-serif font-bold text-lg text-brand-gold">{member.role}</h4>
                            <div className="flex gap-4 text-xs font-sans tracking-widest uppercase opacity-70">
                              <span>{member.hours}</span>
                              <span>{member.price}</span>
                            </div>
                          </div>
                          <ul className="space-y-3">
                            {member.tasks.map((task, tIdx) => (
                              <li key={tIdx} className="text-[15px] font-sans flex items-start gap-3 opacity-80">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0"></span>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="pt-20 border-t border-brand-gold/10 space-y-10">
                  <div className="flex items-center gap-3 sm:gap-6 border-b border-brand-gold/10 pb-4 sm:pb-6 mb-6 sm:mb-8">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-gold text-brand-cream text-[16px] sm:text-[18px] font-serif font-bold">05</span>
                    <h3 className="text-xl font-serif font-bold text-brand-ink">Комментарии к проекту</h3>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-white/40 border border-brand-gold/20 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 space-y-4 sm:space-y-6">
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
                        className="w-full bg-transparent border-none focus:ring-0 text-[15px] font-sans resize-none"
                      />
                      <button
                        onClick={(e) => {
                          const tex = e.currentTarget.parentElement?.querySelector('textarea');
                          if (tex && tex.value.trim()) {
                            addComment(tex.value);
                            tex.value = "";
                          }
                        }}
                        className="bg-brand-ink text-brand-cream px-6 py-2 rounded-xl text-[13px] font-bold font-sans"
                      >
                        Отправить
                      </button>
                    </div>
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 text-[11px] font-bold text-brand-ink uppercase font-sans">
                              <span>{comment.author}</span>
                              <span className="opacity-30">{comment.date}</span>
                            </div>
                            <div className="bg-white/80 p-5 rounded-2xl border border-brand-gold/5 text-[15px] font-sans">
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

        <footer className="mt-10 sm:mt-20 border-t border-brand-gold/10 pt-8 sm:pt-16 pb-8 sm:pb-12 px-3 sm:px-12 space-y-8 sm:space-y-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <span className="block text-xs font-bold text-brand-gold uppercase tracking-[0.3em] font-sans">Project</span>
              <p className="text-2xl font-serif font-bold text-brand-ink uppercase">Premium Gifts</p>
            </div>
            <div className="space-y-6">
              <span className="block text-xs font-bold text-brand-gold uppercase tracking-[0.3em] font-sans">Contact</span>
              <p className="text-[15px] text-brand-ink font-sans">alekseevpo@gmail.com</p>
            </div>
            <div className="space-y-6">
              <span className="block text-xs font-bold text-brand-gold uppercase tracking-[0.3em] font-sans">EU Compliance</span>
              <p className="text-[13px] text-brand-ink/50 font-sans">GDPR Compliant</p>
            </div>
            <div className="space-y-6">
              <span className="block text-xs font-bold text-brand-gold uppercase tracking-[0.3em] font-sans">Status</span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-600 border border-emerald-100 uppercase font-sans">
                Draft Reviewed
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-brand-gold/10 text-[13px] text-brand-ink/50 font-sans space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4">
              <div className="space-y-3 max-w-2xl text-justify sm:text-left">
                <p className="font-bold text-brand-ink/70">ПРАВОВОЕ УВЕДОМЛЕНИЕ</p>
                <p>Настоящий документ является интеллектуальной собственностью автора и охраняется законодательством ЕС. Использование материалов, архитектурных решений и дизайн-спецификаций в коммерческих целях возможно только с письменного согласия автора.</p>
                <p>Охраняется в соответствии с: Директива ЕС 2001/29/EC (InfoSoc) · Регламент ЕС 2016/679 (GDPR) · Директива ЕС 2016/943 (Trade Secrets) · Бернская конвенция (WIPO).</p>
                <p>Документ является исключительно техническим предложением и не порождает юридических обязательств на оказание услуг без подписания отдельного договора.</p>
              </div>
              <div className="space-y-3 md:text-right">
                <p>© 2026 Алексеев Павел Олегович / Селенит</p>
                <p>Все права защищены в ЕС и международно.</p>
                <p>Madrid, Getafe, Calle del Escano 36</p>
                <p>Споры — в судах компетентной юрисдикции Мадрида, Испания.</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Glass Cart Button */}
        <button
          ref={cartRef}
          type="button"
          className="fixed top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5 z-50 group hover:bg-white/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <svg className="w-5 h-5 text-brand-ink/80 group-hover:text-brand-ink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cartCount > 0 && (
            <span className={`relative flex items-center justify-center w-5 h-5 rounded-full bg-brand-gold text-white text-[10px] font-bold font-sans shadow-sm transition-transform duration-300 ${cartBounce ? 'scale-150' : 'scale-100'}`}>
              {cartCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-ink text-brand-cream shadow-2xl z-50 transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-75 pointer-events-none'}`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
