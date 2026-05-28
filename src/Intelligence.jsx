import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const T = {
  bg: "#0d0e13",
  txt: "rgba(255,255,255,.93)",
  txt2: "rgba(255,255,255,.72)",
  txt3: "rgba(255,255,255,.44)",
  txt4: "rgba(255,255,255,.28)",
  blue: "#7aa8ff",
  teal: "#33ddc8",
  red: "#ff6060",
  amber: "#f5a623",
  green: "#4ade80",
};

const CARD = {
  background: "radial-gradient(ellipse 65% 55% at 12% 0%, rgba(255,255,255,.08) 0%, transparent 65%), radial-gradient(ellipse 55% 45% at 88% 100%, rgba(255,255,255,.05) 0%, transparent 60%)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,.10)",
  borderRadius: 16,
  boxShadow: "0 4px 6px rgba(0,0,0,.2), 0 12px 32px rgba(0,0,0,.45), 0 24px 48px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.22), inset 0 -1px 0 rgba(255,255,255,.04), inset 1px 0 0 rgba(255,255,255,.06), inset -1px 0 0 rgba(255,255,255,.03)",
  position: "relative",
  overflow: "hidden",
};

function Grain() {
  const r = useRef(null);
  useEffect(() => {
    const c = r.current; if (!c) return;
    c.width = 1400; c.height = 900;
    const ctx = c.getContext("2d"), d = ctx.createImageData(1400, 900);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = (Math.random() * 18 + 4) | 0;
    }
    ctx.putImageData(d, 0, 0);
  }, []);
  return <canvas ref={r} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

function Sheen({ color }) {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 1,
      background: color
        ? `linear-gradient(90deg,transparent,${color}66 30%,${color}99 50%,${color}66 70%,transparent)`
        : "linear-gradient(90deg,transparent,rgba(255,255,255,.22) 30%,rgba(255,255,255,.32) 50%,rgba(255,255,255,.22) 70%,transparent)",
      zIndex: 2, pointerEvents: "none"
    }} />
  );
}

function SecHdr({ label, right }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.55)" }}>{label}</span>
        {right && <span style={{ fontSize: 9, color: T.txt3, letterSpacing: ".06em" }}>{right}</span>}
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg,rgba(255,255,255,.38) 0%,rgba(255,255,255,.22) 35%,rgba(255,255,255,.08) 65%,transparent 100%)" }} />
    </div>
  );
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(28px)",
      transition: `opacity .5s ${delay}ms ease, transform .5s ${delay}ms cubic-bezier(.34,1.2,.64,1)`
    }}>
      {children}
    </div>
  );
}

function SlackBtn({ id }) {
  const [sent, setSent] = useState(false);
  const [date, setDate] = useState("");
  const handleClick = () => {
    if (sent) return;
    setSent(true);
    const n = new Date();
    setDate(`${n.getMonth() + 1}/${n.getDate()}/${n.getFullYear()}`);
  };
  return (
    <div>
      <button onClick={handleClick} style={{
        display: "flex", alignItems: "center", gap: 5,
        background: sent ? "rgba(245,166,35,.10)" : "rgba(255,255,255,.06)",
        border: sent ? "1px solid rgba(245,166,35,.28)" : "1px solid rgba(255,255,255,.12)",
        borderRadius: 8, padding: "4px 11px", cursor: "pointer",
        fontFamily: "Jost,sans-serif", fontSize: 9, fontWeight: 400,
        color: sent ? T.amber : "rgba(255,255,255,.6)",
        letterSpacing: ".05em", transition: "all .2s",
      }}>
        <span>💬</span> {sent ? "Sent" : "Slack"}
      </button>
      {sent && <div style={{ fontSize: 8, color: T.amber, marginTop: 4, fontStyle: "italic" }}>Slack sent {date}</div>}
    </div>
  );
}

