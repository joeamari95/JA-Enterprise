import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Intelligence from "./Intelligence.jsx";

function useInView(threshold = 0.12) {
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

function useIsMobile() {
  const [mob, setMob] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  useEffect(() => {
    const h = () => setMob(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mob;
}

const T = {
  bg:"#0d0e13", txt:"rgba(255,255,255,.93)", txt2:"rgba(255,255,255,.72)",
  txt3:"rgba(255,255,255,.44)", txt4:"rgba(255,255,255,.28)",
  blue:"#7aa8ff", blueG:"rgba(100,145,255,.5)", teal:"#33ddc8", tealG:"rgba(45,212,180,.45)",
};

const CARD = {
  background:"radial-gradient(ellipse 65% 55% at 12% 0%, rgba(255,255,255,.08) 0%, transparent 65%), radial-gradient(ellipse 55% 45% at 88% 100%, rgba(255,255,255,.05) 0%, transparent 60%)",
  backdropFilter:"blur(8px)",
  WebkitBackdropFilter:"blur(8px)",
  border:"1px solid rgba(255,255,255,.1)",
  borderRadius:16,
  boxShadow:"0 4px 6px rgba(0,0,0,.2), 0 12px 32px rgba(0,0,0,.45), 0 24px 48px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.22), inset 0 -1px 0 rgba(255,255,255,.04), inset 1px 0 0 rgba(255,255,255,.06), inset -1px 0 0 rgba(255,255,255,.03)",
  position:"relative", overflow:"hidden",
};

function Grain() {
  const r = useRef(null);
  useEffect(() => {
    const c = r.current; if (!c) return;
    c.width = 1400; c.height = 900;
    const ctx = c.getContext("2d"), d = ctx.createImageData(1400, 900);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      d.data[i] = d.data[i+1] = d.data[i+2] = v;
      d.data[i+3] = (Math.random() * 18 + 4) | 0;
    }
    ctx.putImageData(d, 0, 0);
  }, []);
  return <canvas ref={r} style={{ position:"fixed",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none" }} />;
}

function Sheen({ color }) {
  return (
    <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
      background:color
        ? `linear-gradient(90deg,transparent,${color}66 30%,${color}99 50%,${color}66 70%,transparent)`
        : "linear-gradient(90deg,transparent,rgba(255,255,255,.22) 30%,rgba(255,255,255,.32) 50%,rgba(255,255,255,.22) 70%,transparent)",
      zIndex:2,pointerEvents:"none" }} />
  );
}

function Dot({ achiev }) {
  return <div style={{ width:4,height:4,borderRadius:"50%",flexShrink:0,marginTop:8,background:achiev?T.teal:T.blue,boxShadow:`0 0 5px ${achiev?T.tealG:T.blueG},0 0 12px ${achiev?T.tealG:T.blueG}` }} />;
}

function SecHdr({ label, right }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:9 }}>
        <span style={{ fontSize:9.5,fontWeight:500,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.55)" }}>{label}</span>
        {right && <em style={{ fontSize:9.5,fontWeight:400,letterSpacing:".1em",textTransform:"uppercase",fontStyle:"italic",color:"rgba(255,255,255,.38)" }}>{right}</em>}
      </div>
      <div style={{ height:1,background:"linear-gradient(90deg,rgba(255,255,255,.38) 0%,rgba(255,255,255,.22) 35%,rgba(255,255,255,.08) 65%,transparent 100%)" }} />
    </div>
  );
}

function RoleCard({ role, isMobile, delay = 0 }) {
  const [open, setOpen] = useState(!!role.open);
  const [ref, visible] = useInView(0.08);
  return (
    <div ref={ref} style={{ ...CARD,marginBottom:7,
      opacity:visible?1:0,transform:visible?"none":"translateY(28px)",
      transitionProperty:"opacity,transform,border-color,box-shadow,background",
      transitionDuration:"0.5s,0.5s,.25s,.25s,.25s",
      transitionDelay:`${delay}ms,${delay}ms,0ms,0ms,0ms`,
      transitionTimingFunction:"ease,cubic-bezier(.34,1.2,.64,1),ease,ease,ease" }}>
      <Sheen />
      <div onClick={() => setOpen(!open)} style={{ display:"flex",alignItems:"center",gap:12,padding:isMobile?"13px 16px":"16px 22px",cursor:"pointer",position:"relative",zIndex:3 }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" style={{ flexShrink:0,transition:"transform .2s",transform:open?"rotate(90deg)":"none" }}>
          <path d="M6 4l4 4-4 4"/>
        </svg>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:isMobile?11.5:13,fontWeight:600,color:T.txt }}>{role.title}</div>
          <div style={{ fontSize:isMobile?9.5:10.5,fontWeight:300,color:"rgba(255,255,255,.45)",marginTop:2 }}>{role.meta}</div>
        </div>
        {role.badge && <div style={{ fontSize:8,fontWeight:500,letterSpacing:".09em",textTransform:"uppercase",padding:"3px 10px",borderRadius:100,border:"1px solid rgba(45,212,191,.3)",color:"rgba(45,212,191,.88)",background:"rgba(45,212,191,.07)",whiteSpace:"nowrap" }}>{role.badge}</div>}
      </div>
      {open && (
        <div style={{ padding:isMobile?"0 16px 16px 40px":"0 22px 20px 48px",position:"relative",zIndex:3 }}>
          {role.groups.map((g,gi) => (
            <div key={gi} style={{ marginTop:12 }}>
              <div style={{ fontSize:7.5,fontWeight:500,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.26)",marginBottom:7,paddingBottom:5,borderBottom:"1px solid rgba(255,255,255,.06)" }}>{g.label}</div>
              {g.bullets.map((b,bi) => (
                <div key={bi} style={{ display:"flex",gap:10,padding:"4px 0",borderBottom:bi<g.bullets.length-1?"1px solid rgba(255,255,255,.04)":"none" }}>
                  <Dot achiev={g.label.toLowerCase().includes("achiev")} />
                  <span style={{ fontSize:isMobile?11.5:12,fontWeight:300,color:T.txt2,lineHeight:1.65 }}>
                    <strong style={{ color:T.txt,fontWeight:400 }}>{b[0]}</strong>{b[1]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BuildCard({ b, bi = 0, isMobile, delay = 0, enterClass = "" }) {
  const [hov, setHov] = useState(false);
  const [open, setOpen] = useState(false);
  const [ref, visible] = useInView(0.08);
  const navigate = useNavigate();
  const isIntelligence = b.name === "Enterprise Intelligence";

  return (
    <div ref={ref} className={enterClass}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...CARD,display:"flex",flexDirection:"column",
        opacity:visible?1:0,transform:!visible?"translateY(28px)":hov?"translateY(-3px)":"none",
        transitionProperty:"opacity,transform,background,border-color,box-shadow",
        transitionDuration:"0.5s,0.5s,.28s,.28s,.28s",
        transitionDelay:`${delay}ms,${delay}ms,0ms,0ms,0ms`,
        transitionTimingFunction:"ease,cubic-bezier(.34,1.2,.64,1),ease,ease,ease",
        background:hov
          ? `radial-gradient(ellipse 60% 50% at ${[12,88,14,86][bi%4]}% 0%, rgba(255,255,255,.1) 0%, transparent 62%), radial-gradient(ellipse 50% 42% at ${[88,12,86,14][bi%4]}% 100%, rgba(255,255,255,.06) 0%, transparent 58%)`
          : `radial-gradient(ellipse 60% 50% at ${[12,88,14,86][bi%4]}% 0%, rgba(255,255,255,.08) 0%, transparent 62%), radial-gradient(ellipse 50% 42% at ${[88,12,86,14][bi%4]}% 100%, rgba(255,255,255,.04) 0%, transparent 58%)`,
        borderColor:hov?"rgba(255,255,255,.16)":"rgba(255,255,255,.12)",
        boxShadow:hov?`0 4px 6px rgba(0,0,0,.25),0 20px 44px rgba(0,0,0,.55),0 32px 56px rgba(0,0,0,.3),0 0 24px ${b.color}14,inset 0 1px 0 rgba(255,255,255,.24)`:"0 4px 6px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.45),0 24px 48px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.2)",
      }}>
      <Sheen color={b.color} />
      <div style={{ height:2,background:`linear-gradient(90deg,${b.color},${b.color}55,transparent 80%)`,position:"relative",zIndex:3 }} />
      <div onClick={() => setOpen(!open)} style={{ padding:isMobile?"16px 18px 12px":"20px 24px 14px",position:"relative",zIndex:3,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"Georgia,serif",fontSize:isMobile?20:22,fontWeight:300,color:T.txt,lineHeight:1.08,marginBottom:8 }}>{b.name}</div>
          <div style={{ paddingLeft:10,borderLeft:`2px solid ${b.color}55` }}>
            <div style={{ fontSize:7.5,fontWeight:500,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(255,255,255,.28)",marginBottom:3 }}>The Problem</div>
            <div style={{ fontSize:isMobile?11:11.5,fontWeight:300,color:"rgba(255,255,255,.65)",fontStyle:"italic",lineHeight:1.55 }}>{b.problem}</div>
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" style={{ flexShrink:0,marginLeft:12,marginTop:4,transition:"transform .28s cubic-bezier(.4,0,.2,1)",transform:open?"rotate(180deg)":"none" }}>
          <path d="M4 6l4 4 4-4"/>
        </svg>
      </div>
      {open && (
        <div style={{ padding:isMobile?"0 18px 16px":"0 24px 18px",position:"relative",zIndex:3,display:"flex",flexDirection:"column",gap:10 }}>
          <div style={{ height:1,background:"rgba(255,255,255,.07)",marginBottom:2 }} />
          <div style={{ fontSize:isMobile?11.5:12,fontWeight:300,color:T.txt2,lineHeight:1.7 }}>{b.desc}</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
            {b.tools.map(t => <span key={t} style={{ fontFamily:"monospace",fontSize:8.5,color:b.color,background:`${b.color}12`,border:`1px solid ${b.color}38`,borderRadius:4,padding:"2px 7px" }}>{t}</span>)}
            {b.metrics.map(m => <span key={m} style={{ fontFamily:"monospace",fontSize:8.5,color:"rgba(255,255,255,.3)",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.12)",borderRadius:4,padding:"2px 7px" }}>{m}</span>)}
          </div>
          {isIntelligence && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate("/intelligence"); }}
              style={{ display:"flex",alignItems:"center",gap:6,marginTop:4,padding:"7px 14px",
                background:`${b.color}14`,border:`1px solid ${b.color}44`,borderRadius:8,
                cursor:"pointer",fontFamily:"Jost,sans-serif",fontSize:10,fontWeight:500,
                color:b.color,letterSpacing:".06em",transition:"all .2s",width:"fit-content",
              }}>
              View Live →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const COMP_CATEGORIES = [
  { label:"Enterprise Sales", keys:["Multi-stakeholder cycles","C-suite & board","Deal structuring","Negotiation","MEDDIC","Channel motions","Executive discovery","Cross-functional orch.","Legal & finance coord.","Pre-mortem analysis"] },
  { label:"Builder & Technical", keys:["Vibe coding","Agentic builds","UX & UI design","MCP tooling","Live demo engineering","CPQ automation"] },
  { label:"Industries", keys:["Restaurant","Retail","Venues & Arenas","Franchise","Hospitality","Healthcare","Entertainment","Software","Real Estate Development","VC & Private Equity"] },
];

function CompAccordion({ cat, defaultOpen, isMobile }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ borderRadius:8,overflow:"hidden",border:open?"1px solid rgba(255,255,255,.16)":"1px solid rgba(255,255,255,.08)",transition:"border-color .2s" }}>
      <div onClick={() => setOpen(!open)} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:isMobile?"9px 13px":"10px 14px",cursor:"pointer",background:open?"rgba(255,255,255,.055)":"rgba(255,255,255,.028)" }}>
        <span style={{ fontSize:7.5,fontWeight:500,letterSpacing:".13em",textTransform:"uppercase",color:open?"rgba(255,255,255,.55)":"rgba(255,255,255,.32)" }}>{cat.label}</span>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}>
          <span style={{ fontSize:8,fontWeight:300,color:"rgba(255,255,255,.22)" }}>{cat.keys.length}</span>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1.5" style={{ transition:"transform .2s",transform:open?"rotate(180deg)":"none" }}>
            <path d="M2 4l4 4 4-4"/>
          </svg>
        </div>
      </div>
      {open && (
        <div style={{ padding:"10px 13px 12px",display:"flex",flexWrap:"wrap",gap:5,borderTop:"1px solid rgba(255,255,255,.06)" }}>
          {cat.keys.map(k => (
            <span key={k} style={{ fontSize:isMobile?9:9.5,fontWeight:300,color:"rgba(255,255,255,.62)",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:4,padding:isMobile?"2px 8px":"3px 9px" }}>{k}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function CountUp({ raw }) {
  const [display, setDisplay] = useState("1");
  useEffect(() => {
    const hasNum = /\d+/.test(raw);
    if (!hasNum) { setDisplay(raw); return; }
    const num = parseInt(raw.replace(/\D/g,""));
    const suffix = raw.replace(/[\d]/g,"");
    const dur = 500 + num * 2.4;
    const delay = 740 + (num / 450) * 160;
    let raf;
    const t = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const cur = Math.max(1, Math.round(ease * num));
        setDisplay(p < 1 ? cur + suffix : raw);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [raw]);
  return <>{display}</>;
}

function RevealSection({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ opacity:visible?1:0, transform:visible?"none":"translateY(24px)", transition:`opacity .6s ${delay}ms ease, transform .6s ${delay}ms cubic-bezier(.4,0,.2,1)` }}>
      {children}
    </div>
  );
}

function SlidingToggle({ panel, setPanel, setCompOpen, isMobile }) {
  const salesActive = panel === "sales";
  return (
    <div style={{ position:"relative",display:"flex",gap:0,padding:2,borderRadius:100,
      background:"rgba(255,255,255,.04)",backdropFilter:"blur(40px) saturate(2.5)",WebkitBackdropFilter:"blur(40px) saturate(2.5)",
      border:"1px solid rgba(255,255,255,.18)",
      boxShadow:"0 8px 32px rgba(0,0,0,.4), inset 0 1.5px 0 rgba(255,255,255,.55), inset 0 -1px 0 rgba(0,0,0,.25)",
    }}>
      <div style={{ position:"absolute",top:2,bottom:2,left:salesActive?2:"calc(50% + 1px)",width:"calc(50% - 3px)",background:"rgba(255,255,255,.12)",borderRadius:100,border:"1px solid rgba(255,255,255,.2)",boxShadow:"0 2px 10px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.22)",transition:"left .32s cubic-bezier(.4,0,.2,1)",pointerEvents:"none",zIndex:1 }} />
      {["sales","builder"].map(p => (
        <button key={p} onClick={() => { setPanel(p); setCompOpen(false); }} style={{ fontFamily:"inherit",fontSize:isMobile?9:10,fontWeight:500,letterSpacing:".1em",textTransform:"uppercase",color:panel===p?"rgba(255,255,255,.96)":"rgba(255,255,255,.3)",background:"none",border:"none",cursor:"pointer",padding:isMobile?"5px 16px":"5px 22px",borderRadius:100,position:"relative",zIndex:2,transition:"color .32s ease" }}>
          {p}
        </button>
      ))}
    </div>
  );
}

const ROLES = [
  { id:"r1",title:"Enterprise Account Executive",meta:"May 2023 – Present · L4 → L6",badge:"Current",open:true,
    groups:[
      { label:"Performance", bullets:[
        ["Sustained 150%+ quota attainment"," across every quarter as the #1-ranked AE globally, including a 421% peak quarter, carrying a $2.8M revenue quota across 30+ simultaneous enterprise opportunities"],
        ["Generated 2–3 net-new enterprise opportunities per week"," through a cultivated partner network spanning NYC private equity relationships, commerce events, and co-marketing campaigns with Cash App and Afterpay"],
        ["Active seller of Square's AI capabilities"," including ManagerBot and Goose, built custom MCP integrations on the spot and delivered production-ready solutions without developer team involvement"],
        ["Closed enterprise deals averaging 7–15 active stakeholders"," across Finance, IT, Legal, Operations, and C-suite, mapping each function's distinct priorities into a single unified buying motion across deal cycles averaging 7–13 months"],
      ]},
      { label:"Key Achievements", bullets:[
        ["Called out by Square's board of directors"," as the organizational benchmark for enterprise execution, the first individual AE whose methodology was elevated to board-level recognition"],
        ["Closed an 18-month enterprise deal"," with a national commercial real estate developer, navigating a 20+ stakeholder buying committee across Legal, Finance, and board review, then managing a 5,000+ person implementation"],
        ["Incorporated Square's AI capabilities"," including ManagerBot and Goose into enterprise sales cycles, building custom MCP integrations on the spot and delivering production-ready solutions without developer team involvement"],
      ]},
    ]},
  { id:"r2",title:"Enterprise & Strategic Services BDR",meta:"February 2022 – May 2023 · L3",
    groups:[
      { label:"Performance", bullets:[
        ["Averaged 190% quota attainment Q1-Q4"," sourcing enterprise pipeline across Healthcare, Hospitality, and QSR"],
        ["Built Square's first channel sales motion from scratch"," growing closed-won opportunities 40% YoY with higher intent and shorter sales cycles"],
      ]},
      { label:"Key Achievement", bullets:[["Promoted to Enterprise AE in 15 months"," through a path that didn't exist, the first BDR-to-Enterprise-AE transition in Square's history"]] },
    ]},
  { id:"r3",title:"Account Executive, SMB",meta:"May 2021 – February 2022 · L2",
    groups:[
      { label:"Performance", bullets:[
        ["178% quota attainment"," running full-cycle deals with multi-stakeholder buying processes"],
        ["Identified and developed the SuiteRetail partnership",", now a preferred Square Partner, building a referral network of 20+ midmarket and enterprise sellers"],
        ["Selected as the only SMB AE"," to partner with the Enterprise AE on Cardinal Health"],
      ]},
      { label:"Key Achievement", bullets:[["Promoted to Enterprise BDR in 9 months",", the fastest transition of its kind in Square's history"]] },
    ]},
  { id:"r4",title:"SMB Business Development Representative",meta:"August 2020 – May 2021 · L1",
    groups:[
      { label:"Performance", bullets:[
        ["Averaged 182% quota attainment Q1–Q4",", consistently recognized among the top BDR performers"],
        ["Executed targeted outbound"," across Restaurant, Retail, and Healthcare verticals from day one"],
      ]},
      { label:"Key Achievement", bullets:[["Promoted to SMB AE in under 9 months",", the fastest BDR-to-AE transition in Square's history"]] },
    ]},
  { id:"r5",title:"Marketing & Graphics Associate",meta:"2018 – 2020",
    groups:[
      { label:"Experience", bullets:[
        ["Sales collateral and full-motion imagery"," that improved inbound lead quality"],
        ["Case studies and brand materials"," enabling a cohesive inbound-to-close motion"],
      ]},
    ]},
];

const BUILDS = [
  { color:"#8ba4c8",name:"Enterprise Intelligence",problem:"CRM required hours of manual research weekly, no reliable way to surface PE investments, leadership changes, or funding signals across the team.",desc:"Account intelligence dashboards for key enterprise targets, auto-surfacing private equity investments, leadership mapping, partner connections, and buying signals like recent funding rounds.",tools:["Claude","Glean","MCP"],metrics:["Hours/week recovered","Full account maps pre-call"] },
  { color:"#a8b8cc",name:"Prospecting Websites",problem:"Standard outbound sequences couldn't cut through noise in a competitive NYC enterprise market.",desc:"Personalized prospect websites with custom branding and account-specific value messaging, showing exactly what Square uniquely delivers to each target.",tools:["Claude","MCP"],metrics:["8/15 NYC prospects responded","Within 3 weeks"] },
  { color:"#9d8fc4",name:"Deal Brain",problem:"30+ live deals, no single source of truth, context fragmenting across channels and calls.",desc:"Live auto-updating repository ingesting transcripts, Slack, email, and SMS via BlueBubble API. Maintains structured deal files mirroring a Notion project system.",tools:["Claude","Goose","Glean","GitHub","BlueBubble API"],metrics:["35% faster deal prep","Hourly sync"] },
  { color:"#7a9bbf",name:"Ask Panels",problem:"Generic AI lacked deal context to answer accurately during live enterprise meetings.",desc:"Per-deal assistant drawing from Deal Brain's source of truth: product timeline, stakeholder history, and org intelligence.",tools:["Claude","Goose","Glean","MCP","Revenue.io"],metrics:["~70% faster live responses"] },
  { color:"#5aaa9e",name:"Deal Dashboards",problem:"7–15 stakeholders per deal across Slack, email, and iMessage causing response delays and dropped threads.",desc:"Per-deal command center aggregating multi-channel communications into one live view with auto-updating to-do list and product timeline.",tools:["Claude","Glean","MCP","Multi-channel"],metrics:["40% faster response","~8 hrs/week recovered","60% fewer missed threads"] },
  { color:"#c4a882",name:"Live Demo Engine",problem:"Static decks couldn't reflect account-specific data or respond to live questions during enterprise meetings.",desc:"Built and deployed custom Square × Claude MCP dashboards live during prospect meetings, real-time, account-specific tools created on the spot.",tools:["Square","Claude","MCP"],metrics:["45% higher follow-up rate","25% higher deal values"] },
  { color:"#b89a52",name:"PM Onboarding Flow",problem:"Multi-concept merchants with 40+ implementation stakeholders break every standard onboarding flow.",desc:"Multi-threaded system with pre-mortem risk analysis, auto-generated CPQ orders via Claude, and custom charts, Q&A forms, and sentiment tracking.",tools:["Claude","Glean","MCP","CPQ automation"],metrics:["30% faster implementation","100+ CPQ orders automated","40+ stakeholders managed"] },
];

const STATS = [{v:"#1",l:"AE Globally"},{v:"38%",l:"Win Rate"},{v:"150%+",l:"Every Quarter"},{v:"421%",l:"Peak Attainment"},{v:"30+",l:"Concurrent Opps"}];
const TOOLS = ["Claude","Goose","Glean","MCP","GitHub","Tasker","Revenue.io","Salesforce","Slack","Notion","BlueBubble API"];

function Portfolio() {
  const [panel, setPanel] = useState("sales");
  const [compOpen, setCompOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useIsMobile();
  const pad = isMobile ? "20px" : "44px";

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background:T.bg,minHeight:"100vh",fontFamily:"Jost,system-ui,sans-serif",color:T.txt,position:"relative",WebkitFontSmoothing:"antialiased" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px} @keyframes bounce{0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(7px);opacity:.8}} @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} @keyframes fadeInBg{from{opacity:0}to{opacity:1}} @keyframes slideDown{from{transform:translateX(-50%) translateY(-18px) scale(.96);opacity:0}to{transform:translateX(-50%) translateY(0) scale(1);opacity:1}} @keyframes drift1{0%,100%{transform:translate(0,0)}40%{transform:translate(22px,-16px)}70%{transform:translate(-12px,18px)}} @keyframes drift2{0%,100%{transform:translate(0,0)}35%{transform:translate(-18px,22px)}65%{transform:translate(16px,-12px)}} @keyframes drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(14px,16px)}} .fu{animation:fadeUp .65s ease both} .fu2{animation:fadeUp .65s .14s ease both} .fu3{animation:fadeUp .65s .28s ease both} @keyframes nameReveal{0%{letter-spacing:.12em;opacity:0;filter:blur(6px)}100%{letter-spacing:-.025em;opacity:1;filter:blur(0)}} .name-reveal{animation:nameReveal .9s cubic-bezier(.4,0,.2,1) both} @keyframes cardEnter{0%{opacity:0;transform:translateY(24px) scale(.98)}100%{opacity:1;transform:none}} .card-enter-1{animation:cardEnter .55s .05s cubic-bezier(.34,1.1,.64,1) both} .card-enter-2{animation:cardEnter .55s .13s cubic-bezier(.34,1.1,.64,1) both} .card-enter-3{animation:cardEnter .55s .21s cubic-bezier(.34,1.1,.64,1) both} .card-enter-4{animation:cardEnter .55s .29s cubic-bezier(.34,1.1,.64,1) both} .card-enter-5{animation:cardEnter .55s .37s cubic-bezier(.34,1.1,.64,1) both} .card-enter-6{animation:cardEnter .55s .45s cubic-bezier(.34,1.1,.64,1) both} .card-enter-7{animation:cardEnter .55s .53s cubic-bezier(.34,1.1,.64,1) both} .fu4{animation:fadeUp .8s .72s ease both} @keyframes sweep{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}`}</style>

      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}>
        <div style={{ position:"absolute",width:isMobile?400:660,height:isMobile?320:520,top:"-10%",left:"-8%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(24,60,200,.16),transparent 68%)",filter:"blur(80px)",animation:"drift1 28s ease-in-out infinite" }} />
        <div style={{ position:"absolute",width:isMobile?360:540,height:isMobile?360:540,top:"18%",right:"-10%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(90,30,190,.12),transparent 68%)",filter:"blur(80px)",animation:"drift2 34s ease-in-out infinite" }} />
        <div style={{ position:"absolute",width:isMobile?300:460,height:isMobile?240:380,bottom:"-8%",left:"28%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(10,130,110,.09),transparent 68%)",filter:"blur(80px)",animation:"drift3 40s ease-in-out infinite" }} />
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 85% 75% at 50% 40%,transparent 35%,rgba(0,0,0,.38) 100%)" }} />
      </div>
      <Grain />

      {/* NAV */}
      <div style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,height:isMobile?48:52,display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?"0 16px":"0 32px",background:"rgba(10,11,16,.78)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.1)",boxShadow:"0 1px 0 rgba(255,255,255,.07),0 8px 24px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.08)" }}>
        <div style={{ fontFamily:"Georgia,serif",fontSize:isMobile?13:15.5,fontWeight:400,letterSpacing:".04em" }}>
          Joseph <span style={{ color:"rgba(255,255,255,.2)",margin:"0 6px" }}>/</span> Amari
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"center" }}>
          <SlidingToggle panel={panel} setPanel={setPanel} setCompOpen={setCompOpen} isMobile={isMobile} />
          <div style={{ borderRadius:100,background:compOpen?"rgba(255,255,255,.1)":"rgba(255,255,255,.05)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:compOpen?"1px solid rgba(255,255,255,.22)":"1px solid rgba(255,255,255,.14)",transition:"all .28s cubic-bezier(.4,0,.2,1)" }}>
            <button onClick={() => setCompOpen(o => !o)} style={{ fontFamily:"inherit",fontSize:isMobile?9:10,fontWeight:500,letterSpacing:".1em",textTransform:"uppercase",color:compOpen?"rgba(255,255,255,.96)":"rgba(255,255,255,.42)",background:"none",border:"none",cursor:"pointer",padding:isMobile?"5px 14px":"6px 20px",borderRadius:100 }}>
              Competencies
            </button>
          </div>
        </div>
        {!isMobile && <div style={{ fontSize:9.5,fontWeight:300,color:"rgba(255,255,255,.28)",letterSpacing:".1em",textTransform:"uppercase" }}>New York City</div>}
        {isMobile && <div style={{ width:80 }} />}
      </div>

      {/* COMPETENCIES */}
      {compOpen && (
        <>
          <div onClick={() => setCompOpen(false)} style={{ position:"fixed",inset:0,zIndex:88,background:"rgba(4,5,10,.18)",backdropFilter:"blur(2px)",WebkitBackdropFilter:"blur(2px)",animation:"fadeInBg .45s ease forwards" }} />
          <div style={{ position:"fixed",top:isMobile?60:68,left:"50%",width:isMobile?"calc(100vw - 32px)":"580px",maxHeight:"70vh",zIndex:90,animation:"slideDown .28s cubic-bezier(.34,1.56,.64,1) forwards" }}>
            <div style={{ background:"rgba(13,14,19,.22)",backdropFilter:"blur(48px)",WebkitBackdropFilter:"blur(48px)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,boxShadow:"0 16px 40px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.1)",overflow:"hidden",maxHeight:"70vh",overflowY:"auto" }}>
              <div style={{ padding:isMobile?"20px 18px 24px":"24px 26px 28px",position:"relative",zIndex:3 }}>
                <div style={{ fontSize:8,fontWeight:500,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.55)",marginBottom:isMobile?14:18 }}>Competencies</div>
                <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:isMobile?7:9 }}>
                  {COMP_CATEGORIES.map(cat => (
                    <CompAccordion key={cat.label} cat={cat} defaultOpen={cat.label==="Enterprise Sales"} isMobile={isMobile} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div style={{ position:"relative",zIndex:1,paddingTop:isMobile?48:52 }}>
        {panel === "sales" && (
          <div style={{ position:"relative" }}>
            <div style={{ minHeight:isMobile?"calc(100svh - 48px)":"calc(100dvh - 52px)",display:"flex",flexDirection:"column",justifyContent:"flex-start",padding:isMobile?"44px 20px 0":"52px 44px 0",maxWidth:1060,margin:"0 auto",position:"relative" }}>
              <div className="fu">
                <div className="name-reveal" style={{ fontFamily:"Georgia,'Times New Roman',serif",fontSize:isMobile?40:58,fontWeight:300,lineHeight:1,marginBottom:isMobile?12:18,background:"linear-gradient(175deg,rgba(255,255,255,1) 0%,rgba(255,255,255,.92) 40%,rgba(255,255,255,.68) 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:"drop-shadow(0 2px 14px rgba(255,255,255,.1))" }}>
                  Joseph <em style={{ fontStyle:"italic" }}>Amari</em>
                </div>
                <div style={{ fontSize:isMobile?8.5:9.5,fontWeight:400,letterSpacing:".16em",textTransform:"uppercase",color:"rgba(255,255,255,.35)",marginBottom:isMobile?12:16 }}>Enterprise Account Executive · Square · New York City</div>
                <div style={{ fontSize:isMobile?13:15.5,fontWeight:300,color:T.txt2,lineHeight:1.78,maxWidth:600,marginBottom:10 }}>
                  Six years at Square across four roles, <strong style={{ color:T.txt,fontWeight:400 }}>ranked #1 AE globally</strong>. The path that got there was unconventional. Self-taught designer, marketing background, no traditional sales pedigree. Came into Square as an SMB BDR and ran every IC sales role on the way up. That foundation turned out to be an asset, not a detour. More recently, building AI agents and tools from real operational problems my team and I are running into every day.
                </div>
                <div className="fu3" style={{ fontSize:isMobile?14:16,fontWeight:300,color:"rgba(255,255,255,.85)",lineHeight:1.5,marginBottom:isMobile?14:18 }}>
                  What excites me most is where sales is heading, the future sits at the intersection of <strong style={{ color:T.txt,fontWeight:500 }}>Sales × Design × Automation</strong>.
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:9,fontSize:isMobile?10:10.5,color:"rgba(45,212,170,.78)" }}>
                  <div style={{ width:5,height:5,borderRadius:"50%",background:"rgba(45,212,170,.9)",boxShadow:"0 0 7px rgba(45,212,170,.6),0 0 14px rgba(45,212,170,.35)",flexShrink:0 }} />
                  Open to conversations · 917.608.6653{!isMobile && " · linkedin.com/in/josephamari"}
                </div>
                {isMobile && <div style={{ fontSize:10,fontWeight:300,color:"rgba(255,255,255,.32)",marginTop:4 }}>linkedin.com/in/josephamari</div>}
              </div>
              <div className="fu4" style={{ display:"flex",flexDirection:"column",gap:isMobile?10:12,marginTop:isMobile?"5vh":"8vh" }}>
                <div style={{ width:"100%",background:"linear-gradient(145deg,rgba(255,255,255,.055) 0%,rgba(255,255,255,.018) 55%,rgba(255,255,255,.008) 100%)",border:"1px solid rgba(255,255,255,.18)",borderRadius:10,overflow:"hidden",boxShadow:"0 10px 36px rgba(0,0,0,.45),inset 0 1.5px 0 rgba(255,255,255,.16)",position:"relative" }}>
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.28) 30%,rgba(255,255,255,.36) 50%,rgba(255,255,255,.28) 70%,transparent)",zIndex:2 }} />
                  <div style={{ display:"flex",width:"100%",position:"relative",zIndex:3 }}>
                    {STATS.map((s,i) => (
                      <div key={s.v} style={{ flex:1,padding:isMobile?"10px 0":"12px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:isMobile?1:3,borderLeft:i>0?"1px solid rgba(255,255,255,.09)":"none" }}>
                        <span style={{ fontFamily:"Georgia,serif",fontSize:isMobile?15:20,fontWeight:300,color:T.txt,lineHeight:1 }}><CountUp raw={s.v}/></span>
                        <span style={{ fontSize:isMobile?6.5:8.5,fontWeight:300,color:"rgba(255,255,255,.38)",letterSpacing:".05em",textTransform:"uppercase",textAlign:"center" }}>{s.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ width:"100%",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 24px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.16)",position:"relative",padding:isMobile?"10px 12px":"11px 16px" }}>
                  <div style={{ display:"flex",alignItems:"center",flexWrap:"wrap",gap:isMobile?"5px 8px":"5px 10px",position:"relative",zIndex:3 }}>
                    <span style={{ fontSize:isMobile?6.5:7.5,fontWeight:500,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(255,255,255,.28)",marginRight:4,flexShrink:0 }}>Verticals</span>
                    {["Restaurant","Retail","Venues & Arenas","Franchise","Hospitality","Healthcare","Entertainment","Software","Real Estate Development","VC & Private Equity"].map(ind => (
                      <span key={ind} style={{ fontSize:isMobile?8.5:9.5,fontWeight:300,color:"rgba(255,255,255,.62)",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.12)",borderRadius:4,padding:isMobile?"2px 7px":"2px 9px",whiteSpace:"nowrap" }}>{ind}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100vw",height:`${(isMobile?120:180)+Math.min(scrollY*.55,isMobile?260:320)}px`,background:"linear-gradient(to bottom,transparent 0%,rgba(13,14,19,.75) 35%,#0d0e13 70%)",pointerEvents:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",paddingBottom:isMobile?18:22,transition:"height .08s linear",zIndex:2 }}>
                <span style={{ fontSize:isMobile?8:8.5,fontWeight:400,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.3)",marginBottom:8 }}>Scroll to learn more</span>
                <div style={{ animation:"bounce 2.2s ease-in-out infinite",opacity:.6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            <RevealSection delay={0}>
              <div style={{ maxWidth:1060,margin:"0 auto",padding:`${isMobile?"36px":"56px"} ${pad} ${isMobile?"36px":"52px"}` }}>
                <SecHdr label="Summary" right="Square" />
                <div style={{ fontSize:isMobile?13:13.5,fontWeight:300,color:T.txt2,lineHeight:1.82,maxWidth:660 }}>
                  Top-ranked Enterprise Account Executive at Square with <strong style={{ color:T.txt,fontWeight:400 }}>six years across four distinct roles</strong>. Specializes in complex, multi-stakeholder enterprise cycles with <strong style={{ color:T.txt,fontWeight:400 }}>7–13 month buying motions</strong>, C-suite and board-level relationship building, and cross-functional coordination across legal, finance, and product. Active seller of Square's AI capabilities, including ManagerBot and Goose, and builder of custom MCP integrations deployed directly into enterprise accounts without developer team dependencies.
                </div>
              </div>
            </RevealSection>
            <RevealSection delay={100}>
              <div style={{ maxWidth:1060,margin:"0 auto",padding:`0 ${pad} ${isMobile?"48px":"80px"}` }}>
                <SecHdr label="Experience" right="Square" />
                {[["Square","August 2020 – Present · New York, NY",0,4],["Tzumi Electronics","2018 – 2020 · New York, NY",4,5]].map(([name,dates,from,to]) => (
                  <div key={name}>
                    {from > 0 && (
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",margin:"20px 0 8px",flexWrap:"wrap",gap:4 }}>
                        <span style={{ fontSize:10.5,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(255,255,255,.55)" }}>{name}</span>
                        <span style={{ fontSize:10,fontWeight:300,color:"rgba(255,255,255,.32)" }}>{dates}</span>
                      </div>
                    )}
                    {ROLES.slice(from,to).map((r,ri) => <RoleCard key={r.id} role={r} isMobile={isMobile} delay={ri*80} />)}
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        )}

        {panel === "builder" && (
          <div key="builder-panel">
            <div style={{ padding:isMobile?"40px 20px 28px":"56px 44px 40px",maxWidth:1060,margin:"0 auto",animation:"cardEnter .6s ease both" }}>
              <div className="fu" style={{ fontFamily:"Georgia,'Times New Roman',serif",fontSize:isMobile?36:58,fontWeight:300,lineHeight:1,letterSpacing:"-.025em",marginBottom:isMobile?10:18,background:"linear-gradient(175deg,rgba(255,255,255,1) 0%,rgba(255,255,255,.68) 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
                Builder, <em>in the field.</em>
              </div>
              <div style={{ fontSize:isMobile?8:9.5,fontWeight:400,letterSpacing:".16em",textTransform:"uppercase",color:"rgba(255,255,255,.35)",marginBottom:isMobile?10:14 }}>Not an engineer. A seller who builds from real pain.</div>
              <div className="fu3" style={{ fontSize:isMobile?12.5:14,fontWeight:300,color:T.txt2,lineHeight:1.82,maxWidth:580 }}>
                Every system below was built live, with <strong style={{ color:T.txt,fontWeight:400 }}>real accounts on the line</strong>, because the tooling broke down at the complexity of 30+ concurrent enterprise deals. Each one was designed to be scalable, built to solve problems I was facing personally, then scoped and structured so they could be deployed across Square's broader sales organization. <strong style={{ color:T.txt,fontWeight:400 }}>All are currently in use or in active rollout across the team.</strong>
              </div>
            </div>
            <div className="fu4" style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:isMobile?10:14,maxWidth:1060,margin:"0 auto",padding:isMobile?"0 20px 40px":"0 44px 64px",alignItems:"start" }}>
              {BUILDS.map((b,bi) => <BuildCard key={b.name} b={b} bi={bi} isMobile={isMobile} delay={bi*100} enterClass={bi < 7 ? `card-enter-${bi+1}` : ""} />)}
            </div>
            <RevealSection delay={0}>
              <div style={{ maxWidth:1060,margin:"0 auto",padding:isMobile?"0 20px 56px":"0 44px 80px" }}>
                <SecHdr label="Full Stack" />
                <div style={{ display:"flex",flexWrap:"wrap",gap:isMobile?5:6 }}>
                  {TOOLS.map((t,ti) => (
                    <span key={t} style={{ fontFamily:"monospace",fontSize:isMobile?9.5:10,fontWeight:300,color:T.txt2,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.14)",borderRadius:6,padding:isMobile?"4px 11px":"5px 13px",boxShadow:"inset 0 1px 0 rgba(255,255,255,.07),0 2px 8px rgba(0,0,0,.22)",animation:`fadeUp .5s ${ti*60}ms ease both` }}>{t}</span>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/intelligence" element={<Intelligence />} />
      </Routes>
    </BrowserRouter>
  );
}
