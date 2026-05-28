import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PASSWORD = "1413Ab!";

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

function useIsMobile() {
  const [mob, setMob] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  useEffect(() => {
    const h = () => setMob(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mob;
}

// Global SFDC activity log — shared across components
const sfdcLog = { items: [], listeners: [] };
function logSfdc(action) {
  const entry = { action, time: new Date() };
  sfdcLog.items.push(entry);
  sfdcLog.listeners.forEach(fn => fn());
}
function useSfdcCount() {
  const [count, setCount] = useState(sfdcLog.items.length);
  useEffect(() => {
    const fn = () => setCount(sfdcLog.items.length);
    sfdcLog.listeners.push(fn);
    return () => { sfdcLog.listeners = sfdcLog.listeners.filter(f => f !== fn); };
  }, []);
  return count;
}

const T = {
  bg: "#0d0e13", txt: "rgba(255,255,255,.93)", txt2: "rgba(255,255,255,.72)",
  txt3: "rgba(255,255,255,.44)", txt4: "rgba(255,255,255,.28)",
  blue: "#7aa8ff", teal: "#33ddc8", red: "#ff6060", amber: "#f5a623", green: "#4ade80",
};

const CARD = {
  background: "radial-gradient(ellipse 70% 50% at 15% 0%, rgba(255,255,255,.09) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 100%, rgba(255,255,255,.05) 0%, transparent 55%)",
  backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,.11)", borderRadius: 16,
  boxShadow: "0 2px 4px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.5), 0 20px 48px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.20), inset 0 -1px 0 rgba(255,255,255,.03), inset 1px 0 0 rgba(255,255,255,.05), inset -1px 0 0 rgba(255,255,255,.02)",
  position: "relative", overflow: "hidden",
};

const SIGNALS = [
  { dot:"red", title:"$1.1B Tech Overhaul — Active Now", body:"Marriott committed $1.1B in 2026 investment. 40%+ earmarked for digital transformation. CEO Capuano: replatforming PMS, central reservations, and loyalty — all moving into deployment this year.", meta:"Q4 2025 Earnings · Feb 2026", url:"https://www.ciodive.com/news/marriott-international-AI-investment-migration/812025/" },
  { dot:"red", title:"PMS Migration In Progress", body:"Capuano confirmed PMS replatform is live rollout at 'a meaningful number' of hotels in 2026. Cloud-native replacement of legacy systems — direct Square entry point.", meta:"CIO Dive · Feb 2026", url:"https://www.ciodive.com/news/marriott-international-AI-investment-migration/812025/" },
  { dot:"amber", title:"Naveen Manga — New CIO Signal", body:"CIO Naveen Manga: 2026 is 'a year for scale.' Front desk associates forced to navigate multiple systems daily — evaluating tools to consolidate. Exact Square F&B pain.", meta:"Hotel Dive · May 2026", url:"https://www.hoteldive.com/news/marriott-cio-talks-enterprisewide-ai-deployment-strategy/820467/" },
  { dot:"blue", title:"Drew Pinto at J.P. Morgan Forum", body:"EVP & Chief Revenue + Technology Officer Drew Pinto spoke at J.P. Morgan Gaming, Lodging, Restaurant & Leisure Forum (Mar 12, 2026). Signals active engagement with enterprise tech vendors.", meta:"PRNewswire · Feb 2026", url:"https://www.barchart.com/story/news/412713/marriott-international-president-and-chief-executive-officer-and-executive-vice-president-and-chief-revenue-technology-officer-to-speak-at-the-j-p-morgan-gaming-lodging-restaurant-leisure-management-access-forum-on-march-12-remarks-to-be-webcast" },
  { dot:"green", title:"AI Strategy: 'Pulling Into the Parking Lot'", body:"Capuano on AI: 'We're not even in uniform or on the field.' Early innings = maximum openness to foundational infrastructure like Square F&B. The window is now.", meta:"Q4 2025 Earnings · Feb 2026", url:"https://www.phocuswire.com/marriott-q4-full-year-earnings-2025" },
];

const SLACK_MESSAGES = {
  oracle: `Hey Stevie — reaching out on a Marriott re-engagement. We have a strong opportunity with their CTO (Drew Pinto) given the MICROS EOL timing and I'd love to coordinate. Would you be open to a quick sync this week, or can you connect me to your Marriott account lead?`,
  netsuite: `Hey Lindsey — looping you in on a Marriott opportunity. They run NetSuite across managed properties and we have an active re-engagement with their CFO team. Would love to bring you into the conversation given the Square ↔ NetSuite integration story. Are you free this week?`,
  courtyard: `Hey Christine — hoping you can help. I'm re-engaging Marriott corporate on the Square opportunity and would love to get updated testimonials from the Courtyard NYC/Boston GMs who were on the 2022 pilot. Can you connect me or share their current contacts?`,
};

const PARTNERS = [
  { name:"Oracle", confirmed:true, role:"Enterprise Tech Partner — MICROS + Opera Cloud Integration", body:"Confirmed partner. MICROS EOL creates a joint replacement narrative. Opera Cloud API integration is live — leverage to accelerate Marriott CTO credibility.", action:"→ Use MICROS EOL as shared urgency. Co-sell the migration story.", pm:"Stevie Nicks", pmTitle:"Partner Manager, Oracle Hospitality", id:"oracle" },
  { name:"NetSuite", confirmed:true, role:"Enterprise Finance Partner — ERP + Financial Reporting", body:"Marriott runs NetSuite across managed properties. Square ↔ NetSuite integration eliminates manual reconciliation across 8,785 properties.", action:"→ Joint CFO story. Lindsey has existing Marriott finance team relationship.", pm:"Lindsey Buckingham", pmTitle:"Partner Manager, NetSuite Enterprise", id:"netsuite" },
  { name:"Courtyard GM Network", confirmed:false, role:"Internal Advocates — 2022 Pilot GMs, NYC + Boston", body:"GMs with live Square performance data. Can advocate upward to Marriott corporate tech team.", action:"→ Re-engage for updated case study + corporate referral to Drew Pinto's team.", pm:"Christine McVie", pmTitle:"Account Manager, Hospitality", id:"courtyard" },
];

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
  return <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
    background:color?`linear-gradient(90deg,transparent,${color}66 30%,${color}99 50%,${color}66 70%,transparent)`:"linear-gradient(90deg,transparent,rgba(255,255,255,.22) 30%,rgba(255,255,255,.32) 50%,rgba(255,255,255,.22) 70%,transparent)",
    zIndex:2,pointerEvents:"none" }} />;
}

function SecHdr({ label, right }) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8 }}>
        <span style={{ fontSize:9.5,fontWeight:500,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.55)" }}>{label}</span>
        {right && <span style={{ fontSize:9,color:T.txt3,letterSpacing:".06em" }}>{right}</span>}
      </div>
      <div style={{ height:1,background:"linear-gradient(90deg,rgba(255,255,255,.38) 0%,rgba(255,255,255,.22) 35%,rgba(255,255,255,.08) 65%,transparent 100%)" }} />
    </div>
  );
}

function Reveal({ children, delay=0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ opacity:visible?1:0,transform:visible?"none":"translateY(28px)",
      transition:`opacity .5s ${delay}ms ease,transform .5s ${delay}ms cubic-bezier(.34,1.2,.64,1)` }}>
      {children}
    </div>
  );
}

function RefreshBtn({ isMobile }) {
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);
  const handle = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setFlash(true); setTimeout(() => setFlash(false), 1200); }, 2800);
  };
  return (
    <button onClick={handle} style={{ display:"flex",alignItems:"center",gap:6,
      marginTop:10,padding:isMobile?"10px 18px":"6px 13px",
      background:flash?"rgba(45,212,180,.22)":"rgba(45,212,180,.09)",
      border:flash?"1px solid rgba(45,212,180,.5)":"1px solid rgba(45,212,180,.22)",
      borderRadius:8,cursor:"pointer",fontFamily:"Jost,sans-serif",
      fontSize:isMobile?11:9,fontWeight:400,color:T.teal,letterSpacing:".07em",
      transition:"all .3s",width:isMobile?"100%":"fit-content",
      justifyContent:"center" }}>
      <span style={{ display:"inline-block",animation:loading?"spin 1s linear infinite":"none" }}>↻</span>
      <span>{loading?"Refreshing...":"Refresh Intel"}</span>
    </button>
  );
}

const tag = (txt, color, bg, border) => (
  <span key={txt} style={{ fontSize:9,fontWeight:500,letterSpacing:".08em",padding:"3px 9px",borderRadius:20,
    color,background:bg,border:`1px solid ${border}`,fontFamily:"Jost,sans-serif" }}>{txt}</span>
);