function RefreshBtn() {
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);
  const handle = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFlash(true);
      setTimeout(() => setFlash(false), 1200);
    }, 2800);
  };
  return (
    <button onClick={handle} style={{
      display: "flex", alignItems: "center", gap: 6,
      marginTop: 10, padding: "6px 13px",
      background: flash ? "rgba(45,212,180,.22)" : "rgba(45,212,180,.09)",
      border: flash ? "1px solid rgba(45,212,180,.5)" : "1px solid rgba(45,212,180,.22)",
      borderRadius: 8, cursor: "pointer",
      fontFamily: "Jost,sans-serif", fontSize: 9, fontWeight: 400,
      color: T.teal, letterSpacing: ".07em",
      transition: "all .3s", width: "fit-content",
    }}>
      <span style={{ display: "inline-block", animation: loading ? "spin 1s linear infinite" : "none" }}>↻</span>
      <span>{loading ? "Refreshing..." : "Refresh Intel"}</span>
    </button>
  );
}

const tag = (txt, color, bg, border) => (
  <span key={txt} style={{
    fontSize: 9, fontWeight: 500, letterSpacing: ".08em",
    padding: "3px 9px", borderRadius: 20,
    color, background: bg, border: `1px solid ${border}`,
    fontFamily: "Jost,sans-serif",
  }}>{txt}</span>
);

