import { useEffect, useState } from 'react';

const FORMULA = '=AUTOMATISERA(det_du_gör_för_hand)';

/** Hero-bilden: ett litet kalkylark som visar före och efter. Formeln skrivs ut en gång vid sidladdning. */
export function SheetDemo() {
  const [shown, setShown] = useState(FORMULA);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    setShown('');
    const id = window.setInterval(() => {
      i += 1;
      setShown(FORMULA.slice(0, i));
      if (i >= FORMULA.length) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, []);

  return (
    <figure className="sheet" aria-label="Exempel: en uppgift som tog fem timmar i veckan tar tio minuter efter automatisering">
      <div className="sheet-fx" aria-hidden="true">
        <span className="sheet-ref">D4</span>
        <span className="sheet-f">fx</span>
        <span className="sheet-formula">{shown}</span>
      </div>
      <table className="sheet-grid" aria-hidden="true">
        <thead>
          <tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr>
        </thead>
        <tbody>
          <tr><th>1</th><td className="h">Uppgift</td><td className="h">Hur</td><td className="h num">Före</td><td className="h num">Efter</td></tr>
          <tr><th>2</th><td>Månadsrapport</td><td>Kopiera för hand</td><td className="num">4 h</td><td className="num">5 min</td></tr>
          <tr><th>3</th><td>Anmälningar</td><td>Mejl och lappar</td><td className="num">3 h</td><td className="num">0 min</td></tr>
          <tr><th>4</th><td>Påminnelser</td><td>Skickas manuellt</td><td className="num">1 h</td><td className="num sel">0 min</td></tr>
          <tr><th>5</th><td className="h">Per vecka</td><td></td><td className="num h">8 h</td><td className="num h">5 min</td></tr>
        </tbody>
      </table>
    </figure>
  );
}