// ── SLACK MODAL — responsive ──
function SlackModal({ partner, onClose, isMobile }) {
  const [step, setStep] = useState("message");
  const [copied, setCopied] = useState(false);
  const [reminder, setReminder] = useState("2days");
  const [sent, setSent] = useState(false);
  const msg = SLACK_MESSAGES[partner.id] || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(msg).catch(() => {});
    setCopied(true);
    logSfdc(`Slack drafted: ${partner.pm} re: Marriott`);
    setTimeout(() => setStep("reminder"), 800);
  };

  const handleSetReminder = () => { setSent(true); setTimeout(onClose, 1200); };

  const today = new Date();
  const reminderDate = () => {
    const d = new Date(today);
    if (reminder==="2days") d.setDate(d.getDate()+2);
    else if (reminder==="1week") d.setDate(d.getDate()+7);
    else if (reminder==="2weeks") d.setDate(d.getDate()+14);
    else if (reminder==="1month") d.setMonth(d.getMonth()+1);
    return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
  };

  // Mobile: full-screen sheet from bottom
  const mobileSheet = {
    position:"fixed", inset:0, zIndex:300,
    display:"flex", flexDirection:"column", justifyContent:"flex-end",
  };
  const mobileOverlay = {
    position:"absolute", inset:0, background:"rgba(4,5,10,.65)",
    backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)",
  };
  const mobileInner = {
    position:"relative", zIndex:1,
    background:"radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.10) 0%,transparent 65%),#0f1018",
    backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
    borderTop:"1px solid rgba(255,255,255,.16)",
    borderRadius:"20px 20px 0 0",
    padding:"28px 24px 40px",
    animation:"sheetUp .32s cubic-bezier(.34,1.1,.64,1) both",
  };

  const desktopWrap = {
    position:"fixed", inset:0, zIndex:300,
    display:"flex", alignItems:"center", justifyContent:"center",
    background:"rgba(4,5,10,.7)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
  };
  const desktopInner = {
    width:420, position:"relative",
    background:"radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.09) 0%,transparent 65%),radial-gradient(ellipse 55% 45% at 88% 100%,rgba(255,255,255,.05) 0%,transparent 60%)",
    backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
    border:"1px solid rgba(255,255,255,.14)", borderRadius:20,
    boxShadow:"0 24px 64px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.22)",
    overflow:"hidden",
  };

  const content = (
    <>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
        background:"linear-gradient(90deg,transparent,rgba(255,255,255,.3) 40%,rgba(255,255,255,.4) 50%,rgba(255,255,255,.3) 60%,transparent)",
        pointerEvents:"none" }} />
      {isMobile && (
        <div style={{ width:36,height:4,background:"rgba(255,255,255,.2)",borderRadius:2,
          margin:"0 auto 20px",cursor:"pointer" }} onClick={onClose} />
      )}
      <div style={{ padding:isMobile?"0":"22px 22px 20px" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:"Georgia,serif",fontSize:isMobile?18:16,fontWeight:300,color:T.txt,marginBottom:2 }}>
              Message {partner.pm}
            </div>
            <div style={{ fontSize:9,color:T.txt3,letterSpacing:".06em",fontStyle:"italic" }}>{partner.pmTitle}</div>
          </div>
          {!isMobile && (
            <button onClick={onClose} style={{ background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",
              borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:11,color:T.txt3,fontFamily:"Jost,sans-serif" }}>✕</button>
          )}
        </div>

        {step==="message" && (
          <>
            <div style={{ fontSize:9,fontWeight:500,letterSpacing:".12em",textTransform:"uppercase",
              color:"rgba(255,255,255,.35)",marginBottom:8 }}>Draft Message</div>
            <div style={{ padding:"12px 14px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",
              borderRadius:10,fontSize:isMobile?13:11.5,color:T.txt2,lineHeight:1.7,marginBottom:14,fontStyle:"italic" }}>
              {msg}
            </div>
            <button onClick={handleCopy} style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"center",
              gap:8,padding:isMobile?"14px 0":"10px 0",
              background:copied?"rgba(74,222,128,.15)":"linear-gradient(135deg,rgba(122,168,255,.18),rgba(51,221,200,.12))",
              border:copied?"1px solid rgba(74,222,128,.3)":"1px solid rgba(122,168,255,.3)",
              borderRadius:10,cursor:"pointer",fontFamily:"Jost,sans-serif",fontSize:isMobile?13:11,fontWeight:500,
              color:copied?T.green:T.blue,letterSpacing:".06em",transition:"all .25s" }}>
              <span style={{ fontSize:isMobile?16:14 }}>{copied?"✓":"📋"}</span>
              {copied?"Copied!":"Copy Message"}
            </button>
          </>
        )}

        {step==="reminder" && !sent && (
          <>
            <div style={{ textAlign:"center",marginBottom:16 }}>
              <div style={{ fontSize:isMobile?24:18,marginBottom:8 }}>⏰</div>
              <div style={{ fontFamily:"Georgia,serif",fontSize:isMobile?16:14,fontWeight:300,color:T.txt,marginBottom:4 }}>
                Set a follow-up reminder?
              </div>
              <div style={{ fontSize:isMobile?12:10.5,color:T.txt3 }}>Remind you to follow up with {partner.pm}</div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
              {[["2days","2 Days","Best for partner outreach"],["1week","1 Week","Standard follow-up"],["2weeks","2 Weeks","Longer runway"],["1month","1 Month","Low-priority cadence"]].map(([val,label,hint]) => (
                <button key={val} onClick={() => setReminder(val)} style={{
                  padding:isMobile?"14px 12px 10px":"10px 10px 8px",borderRadius:10,cursor:"pointer",
                  background:reminder===val?"rgba(122,168,255,.16)":"rgba(255,255,255,.04)",
                  border:reminder===val?"1px solid rgba(122,168,255,.4)":"1px solid rgba(255,255,255,.08)",
                  fontFamily:"Jost,sans-serif",transition:"all .18s",textAlign:"left" }}>
                  <div style={{ fontSize:isMobile?13:12,fontWeight:500,color:reminder===val?T.blue:T.txt,marginBottom:2 }}>{label}</div>
                  <div style={{ fontSize:isMobile?10:8.5,color:T.txt3,letterSpacing:".02em" }}>{hint}</div>
                </button>
              ))}
            </div>
            <button onClick={handleSetReminder} style={{ width:"100%",padding:isMobile?"14px 0":"10px 0",
              background:"linear-gradient(135deg,rgba(122,168,255,.18),rgba(51,221,200,.12))",
              border:"1px solid rgba(122,168,255,.3)",borderRadius:10,cursor:"pointer",
              fontFamily:"Jost,sans-serif",fontSize:isMobile?13:11,fontWeight:500,color:T.blue,letterSpacing:".06em" }}>
              Set Reminder for {reminderDate()}
            </button>
            <button onClick={onClose} style={{ width:"100%",padding:"8px 0",marginTop:6,
              background:"none",border:"none",cursor:"pointer",fontSize:isMobile?12:10,color:T.txt3,fontFamily:"Jost,sans-serif" }}>
              Skip reminder
            </button>
          </>
        )}

        {sent && (
          <div style={{ textAlign:"center",padding:"24px 0" }}>
            <div style={{ fontSize:isMobile?36:28,marginBottom:10 }}>✅</div>
            <div style={{ fontFamily:"Georgia,serif",fontSize:isMobile?16:14,fontWeight:300,color:T.green }}>
              Reminder set for {reminderDate()}
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div style={mobileSheet} onClick={onClose}>
        <div style={mobileOverlay} />
        <div style={mobileInner} onClick={e => e.stopPropagation()}>{content}</div>
      </div>
    );
  }

  return (
    <div style={desktopWrap} onClick={onClose}>
      <div style={desktopInner} onClick={e => e.stopPropagation()}>{content}</div>
    </div>
  );
}

// ── PARTNER CARD ──
function PartnerCard({ p, isMobile }) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [messaged, setMessaged] = useState(false);
  const [messagedDate, setMessagedDate] = useState("");

  const handleSlackClose = () => {
    setModal(false); setMessaged(true);
    const n = new Date();
    setMessagedDate(`${n.getMonth()+1}/${n.getDate()}/${n.getFullYear()}`);
  };

  return (
    <>
      {modal && <SlackModal partner={p} onClose={handleSlackClose} isMobile={isMobile} />}
      <div style={{ background:"radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.06) 0%,transparent 65%)",
        border:`1px solid ${open?"rgba(255,255,255,.14)":"rgba(255,255,255,.08)"}`,borderRadius:12,marginBottom:7,
        overflow:"hidden",transition:"border-color .2s",
        boxShadow:open?"0 8px 24px rgba(0,0,0,.3)":"0 2px 8px rgba(0,0,0,.2)" }}>

        {/* Always-visible collapsed row */}
        <div style={{ padding:"10px 12px",cursor:"pointer" }} onClick={() => setOpen(!open)}>
          {/* Row 1: name + chevron */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ fontFamily:"Georgia,serif",fontSize:13,fontWeight:300,color:T.txt }}>{p.name}</div>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"
              style={{ transition:"transform .22s",transform:open?"rotate(180deg)":"none",flexShrink:0 }}>
              <path d="M2 4l4 4 4-4"/>
            </svg>
          </div>
          {/* Row 2: envelope message button full width */}
          <button onClick={e => { e.stopPropagation(); setModal(true); }} style={{
            width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            padding:isMobile?"8px 0":"6px 0",
            background:messaged?"rgba(245,166,35,.08)":"rgba(255,255,255,.04)",
            border:messaged?"1px solid rgba(245,166,35,.2)":"1px solid rgba(255,255,255,.09)",
            borderRadius:8,cursor:"pointer",fontFamily:"Jost,sans-serif",
            fontSize:isMobile?10:9,fontWeight:400,
            color:messaged?T.amber:"rgba(255,255,255,.45)",
            letterSpacing:".06em",transition:"all .2s" }}>
            {/* Envelope with arrow icon */}
            {messaged ? (
              <>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <rect x="1" y="3" width="14" height="10" rx="1.5"/>
                  <path d="M1 5l7 5 7-5"/>
                </svg>
                <span>Sent {messagedDate}</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <rect x="1" y="3" width="11" height="9" rx="1.5"/>
                  <path d="M1 5l5.5 4 5.5-4"/>
                  <path d="M13 7l2.5-2.5M13 7h2M13 7v-2" strokeWidth="1.2"/>
                </svg>
                <span>Message Partner Manager on Slack {p.id==="oracle"?"(@stevienicks)":p.id==="netsuite"?"(@lbuckingham)":"(@cmcvie)"}</span>
              </>
            )}
          </button>
        </div>

        {/* Expanded content */}
        {open && (
          <div style={{ padding:"0 12px 12px",borderTop:"1px solid rgba(255,255,255,.06)" }}>
            {p.confirmed && <div style={{ fontSize:8,color:T.amber,letterSpacing:".07em",fontWeight:500,padding:"6px 0 4px" }}>✓ CONFIRMED PARTNER</div>}
            <div style={{ fontSize:9.5,color:T.txt3,fontStyle:"italic",marginBottom:7,marginTop:p.confirmed?0:6,letterSpacing:".02em" }}>{p.role}</div>
            <div style={{ fontSize:10.5,color:T.txt2,lineHeight:1.6,marginBottom:6 }}>{p.body}</div>
            <div style={{ fontSize:9.5,color:T.teal,fontStyle:"italic" }}>{p.action}</div>
          </div>
        )}
      </div>
    </>
  );
}