export default function Intelligence() {
  const navigate = useNavigate();
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setClock(n.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Jost,system-ui,sans-serif", color: T.txt, position: "relative", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 5px rgba(74,222,128,.7);}50%{opacity:.4;box-shadow:0 0 2px rgba(74,222,128,.3);}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fillBar{from{width:0}to{width:28%}}
        @keyframes drift1{0%,100%{transform:translate(0,0)}40%{transform:translate(22px,-16px)}70%{transform:translate(-12px,18px)}}
        @keyframes drift2{0%,100%{transform:translate(0,0)}35%{transform:translate(-18px,22px)}65%{transform:translate(16px,-12px)}}
        @keyframes drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(14px,16px)}}
      `}</style>

      {/* BG atmosphere — exact match to ja-enterprise */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 660, height: 520, top: "-10%", left: "-8%", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(24,60,200,.16),transparent 68%)", filter: "blur(80px)", animation: "drift1 28s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 540, height: 540, top: "18%", right: "-10%", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(90,30,190,.12),transparent 68%)", filter: "blur(80px)", animation: "drift2 34s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 460, height: 380, bottom: "-8%", left: "28%", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(10,130,110,.09),transparent 68%)", filter: "blur(80px)", animation: "drift3 40s ease-in-out infinite" }} />
      </div>
      <Grain />

      {/* NAV — exact match */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", background: "rgba(10,11,16,.78)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.1)", boxShadow: "0 1px 0 rgba(255,255,255,.07),0 8px 24px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.08)" }}>
        <div style={{ fontFamily: "Georgia,serif", fontSize: 15.5, fontWeight: 400, letterSpacing: ".04em" }}>
          Joseph <span style={{ color: "rgba(255,255,255,.2)", margin: "0 6px" }}>/</span> Amari
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate("/")} style={{
            fontFamily: "Jost,sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: ".1em",
            textTransform: "uppercase", color: "rgba(255,255,255,.38)", background: "none",
            border: "none", cursor: "pointer", padding: "5px 16px", borderRadius: 100,
            transition: "color .2s",
          }}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 100, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)" }}>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.96)" }}>Enterprise Intelligence</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: T.green, letterSpacing: ".08em", fontWeight: 500 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, animation: "pulse 2s ease-in-out infinite" }} />
            LIVE
          </div>
          <div style={{ fontSize: 9.5, color: T.txt3, letterSpacing: ".04em", fontFamily: "monospace" }}>{clock}</div>
        </div>
      </div>

      {/* 3-COL LAYOUT */}
      <div style={{ position: "relative", zIndex: 1, paddingTop: 52, display: "grid", gridTemplateColumns: "220px 1fr 268px", height: "calc(100vh - 52px)", overflow: "hidden" }}>

        {/* ── LEFT COL ── */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,.07)", padding: "20px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>

          <Reveal delay={0}>
            <div style={{ paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,.07)" }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 21, fontWeight: 300, lineHeight: 1.05, marginBottom: 5 }}>Marriott<br />International</div>
              <div style={{ fontSize: 10, color: T.txt3, letterSpacing: ".04em", lineHeight: 1.7 }}>marriott.com · Global Hospitality<br />Bethesda, MD · NYSE: MAR<br />Est. 1927 · 30 Brands</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {tag("HOSPITALITY", T.blue, "rgba(100,145,255,.12)", "rgba(100,145,255,.22)")}
                {tag("FRANCHISE", T.teal, "rgba(45,212,180,.10)", "rgba(45,212,180,.2)")}
                {tag("🔥 HOT", T.red, "rgba(255,96,96,.12)", "rgba(255,96,96,.2)")}
                {tag("★ IDEAL ICP", T.green, "rgba(74,222,128,.10)", "rgba(74,222,128,.2)")}
              </div>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <SecHdr label="Key Metrics" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
              {[["8,785", T.teal, "Properties"], ["141", T.blue, "Countries"], ["~418k", T.txt, "Employees"], ["$23.7B", T.green, "Revenue '24"]].map(([v, c, l]) => (
                <div key={l} style={{ padding: "8px 10px", background: "radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.06) 0%,transparent 65%)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10 }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 18, fontWeight: 300, color: c, lineHeight: 1, marginBottom: 3 }}>{v}</div>
                  <div style={{ fontSize: 8.5, color: T.txt3, letterSpacing: ".08em", textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
              <div style={{ gridColumn: "span 2", padding: "8px 10px", background: "radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.06) 0%,transparent 65%)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10 }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 13, fontWeight: 300, color: T.amber, lineHeight: 1, marginBottom: 3 }}>2022 Pilot</div>
                <div style={{ fontSize: 8.5, color: T.txt3, letterSpacing: ".08em", textTransform: "uppercase" }}>Prior Square Eval — Courtyard NYC/BOS</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SecHdr label="F&B Stack" />
            {[["Oracle MICROS", "CURRENT — EOL", T.red, "rgba(255,96,96,.12)", "rgba(255,96,96,.2)"], ["Agilysys POS", "CURRENT", T.txt3, "rgba(255,255,255,.05)", "rgba(255,255,255,.08)"], ["Square (2022)", "PRIOR EVAL", T.amber, "rgba(245,166,35,.10)", "rgba(245,166,35,.18)"], ["Opera Cloud PMS", "INTEG OPP", T.green, "rgba(74,222,128,.08)", "rgba(74,222,128,.15)"]].map(([n, s, c, bg, b]) => (
              <div key={n} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 9px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 7, marginBottom: 4 }}>
                <span style={{ fontSize: 10.5, color: T.txt, fontWeight: 400 }}>{n}</span>
                <span style={{ fontSize: 8, fontWeight: 500, letterSpacing: ".06em", padding: "2px 7px", borderRadius: 3, color: c, background: bg, border: `1px solid ${b}` }}>{s}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={180}>
            <SecHdr label="Square Fit" />
            {[["✓", T.green, "Enterprise KDS"], ["✓", T.green, "Multi-location Menus"], ["✓", T.green, "Open APIs → Opera Cloud"], ["✓", T.green, "Restaurants Premium"], ["⚠", T.amber, "Franchise POS Variance"]].map(([icon, c, txt]) => (
              <div key={txt} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 0", fontSize: 10.5, color: T.txt2, borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                <span style={{ fontSize: 9, color: c, width: 14, flexShrink: 0 }}>{icon}</span>{txt}
              </div>
            ))}
          </Reveal>

          <Reveal delay={240}>
            <SecHdr label="SFDC" />
            {[["Stage", "Stage 2 — Discovery", T.blue], ["Owner", "Joey Amari", T.txt], ["Re-engage", "Q2 2025", T.txt], ["Record", null, T.blue]].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 10px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 7, marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: T.txt3, letterSpacing: ".06em" }}>{l}</span>
                {v ? <span style={{ fontSize: 10.5, color: c, fontWeight: 400 }}>{v}</span> : <a href="#" style={{ fontSize: 10.5, color: T.blue, textDecoration: "none" }}>Open →</a>}
              </div>
            ))}
            <div style={{ height: 3, background: "rgba(255,255,255,.08)", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "28%", background: `linear-gradient(90deg,${T.blue},${T.teal})`, borderRadius: 2, animation: "fillBar .8s .4s ease both" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {["Prospect", "Discovery", "Eval", "Negotiate", "Close"].map((s, i) => (
                <span key={s} style={{ fontSize: 7.5, color: i === 1 ? T.blue : T.txt4, letterSpacing: ".06em" }}>{s}</span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── MAIN COL ── */}
        <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Strategic Overview */}
          <Reveal delay={40}>
            <div style={{ ...CARD, padding: 16 }}>
              <Sheen />
              <SecHdr label="Strategic Overview" />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 300, lineHeight: 1.05 }}>Marriott International</div>
                  <div style={{ fontSize: 10, color: T.txt3, letterSpacing: ".03em", marginTop: 3 }}>Global Hospitality · Est. 1927 · 30 brands · 141 countries · NYSE: MAR</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-end" }}>
                  {tag("HOSPITALITY", T.blue, "rgba(100,145,255,.12)", "rgba(100,145,255,.22)")}
                  {tag("🔥 ACTIVE SIGNAL", T.red, "rgba(255,96,96,.12)", "rgba(255,96,96,.2)")}
                  {tag("★ IDEAL ICP", T.green, "rgba(74,222,128,.10)", "rgba(74,222,128,.2)")}
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: T.txt2, lineHeight: 1.68, marginBottom: 12, fontWeight: 300 }}>World's largest hotel company. Hybrid franchise-managed model with complex F&B spanning full-service restaurants, bars, banquet & catering at every property tier. 2022 Square pilot in Courtyard NYC/Boston proved unit-level performance — blocked by enterprise infrastructure gaps that no longer exist. Oracle MICROS EOL pressure and a new CTO with a fresh rationalization mandate create a rare re-entry window. The 2022 no was not his decision.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1, background: "rgba(255,255,255,.07)", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                {[["8,785", "Properties"], ["30", "Brands"], ["$23.7B", "Revenue"], ["~418k", "Employees"], ["2022", "Prior Eval"]].map(([v, l]) => (
                  <div key={l} style={{ background: "rgba(13,14,19,.7)", padding: "9px 12px" }}>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 16, fontWeight: 300, color: T.txt, lineHeight: 1, marginBottom: 2 }}>{v}</div>
                    <div style={{ fontSize: 8, color: T.txt3, letterSpacing: ".08em", textTransform: "uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[["Re-Engage", "Q2 2025"], ["Pilot Target", "Q1 2026"], ["Growth", "+6% RevPAR YoY"], ["Parent", "Public — MAR"]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 8.5, color: T.txt3, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 11, color: T.txt, fontWeight: 400 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Ownership */}
          <Reveal delay={100}>
            <SecHdr label="Ownership & Power Structure" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
              {[
                { name: "Anthony Capuano", href: "https://www.linkedin.com/in/anthonycapuano/", role: "President & CEO — Economic Buyer", sig: "HIGH", sigColor: T.red, sigBg: "rgba(255,96,96,.14)", border: T.red, body: "Driving tech modernization across the portfolio. F&B digital transformation is board-mandated priority for 2025. Ultimate decision authority on enterprise vendor relationships.", action: "→ Economic buyer. Board-level F&B tech mandate." },
                { name: "Drew Pinto", href: "#", role: "EVP & Global CTO — Tech Decision Maker", sig: "HIGH", sigColor: T.red, sigBg: "rgba(255,96,96,.14)", border: T.red, body: "Oversees all tech across 8,785 properties. Evaluated Square in 2022 — relationship exists. Rationalization mandate — the 2022 no was not his.", action: "→ Primary re-engagement. He knows Square. Clean slate." },
                { name: "Vanguard Group", href: "#", role: "Institutional — 8.9% Stake", sig: "INVESTOR", sigColor: T.blue, sigBg: "rgba(100,145,255,.13)", border: T.blue, body: "Largest institutional holder. Constant margin improvement pressure. Square's unit economics maps directly to shareholder mandate.", action: "→ Efficiency narrative. Per-property TCO reduction." },
              ].map(o => (
                <div key={o.name} style={{ padding: "12px 13px", background: "radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.06) 0%,transparent 65%)", border: `1px solid rgba(255,255,255,.1)`, borderLeft: `2px solid ${o.border}`, borderRadius: 12, position: "relative", transition: "transform .25s" }}>
                  <div style={{ position: "absolute", top: 10, right: 10, fontSize: 8, fontWeight: 500, letterSpacing: ".08em", padding: "2px 7px", borderRadius: 3, color: o.sigColor, background: o.sigBg }}>{o.sig}</div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 13, fontWeight: 300, marginBottom: 2 }}><a href={o.href} target="_blank" rel="noreferrer" style={{ color: T.txt, textDecoration: "none" }}>{o.name}</a></div>
                  <div style={{ fontSize: 9.5, color: T.txt3, fontStyle: "italic", marginBottom: 7, letterSpacing: ".02em" }}>{o.role}</div>
                  <div style={{ fontSize: 10.5, color: T.txt2, lineHeight: 1.58 }}>{o.body}</div>
                  <div style={{ marginTop: 7, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,.06)", fontSize: 9.5, color: T.teal, fontStyle: "italic" }}>{o.action}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Exec Leadership */}
          <Reveal delay={160}>
            <SecHdr label="Executive Leadership" />
            {[
              { name: "Anthony Capuano", href: "https://www.linkedin.com/in/anthonycapuano/", title: "President & CEO", note: "F&B modernization = top 2025 capex priority. Board-level digital mandate.", badge: "Economic Buyer", bc: T.blue, bb: "rgba(100,145,255,.12)", bbr: "rgba(100,145,255,.22)" },
              { name: "Drew Pinto", href: "#", title: "EVP & Global CTO", note: "Evaluated Square in 2022. Re-engage on enterprise deployment model. 2022 no was not his decision.", badge: "Tech Buyer", bc: T.teal, bb: "rgba(45,212,180,.10)", bbr: "rgba(45,212,180,.2)" },
              { name: "Leeny Oberg", href: "#", title: "EVP & CFO", note: "Controls budget. Lead with per-property TCO reduction and Square ↔ NetSuite reconciliation story.", badge: "CFO", bc: T.blue, bb: "rgba(100,145,255,.12)", bbr: "rgba(100,145,255,.22)" },
              { name: "VP F&B Americas", href: "#", title: "Active Search — Role Open", note: "Leadership transition. Engage before new exec is fully onboarded — clean slate.", badge: "⚠ Gap", bc: T.red, bb: "rgba(255,96,96,.12)", bbr: "rgba(255,96,96,.2)" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 12px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, marginBottom: 5, transition: "border-color .2s" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 12, fontWeight: 300, marginBottom: 2 }}><a href={e.href} target="_blank" rel="noreferrer" style={{ color: T.txt, textDecoration: "none" }}>{e.name}</a></div>
                  <div style={{ fontSize: 9.5, color: T.txt3, fontStyle: "italic", marginBottom: 4 }}>{e.title}</div>
                  <div style={{ fontSize: 10.5, color: T.txt2, lineHeight: 1.5 }}>{e.note}</div>
                </div>
                <span style={{ fontSize: 8, fontWeight: 500, letterSpacing: ".07em", padding: "2px 8px", borderRadius: 3, whiteSpace: "nowrap", flexShrink: 0, marginTop: 2, color: e.bc, background: e.bb, border: `1px solid ${e.bbr}` }}>{e.badge}</span>
              </div>
            ))}
          </Reveal>

          {/* Discovery + Changed */}
          <Reveal delay={220}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <SecHdr label="Discovery Priorities" />
                {[["01", "Why the 2022 Pilot Stalled", "What specifically blocked — API gaps, multi-brand complexity, or champion loss? Arm with answers before the call."], ["02", "Oracle MICROS Migration Timeline", "Which brands are actively replacing. Urgency level determines the entry point and motion."], ["03", "Franchise vs. Corporate Authority", "Top-down mandate or franchisee-by-franchisee? This determines the entire sales play."], ["04", "PMS + Loyalty Integration Req", "Confirm API coverage for Opera Cloud + Bonvoy. Address the 2022 blocker head-on."]].map(([n, t, b]) => (
                  <div key={n} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 11px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, marginBottom: 5 }}>
                    <div style={{ fontSize: 9, color: T.txt3, flexShrink: 0, width: 16, paddingTop: 2, fontFamily: "monospace" }}>{n}</div>
                    <div>
                      <div style={{ fontFamily: "Georgia,serif", fontSize: 11, fontWeight: 300, marginBottom: 2 }}>{t}</div>
                      <div style={{ fontSize: 10, color: T.txt2, lineHeight: 1.55 }}>{b}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <SecHdr label="What's Changed Since 2022" />
                {[["✓", T.green, "Enterprise KDS live", "— was the #1 gap in 2022 pilot. Now deployed at scale across enterprise accounts."], ["✓", T.green, "Open APIs mature", "— Opera Cloud + Bonvoy integration fully supported. The blocker is gone."], ["✓", T.green, "Multi-brand menu mgmt", "— centralized control with per-location overrides. Solves franchise variance."], ["⚡", T.amber, "MICROS EOL confirmed", "— Oracle announced end-of-life. Active search underway across Marriott brands."], ["→", T.blue, "New CTO in seat 2023", "— Drew Pinto. Rationalization mandate. The 2022 no was not his."]].map(([icon, c, t, b]) => (
                  <div key={t} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "7px 10px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 9, flexShrink: 0, paddingTop: 2, width: 12, color: c }}>{icon}</div>
                    <div style={{ fontSize: 10.5, color: T.txt2, lineHeight: 1.55 }}><strong style={{ color: T.txt, fontWeight: 500 }}>{t}</strong>{b}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Core Thesis */}
          <Reveal delay={280}>
            <div style={{ background: "radial-gradient(ellipse 65% 55% at 12% 0%,rgba(100,145,255,.10) 0%,transparent 65%), radial-gradient(ellipse 55% 45% at 88% 100%,rgba(45,212,180,.06) 0%,transparent 60%)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(100,145,255,.22)", borderRadius: 16, boxShadow: "0 4px 6px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.22)", padding: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(100,145,255,.45),rgba(45,212,180,.3),transparent)" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.teal, boxShadow: "0 0 8px rgba(45,212,180,.8)" }} />
                  <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: T.teal }}>Core Thesis</span>
                </div>
                <span style={{ fontSize: 8.5, color: T.txt3, padding: "2px 8px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 4 }}>⚡ Joey's read</span>
              </div>
              <div style={{ fontSize: 11.5, color: T.txt, lineHeight: 1.72, marginBottom: 10, fontWeight: 300 }}>
                Marriott is a re-engagement play, not a cold pitch. The 2022 Courtyard pilot proved Square works at property level — the blockers were enterprise infrastructure gaps that no longer exist. Oracle MICROS EOL pressure, a new CTO with a fresh mandate, and an open VP F&B seat create a rare simultaneous opening. This is the pitch: <em style={{ color: T.blue }}>"You evaluated us early. Here's what's different."</em> Franchise variance is the only remaining wildcard — determine top-down vs. franchisee motion before committing to a sales play.
              </div>
              <div style={{ fontSize: 8.5, color: T.txt3, lineHeight: 1.65, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,.07)" }}>Synthesized from: Marriott 2024 Annual Report · Q1 2025 Earnings · Drew Pinto LinkedIn (Mar 2025) · Oracle MICROS EOL (Jan 2025) · Square internal pilot data (2022) · Reviewed and framed by Joey Amari</div>
              <RefreshBtn />
            </div>
          </Reveal>

          {/* Pitch Map */}
          <Reveal delay={340}>
            <SecHdr label="Block Ecosystem Pitch Map" />
            {[["▶", "Restaurants Premium", " — Full-service F&B, course mgmt, multi-revenue-center reporting. MICROS replacement at lower TCO."], ["▶", "Enterprise KDS", " — High-volume, multi-station kitchen display. Closes the primary 2022 gap."], ["▶", "Multi-location Menu Mgmt", " — Centralized control with per-location overrides. Solves franchise POS variance."], ["▶", "Open APIs → Opera + Bonvoy", " — Native PMS & loyalty integration. The 2022 blocker is gone."], ["▶", "Square Banking + Payroll", " — Expansion motion post-POS via confirmed NetSuite integration."]].map(([a, t, b]) => (
              <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 10px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 9, color: T.blue, flexShrink: 0, paddingTop: 2, fontFamily: "monospace" }}>{a}</div>
                <div style={{ fontSize: 10.5, color: T.txt2, lineHeight: 1.55 }}><strong style={{ color: T.txt, fontWeight: 500 }}>{t}</strong>{b}</div>
              </div>
            ))}
          </Reveal>
        </div>

        {/* ── RIGHT COL ── */}
        <div style={{ borderLeft: "1px solid rgba(255,255,255,.07)", padding: "20px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Live Signals */}
          <Reveal delay={80}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <SecHdr label="Live Signals" />
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: T.green, letterSpacing: ".08em", fontWeight: 500, marginBottom: 12 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, animation: "pulse 2s ease-in-out infinite" }} />LIVE
              </div>
            </div>
            {[
              ["red", "Oracle MICROS EOL Confirmed", "EOL timeline confirmed for MICROS 3700 across select-service. Marriott brands in active vendor evaluation.", "Hotels & Lodging News · Jan 2025"],
              ["green", "Q1 2025 Earnings — Tech Priority", "Capuano cited \"property-level digital experience\" as top 2025 capex priority. F&B modernization called out in CFO remarks.", "Marriott Q1 2025 Earnings · May 2025"],
              ["amber", "VP F&B Americas — Active Search", "Open role on LinkedIn. Leadership transition in key buyer seat — engage before new exec is fully onboarded.", "LinkedIn Jobs · Mar 2025"],
              ["blue", "Oracle + NetSuite — Confirmed Partners", "Both confirmed Square partners with active Marriott relationships. Dual entry path via Hayley Williams + Gerard Way.", "Square Partner Network · Confirmed"],
              ["green", "2022 Pilot Props — Still Running Square", "NYC/Boston Courtyard properties still active on Square. Internal reference + performance data in SFDC.", "Square Internal · SFDC"],
            ].map(([dot, title, body, meta]) => {
              const dotColors = { red: T.red, green: T.green, amber: T.amber, blue: T.blue };
              return (
                <div key={title} style={{ padding: "9px 11px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, background: dotColors[dot], boxShadow: `0 0 5px ${dotColors[dot]}88` }} />
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 11, fontWeight: 300, color: T.txt, lineHeight: 1.3 }}>{title}</div>
                  </div>
                  <div style={{ fontSize: 10, color: T.txt2, lineHeight: 1.55, paddingLeft: 12 }}>{body}</div>
                  <div style={{ fontSize: 8.5, color: T.txt4, marginTop: 3, paddingLeft: 12, letterSpacing: ".03em" }}>{meta}</div>
                </div>
              );
            })}
          </Reveal>

          {/* Confirmed Partners */}
          <Reveal delay={140}>
            <SecHdr label="Confirmed Partners" />
            {[
              { name: "Oracle", badge: "POS / MICROS", badgeC: T.red, badgeBg: "rgba(255,96,96,.12)", badgeBr: "rgba(255,96,96,.2)", confirmed: true, role: "Enterprise Tech Partner — MICROS + Opera Cloud Integration", body: "Confirmed partner. MICROS EOL creates a joint replacement narrative. Opera Cloud API integration is live — leverage to accelerate Marriott CTO credibility.", action: "→ Use MICROS EOL as shared urgency. Co-sell the migration story.", pm: "Hayley Williams", pmTitle: "Partner Manager, Oracle Hospitality", id: "oracle" },
              { name: "NetSuite", badge: "ERP / FINANCE", badgeC: T.blue, badgeBg: "rgba(100,145,255,.12)", badgeBr: "rgba(100,145,255,.22)", confirmed: true, role: "Enterprise Finance Partner — ERP + Financial Reporting", body: "Marriott runs NetSuite across managed properties. Square ↔ NetSuite integration eliminates manual reconciliation across 8,785 properties.", action: "→ Joint CFO story. Gerard has existing Marriott finance team relationship.", pm: "Gerard Way", pmTitle: "Partner Manager, NetSuite Enterprise", id: "netsuite" },
              { name: "Courtyard GM Network", badge: "CHAMPIONS", badgeC: T.green, badgeBg: "rgba(74,222,128,.10)", badgeBr: "rgba(74,222,128,.18)", confirmed: false, role: "Internal Advocates — 2022 Pilot GMs, NYC + Boston", body: "GMs with live Square performance data. Can advocate upward to Marriott corporate tech team. Re-engage for updated case study and corp referral.", action: "→ Re-engage via Stevie Nicks · Acct Mgr, Hospitality", pm: "Stevie Nicks", pmTitle: "Account Manager, Hospitality", id: "courtyard" },
            ].map(p => (
              <div key={p.name} style={{ padding: "11px 12px", background: "radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.05) 0%,transparent 65%)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, marginBottom: 7 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 2 }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 13, fontWeight: 300, color: T.txt }}>{p.name}</div>
                  <span style={{ fontSize: 8, fontWeight: 500, letterSpacing: ".07em", padding: "2px 7px", borderRadius: 3, color: p.badgeC, background: p.badgeBg, border: `1px solid ${p.badgeBr}` }}>{p.badge}</span>
                </div>
                {p.confirmed && <div style={{ fontSize: 8, color: T.amber, letterSpacing: ".06em", fontWeight: 500, marginBottom: 4 }}>✓ CONFIRMED PARTNER</div>}
                <div style={{ fontSize: 9.5, color: T.txt3, fontStyle: "italic", marginBottom: 6, letterSpacing: ".02em" }}>{p.role}</div>
                <div style={{ fontSize: 10.5, color: T.txt2, lineHeight: 1.58, marginBottom: 6 }}>{p.body}</div>
                <div style={{ fontSize: 9.5, color: T.teal, fontStyle: "italic", marginBottom: 8 }}>{p.action}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 9px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 7 }}>
                  <div>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 11.5, fontWeight: 300, color: T.txt, marginBottom: 1 }}>{p.pm}</div>
                    <div style={{ fontSize: 8.5, color: T.txt3, fontStyle: "italic", letterSpacing: ".02em" }}>{p.pmTitle}</div>
                  </div>
                  <SlackBtn id={p.id} />
                </div>
              </div>
            ))}
          </Reveal>

          {/* Re-engagement Strategy */}
          <Reveal delay={200}>
            <SecHdr label="Re-Engagement Strategy" />
            {[["#1", "Re-engage Drew Pinto Direct", "Cold re-intro with \"What's Changed\" framing. Lead with MICROS pressure. He knows Square — capability update, not a cold pitch."], ["#2", "Activate Oracle Partner Path", "Hayley Williams at Oracle has active Marriott relationship. Co-sell MICROS EOL + Square replacement through the partner channel."], ["#3", "Courtyard GM Referral Loop", "Re-engage pilot GMs via Stevie Nicks. Get updated testimonials and corporate referral intro to Drew Pinto's team."]].map(([n, t, b]) => (
              <div key={n} style={{ padding: "9px 11px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: T.blue, flexShrink: 0 }}>{n}</div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 11, fontWeight: 300, color: T.txt, lineHeight: 1.3 }}>{t}</div>
                </div>
                <div style={{ fontSize: 10, color: T.txt2, lineHeight: 1.55, paddingLeft: 18 }}>{b}</div>
              </div>
            ))}
          </Reveal>

        </div>
      </div>
    </div>
  );
}
