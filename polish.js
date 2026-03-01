const fs = require('fs');

try {
  let s = fs.readFileSync('app/page.tsx', 'utf-8');

  // 1. Make the central document box pristine white with soft gold shadow
  s = s.replace(
    /className="mt-6 rounded-\[2\.5rem\] border border-brand-gold\/20 bg-brand-cream shadow-sm overflow-hidden"/g,
    'className="mt-6 rounded-[2.5rem] border border-brand-gold/15 bg-white shadow-2xl shadow-brand-gold/10 overflow-hidden"'
  );

  // 2. Make tabs more editorial (underline style instead of pills)
  // This is tricky with regex, let's target the wrapper and the buttons
  s = s.replace(
    /className="flex flex-wrap items-center gap-1 border-b border-brand-gold\/10 p-2 sm:p-3"/g,
    'className="flex flex-wrap items-center gap-8 border-b border-brand-gold/15 px-6 pt-6 sm:px-10 shrink-0"'
  );
  
  // Tab 1 Strategy
  s = s.replace(
    /className=\{\s*classNames\(\s*"rounded-xl px-3 py-2 text-\[13px\] font-medium transition sm:px-4 sm:text-\[15px\] font-sans",\s*tab === "strategy"\s*\?\s*"bg-brand-ink text-brand-cream shadow-lg"\s*:\s*"text-brand-ink\/60 hover:bg-brand-gold\/10"\s*\)\s*\}/g,
    `className={classNames(
                "pb-4 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.15em] transition font-sans border-b-2 relative top-[2px]",
                tab === "strategy"
                  ? "border-brand-ink text-brand-ink"
                  : "border-transparent text-brand-ink/40 hover:text-brand-ink/70 hover:border-brand-gold/30"
              )}`
  );

  // Tab 2 Spec
  s = s.replace(
    /className=\{\s*classNames\(\s*"rounded-xl px-3 py-2 text-\[13px\] font-medium transition sm:px-4 sm:text-\[15px\] font-sans",\s*tab === "spec"\s*\?\s*"bg-brand-ink text-brand-cream shadow-lg"\s*:\s*"text-brand-ink\/60 hover:bg-brand-gold\/10"\s*\)\s*\}/g,
    `className={classNames(
                "pb-4 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.15em] transition font-sans border-b-2 relative top-[2px]",
                tab === "spec"
                  ? "border-brand-ink text-brand-ink"
                  : "border-transparent text-brand-ink/40 hover:text-brand-ink/70 hover:border-brand-gold/30"
              )}`
  );

  // 3. Make the main wrapper padding bigger to breathe
  s = s.replace(/className="p-4 sm:p-6"/g, 'className="p-6 sm:p-10 lg:p-14"');

  // 4. Audit cards - make them elegant outlines
  s = s.replace(/bg-white\/60 backdrop-blur-sm border border-brand-gold\/10 rounded-2xl p-5 shadow-sm space-y-3/g, 'bg-transparent border border-brand-gold/20 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm');
  
  // 5. Spec cards (Numbers container)
  s = s.replace(/bg-white\/40 backdrop-blur-sm border border-brand-gold\/10 rounded-3xl p-6 space-y-2/g, 'bg-white border sm:border-transparent border-brand-gold/10 rounded-3xl p-6 space-y-2 hover:border-brand-gold/20 hover:bg-zinc-50/50');

  // 6. Section Titles layout
  s = s.replace(/className="flex items-center gap-4"/g, 'className="flex items-center gap-6 border-b border-brand-gold/10 pb-6 mb-8"');

  // 7. Make header text lighter / elegant
  s = s.replace(/text-2xl font-serif font-bold tracking-tight sm:text-3xl text-brand-ink uppercase/g, 'text-3xl font-serif font-bold tracking-tight sm:text-4xl text-brand-ink uppercase');

  // 8. Increase budget block gap and presentation
  s = s.replace(/bg-brand-ink rounded-\[2\.5rem\] p-8 sm:p-12 text-brand-cream space-y-12 shadow-2xl/g, 'bg-brand-ink rounded-[2.5rem] p-10 sm:p-16 text-brand-cream space-y-16 shadow-2xl');

  // 9. Change grid gaps for sections
  s = s.replace(/grid sm:grid-cols-2 gap-8/g, 'grid sm:grid-cols-2 gap-10');
  
  fs.writeFileSync('app/page.tsx', s);
  console.log("Success");
} catch(e) {
  console.log("Error:", e);
}