// ── SFDC WIDGET ──
function SfdcWidget({ isMobile }) {
  const [nextStep, setNextStep] = useState("Re-engage Drew Pinto — MICROS EOL trigger");
  const [editing, setEditing] = useState(false);
  const [logged, setLogged] = useState(false);
  const [logDate, setLogDate] = useState("");

  const handleLog = () => {
    setLogged(true);
    const n = new Date();
    setLogDate(`${n.getMonth()+1}/${n.getDate()}/${n.getFullYear()} ${n.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}`);
    setTimeout(() => setEditing(false), 200);
  };

  return (
    <div>
      <SecHdr label="SFDC" />
      {[
        ["Stage", <span style={{color:T.blue,fontSize:10.5,fontWeight:400}}>Stage 2 — Discovery</span>],
        ["Owner", <span style={{color:T.txt,fontSize:10.5,fontWeight:400}}>Joey Amari</span>],
        ["Trigger", <span style={{color:T.amber,fontSize:10,fontWeight:400}}>MICROS EOL → Re-engage now</span>],
        ["Record", <a href="#" style={{color:T.blue,textDecoration:"none",fontSize:10.5}}>Open →</a>],
      ].map(([l,v]) => (
        <div key={l} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"5px 10px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",
          borderRadius:7,marginBottom:4 }}>
          <span style={{ fontSize:9,color:T.txt3,letterSpacing:".06em" }}>{l}</span>
          {v}
        </div>
      ))}
      <div style={{ marginTop:8,padding:"9px 10px",background:"rgba(255,255,255,.03)",
        border:`1px solid ${logged?"rgba(74,222,128,.25)":"rgba(255,255,255,.07)"}`,borderRadius:8,transition:"border-color .3s" }}>
        <div style={{ fontSize:8.5,color:T.txt3,letterSpacing:".08em",textTransform:"uppercase",marginBottom:5 }}>Next Step</div>
        {editing ? (
          <input value={nextStep} onChange={e => setNextStep(e.target.value)}
            style={{ width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(122,168,255,.3)",
              borderRadius:6,padding:"5px 8px",color:T.txt,fontFamily:"Jost,sans-serif",fontSize:11,outline:"none",marginBottom:8 }}
            autoFocus onKeyDown={e => e.key==="Enter" && handleLog()} />
        ) : (
          <div onClick={() => setEditing(true)} style={{ fontSize:11,color:T.txt2,lineHeight:1.5,marginBottom:8,cursor:"text",padding:"2px 0" }}>{nextStep}</div>
        )}
        <button onClick={handleLog} style={{ width:"100%",padding:"6px 0",
          background:logged?"rgba(74,222,128,.12)":"rgba(122,168,255,.10)",
          border:logged?"1px solid rgba(74,222,128,.28)":"1px solid rgba(122,168,255,.25)",
          borderRadius:7,cursor:"pointer",fontFamily:"Jost,sans-serif",fontSize:9,fontWeight:500,
          color:logged?T.green:T.blue,letterSpacing:".07em",transition:"all .25s",
          display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
          {logged ? <>✓ Logged · {logDate}</> : <>📊 Log Next Step to SFDC</>}
        </button>
      </div>
      <div style={{ height:3,background:"rgba(255,255,255,.08)",borderRadius:2,marginTop:8,overflow:"hidden" }}>
        <div style={{ height:"100%",width:"28%",background:`linear-gradient(90deg,${T.blue},${T.teal})`,borderRadius:2,animation:"fillBar .8s .4s ease both" }} />
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",marginTop:4 }}>
        {["Prospect","Discovery","Eval","Negotiate","Close"].map((s,i) => (
          <span key={s} style={{ fontSize:7.5,color:i===1?T.blue:T.txt4,letterSpacing:".06em" }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

// ── PASSWORD GATE ──
function PasswordGate({ onUnlock }) {
  const [val, setVal] = useState("");
  const [shake, setShake] = useState(false);
  const [err, setErr] = useState(false);

  const tryUnlock = () => {
    if (val === PASSWORD) { onUnlock(); }
    else {
      setShake(true); setErr(true);
      setTimeout(() => { setShake(false); setErr(false); setVal(""); }, 700);
    }
  };

  return (
    <div style={{ position:"fixed",inset:0,background:T.bg,display:"flex",alignItems:"center",
      justifyContent:"center",zIndex:300,fontFamily:"Jost,sans-serif" }}>
      <div style={{ position:"absolute",inset:0,pointerEvents:"none" }}>
        <div style={{ position:"absolute",width:600,height:600,top:"-15%",left:"-10%",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(24,60,200,.18),transparent 65%)",filter:"blur(80px)",animation:"drift1 22s ease-in-out infinite" }} />
        <div style={{ position:"absolute",width:500,height:500,bottom:"-10%",right:"-8%",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(45,212,180,.12),transparent 65%)",filter:"blur(80px)",animation:"drift2 28s ease-in-out infinite" }} />
        <div style={{ position:"absolute",width:400,height:400,top:"40%",left:"40%",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(90,30,190,.10),transparent 65%)",filter:"blur(80px)",animation:"drift3 34s ease-in-out infinite" }} />
      </div>
      <Grain />
      <div style={{ ...CARD,width:"min(340px,90vw)",padding:"36px 32px",textAlign:"center",position:"relative",zIndex:1,animation:"gateIn .5s cubic-bezier(.34,1.2,.64,1) both" }}>
        <Sheen />
        <div style={{ width:44,height:44,borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(122,168,255,.2),rgba(45,212,180,.1))",
          border:"1px solid rgba(122,168,255,.3)",margin:"0 auto 18px",display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:18,boxShadow:"0 0 20px rgba(122,168,255,.2),0 0 40px rgba(45,212,180,.1)" }}>🔒</div>
        <div style={{ fontFamily:"Georgia,serif",fontSize:18,fontWeight:300,color:T.txt,marginBottom:4 }}>Block Intelligence</div>
        <div style={{ fontSize:10,color:T.txt3,letterSpacing:".08em",textTransform:"uppercase",marginBottom:24 }}>Restricted Access</div>
        <input type="password" value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key==="Enter" && tryUnlock()}
          placeholder="Enter access code" autoFocus
          style={{ width:"100%",padding:"10px 14px",background:"rgba(255,255,255,.05)",
            border:err?"1px solid rgba(255,96,96,.5)":"1px solid rgba(255,255,255,.12)",
            borderRadius:10,color:T.txt,fontFamily:"Jost,sans-serif",fontSize:13,outline:"none",
            marginBottom:10,letterSpacing:".05em",textAlign:"center",
            animation:shake?"shake .4s ease":"none",transition:"border-color .2s" }} />
        {err && <div style={{ fontSize:9.5,color:T.red,marginBottom:8,letterSpacing:".04em" }}>Invalid access code</div>}
        <button onClick={tryUnlock} style={{ width:"100%",padding:"10px 0",
          background:"linear-gradient(135deg,rgba(122,168,255,.18),rgba(45,212,180,.12))",
          border:"1px solid rgba(122,168,255,.28)",borderRadius:10,cursor:"pointer",
          fontFamily:"Jost,sans-serif",fontSize:11,fontWeight:500,color:T.blue,letterSpacing:".08em" }}>Unlock →</button>
      </div>
    </div>
  );
}

// ── MOBILE VIEW ──
function MobileView({ navigate }) {
  const dotColors = { red:T.red, green:T.green, amber:T.amber, blue:T.blue };
  const BG = "#0d0e13";

  return (
    <div style={{ background:T.bg,minHeight:"100vh",fontFamily:"Jost,sans-serif",color:T.txt,position:"relative",WebkitFontSmoothing:"antialiased" }}>
      {/* BG orbs */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}>
        <div style={{ position:"absolute",width:400,height:400,top:"-10%",left:"-15%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(24,60,200,.15),transparent 65%)",filter:"blur(70px)",animation:"drift1 26s ease-in-out infinite" }} />
        <div style={{ position:"absolute",width:360,height:360,top:"30%",right:"-15%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(90,30,190,.10),transparent 65%)",filter:"blur(70px)",animation:"drift2 32s ease-in-out infinite" }} />
        <div style={{ position:"absolute",width:300,height:300,bottom:"-5%",left:"20%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(10,130,110,.08),transparent 65%)",filter:"blur(70px)",animation:"drift3 38s ease-in-out infinite" }} />
      </div>
      <Grain />

      {/* Nav */}
      <div style={{ position:"sticky",top:0,zIndex:100 }}>
        <div style={{ height:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",
          background:"rgba(10,11,16,.92)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(255,255,255,.07)" }}>
          <button onClick={() => navigate("/")} style={{ background:"none",border:"none",cursor:"pointer",
            fontFamily:"Jost,sans-serif",fontSize:11,color:"rgba(255,255,255,.4)",letterSpacing:".08em" }}>← Back</button>
          <div style={{ fontFamily:"Georgia,serif",fontSize:13,fontWeight:400,color:T.txt }}>
            Marriott <span style={{ color:"rgba(255,255,255,.18)",margin:"0 4px" }}>/</span> Intelligence
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:8.5,color:T.green,letterSpacing:".08em" }}>
            <div style={{ width:4,height:4,borderRadius:"50%",background:T.green,animation:"pulse 2s ease-in-out infinite" }} />LIVE
          </div>
        </div>
        <DisclaimerTicker />
      </div>
      <SfdcFloater />

      {/* Content */}
      <div style={{ position:"relative",zIndex:1,padding:"12px 12px 48px",display:"flex",flexDirection:"column",gap:10 }}>

        {/* Company header — compact */}
        <Reveal delay={0}>
          <div style={{ ...CARD,padding:"14px 14px 12px" }}>
            <Sheen />
            <div style={{ marginBottom:10 }}>
              <div style={{ fontFamily:"Georgia,serif",fontSize:22,fontWeight:300,lineHeight:1.05,marginBottom:3 }}>Marriott International</div>
              <div style={{ fontSize:9,color:T.txt3,letterSpacing:".04em" }}>NYSE: MAR · Global Hospitality · Est. 1927 · 30 Brands</div>
            </div>
            {/* 5-col metrics */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4 }}>
              {[["8,785",T.teal,"Props"],["141",T.blue,"Countries"],["~418k",T.txt2,"Staff"],["$23.7B",T.green,"Rev"],["2022",T.amber,"Eval"]].map(([v,c,l]) => (
                <div key={l} style={{ padding:"6px 6px",background:"rgba(255,255,255,.04)",
                  border:"1px solid rgba(255,255,255,.07)",borderRadius:7,textAlign:"center" }}>
                  <div style={{ fontFamily:"Georgia,serif",fontSize:13,fontWeight:300,color:c,lineHeight:1,marginBottom:2 }}>{v}</div>
                  <div style={{ fontSize:6.5,color:T.txt4,letterSpacing:".07em",textTransform:"uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Core Thesis */}
        <Reveal delay={40}>
          <ThesisCard isMobile={true} />
        </Reveal>

        {/* Partners */}
        <Reveal delay={80}>
          <SecHdr label="Confirmed Partners" />
          {PARTNERS.map(p => <PartnerCard key={p.id} p={p} isMobile={true} />)}
        </Reveal>

        {/* Live Signals — compact */}
        <Reveal delay={110}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8 }}>
            <SecHdr label="Live Signals" />
            <div style={{ display:"flex",alignItems:"center",gap:4,fontSize:8.5,color:T.green,letterSpacing:".08em",marginBottom:10 }}>
              <div style={{ width:4,height:4,borderRadius:"50%",background:T.green,animation:"pulse 2s ease-in-out infinite" }} />LIVE
            </div>
          </div>
          {SIGNALS.map(s => (
            <a key={s.title} href={s.url} target="_blank" rel="noreferrer" style={{ textDecoration:"none",display:"block",marginBottom:6 }}>
              <div style={{ padding:"9px 11px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:9 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:3 }}>
                  <div style={{ width:4,height:4,borderRadius:"50%",flexShrink:0,background:dotColors[s.dot],boxShadow:`0 0 5px ${dotColors[s.dot]}88` }} />
                  <div style={{ fontFamily:"Georgia,serif",fontSize:11.5,fontWeight:300,color:T.txt,lineHeight:1.3,flex:1 }}>{s.title}</div>
                  <span style={{ fontSize:9,color:T.txt4,flexShrink:0 }}>↗</span>
                </div>
                <div style={{ fontSize:10,color:T.txt2,lineHeight:1.5,paddingLeft:10 }}>{s.body}</div>
                <div style={{ fontSize:8,color:T.blue,marginTop:2,paddingLeft:10,letterSpacing:".03em" }}>{s.meta}</div>
              </div>
            </a>
          ))}
        </Reveal>

        {/* Key Stakeholders — uses same OwnerRow as desktop */}
        <Reveal delay={140}>
          <SecHdr label="Key Stakeholders" />
          {[
            { name:"Anthony Capuano",href:"https://www.linkedin.com/in/anthonycapuano/",role:"President & CEO",sig:"HIGH",sigColor:T.red,sigBg:"rgba(255,96,96,.14)",border:T.red,body:"Driving tech modernization across the portfolio. F&B digital transformation is board-mandated priority for 2025.",action:"→ Economic buyer. Board-level F&B tech mandate.",stakeholders:"+12 across portfolio",prior:"Referenced 2022 eval in Q2 earnings",sentiment:"Receptive",sentimentColor:T.green },
            { name:"Drew Pinto",href:"#",role:"EVP & Global CTO",sig:"HIGH",sigColor:T.red,sigBg:"rgba(255,96,96,.14)",border:T.red,body:"Oversees all tech across 8,785 properties. Evaluated Square in 2022. Rationalization mandate — 2022 no was not his.",action:"→ Primary re-engagement. He knows Square. Clean slate.",stakeholders:"+12 incl. IT & Ops leads",prior:"2022 pilot decision maker",sentiment:"Neutral → Warm",sentimentColor:T.amber },
            { name:"Vanguard Group",href:"#",role:"Institutional — 8.9% Stake",sig:"INVESTOR",sigColor:T.blue,sigBg:"rgba(100,145,255,.13)",border:T.blue,body:"Largest institutional holder. Constant margin pressure. Square's unit economics maps directly to shareholder mandate.",action:"→ Efficiency narrative. Per-property TCO reduction.",stakeholders:"Board-level influence",prior:"No direct engagement",sentiment:"Margin-focused",sentimentColor:T.blue },
          ].map(o => <OwnerRow key={o.name} o={o} />)}
        </Reveal>

        {/* Exec Leadership — uses same ExecRow as desktop */}
        <Reveal delay={170}>
          <SecHdr label="Executive Leadership" />
          {[
            { name:"Anthony Capuano",href:"https://www.linkedin.com/in/anthonycapuano/",title:"President & CEO",note:"F&B modernization = top 2025 capex priority. Board-level digital mandate.",badge:"Economic Buyer",bc:T.blue,bb:"rgba(100,145,255,.12)",bbr:"rgba(100,145,255,.22)" },
            { name:"Drew Pinto",href:"#",title:"EVP & Global CTO",note:"Evaluated Square in 2022. Re-engage on enterprise deployment. 2022 no was not his decision.",badge:"Tech Buyer",bc:T.teal,bb:"rgba(45,212,180,.10)",bbr:"rgba(45,212,180,.2)" },
            { name:"Leeny Oberg",href:"#",title:"EVP & CFO",note:"Lead with per-property TCO reduction and Square ↔ NetSuite reconciliation story.",badge:"CFO",bc:T.blue,bb:"rgba(100,145,255,.12)",bbr:"rgba(100,145,255,.22)" },
            { name:"VP F&B Americas",href:"#",title:"Active Search — Role Open",note:"Leadership transition. Engage before new exec is fully onboarded.",badge:"⚠ Gap",bc:T.red,bb:"rgba(255,96,96,.12)",bbr:"rgba(255,96,96,.2)" },
          ].map(e => <ExecRow key={e.name} e={e} />)}
        </Reveal>

        {/* What's Changed — uses same ChangedRow as desktop */}
        <Reveal delay={200}>
          <SecHdr label="What's Changed Since 2022" />
          {[
            { rank:1, icon:"✓", color:T.green, bg:"rgba(74,222,128,.08)", border:"rgba(74,222,128,.18)", title:"MICROS EOL — Forced Migration", change:"Oracle confirmed MICROS 3700 end-of-life. Marriott brands actively evaluating replacements.", why:"The 2022 objection was 'we're not replacing what works.' That's gone — they have to move.", buyer:"Drew Pinto (CTO)" },
            { rank:2, icon:"✓", color:T.green, bg:"rgba(74,222,128,.08)", border:"rgba(74,222,128,.18)", title:"Enterprise KDS Now Live", change:"Square's enterprise kitchen display system is deployed at scale — the #1 gap from 2022.", why:"VP F&B's primary technical objection is closed. Full-service F&B at property scale is proven.", buyer:"VP F&B Americas" },
            { rank:3, icon:"✓", color:T.green, bg:"rgba(74,222,128,.08)", border:"rgba(74,222,128,.18)", title:"Open APIs — Opera + Bonvoy", change:"Native PMS and loyalty integration now fully supported. The 2022 blocker is gone.", why:"Pinto's IT team blocked on integration gaps. Those gaps no longer exist.", buyer:"Drew Pinto + IT" },
            { rank:4, icon:"→", color:T.blue, bg:"rgba(100,145,255,.08)", border:"rgba(100,145,255,.18)", title:"New CTO — Fresh Mandate", change:"Drew Pinto joined 2023 with an active tech rationalization mandate.", why:"The 2022 'no' was not his decision. He evaluates Square with fresh eyes.", buyer:"All stakeholders" },
            { rank:5, icon:"✓", color:T.teal, bg:"rgba(45,212,180,.07)", border:"rgba(45,212,180,.15)", title:"Multi-brand Menu Management", change:"Centralized menu control with per-location overrides now live.", why:"Franchise variance was the ops objection. Now solvable with a single platform.", buyer:"Operations + Franchise" },
          ].map(item => <ChangedRow key={item.rank} item={item} />)}
        </Reveal>

        {/* Discovery */}
        <Reveal delay={230}>
          <SecHdr label="Discovery Priorities" />
          {[["01","Why the 2022 Pilot Stalled","What specifically blocked — API gaps, multi-brand complexity, or champion loss?"],
            ["02","MICROS Migration Timeline","Which brands are actively replacing. Urgency determines the entry point."],
            ["03","Franchise vs. Corporate","Top-down mandate or franchisee-by-franchisee? Determines the sales play."],
            ["04","PMS + Loyalty Integration","Confirm API coverage for Opera Cloud + Bonvoy. Address the 2022 blocker."]].map(([n,t,b]) => (
            <div key={n} style={{ display:"flex",gap:9,padding:"9px 11px",background:"rgba(255,255,255,.03)",
              border:"1px solid rgba(255,255,255,.07)",borderRadius:9,marginBottom:5 }}>
              <div style={{ fontSize:8.5,color:T.txt4,flexShrink:0,paddingTop:1,fontFamily:"monospace" }}>{n}</div>
              <div>
                <div style={{ fontFamily:"Georgia,serif",fontSize:11.5,fontWeight:300,marginBottom:2 }}>{t}</div>
                <div style={{ fontSize:10.5,color:T.txt2,lineHeight:1.5 }}>{b}</div>
              </div>
            </div>
          ))}
        </Reveal>

        {/* SFDC */}
        <Reveal delay={260}>
          <SfdcWidget isMobile={true} />
        </Reveal>

        {/* Pitch Map */}
        <Reveal delay={290}>
          <SecHdr label="Block Ecosystem Pitch Map" />
          {[["Restaurants Premium","MICROS replacement. Full-service F&B, course mgmt, multi-revenue-center reporting."],
            ["Enterprise KDS","High-volume kitchen display at scale. Closes the primary 2022 gap."],
            ["Multi-location Menu","Centralized control with per-location overrides. Solves franchise variance."],
            ["Open APIs → Opera + Bonvoy","Native PMS & loyalty integration. The 2022 blocker is gone."],
            ["Square Banking + Payroll","Expansion motion post-POS via confirmed NetSuite integration."]].map(([t,b]) => (
            <div key={t} style={{ display:"flex",gap:8,padding:"7px 11px",background:"rgba(255,255,255,.03)",
              border:"1px solid rgba(255,255,255,.07)",borderRadius:8,marginBottom:4 }}>
              <div style={{ fontSize:9,color:T.blue,flexShrink:0,paddingTop:2,fontFamily:"monospace" }}>▶</div>
              <div style={{ fontSize:10.5,color:T.txt2,lineHeight:1.5 }}>
                <strong style={{ color:T.txt,fontWeight:500 }}>{t}</strong> — {b}
              </div>
            </div>
          ))}
        </Reveal>

      </div>
    </div>
  );
}

// ── DISCLAIMER TICKER ──
function DisclaimerTicker() {
  const text = "All information is publicly available — no proprietary data, internal systems, or confidential insights from Block / Square have been used. Built for demonstration purposes only.";
  return (
    <div style={{
      position:"relative", overflow:"hidden",
      borderBottom:"1px solid rgba(255,255,255,.05)",
      background:"rgba(255,255,255,.018)",
      height:26, display:"flex", alignItems:"center",
    }}>
      <div style={{
        display:"flex", whiteSpace:"nowrap",
        animation:"tickerScroll 38s linear infinite",
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            fontSize:8.5, color:"rgba(255,255,255,.28)",
            letterSpacing:".07em", padding:"0 60px",
            fontFamily:"Jost,sans-serif", fontWeight:300,
          }}>
            {text}
            <span style={{ color:"rgba(255,255,255,.12)", margin:"0 20px" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── SFDC TOAST ──
const toastBus = { listeners: [] };
function showToast(msg) { toastBus.listeners.forEach(fn => fn(msg)); }
function SfdcToast() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    const fn = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2000); };
    toastBus.listeners.push(fn);
    return () => { toastBus.listeners = toastBus.listeners.filter(f => f !== fn); };
  }, []);
  if (!msg) return null;
  return (
    <div style={{ position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:500,
      pointerEvents:"none",background:"rgba(11,12,18,.94)",backdropFilter:"blur(16px)",
      border:"1px solid rgba(255,255,255,.09)",borderRadius:100,padding:"6px 16px",
      display:"flex",alignItems:"center",gap:8,boxShadow:"0 8px 24px rgba(0,0,0,.4)",
      animation:"toastIn .25s cubic-bezier(.34,1.2,.64,1) both",whiteSpace:"nowrap" }}>
      <div style={{ width:4,height:4,borderRadius:"50%",background:T.green,flexShrink:0 }} />
      <span style={{ fontFamily:"Jost,sans-serif",fontSize:9.5,color:T.txt2,letterSpacing:".04em" }}>{msg}</span>
    </div>
  );
}

// ── SFDC MICRO LOG — minimal ──
function SfdcMicroLog({ label, small }) {
  const [logged, setLogged] = useState(false);
  const handle = (e) => {
    e.stopPropagation();
    if (logged) return;
    setLogged(true);
    logSfdc(label);
    showToast(`Logged · ${label}`);
  };
  return (
    <button onClick={handle} title={`Log: ${label}`} style={{
      padding:"2px 7px",
      background:"transparent",
      border:`1px solid ${logged?"rgba(74,222,128,.2)":"rgba(255,255,255,.07)"}`,
      borderRadius:4,cursor:logged?"default":"pointer",
      fontFamily:"Jost,sans-serif",fontSize:7,
      color:logged?T.green:"rgba(255,255,255,.22)",
      letterSpacing:".07em",transition:"all .2s",flexShrink:0,
    }}>
      {logged ? "✓ logged" : "sfdc"}
    </button>
  );
}

// ── SFDC NAV PILL ──
function SfdcNavPill() {
  const count = useSfdcCount();
  const [open, setOpen] = useState(false);
  if (count === 0) return null;
  return (
    <div style={{ position:"relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display:"flex",alignItems:"center",gap:5,padding:"3px 10px",
        background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",
        borderRadius:100,cursor:"pointer",fontFamily:"Jost,sans-serif",fontSize:8.5,
        color:"rgba(255,255,255,.38)",letterSpacing:".06em",transition:"all .2s",
      }}>
        <span style={{ color:T.green,fontFamily:"monospace" }}>{count}</span>
        <span>· sfdc</span>
      </button>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position:"fixed",inset:0,zIndex:199 }} />
      )}
      {open && (
        <div style={{ position:"absolute",top:"calc(100% + 8px)",right:0,width:250,zIndex:200,
          background:"rgba(11,12,18,.96)",backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,.09)",borderRadius:12,
          boxShadow:"0 16px 40px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.07)",
          padding:"12px 14px",animation:"gateIn .2s ease both" }}>
          <div style={{ fontSize:7.5,fontWeight:500,letterSpacing:".12em",textTransform:"uppercase",
            color:"rgba(255,255,255,.3)",marginBottom:8 }}>Activity Log</div>
          {sfdcLog.items.map((item,i) => (
            <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,.05)",
              fontSize:9,color:T.txt2 }}>
              <span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,marginRight:8 }}>{item.action}</span>
              <span style={{ color:T.txt4,fontSize:7.5,fontFamily:"monospace",flexShrink:0 }}>
                {item.time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
              </span>
            </div>
          ))}
          <button style={{ width:"100%",marginTop:8,padding:"5px 0",
            background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",
            borderRadius:6,cursor:"pointer",fontFamily:"Jost,sans-serif",fontSize:8.5,
            color:T.txt3,letterSpacing:".06em" }}>
            Push all to SFDC
          </button>
        </div>
      )}
    </div>
  );
}

function SfdcFloater() { return <SfdcToast />; }


function ThesisCard({ isMobile }) {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW_HEIGHT = 68;
  const BG = "#0d0e13";

  return (
    <div style={{
      background:"radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.06) 0%,transparent 65%),rgba(13,14,19,.6)",
      backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",
      border:"1px solid rgba(255,255,255,.10)",borderRadius:16,
      boxShadow:"0 4px 6px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.18)",
      padding:16,position:"relative" }}>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
        background:"linear-gradient(90deg,transparent,rgba(255,255,255,.28) 50%,transparent)",pointerEvents:"none" }} />

      {/* Header */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:7 }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:T.teal,boxShadow:"0 0 8px rgba(45,212,180,.8)" }} />
          <span style={{ fontSize:9,fontWeight:500,letterSpacing:".12em",textTransform:"uppercase",color:T.teal }}>Core Thesis</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:8.5,color:T.txt3,padding:"2px 8px",background:"rgba(255,255,255,.04)",
            border:"1px solid rgba(255,255,255,.08)",borderRadius:4 }}>⚡ Joey's read</span>
          {expanded && (
            <button onClick={() => setExpanded(false)} style={{
              display:"flex",alignItems:"center",gap:4,
              background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.10)",
              borderRadius:6,padding:"3px 8px",cursor:"pointer",fontFamily:"Jost,sans-serif",
              fontSize:8.5,color:T.txt3,letterSpacing:".06em" }}>
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
                style={{ transform:"rotate(180deg)" }}>
                <path d="M2 4l4 4 4-4"/>
              </svg>
              Collapse
            </button>
          )}
        </div>
      </div>

      {/* Text clip container */}
      <div style={{
        maxHeight: expanded ? "400px" : `${PREVIEW_HEIGHT}px`,
        overflow:"hidden",
        transition:"max-height .45s cubic-bezier(.4,0,.2,1)",
        maskImage: expanded ? "none" : "linear-gradient(to bottom, black 30%, transparent 100%)",
        WebkitMaskImage: expanded ? "none" : "linear-gradient(to bottom, black 30%, transparent 100%)",
      }}>
        <div style={{ fontSize:isMobile?12.5:11.5,color:T.txt,lineHeight:1.72,fontWeight:300 }}>
          Marriott is a re-engagement play, not a cold pitch. The 2022 Courtyard pilot proved Square works at property level — the blockers were enterprise infrastructure gaps that no longer exist. Oracle MICROS EOL pressure, a new CTO with a fresh mandate, and an open VP F&B seat create a rare simultaneous opening. This is the pitch: <em style={{ color:T.blue }}>"You evaluated us early. Here's what's different."</em> Franchise variance is the only remaining wildcard — determine top-down vs. franchisee motion before committing to a sales play.
        </div>
        {expanded && (
          <div style={{ fontSize:8.5,color:T.txt3,lineHeight:1.65,paddingTop:8,
            marginTop:8,borderTop:"1px solid rgba(255,255,255,.07)" }}>
            Synthesized from: Marriott 2024 Annual Report · Q4 2025 Earnings · Drew Pinto LinkedIn (Mar 2026) · CIO Dive (Feb 2026) · Hotel Dive (May 2026) · Reviewed and framed by Joey Amari
          </div>
        )}
      </div>

      {/* Clean in-flow toggle — no absolute, no floating arrow */}
      <button onClick={() => setExpanded(!expanded)} style={{
        display:"flex",alignItems:"center",justifyContent:"center",
        width:"100%",marginTop:8,paddingTop:6,paddingBottom:2,
        background:"none",border:"none",borderTop:"1px solid rgba(255,255,255,.05)",
        cursor:"pointer" }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
          stroke="rgba(255,255,255,.18)" strokeWidth="1.5"
          style={{ transition:"transform .3s",transform:expanded?"rotate(180deg)":"none",
            animation:expanded?"none":"arrowBounce 1.8s ease-in-out infinite" }}>
          <path d="M2 4l4 4 4-4"/>
        </svg>
      </button>

      {expanded && <RefreshBtn isMobile={isMobile} />}
    </div>
  );
}

function OwnerRow({ o }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? "radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.08) 0%,transparent 65%)"
          : "radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.05) 0%,transparent 65%)",
        border:`1px solid ${open||hov?"rgba(255,255,255,.14)":"rgba(255,255,255,.08)"}`,
        borderLeft:`2px solid ${o.border}`,borderRadius:10,marginBottom:5,overflow:"hidden",
        transition:"all .22s",
        transform: hov ? "translateY(-1px)" : "none",
        boxShadow: hov ? `0 6px 20px rgba(0,0,0,.35),0 0 12px ${o.border}18` : "0 2px 8px rgba(0,0,0,.2)",
      }}>
      <div onClick={() => setOpen(!open)} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 12px",cursor:"pointer" }}>
        <div style={{ flex:1,display:"flex",alignItems:"center",gap:8,minWidth:0 }}>
          <div style={{ fontFamily:"Georgia,serif",fontSize:12,fontWeight:300,color:T.txt,whiteSpace:"nowrap" }}>
            <a href={o.href} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ color:T.txt,textDecoration:"none" }}>{o.name}</a>
          </div>
          <div style={{ fontSize:9,color:T.txt3,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{o.role}</div>
        </div>
        <SfdcMicroLog label={`Contact touched: ${o.name}`} small={true} />
        <span style={{ fontSize:8,fontWeight:500,letterSpacing:".08em",padding:"2px 7px",borderRadius:3,
          color:o.sigColor,background:o.sigBg,flexShrink:0 }}>{o.sig}</span>
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"
          style={{ transition:"transform .2s",transform:open?"rotate(180deg)":"none",flexShrink:0 }}>
          <path d="M2 4l4 4 4-4"/>
        </svg>
      </div>
      {open && (
        <div style={{ padding:"0 12px 10px",borderTop:"1px solid rgba(255,255,255,.06)" }}>
          <div style={{ fontSize:10.5,color:T.txt2,lineHeight:1.58,paddingTop:8,marginBottom:8 }}>{o.body}</div>
          {/* Inline scrollable meta strip — no height increase */}
          <div style={{ display:"flex",gap:8,overflowX:"auto",marginBottom:8,
            scrollbarWidth:"none",msOverflowStyle:"none",WebkitOverflowScrolling:"touch" }}>
            {[
              ["Stakeholders", o.stakeholders||"+12", T.txt],
              ["Prior", o.prior||"2022 pilot eval", T.txt2],
              ["Sentiment", o.sentiment||"Warm", o.sentimentColor||T.green],
            ].map(([l,v,c]) => (
              <div key={l} style={{ flexShrink:0,padding:"4px 10px",
                background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",
                borderRadius:6,display:"flex",alignItems:"center",gap:6 }}>
                <span style={{ fontSize:7.5,color:T.txt4,letterSpacing:".08em",textTransform:"uppercase",whiteSpace:"nowrap" }}>{l}</span>
                <span style={{ fontSize:9.5,color:c,fontWeight:400,whiteSpace:"nowrap" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:9.5,color:T.teal,fontStyle:"italic" }}>{o.action}</div>
        </div>
      )}
    </div>
  );
}

function ExecRow({ e }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.03)",
        border:`1px solid ${open||hov?"rgba(255,255,255,.13)":"rgba(255,255,255,.07)"}`,
        borderRadius:9,marginBottom:5,overflow:"hidden",transition:"all .22s",
        transform: hov ? "translateY(-1px)" : "none",
        boxShadow: hov ? "0 6px 20px rgba(0,0,0,.3)" : "none",
      }}>
      <div onClick={() => setOpen(!open)} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 12px",cursor:"pointer" }}>
        <div style={{ flex:1,display:"flex",alignItems:"center",gap:8,minWidth:0 }}>
          <div style={{ fontFamily:"Georgia,serif",fontSize:12,fontWeight:300,color:T.txt,whiteSpace:"nowrap" }}>
            <a href={e.href} target="_blank" rel="noreferrer" onClick={ev=>ev.stopPropagation()} style={{ color:T.txt,textDecoration:"none" }}>{e.name}</a>
          </div>
          <div style={{ fontSize:9,color:T.txt3,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{e.title}</div>
        </div>
        <SfdcMicroLog label={`Contact touched: ${e.name}`} small={true} />
        <span style={{ fontSize:8,fontWeight:500,letterSpacing:".07em",padding:"2px 8px",borderRadius:3,
          whiteSpace:"nowrap",flexShrink:0,color:e.bc,background:e.bb,border:`1px solid ${e.bbr}` }}>{e.badge}</span>
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"
          style={{ transition:"transform .2s",transform:open?"rotate(180deg)":"none",flexShrink:0 }}>
          <path d="M2 4l4 4 4-4"/>
        </svg>
      </div>
      {open && (
        <div style={{ padding:"0 12px 10px",borderTop:"1px solid rgba(255,255,255,.06)" }}>
          <div style={{ fontSize:10.5,color:T.txt2,lineHeight:1.55,paddingTop:8 }}>{e.note}</div>
        </div>
      )}
    </div>
  );
}

// ── WHAT'S CHANGED ROW — expandable ──
function ChangedRow({ item }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => setOpen(!open)}
      style={{
        background: hov ? item.bg : "rgba(255,255,255,.025)",
        border:`1px solid ${hov||open ? item.border : "rgba(255,255,255,.07)"}`,
        borderLeft:`2px solid ${item.color}`,
        borderRadius:9,padding:"8px 10px",cursor:"pointer",
        transition:"all .22s",
        transform: hov ? "translateY(-1px)" : "none",
        boxShadow: hov ? `0 4px 16px rgba(0,0,0,.25),0 0 8px ${item.color}18` : "none",
      }}>
      {/* Collapsed: rank + icon + title + buyer badge */}
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <div style={{ fontFamily:"monospace",fontSize:8,color:item.color,
          background:item.bg,border:`1px solid ${item.border}`,
          borderRadius:4,padding:"1px 5px",flexShrink:0,fontWeight:600 }}>
          #{item.rank}
        </div>
        <div style={{ fontSize:10.5,color:T.txt,fontWeight:500,flex:1,lineHeight:1.3 }}>
          {item.title}
        </div>
        <svg width="8" height="8" viewBox="0 0 12 12" fill="none"
          stroke="rgba(255,255,255,.25)" strokeWidth="1.5"
          style={{ transition:"transform .2s",transform:open?"rotate(180deg)":"none",flexShrink:0 }}>
          <path d="M2 4l4 4 4-4"/>
        </svg>
      </div>

      {/* Expanded: change + why + buyer */}
      {open && (
        <div style={{ marginTop:8,paddingTop:8,borderTop:"1px solid rgba(255,255,255,.06)" }}>
          <div style={{ fontSize:10,color:T.txt2,lineHeight:1.6,marginBottom:6 }}>
            <span style={{ color:item.color,fontWeight:500 }}>What changed: </span>
            {item.change}
          </div>
          <div style={{ fontSize:10,color:T.txt2,lineHeight:1.6,marginBottom:8 }}>
            <span style={{ color:T.teal,fontWeight:500 }}>Why it matters: </span>
            {item.why}
          </div>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <span style={{ fontSize:8.5,color:T.txt3,fontStyle:"italic" }}>Unblocks: {item.buyer}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── OVERVIEW CARD — collapsible ──
function OverviewCard() {
  const [open, setOpen] = useState(false);
  const BG = "#0d0e13";

  return (
    <div style={{ ...CARD, padding:16, position:"relative" }} className="living-card hover-lift">
      <Sheen />
      <div style={{ position:"absolute",top:0,bottom:0,width:"40%",
        background:"linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)",
        animation:"shimmer 1.8s .3s ease forwards",pointerEvents:"none",zIndex:3 }} />

      {/* Title only — no badges */}
      <div style={{ marginBottom:10 }}>
        <div style={{ fontFamily:"Georgia,serif",fontSize:20,fontWeight:300,lineHeight:1.05 }}>Marriott International</div>
        <div style={{ fontSize:9.5,color:T.txt3,letterSpacing:".04em",marginTop:3 }}>
          NYSE: MAR · Global Hospitality · Est. 1927 · 30 Brands · 141 Countries
        </div>
      </div>

      {/* Key Metrics — always visible */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom: open ? 12 : 0 }}>
        {[["8,785",T.teal,"Properties"],["141",T.blue,"Countries"],["~418k",T.txt2,"Employees"],["$23.7B",T.green,"Revenue '24"],["2022",T.amber,"Prior Eval"]].map(([v,c,l]) => (
          <div key={l} style={{ padding:"8px 10px",background:"rgba(255,255,255,.04)",
            border:"1px solid rgba(255,255,255,.07)",borderRadius:9 }}>
            <div style={{ fontFamily:"Georgia,serif",fontSize:15,fontWeight:300,color:c,lineHeight:1,marginBottom:3 }}>{v}</div>
            <div style={{ fontSize:7.5,color:T.txt3,letterSpacing:".08em",textTransform:"uppercase" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Expandable body */}
      <div style={{ maxHeight:open?"220px":"0px", overflow:"hidden",
        transition:"max-height .4s cubic-bezier(.4,0,.2,1)" }}>
        <div style={{ paddingTop:12,fontSize:11,color:T.txt2,lineHeight:1.68,marginBottom:10,fontWeight:300 }}>
          World's largest hotel company. Hybrid franchise-managed model with complex F&B at every property tier. 2022 Square pilot in Courtyard NYC/Boston proved unit-level performance. $1.1B tech investment in 2026 with PMS replatform in active deployment.
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,paddingBottom:4 }}>
          {[["Tech Investment","$1.1B in 2026"],["Re-Engage Trigger","MICROS EOL → Now"],["Parent","Public — MAR"]].map(([l,v]) => (
            <div key={l}>
              <div style={{ fontSize:8,color:T.txt3,letterSpacing:".08em",textTransform:"uppercase",marginBottom:3 }}>{l}</div>
              <div style={{ fontSize:11,color:T.txt,fontWeight:400 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle tap area — always at bottom, no floating arrow */}
      <button onClick={() => setOpen(!open)} style={{
        display:"flex",alignItems:"center",justifyContent:"center",
        width:"100%",marginTop:8,paddingTop:6,paddingBottom:2,
        background:"none",border:"none",borderTop:"1px solid rgba(255,255,255,.05)",
        cursor:"pointer" }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
          stroke="rgba(255,255,255,.18)" strokeWidth="1.5"
          style={{ transition:"transform .3s",transform:open?"rotate(180deg)":"none",
            animation:open?"none":"arrowBounce 1.8s ease-in-out infinite" }}>
          <path d="M2 4l4 4 4-4"/>
        </svg>
      </button>
    </div>
  );
}

// ── DESKTOP VIEW ──
function DesktopView({ navigate }) {
  const [clock, setClock] = useState("");
  const dotColors = { red:T.red, green:T.green, amber:T.amber, blue:T.blue };

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setClock(n.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    };
    tick(); const id = setInterval(tick,1000); return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background:T.bg,minHeight:"100vh",fontFamily:"Jost,system-ui,sans-serif",color:T.txt,position:"relative",WebkitFontSmoothing:"antialiased" }}>
      {/* Living BG */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}>
        <div style={{ position:"absolute",width:700,height:600,top:"-12%",left:"-10%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(24,60,200,.15),transparent 65%)",filter:"blur(90px)",animation:"drift1 26s ease-in-out infinite" }} />
        <div style={{ position:"absolute",width:580,height:580,top:"20%",right:"-12%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(90,30,190,.11),transparent 65%)",filter:"blur(80px)",animation:"drift2 32s ease-in-out infinite" }} />
        <div style={{ position:"absolute",width:500,height:420,bottom:"-10%",left:"25%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(10,130,110,.09),transparent 65%)",filter:"blur(80px)",animation:"drift3 38s ease-in-out infinite" }} />
        <div style={{ position:"absolute",width:200,height:200,top:"30%",left:"20%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(122,168,255,.06),transparent 70%)",filter:"blur(40px)",animation:"orbPulse 6s ease-in-out infinite" }} />
        <div style={{ position:"absolute",width:180,height:180,bottom:"25%",right:"20%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(45,212,180,.05),transparent 70%)",filter:"blur(40px)",animation:"orbPulse 8s 2s ease-in-out infinite" }} />
      </div>
      <Grain />

      {/* NAV */}
      <div style={{ position:"fixed",top:0,left:0,right:0,zIndex:100 }}>
        <div style={{ height:52,display:"flex",
          alignItems:"center",justifyContent:"space-between",padding:"0 32px",
          background:"rgba(10,11,16,.82)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(255,255,255,.08)",
          boxShadow:"0 1px 0 rgba(255,255,255,.06),0 8px 24px rgba(0,0,0,.3)" }}>
          <div style={{ fontFamily:"Georgia,serif",fontSize:15.5,fontWeight:400,letterSpacing:".04em" }}>
            Joseph <span style={{ color:"rgba(255,255,255,.2)",margin:"0 6px" }}>/</span> Amari
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <button onClick={() => navigate("/")} style={{ fontFamily:"Jost,sans-serif",fontSize:10,fontWeight:500,
              letterSpacing:".1em",textTransform:"uppercase",color:"rgba(255,255,255,.38)",background:"none",
              border:"none",cursor:"pointer",padding:"5px 16px",borderRadius:100,transition:"color .2s" }}>← Back</button>
            <div style={{ display:"flex",alignItems:"center",gap:8,padding:"4px 14px",borderRadius:100,
              background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.12)" }}>
              <span style={{ fontSize:10,fontWeight:500,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(255,255,255,.96)" }}>Enterprise Intelligence</span>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <SfdcNavPill />
            <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:9,color:T.green,letterSpacing:".08em",fontWeight:500 }}>
              <div style={{ width:5,height:5,borderRadius:"50%",background:T.green,animation:"pulse 2s ease-in-out infinite" }} />LIVE
            </div>
            <div style={{ fontSize:9.5,color:T.txt3,letterSpacing:".04em",fontFamily:"monospace" }}>{clock}</div>
          </div>
        </div>
        <DisclaimerTicker />
      </div>

      <SfdcFloater />

      {/* 3-COL */}
      <div style={{ position:"relative",zIndex:1,paddingTop:78,display:"grid",
        gridTemplateColumns:"220px 1fr 268px",height:"calc(100vh - 78px)",overflow:"hidden" }}>

        {/* LEFT COL */}
        <div style={{ borderRight:"1px solid rgba(255,255,255,.07)",padding:"20px 16px",overflowY:"auto",display:"flex",flexDirection:"column",gap:16 }}>
          <Reveal delay={0}>
            <div style={{ paddingBottom:14,borderBottom:"1px solid rgba(255,255,255,.07)" }}>
              <div style={{ fontFamily:"Georgia,serif",fontSize:21,fontWeight:300,lineHeight:1.05,marginBottom:5 }}>Marriott<br/>International</div>
              <div style={{ fontSize:10,color:T.txt3,letterSpacing:".04em",lineHeight:1.7 }}>marriott.com · Global Hospitality<br/>Bethesda, MD · NYSE: MAR<br/>Est. 1927 · 30 Brands</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:4,marginTop:8 }}>
                {tag("HOSPITALITY",T.blue,"rgba(100,145,255,.12)","rgba(100,145,255,.22)")}
                {tag("FRANCHISE",T.teal,"rgba(45,212,180,.10)","rgba(45,212,180,.2)")}
                {tag("🔥 HOT",T.red,"rgba(255,96,96,.12)","rgba(255,96,96,.2)")}
                {tag("★ IDEAL ICP",T.green,"rgba(74,222,128,.10)","rgba(74,222,128,.2)")}
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <SecHdr label="Confirmed Partners" />
            {PARTNERS.map(p => <PartnerCard key={p.id} p={p} isMobile={false} />)}
          </Reveal>
          <Reveal delay={140}>
            <SecHdr label="F&B Stack" />
            {[["Oracle MICROS","CURRENT — EOL",T.red,"rgba(255,96,96,.12)","rgba(255,96,96,.2)"],["Agilysys POS","CURRENT",T.txt3,"rgba(255,255,255,.05)","rgba(255,255,255,.08)"],["Square (2022)","PRIOR EVAL",T.amber,"rgba(245,166,35,.10)","rgba(245,166,35,.18)"],["Opera Cloud PMS","INTEG OPP",T.green,"rgba(74,222,128,.08)","rgba(74,222,128,.15)"]].map(([n,s,c,bg,b]) => (
              <div key={n} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 9px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:7,marginBottom:4 }}>
                <span style={{ fontSize:10.5,color:T.txt,fontWeight:400 }}>{n}</span>
                <span style={{ fontSize:8,fontWeight:500,letterSpacing:".06em",padding:"2px 7px",borderRadius:3,color:c,background:bg,border:`1px solid ${b}` }}>{s}</span>
              </div>
            ))}
          </Reveal>
          <Reveal delay={180}>
            <SfdcWidget isMobile={false} />
          </Reveal>
        </div>

        {/* MAIN COL */}
        <div style={{ padding:"20px 24px",overflowY:"auto",display:"flex",flexDirection:"column",gap:14 }}>
          <Reveal delay={40}>
            <OverviewCard />
          </Reveal>

          <Reveal delay={100}>
            <ThesisCard isMobile={false} />
          </Reveal>

          <Reveal delay={160}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,alignItems:"stretch" }}>
              {/* OWNERSHIP */}
              <div style={{
                background:"radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.07) 0%,transparent 65%),radial-gradient(ellipse 55% 45% at 88% 100%,rgba(255,255,255,.04) 0%,transparent 60%)",
                border:"1px solid rgba(255,255,255,.09)",borderRadius:14,padding:"14px 14px",
                display:"flex",flexDirection:"column",
                boxShadow:"0 4px 20px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.10)",
                position:"relative",overflow:"hidden",
              }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
                  background:"linear-gradient(90deg,transparent,rgba(255,255,255,.28) 50%,transparent)",
                  pointerEvents:"none" }} />
                <SecHdr label="Key Stakeholders" />
                <div style={{ display:"flex",flexDirection:"column",gap:5,flex:1 }}>
                  {[
                    { name:"Anthony Capuano",href:"https://www.linkedin.com/in/anthonycapuano/",role:"President & CEO",sig:"HIGH",sigColor:T.red,sigBg:"rgba(255,96,96,.14)",border:T.red,body:"Driving tech modernization across the portfolio. F&B digital transformation is board-mandated priority for 2025.",action:"→ Economic buyer. Board-level F&B tech mandate.",stakeholders:"+12 across portfolio",prior:"Referenced 2022 eval in Q2 earnings",sentiment:"Receptive",sentimentColor:T.green },
                    { name:"Drew Pinto",href:"#",role:"EVP & Global CTO",sig:"HIGH",sigColor:T.red,sigBg:"rgba(255,96,96,.14)",border:T.red,body:"Oversees all tech across 8,785 properties. Evaluated Square in 2022. Rationalization mandate — 2022 no was not his.",action:"→ Primary re-engagement. He knows Square. Clean slate.",stakeholders:"+12 incl. IT & Ops leads",prior:"2022 pilot decision maker",sentiment:"Neutral → Warm",sentimentColor:T.amber },
                    { name:"Vanguard Group",href:"#",role:"Institutional — 8.9% Stake",sig:"INVESTOR",sigColor:T.blue,sigBg:"rgba(100,145,255,.13)",border:T.blue,body:"Largest institutional holder. Constant margin pressure. Square's unit economics maps directly to shareholder mandate.",action:"→ Efficiency narrative. Per-property TCO reduction.",stakeholders:"Board-level influence",prior:"No direct engagement",sentiment:"Margin-focused",sentimentColor:T.blue },
                  ].map(o => <OwnerRow key={o.name} o={o} />)}
                </div>
              </div>

              {/* WHAT'S CHANGED */}
              <div style={{
                background:"radial-gradient(ellipse 65% 55% at 12% 0%,rgba(255,255,255,.07) 0%,transparent 65%),radial-gradient(ellipse 55% 45% at 88% 100%,rgba(255,255,255,.04) 0%,transparent 60%)",
                border:"1px solid rgba(255,255,255,.09)",borderRadius:14,padding:"14px 14px",
                display:"flex",flexDirection:"column",
                boxShadow:"0 4px 20px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.10)",
                position:"relative",overflow:"hidden",
              }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
                  background:"linear-gradient(90deg,transparent,rgba(255,255,255,.28) 50%,transparent)",
                  pointerEvents:"none" }} />
                <SecHdr label="What's Changed Since 2022" />
                <div style={{ display:"flex",flexDirection:"column",gap:5,flex:1 }}>
                  {[
                    { rank:1, icon:"✓", color:T.green, bg:"rgba(74,222,128,.08)", border:"rgba(74,222,128,.18)", title:"MICROS EOL — Forced Migration", change:"Oracle confirmed MICROS 3700 end-of-life. Marriott brands actively evaluating replacements.", why:"The 2022 objection was 'we're not replacing what works.' That's gone — they have to move.", buyer:"Drew Pinto (CTO)" },
                    { rank:2, icon:"✓", color:T.green, bg:"rgba(74,222,128,.08)", border:"rgba(74,222,128,.18)", title:"Enterprise KDS Now Live", change:"Square's enterprise kitchen display system is deployed at scale — the #1 gap from 2022.", why:"VP F&B's primary technical objection is closed. Full-service F&B at property scale is proven.", buyer:"VP F&B Americas" },
                    { rank:3, icon:"✓", color:T.green, bg:"rgba(74,222,128,.08)", border:"rgba(74,222,128,.18)", title:"Open APIs — Opera + Bonvoy", change:"Native PMS and loyalty integration now fully supported. The 2022 blocker is gone.", why:"Pinto's IT team blocked on integration gaps. Those gaps no longer exist.", buyer:"Drew Pinto + IT" },
                    { rank:4, icon:"→", color:T.blue, bg:"rgba(100,145,255,.08)", border:"rgba(100,145,255,.18)", title:"New CTO — Fresh Mandate", change:"Drew Pinto joined 2023 with an active tech rationalization mandate.", why:"The 2022 'no' was not his decision. He evaluates Square with fresh eyes.", buyer:"All stakeholders" },
                    { rank:5, icon:"✓", color:T.teal, bg:"rgba(45,212,180,.07)", border:"rgba(45,212,180,.15)", title:"Multi-brand Menu Management", change:"Centralized menu control with per-location overrides now live.", why:"Franchise variance was the ops objection. Now solvable with a single platform.", buyer:"Operations + Franchise" },
                  ].map((item) => (
                    <ChangedRow key={item.rank} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <SecHdr label="Executive Leadership" />
            {[
              { name:"Anthony Capuano",href:"https://www.linkedin.com/in/anthonycapuano/",title:"President & CEO",note:"F&B modernization = top 2025 capex priority. Board-level digital mandate.",badge:"Economic Buyer",bc:T.blue,bb:"rgba(100,145,255,.12)",bbr:"rgba(100,145,255,.22)" },
              { name:"Drew Pinto",href:"#",title:"EVP & Global CTO",note:"Evaluated Square in 2022. Re-engage on enterprise deployment. 2022 no was not his decision.",badge:"Tech Buyer",bc:T.teal,bb:"rgba(45,212,180,.10)",bbr:"rgba(45,212,180,.2)" },
              { name:"Leeny Oberg",href:"#",title:"EVP & CFO",note:"Lead with per-property TCO reduction and Square ↔ NetSuite reconciliation story.",badge:"CFO",bc:T.blue,bb:"rgba(100,145,255,.12)",bbr:"rgba(100,145,255,.22)" },
              { name:"VP F&B Americas",href:"#",title:"Active Search — Role Open",note:"Leadership transition. Engage before new exec is fully onboarded.",badge:"⚠ Gap",bc:T.red,bb:"rgba(255,96,96,.12)",bbr:"rgba(255,96,96,.2)" },
            ].map(e => <ExecRow key={e.name} e={e} />)}
          </Reveal>

          <Reveal delay={260}>
            <SecHdr label="Discovery Priorities" />
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              {[["01","Why the 2022 Pilot Stalled","What specifically blocked — API gaps, multi-brand complexity, or champion loss?"],["02","Oracle MICROS Migration Timeline","Which brands are actively replacing. Urgency determines the entry point."],["03","Franchise vs. Corporate Authority","Top-down mandate or franchisee-by-franchisee? This determines the sales play."],["04","PMS + Loyalty Integration Req","Confirm API coverage for Opera Cloud + Bonvoy. Address the 2022 blocker."]].map(([n,t,b]) => (
                <div key={n} style={{ display:"flex",gap:10,padding:"8px 11px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:9 }}>
                  <div style={{ fontSize:9,color:T.txt3,flexShrink:0,width:16,paddingTop:2,fontFamily:"monospace" }}>{n}</div>
                  <div><div style={{ fontFamily:"Georgia,serif",fontSize:11,fontWeight:300,marginBottom:2 }}>{t}</div><div style={{ fontSize:10,color:T.txt2,lineHeight:1.55 }}>{b}</div></div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={320}>
            <SecHdr label="Block Ecosystem Pitch Map" />
            {[["▶","Restaurants Premium"," — Full-service F&B, course mgmt, multi-revenue-center reporting. MICROS replacement at lower TCO."],["▶","Enterprise KDS"," — High-volume, multi-station kitchen display. Closes the primary 2022 gap."],["▶","Multi-location Menu Mgmt"," — Centralized control with per-location overrides. Solves franchise POS variance."],["▶","Open APIs → Opera + Bonvoy"," — Native PMS & loyalty integration. The 2022 blocker is gone."],["▶","Square Banking + Payroll"," — Expansion motion post-POS via confirmed NetSuite integration."]].map(([a,t,b]) => (
              <div key={t} style={{ display:"flex",gap:8,padding:"7px 10px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:8,marginBottom:4 }}>
                <div style={{ fontSize:9,color:T.blue,flexShrink:0,paddingTop:2,fontFamily:"monospace" }}>{a}</div>
                <div style={{ fontSize:10.5,color:T.txt2,lineHeight:1.55 }}><strong style={{ color:T.txt,fontWeight:500 }}>{t}</strong>{b}</div>
              </div>
            ))}
          </Reveal>
        </div>

        {/* RIGHT COL */}
        <div style={{ borderLeft:"1px solid rgba(255,255,255,.07)",padding:"20px 16px",overflowY:"auto",display:"flex",flexDirection:"column",gap:14 }}>
          <Reveal delay={80}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8 }}>
              <SecHdr label="Live Signals" />
              <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:9,color:T.green,letterSpacing:".08em",fontWeight:500,marginBottom:12 }}>
                <div style={{ width:5,height:5,borderRadius:"50%",background:T.green,animation:"pulse 2s ease-in-out infinite" }} />LIVE
              </div>
            </div>
            {SIGNALS.map(s => (
              <a key={s.title} href={s.url} target="_blank" rel="noreferrer" style={{ textDecoration:"none",display:"block",marginBottom:5 }}>
                <div style={{ padding:"9px 11px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,transition:"border-color .2s,background .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,.14)"; e.currentTarget.style.background="rgba(255,255,255,.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,.07)"; e.currentTarget.style.background="rgba(255,255,255,.03)"; }}>
                  <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:4 }}>
                    <div style={{ width:5,height:5,borderRadius:"50%",flexShrink:0,background:dotColors[s.dot],boxShadow:`0 0 6px ${dotColors[s.dot]}99` }} />
                    <div style={{ fontFamily:"Georgia,serif",fontSize:11,fontWeight:300,color:T.txt,lineHeight:1.3,flex:1 }}>{s.title}</div>
                    <span style={{ fontSize:9,color:T.txt3,flexShrink:0 }}>↗</span>
                  </div>
                  <div style={{ fontSize:10,color:T.txt2,lineHeight:1.55,paddingLeft:12 }}>{s.body}</div>
                  <div style={{ fontSize:8.5,color:T.blue,marginTop:3,paddingLeft:12,letterSpacing:".03em" }}>{s.meta}</div>
                </div>
              </a>
            ))}
          </Reveal>

          <Reveal delay={140}>
            <SecHdr label="Re-Engagement Strategy" />
            {[["#1","Re-engage Drew Pinto Direct","Cold re-intro with \"What's Changed\" framing. Lead with MICROS pressure. He knows Square — capability update, not a cold pitch."],["#2","Activate Oracle Partner Path","Hayley Williams at Oracle has active Marriott relationship. Co-sell MICROS EOL + Square replacement through the partner channel."],["#3","Courtyard GM Referral Loop","Re-engage pilot GMs via Stevie Nicks. Get updated testimonials and corporate referral intro to Drew Pinto's team."]].map(([n,t,b]) => (
              <div key={n} style={{ padding:"9px 11px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,marginBottom:5 }}>
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:4 }}>
                  <div style={{ fontFamily:"monospace",fontSize:9,color:T.blue,flexShrink:0 }}>{n}</div>
                  <div style={{ fontFamily:"Georgia,serif",fontSize:11,fontWeight:300,color:T.txt,lineHeight:1.3 }}>{t}</div>
                </div>
                <div style={{ fontSize:10,color:T.txt2,lineHeight:1.55,paddingLeft:18 }}>{b}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ──
export default function Intelligence() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("bi_unlocked") === "1");
  const handleUnlock = () => { sessionStorage.setItem("bi_unlocked","1"); setUnlocked(true); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 6px rgba(74,222,128,.8);}50%{opacity:.4;box-shadow:0 0 2px rgba(74,222,128,.3);}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fillBar{from{width:0}to{width:28%}}
        @keyframes drift1{0%,100%{transform:translate(0,0)}40%{transform:translate(30px,-20px)}70%{transform:translate(-15px,25px)}}
        @keyframes drift2{0%,100%{transform:translate(0,0)}35%{transform:translate(-22px,28px)}65%{transform:translate(20px,-15px)}}
        @keyframes drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,20px)}}
        @keyframes orbPulse{0%,100%{opacity:.7;transform:scale(1);}50%{opacity:1;transform:scale(1.08);}}
        @keyframes borderGlow{0%,100%{box-shadow:0 0 0 0 rgba(122,168,255,0);}50%{box-shadow:0 0 16px 2px rgba(122,168,255,.08);}}
        @keyframes slackGlow{0%,100%{box-shadow:0 0 8px rgba(122,168,255,.1);}50%{box-shadow:0 0 16px rgba(122,168,255,.28),0 0 4px rgba(45,212,180,.15);}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
        @keyframes gateIn{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}
        @keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes arrowBounce{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(3px);opacity:1}}
        @keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
        @keyframes floaterPulse{0%,100%{box-shadow:0 4px 20px rgba(0,0,0,.4),0 0 16px rgba(74,222,128,.12);}50%{box-shadow:0 4px 24px rgba(0,0,0,.5),0 0 24px rgba(74,222,128,.22);}}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}
        .hover-lift{transition:transform .22s ease,box-shadow .22s ease;}
        .hover-lift:hover{transform:translateY(-2px);}
      `}</style>
      {!unlocked
        ? <PasswordGate onUnlock={handleUnlock} />
        : isMobile
          ? <MobileView navigate={navigate} />
          : <DesktopView navigate={navigate} />
      }
    </>
  );
}
