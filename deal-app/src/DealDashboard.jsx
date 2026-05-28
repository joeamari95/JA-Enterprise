import { useState, useRef, useEffect } from "react";

// ── DESIGN TOKENS ──
const T = {
  bg:"#0d0e13", txt:"rgba(255,255,255,.93)", txt2:"rgba(255,255,255,.72)",
  txt3:"rgba(255,255,255,.44)", txt4:"rgba(255,255,255,.22)",
  blue:"#7aa8ff", teal:"#33ddc8", red:"#ff6060", amber:"#f5a623", green:"#4ade80",
  purple:"#b794f4", pink:"#f687b3",
};

const CARD = {
  background:"radial-gradient(ellipse 70% 50% at 15% 0%,rgba(255,255,255,.08) 0%,transparent 60%),rgba(13,14,19,.72)",
  backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
  border:"1px solid rgba(255,255,255,.11)", borderRadius:14,
  boxShadow:"0 2px 4px rgba(0,0,0,.3),0 8px 24px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.18)",
  position:"relative", overflow:"hidden",
};

function Sheen() {
  return <div style={{position:"absolute",top:0,left:0,right:0,height:1,
    background:"linear-gradient(90deg,transparent,rgba(255,255,255,.22) 40%,rgba(255,255,255,.3) 50%,rgba(255,255,255,.22) 60%,transparent)",
    pointerEvents:"none",zIndex:1}} />;
}

function Grain() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    c.width = 200; c.height = 200;
    const id = ctx.createImageData(200, 200);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.random() * 255;
      id.data[i] = id.data[i+1] = id.data[i+2] = v;
      id.data[i+3] = 12;
    }
    ctx.putImageData(id, 0, 0);
  }, []);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",
    pointerEvents:"none",zIndex:0,opacity:.4,mixBlendMode:"overlay"}} />;
}

function Dot({color, pulse}) {
  return <div style={{width:6,height:6,borderRadius:"50%",background:color,flexShrink:0,
    boxShadow:`0 0 6px ${color}88`,animation:pulse?"pulse 2s ease-in-out infinite":"none"}} />;
}

// ── MOCK DATA ──
const DEAL = {
  name:"Marriott International",
  stage:"Technical Evaluation",
  stageColor:T.amber,
  acv:"$285,000",
  close:"Q3 2026",
  owner:"Joey Amari",
  risk:"Legal Review Stalled",
  riskColor:T.red,
  score:72,
};

const SLACK_CHANNELS = [
  { id:"main", name:"marriott-enterprise", type:"main", unread:3, urgent:true },
  { id:"product", name:"marriott-product", type:"product", unread:7, urgent:true },
  { id:"finance", name:"marriott-finance", type:"finance", unread:1, urgent:false },
  { id:"legal", name:"marriott-legal", type:"legal", unread:0, urgent:false },
  { id:"exec", name:"marriott-exec-sync", type:"exec", unread:2, urgent:false },
];

const GMAIL_THREADS = [
  { id:"g1", from:"dpinto@marriott.com", subject:"Re: Square Enterprise POC — Next Steps", unread:true, urgent:true, time:"2h ago" },
  { id:"g2", from:"loberg@marriott.com", subject:"Commercial Terms Review — Square", unread:true, urgent:false, time:"4h ago" },
  { id:"g3", from:"nmanga@marriott.com", subject:"IT Architecture Review — F&B Systems", unread:false, urgent:false, time:"Yesterday" },
  { id:"g4", from:"legal@marriott.com", subject:"MSA Redlines — Round 2", unread:false, urgent:true, time:"2d ago" },
];

const SLACK_MESSAGES = {
  main: [
    { user:"Joey Amari", avatar:"JA", color:T.blue, time:"10:14 AM", text:"Drew's team came back with 3 new blockers from their IT review. Tagging relevant threads below. Need product + legal eyes ASAP." },
    { user:"Sarah Chen (SE)", avatar:"SC", color:T.teal, time:"10:22 AM", text:"On it. The API auth question is something we can answer today — it's covered in our Opera Cloud integration docs. I'll send the technical brief directly to Naveen's team." },
    { user:"Marcus Webb (Legal)", avatar:"MW", color:T.purple, time:"10:31 AM", text:"MSA redlines came back this morning. They want indemnification clause modified and are pushing back on the liability cap. Not a dealbreaker but needs attention before we can move forward on commercial terms.", thread:true, threadCount:4 },
    { user:"Joey Amari", avatar:"JA", color:T.blue, time:"10:45 AM", text:"@Marcus let's set up a call with their legal team this week. Can you get availability from Rachel on their side?" },
    { user:"Diana Park (Finance)", avatar:"DP", color:T.pink, time:"11:02 AM", text:"Finance call with Leeny Oberg's team is confirmed for Thursday 2pm ET. They want a per-property ROI breakdown — I'll have the model ready by EOD Wednesday." },
    { user:"Marcus Webb (Legal)", avatar:"MW", color:T.purple, time:"11:18 AM", text:"Rachel is available Wed or Fri. I'll hold both. Also flagging — their data processing addendum needs our DPA review before legal sign-off. Loop in compliance?", urgent:true },
    { user:"Joey Amari", avatar:"JA", color:T.blue, time:"11:24 AM", text:"Yes, looping in compliance. Also — Drew Pinto confirmed he's joining the exec sync on Friday. This is the push we needed. Everyone make sure your sections are tight." },
    { user:"Sarah Chen (SE)", avatar:"SC", color:T.teal, time:"11:31 AM", text:"Technical brief is drafted and sent to Naveen's team. Waiting on confirmation they received it. Also prepping the KDS live demo for Friday — need 30 mins on Drew's calendar before the full sync." },
  ],
  product: [
    { user:"Sarah Chen (SE)", avatar:"SC", color:T.teal, time:"9:02 AM", text:"Marriott product asks from last call: 1) Multi-brand menu management with per-property overrides 2) Opera Cloud PMS bi-directional sync 3) Bonvoy loyalty points integration at POS 4) Centralized reporting across 8,785 properties. All are on roadmap but timelines vary." },
    { user:"Alex Torres (PM)", avatar:"AT", color:T.green, time:"9:18 AM", text:"Menu management: GA Q3. Opera Cloud: Beta now, GA Q4. Bonvoy: On roadmap, not committed. Centralized reporting: GA now with Enterprise tier. I'll send the full feature availability doc." },
    { user:"Joey Amari", avatar:"JA", color:T.blue, time:"9:24 AM", text:"Bonvoy is their #3 ask and it's not committed — need a bridge answer for Drew. Can we position it as 'open API framework + roadmap commitment letter'?", urgent:true },
    { user:"Alex Torres (PM)", avatar:"AT", color:T.green, time:"9:41 AM", text:"We can do a roadmap commitment letter for Bonvoy with an ETA of Q1 2027. Legal needs to approve the language. Also — the VP F&B seat is still open at Marriott. Do we have clarity on who's taking over? That changes how we position the menu management pitch." },
    { user:"Sarah Chen (SE)", avatar:"SC", color:T.teal, time:"9:55 AM", text:"No word on VP F&B replacement yet. Joey — any intel from the Courtyard GM network on this?" },
    { user:"Joey Amari", avatar:"JA", color:T.blue, time:"10:08 AM", text:"Christine McVie mentioned they're interviewing externally, decision expected end of month. I'd position menu management to David Grissen (Americas) in the interim — he has authority to move forward without the VP seat filled." },
    { user:"Alex Torres (PM)", avatar:"AT", color:T.green, time:"10:22 AM", text:"Got it. Updating the feature request tracker accordingly. Grissen is added as secondary champion for menu mgmt. Feature request form submitted for Bonvoy — tagging as priority for Q1 2027.", thread:true, threadCount:6 },
  ],
  finance: [
    { user:"Diana Park (Finance)", avatar:"DP", color:T.pink, time:"8:30 AM", text:"ROI model update: Per-property analysis shows avg $32K annual savings on labor + reconciliation. Across 500 US managed properties that's $16M ARR impact. This is our strongest commercial story yet." },
    { user:"Joey Amari", avatar:"JA", color:T.blue, time:"8:44 AM", text:"This is the number. Lead with this on Thursday with Oberg's team. Can you add a 3-year NPV view as well?" },
    { user:"Diana Park (Finance)", avatar:"DP", color:T.pink, time:"9:01 AM", text:"Adding 3yr NPV — at 8% discount rate it's ~$41M. Also including comparison to Oracle MICROS TCO which comes out significantly higher. I'll have the full deck ready by Wednesday EOD." },
  ],
  legal: [
    { user:"Marcus Webb (Legal)", avatar:"MW", color:T.purple, time:"Yesterday 4:15 PM", text:"MSA redlines received. Summary: 1) They want mutual indemnification (we have unilateral) 2) Liability cap at 12 months ACV, they want 6 months 3) Data processing addendum needs DPA review 4) IP ownership clause on custom integrations needs clarification." },
    { user:"Joey Amari", avatar:"JA", color:T.blue, time:"Yesterday 4:32 PM", text:"Items 1 and 4 we can flex on. Item 2 — 6 months is aggressive given $285K ACV, push back to 12. Item 3 — get compliance review started today, this could take 2 weeks." },
    { user:"Marcus Webb (Legal)", avatar:"MW", color:T.purple, time:"Yesterday 4:51 PM", text:"Agreed on all. Compliance review initiated. Earliest we can complete DPA review is May 29. This is the timeline blocker — everything else can move in parallel but we can't execute without the DPA sign-off.", urgent:true },
    { user:"Rachel Kim (Marriott Legal)", avatar:"RK", color:T.amber, time:"Today 8:15 AM", text:"Following up on the MSA redlines we sent over. Our legal team has a hard stop on the liability cap — 6 months is a firm requirement from their risk committee. Can Square's team escalate internally for approval? We want to keep this moving." },
  ],
  exec: [
    { user:"Joey Amari", avatar:"JA", color:T.blue, time:"Yesterday 2:00 PM", text:"Exec sync confirmed for Friday 10am ET. Attendees: Drew Pinto (CTO), Anthony Capuano (CEO), Leeny Oberg (CFO) from Marriott. From Square: me, Sarah Chen, Diana Park, and Marcus Webb." },
    { user:"Sarah Chen (SE)", avatar:"SC", color:T.teal, time:"Yesterday 2:18 PM", text:"Agenda drafted: 1) Technical architecture overview (30 min) 2) Commercial terms progress (15 min) 3) Implementation timeline (15 min) 4) Q&A + next steps (15 min). I'll send to all attendees tomorrow." },
    { user:"Joey Amari", avatar:"JA", color:T.blue, time:"Yesterday 2:35 PM", text:"Good. Make sure the KDS live demo is in the tech section — that's the moment we need with Drew. And lead with the $16M ARR impact number for Capuano — that's his language.", urgent:true },
    { user:"Diana Park (Finance)", avatar:"DP", color:T.pink, time:"Yesterday 3:01 PM", text:"Confirmed I'll cover the commercial section. Bringing the 3yr NPV model and MICROS TCO comparison. Also — do we have the Courtyard pilot data finalized? That's our strongest proof point for Capuano." },
  ],
};

const GMAIL_MESSAGES = {
  g1: [
    { from:"dpinto@marriott.com", name:"Drew Pinto", time:"Today 9:47 AM", body:"Joey — following up on our technical review. Our IT architecture team flagged three items that need clarification before we can move to the next stage:\n\n1. How does the Square API handle the Opera Cloud PMS sync — specifically bi-directional inventory updates?\n2. What's the data residency model for EU properties under GDPR?\n3. Can the Enterprise KDS support 40+ stations per property in a high-volume environment?\n\nWe'd like to get answers to these before our exec sync on Friday. Sarah Chen offered to send a technical brief — that would be helpful.\n\nAlso confirming I'm joining the exec sync Friday at 10am ET. Looking forward to it.\n\n— Drew" },
    { from:"joeya@block.xyz", name:"Joey Amari", time:"Today 10:05 AM", body:"Drew — great to hear from you. Sarah is putting together the technical brief today and will have it to your team within the hour. All three items are addressable.\n\nBriefly:\n1. Opera Cloud sync: bi-directional, real-time via REST API — Sarah will include full API docs\n2. Data residency: We offer EU data isolation for GDPR compliance — included in Enterprise tier\n3. KDS scale: Tested at 60+ stations, deployed at scale in multiple enterprise clients\n\nSee you Friday. I think you'll like what we have to show.\n\nBest,\nJoey" },
  ],
  g2: [
    { from:"loberg@marriott.com", name:"Leeny Oberg", time:"Today 8:22 AM", body:"Hi Joey,\n\nOur team has reviewed the commercial proposal. A few items we need to discuss before Thursday's call:\n\n1. The per-property pricing model — we need to understand the floor/ceiling for a portfolio of our size\n2. Implementation services cost — this wasn't clearly broken out in the proposal\n3. Multi-year contract incentives — what's available at 3-year vs 5-year commitment?\n\nOur CFO team will be joining Thursday. Please ensure your finance team is prepared to discuss blended enterprise pricing and NPV projections at scale.\n\n— Leeny" },
  ],
  g3: [
    { from:"nmanga@marriott.com", name:"Naveen Manga", time:"Yesterday 3:15 PM", body:"Joey,\n\nThank you for the technical overview from last week's call. I shared it with my architecture team and we have a few follow-up questions on the IT review side.\n\nOur main concern is the integration complexity across 30 brands with different PMS configurations. Can we schedule a dedicated 90-minute technical session with Sarah Chen and our integration lead before the exec sync?\n\nWe're also evaluating 2 other vendors currently, so timing matters. If we can get the technical questions answered this week, we can move to legal review in parallel.\n\n— Naveen" },
  ],
  g4: [
    { from:"legal@marriott.com", name:"Rachel Kim", time:"2 days ago", body:"Dear Joey,\n\nPlease find attached our MSA redlines for Round 2 review. Key changes our legal team requires:\n\n1. Section 8.2 — Indemnification: We require mutual indemnification language rather than the current unilateral structure\n2. Section 11.1 — Liability Cap: Modified to 6 months ACV (currently 12 months in your draft)\n3. Schedule B — DPA: Requires full compliance review, we need your team's DPA signed before execution\n4. Section 14.3 — IP Ownership: Clarification needed on custom integration IP — who owns integrations built specifically for Marriott?\n\nPlease have your legal team respond by end of week. We want to keep this on track for Q3 close.\n\nRegards,\nRachel Kim\nSenior Legal Counsel, Marriott International" },
  ],
};

const BRAIN_INSIGHTS = [
  { type:"risk", color:T.red, icon:"⚠", title:"Legal DPA Review Blocking", body:"MSA cannot execute without DPA sign-off. Compliance review started — estimated completion May 29. This is the critical path item for Q3 close.", source:"#marriott-legal · Today 4:51 PM" },
  { type:"action", color:T.amber, icon:"→", title:"Exec Sync Friday — Critical", body:"Drew Pinto, Capuano, and Oberg all confirmed. Lead with KDS live demo + $16M ARR impact number. This is the deal-defining moment.", source:"#marriott-exec-sync · Yesterday" },
  { type:"intel", color:T.blue, icon:"◎", title:"VP F&B Seat Still Open", body:"Decision on replacement expected end of month. Position menu management pitch to David Grissen (Americas) in the interim — he has authority to move forward.", source:"#marriott-product · 10:08 AM" },
  { type:"signal", color:T.green, icon:"↑", title:"Finance Story is Strong", body:"Per-property ROI: $32K/year. 500 US properties = $16M ARR impact. 3yr NPV at ~$41M. This is stronger than any competitor can match. Diana has deck ready Wed EOD.", source:"#marriott-finance · 8:30 AM" },
  { type:"risk", color:T.red, icon:"⚠", title:"Bonvoy Integration Not Committed", body:"Marriott's #3 product ask. Not on GA roadmap. Bridge answer: roadmap commitment letter for Q1 2027. Legal needs to approve language before Friday.", source:"#marriott-product · 9:24 AM" },
  { type:"action", color:T.teal, icon:"→", title:"Technical Brief Sent to Naveen", body:"Sarah Chen sent Opera Cloud + KDS architecture brief. Waiting on confirmation. KDS live demo being prepped for Friday exec sync.", source:"#marriott-enterprise · 11:31 AM" },
];

const OPEN_ITEMS = [
  { owner:"Marcus Webb", due:"May 29", text:"DPA compliance review", status:"in-progress", color:T.amber },
  { owner:"Diana Park", due:"Wed EOD", text:"3yr NPV model + MICROS TCO comparison", status:"in-progress", color:T.amber },
  { owner:"Sarah Chen", due:"Today", text:"KDS demo prep for Friday exec sync", status:"in-progress", color:T.green },
  { owner:"Marcus Webb", due:"This week", text:"Schedule legal call with Rachel Kim re: liability cap", status:"open", color:T.txt3 },
  { owner:"Joey Amari", due:"Today", text:"Confirm Courtyard pilot data is finalized", status:"open", color:T.txt3 },
  { owner:"Alex Torres", due:"This week", text:"Bonvoy roadmap commitment letter — legal approval", status:"open", color:T.txt3 },
];

const FEATURE_REQUESTS = [
  { req:"Multi-brand menu management", priority:"P1", status:"GA Q3", champion:"Drew Pinto / David Grissen", color:T.green },
  { req:"Opera Cloud PMS bi-directional sync", priority:"P1", status:"Beta → GA Q4", champion:"Naveen Manga", color:T.amber },
  { req:"Bonvoy loyalty integration at POS", priority:"P2", status:"Roadmap Q1 '27", champion:"Drew Pinto", color:T.red },
  { req:"Centralized reporting 8,785 props", priority:"P1", status:"GA Now", champion:"Leeny Oberg", color:T.green },
  { req:"GDPR EU data residency", priority:"P1", status:"GA Now", champion:"Naveen Manga", color:T.green },
  { req:"40+ station KDS per property", priority:"P1", status:"GA Now", champion:"VP F&B (Open)", color:T.green },
];

// ── COMPONENTS ──
function SecHdr({label, color}) {
  return (
    <div style={{marginBottom:8}}>
      <div style={{fontSize:8.5,fontWeight:500,letterSpacing:".16em",textTransform:"uppercase",
        color:color||"rgba(255,255,255,.38)",marginBottom:5,fontFamily:"Jost,sans-serif"}}>{label}</div>
      <div style={{height:1,background:"linear-gradient(90deg,rgba(255,255,255,.25) 0%,rgba(255,255,255,.08) 50%,transparent 100%)"}} />
    </div>
  );
}

function Avatar({initials, color}) {
  return (
    <div style={{width:24,height:24,borderRadius:"50%",background:`${color}22`,border:`1px solid ${color}55`,
      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
      fontSize:8,fontWeight:600,color,letterSpacing:".04em"}}>{initials}</div>
  );
}

// ── SLACK VIEWER ──
function SlackViewer({channelId, onClose}) {
  const messages = SLACK_MESSAGES[channelId] || [];
  const channel = SLACK_CHANNELS.find(c => c.id === channelId);
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Channel header */}
      <div style={{padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,.07)",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:13,color:"rgba(255,255,255,.5)"}}>#</span>
          <span style={{fontSize:12,fontWeight:500,color:T.txt}}>{channel?.name}</span>
          {channel?.urgent && <div style={{width:5,height:5,borderRadius:"50%",background:T.red,animation:"pulse 2s ease-in-out infinite"}} />}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:8,color:T.txt4,letterSpacing:".06em",background:"rgba(255,255,255,.04)",
            padding:"2px 8px",borderRadius:4,border:"1px solid rgba(255,255,255,.07)"}}>READ ONLY</span>
          {onClose && <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
            color:"rgba(255,255,255,.3)",fontSize:14,lineHeight:1}}>✕</button>}
        </div>
      </div>
      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:12,
        maskImage:"linear-gradient(to bottom,black 0%,black 88%,transparent 100%)",
        WebkitMaskImage:"linear-gradient(to bottom,black 0%,black 88%,transparent 100%)"}}>
        {messages.map((m,i) => (
          <div key={i} style={{display:"flex",gap:9,animation:"fadeIn .2s ease both",animationDelay:`${i*30}ms`}}>
            <Avatar initials={m.avatar} color={m.color} />
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"baseline",gap:7,marginBottom:3}}>
                <span style={{fontSize:11.5,fontWeight:500,color:m.color}}>{m.user}</span>
                <span style={{fontSize:9,color:T.txt4}}>{m.time}</span>
                {m.urgent && <span style={{fontSize:7.5,color:T.red,background:"rgba(255,96,96,.12)",
                  padding:"1px 5px",borderRadius:3,border:"1px solid rgba(255,96,96,.2)"}}>URGENT</span>}
              </div>
              <div style={{fontSize:11,color:T.txt2,lineHeight:1.65,whiteSpace:"pre-wrap"}}>{m.text}</div>
              {m.thread && (
                <div style={{marginTop:6,display:"flex",alignItems:"center",gap:6,cursor:"pointer",
                  padding:"4px 8px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",
                  borderRadius:6,width:"fit-content"}}>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke={T.blue} strokeWidth="1.5">
                    <path d="M2 3h12v8H2zM6 14l2-3 2 3"/>
                  </svg>
                  <span style={{fontSize:9,color:T.blue,letterSpacing:".03em"}}>{m.threadCount} replies · View thread</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Read-only indicator */}
      <div style={{padding:"8px 14px",borderTop:"1px solid rgba(255,255,255,.05)",flexShrink:0}}>
        <div style={{padding:"7px 12px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",
          borderRadius:8,display:"flex",alignItems:"center",gap:8}}>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.5">
            <rect x="3" y="8" width="10" height="6" rx="1"/><path d="M5 8V5a3 3 0 016 0v3"/>
          </svg>
          <span style={{fontSize:9,color:"rgba(255,255,255,.2)",fontStyle:"italic"}}>Read-only · Connect Slack API for live data</span>
        </div>
      </div>
    </div>
  );
}

// ── GMAIL VIEWER ──
function GmailViewer({threadId, onClose}) {
  const messages = GMAIL_MESSAGES[threadId] || [];
  const thread = GMAIL_THREADS.find(t => t.id === threadId);
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,.07)",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:500,color:T.txt,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{thread?.subject}</div>
          <div style={{fontSize:9,color:T.txt4}}>{thread?.from} · {thread?.time}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,marginLeft:12}}>
          <span style={{fontSize:8,color:T.txt4,letterSpacing:".06em",background:"rgba(255,255,255,.04)",
            padding:"2px 8px",borderRadius:4,border:"1px solid rgba(255,255,255,.07)"}}>READ ONLY</span>
          {onClose && <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
            color:"rgba(255,255,255,.3)",fontSize:14,lineHeight:1}}>✕</button>}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:12,
        maskImage:"linear-gradient(to bottom,black 0%,black 88%,transparent 100%)",
        WebkitMaskImage:"linear-gradient(to bottom,black 0%,black 88%,transparent 100%)"}}>
        {messages.map((m,i) => (
          <div key={i} style={{padding:"10px 12px",background:"rgba(255,255,255,.03)",
            border:"1px solid rgba(255,255,255,.07)",borderRadius:10,animation:"fadeIn .2s ease both",animationDelay:`${i*40}ms`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(122,168,255,.15)",
                border:"1px solid rgba(122,168,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:9,fontWeight:600,color:T.blue}}>{m.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
              <div>
                <div style={{fontSize:11,fontWeight:500,color:T.txt}}>{m.name}</div>
                <div style={{fontSize:9,color:T.txt4}}>{m.from} · {m.time}</div>
              </div>
            </div>
            <div style={{fontSize:11,color:T.txt2,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.body}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"8px 14px",borderTop:"1px solid rgba(255,255,255,.05)",flexShrink:0}}>
        <div style={{padding:"7px 12px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",
          borderRadius:8,display:"flex",alignItems:"center",gap:8}}>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.5">
            <rect x="3" y="8" width="10" height="6" rx="1"/><path d="M5 8V5a3 3 0 016 0v3"/>
          </svg>
          <span style={{fontSize:9,color:"rgba(255,255,255,.2)",fontStyle:"italic"}}>Read-only · Connect Gmail API for live data</span>
        </div>
      </div>
    </div>
  );
}

// ── COMMS FEED (center panel preview) ──
function CommsFeedPreview({onOpenComms}) {
  const allChannels = [
    ...SLACK_CHANNELS.filter(c=>c.unread>0).map(c => ({
      type:"slack", id:c.id, name:`#${c.name}`, unread:c.unread, urgent:c.urgent,
      preview:SLACK_MESSAGES[c.id]?.[SLACK_MESSAGES[c.id].length-1]?.text?.slice(0,80)+"…",
      author:SLACK_MESSAGES[c.id]?.[SLACK_MESSAGES[c.id].length-1]?.user,
      color:SLACK_CHANNELS.find(x=>x.id===c.id) ? T.green : T.blue,
      time:SLACK_MESSAGES[c.id]?.[SLACK_MESSAGES[c.id].length-1]?.time,
    })),
    ...GMAIL_THREADS.filter(t=>t.unread).map(t => ({
      type:"gmail", id:t.id, name:t.subject, unread:1, urgent:t.urgent,
      preview:GMAIL_MESSAGES[t.id]?.[0]?.body?.split("\n\n")[0]?.slice(0,80)+"…",
      author:t.from, color:T.blue, time:t.time,
    })),
  ];

  return (
    <div style={{...CARD, padding:"14px 14px", display:"flex", flexDirection:"column", gap:0}}>
      <Sheen />
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <Dot color={T.green} pulse />
          <span style={{fontSize:9,fontWeight:500,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.55)"}}>
            Live Comms Feed
          </span>
          <span style={{fontSize:8,color:T.red,background:"rgba(255,96,96,.12)",padding:"1px 6px",
            borderRadius:10,border:"1px solid rgba(255,96,96,.2)",fontWeight:500}}>
            {allChannels.reduce((a,c)=>a+c.unread,0)} unread
          </span>
        </div>
        <button onClick={onOpenComms} style={{
          display:"flex",alignItems:"center",gap:5,padding:"4px 10px",
          background:"rgba(122,168,255,.08)",border:"1px solid rgba(122,168,255,.2)",borderRadius:6,
          cursor:"pointer",fontFamily:"Jost,sans-serif",fontSize:8.5,color:T.blue,letterSpacing:".06em",fontWeight:500}}>
          Open Command Center ↗
        </button>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {allChannels.map((ch,i) => (
          <div key={i} onClick={() => onOpenComms(ch.type, ch.id)} style={{
            display:"flex",gap:10,padding:"8px 10px",cursor:"pointer",
            background:"rgba(255,255,255,.03)",border:`1px solid ${ch.urgent?"rgba(255,96,96,.2)":"rgba(255,255,255,.07)"}`,
            borderRadius:9,transition:"border-color .15s,background .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.borderColor=ch.urgent?"rgba(255,96,96,.35)":"rgba(255,255,255,.13)"}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.03)";e.currentTarget.style.borderColor=ch.urgent?"rgba(255,96,96,.2)":"rgba(255,255,255,.07)"}}>
            {/* Source icon */}
            <div style={{flexShrink:0,width:18,height:18,borderRadius:4,
              background:ch.type==="slack"?"rgba(74,222,128,.12)":"rgba(122,168,255,.12)",
              border:`1px solid ${ch.type==="slack"?"rgba(74,222,128,.25)":"rgba(122,168,255,.25)"}`,
              display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
              <span style={{fontSize:8,color:ch.type==="slack"?T.green:T.blue}}>{ch.type==="slack"?"S":"G"}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <span style={{fontSize:10,fontWeight:500,color:T.txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.name}</span>
                {ch.urgent && <span style={{fontSize:7,color:T.red,letterSpacing:".06em",flexShrink:0}}>URGENT</span>}
                <span style={{marginLeft:"auto",fontSize:8,color:T.txt4,flexShrink:0}}>{ch.time}</span>
              </div>
              <div style={{fontSize:9.5,color:T.txt3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.preview}</div>
            </div>
            <div style={{flexShrink:0,alignSelf:"flex-start",marginTop:2}}>
              <span style={{fontSize:8,fontWeight:600,color:ch.urgent?T.red:T.txt4,
                background:ch.urgent?"rgba(255,96,96,.1)":"rgba(255,255,255,.06)",
                padding:"1px 6px",borderRadius:10,border:`1px solid ${ch.urgent?"rgba(255,96,96,.2)":"rgba(255,255,255,.08)"}`}}>
                {ch.unread}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── COMMS COMMAND CENTER (full screen) ──
function CommsCommandCenter({onClose, defaultType, defaultId}) {
  const [activeType, setActiveType] = useState(defaultType || "slack");
  const [activeId, setActiveId] = useState(defaultId || "main");

  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:T.bg,display:"flex",flexDirection:"column"}}>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",width:600,height:600,top:"-10%",left:"-5%",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(24,60,200,.12),transparent 65%)",filter:"blur(80px)",animation:"drift1 26s ease-in-out infinite"}} />
        <div style={{position:"absolute",width:500,height:500,bottom:"-5%",right:"-5%",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(90,30,190,.08),transparent 65%)",filter:"blur(80px)",animation:"drift2 32s ease-in-out infinite"}} />
      </div>
      <Grain />

      {/* Command center nav */}
      <div style={{position:"relative",zIndex:10,height:52,display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 24px",background:"rgba(10,11,16,.94)",backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,.07)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
            fontSize:10,color:"rgba(255,255,255,.38)",fontFamily:"Jost,sans-serif",letterSpacing:".08em"}}>← Back to Deal Room</button>
          <span style={{color:"rgba(255,255,255,.12)"}}>·</span>
          <span style={{fontFamily:"DM Serif Display,serif",fontSize:14,color:T.txt}}>Marriott — Comms Command Center</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <Dot color={T.green} pulse />
          <span style={{fontSize:8.5,color:T.green,letterSpacing:".08em"}}>LIVE</span>
        </div>
      </div>

      {/* 3-col layout */}
      <div style={{position:"relative",zIndex:1,display:"grid",gridTemplateColumns:"220px 1fr 300px",
        flex:1,overflow:"hidden"}}>

        {/* LEFT: Channel list */}
        <div style={{borderRight:"1px solid rgba(255,255,255,.07)",overflowY:"auto",padding:"16px 12px",
          display:"flex",flexDirection:"column",gap:12}}>
          {/* Slack section */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <div style={{width:16,height:16,borderRadius:4,background:"rgba(74,222,128,.12)",
                border:"1px solid rgba(74,222,128,.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:8,color:T.green,fontWeight:700}}>S</span>
              </div>
              <span style={{fontSize:9,fontWeight:500,letterSpacing:".12em",textTransform:"uppercase",color:T.green}}>Slack</span>
            </div>
            {SLACK_CHANNELS.map(ch => (
              <div key={ch.id} onClick={() => {setActiveType("slack");setActiveId(ch.id);}} style={{
                display:"flex",alignItems:"center",gap:7,padding:"6px 8px",borderRadius:7,marginBottom:2,cursor:"pointer",
                background:activeType==="slack"&&activeId===ch.id?"rgba(74,222,128,.08)":"transparent",
                border:activeType==="slack"&&activeId===ch.id?"1px solid rgba(74,222,128,.2)":"1px solid transparent",
                transition:"all .15s"}}>
                <span style={{fontSize:11,color:ch.unread>0?"rgba(255,255,255,.5)":"rgba(255,255,255,.2)"}}>#</span>
                <span style={{flex:1,fontSize:10.5,color:ch.unread>0?T.txt:T.txt3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.name}</span>
                {ch.unread>0 && <span style={{fontSize:8,fontWeight:600,color:ch.urgent?T.red:T.txt4,
                  background:ch.urgent?"rgba(255,96,96,.12)":"rgba(255,255,255,.08)",
                  padding:"1px 5px",borderRadius:8,border:`1px solid ${ch.urgent?"rgba(255,96,96,.2)":"rgba(255,255,255,.1)"}`}}>{ch.unread}</span>}
              </div>
            ))}
          </div>

          <div style={{height:1,background:"rgba(255,255,255,.06)"}} />

          {/* Gmail section */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <div style={{width:16,height:16,borderRadius:4,background:"rgba(122,168,255,.12)",
                border:"1px solid rgba(122,168,255,.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:8,color:T.blue,fontWeight:700}}>G</span>
              </div>
              <span style={{fontSize:9,fontWeight:500,letterSpacing:".12em",textTransform:"uppercase",color:T.blue}}>Gmail</span>
            </div>
            {GMAIL_THREADS.map(t => (
              <div key={t.id} onClick={() => {setActiveType("gmail");setActiveId(t.id);}} style={{
                display:"flex",alignItems:"flex-start",gap:7,padding:"6px 8px",borderRadius:7,marginBottom:2,cursor:"pointer",
                background:activeType==="gmail"&&activeId===t.id?"rgba(122,168,255,.08)":"transparent",
                border:activeType==="gmail"&&activeId===t.id?"1px solid rgba(122,168,255,.2)":"1px solid transparent",
                transition:"all .15s"}}>
                <div style={{width:4,height:4,borderRadius:"50%",marginTop:4,flexShrink:0,
                  background:t.unread?(t.urgent?T.red:T.blue):"transparent"}} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:10,color:t.unread?T.txt:T.txt3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:1}}>{t.subject.slice(0,30)}…</div>
                  <div style={{fontSize:8.5,color:T.txt4}}>{t.from.split("@")[0]} · {t.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN: Message viewer */}
        <div style={{overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {activeType==="slack" ? <SlackViewer channelId={activeId} /> : <GmailViewer threadId={activeId} />}
        </div>

        {/* RIGHT: AI synthesis of active thread */}
        <div style={{borderLeft:"1px solid rgba(255,255,255,.07)",padding:"16px 14px",overflowY:"auto",
          display:"flex",flexDirection:"column",gap:12}}>
          <div style={{...CARD,padding:"12px 12px"}}>
            <Sheen />
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <Dot color={T.teal} />
              <span style={{fontSize:8.5,fontWeight:500,letterSpacing:".14em",textTransform:"uppercase",color:T.teal}}>Deal Brain Synthesis</span>
            </div>
            {activeType==="slack" && activeId==="main" && <>
              <div style={{fontSize:9.5,color:T.txt2,lineHeight:1.65,marginBottom:10}}>3 urgent items require your attention. Legal DPA is the critical path blocker. Exec sync Friday is the deal-defining moment.</div>
              {[["Legal DPA","Critical path to Q3 close. May 29 ETA.",T.red],
                ["Exec sync","Drew + Capuano + Oberg confirmed Friday.",T.green],
                ["Liability cap","Marriott pushing 6mo, we're at 12mo.",T.amber]
              ].map(([t,b,c])=>(
                <div key={t} style={{padding:"6px 8px",background:"rgba(255,255,255,.03)",border:`1px solid ${c}22`,borderLeft:`2px solid ${c}`,borderRadius:6,marginBottom:5}}>
                  <div style={{fontSize:9,fontWeight:500,color:c,marginBottom:2}}>{t}</div>
                  <div style={{fontSize:9,color:T.txt3,lineHeight:1.5}}>{b}</div>
                </div>
              ))}
            </>}
            {activeType==="slack" && activeId==="product" && <>
              <div style={{fontSize:9.5,color:T.txt2,lineHeight:1.65,marginBottom:10}}>7 unread messages. Bonvoy gap is the main risk. Menu management positioned to Grissen as interim champion.</div>
              {[["Bonvoy gap","Not on GA roadmap. Bridge: commitment letter Q1 '27.",T.red],
                ["Menu mgmt","GA Q3. Grissen added as champion.",T.green],
                ["VP F&B open","Decision end of month. Pitch Grissen in interim.",T.amber]
              ].map(([t,b,c])=>(
                <div key={t} style={{padding:"6px 8px",background:"rgba(255,255,255,.03)",border:`1px solid ${c}22`,borderLeft:`2px solid ${c}`,borderRadius:6,marginBottom:5}}>
                  <div style={{fontSize:9,fontWeight:500,color:c,marginBottom:2}}>{t}</div>
                  <div style={{fontSize:9,color:T.txt3,lineHeight:1.5}}>{b}</div>
                </div>
              ))}
            </>}
            {activeType==="gmail" && activeId==="g1" && <>
              <div style={{fontSize:9.5,color:T.txt2,lineHeight:1.65,marginBottom:10}}>Drew Pinto is engaged and asking good technical questions. Friday exec sync confirmed. 3 technical questions need answers today.</div>
              {[["Drew confirmed","Exec sync Friday 10am ET. Critical moment.",T.green],
                ["3 tech blockers","Opera Cloud sync, GDPR, KDS scale. All addressable.",T.amber],
                ["Action","Sarah sending technical brief today.",T.teal]
              ].map(([t,b,c])=>(
                <div key={t} style={{padding:"6px 8px",background:"rgba(255,255,255,.03)",border:`1px solid ${c}22`,borderLeft:`2px solid ${c}`,borderRadius:6,marginBottom:5}}>
                  <div style={{fontSize:9,fontWeight:500,color:c,marginBottom:2}}>{t}</div>
                  <div style={{fontSize:9,color:T.txt3,lineHeight:1.5}}>{b}</div>
                </div>
              ))}
            </>}
            {activeType==="gmail" && activeId==="g4" && <>
              <div style={{fontSize:9.5,color:T.txt2,lineHeight:1.65,marginBottom:10}}>Legal is the critical path. 4 redline items. DPA review is blocking — 2 week timeline.</div>
              {[["DPA blocking","Compliance review started. May 29 ETA. Cannot execute without.",T.red],
                ["Liability cap","6mo is firm from risk committee. Need internal escalation.",T.red],
                ["Items 1+4","Mutual indemnification + IP — we can flex on both.",T.green]
              ].map(([t,b,c])=>(
                <div key={t} style={{padding:"6px 8px",background:"rgba(255,255,255,.03)",border:`1px solid ${c}22`,borderLeft:`2px solid ${c}`,borderRadius:6,marginBottom:5}}>
                  <div style={{fontSize:9,fontWeight:500,color:c,marginBottom:2}}>{t}</div>
                  <div style={{fontSize:9,color:T.txt3,lineHeight:1.5}}>{b}</div>
                </div>
              ))}
            </>}
            {!["main","product"].includes(activeId) && activeType==="slack" && <>
              <div style={{fontSize:9.5,color:T.txt2,lineHeight:1.65,marginBottom:10}}>Select a channel to see Deal Brain synthesis for that thread.</div>
            </>}
            <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid rgba(255,255,255,.06)",
              fontSize:8,color:T.txt4,fontStyle:"italic"}}>Sourced from Deal Brain · {new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</div>
          </div>

          {/* Open items from this thread */}
          <div style={{...CARD,padding:"12px 12px"}}>
            <Sheen />
            <SecHdr label="Open Items" />
            {OPEN_ITEMS.slice(0,4).map((item,i) => (
              <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
                <div style={{width:3,height:3,borderRadius:"50%",background:item.color,marginTop:5,flexShrink:0}} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:9.5,color:T.txt2,lineHeight:1.4}}>{item.text}</div>
                  <div style={{fontSize:8,color:T.txt4,marginTop:1}}>{item.owner} · {item.due}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DEAL BRAIN SEARCH ──
function DealBrainSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const ANSWERS = {
    "legal":"DPA compliance review is the critical path blocker. Marcus Webb initiated review — estimated completion May 29. Marriott's legal team requires mutual indemnification, 6-month liability cap (firm from risk committee), and DPA sign-off before MSA execution. Source: #marriott-legal, MSA Redlines Round 2 email.",
    "exec sync":"Friday 10am ET. Attendees: Drew Pinto (CTO), Anthony Capuano (CEO), Leeny Oberg (CFO). Square team: Joey, Sarah Chen, Diana Park, Marcus Webb. Lead with KDS live demo + $16M ARR impact. This is the deal-defining meeting. Source: #marriott-exec-sync.",
    "bonvoy":"Bonvoy loyalty integration is Marriott's #3 product ask. Not currently on GA roadmap. Bridge answer: roadmap commitment letter for Q1 2027. Alex Torres submitted feature request. Legal needs to approve commitment letter language before Friday exec sync. Source: #marriott-product.",
    "roifinance":"Per-property ROI: $32K/year labor + reconciliation savings. 500 US managed properties = $16M ARR impact. 3yr NPV at ~$41M (8% discount rate). MICROS TCO comparison significantly higher. Diana Park has full deck ready Wed EOD. Source: #marriott-finance.",
    "drew pinto":"Drew Pinto is EVP & Chief Revenue + Technology Officer. Joined Marriott 2023 with active tech rationalization mandate. Confirmed Friday exec sync. Sent 3 technical questions today re: Opera Cloud sync, GDPR, KDS scale. All are addressable. His 2022 no was not his decision. Source: dpinto@marriott.com email + #marriott-enterprise.",
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const q = query.toLowerCase();
      let answer = "No specific intel found for that query in the current deal context. Try: legal, exec sync, Bonvoy, ROI, or Drew Pinto.";
      for (const [k,v] of Object.entries(ANSWERS)) {
        if (q.includes(k) || k.includes(q.split(" ")[0])) { answer = v; break; }
      }
      setResult(answer);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{...CARD, padding:"14px 14px"}}>
      <Sheen />
      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
        <Dot color={T.teal} />
        <span style={{fontSize:9,fontWeight:500,letterSpacing:".14em",textTransform:"uppercase",color:T.teal}}>Deal Brain</span>
        <span style={{fontSize:8,color:T.txt4,marginLeft:4,fontStyle:"italic"}}>All intel sourced here</span>
      </div>
      <div style={{display:"flex",gap:6,marginBottom: result||loading ? 10 : 0}}>
        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleSearch()}
          placeholder="Ask anything about this deal..."
          style={{flex:1,padding:"8px 12px",background:"rgba(255,255,255,.04)",
            border:"1px solid rgba(255,255,255,.1)",borderRadius:8,
            fontFamily:"Jost,sans-serif",fontSize:11,color:T.txt,outline:"none",
            caretColor:T.teal}}
        />
        <button onClick={handleSearch} style={{
          padding:"8px 14px",background:"rgba(51,221,200,.1)",border:"1px solid rgba(51,221,200,.2)",
          borderRadius:8,cursor:"pointer",fontFamily:"Jost,sans-serif",fontSize:10,
          color:T.teal,fontWeight:500,letterSpacing:".06em",flexShrink:0}}>
          {loading ? <div style={{width:12,height:12,border:"1px solid rgba(51,221,200,.4)",borderTopColor:T.teal,borderRadius:"50%",animation:"spin 1s linear infinite"}} /> : "Ask →"}
        </button>
      </div>
      {result && !loading && (
        <div style={{padding:"10px 12px",background:"rgba(51,221,200,.05)",border:"1px solid rgba(51,221,200,.15)",
          borderRadius:8,animation:"fadeIn .3s ease both"}}>
          <div style={{fontSize:10.5,color:T.txt2,lineHeight:1.7}}>{result}</div>
        </div>
      )}
    </div>
  );
}

// ── MAIN DEAL DASHBOARD ──
export default function DealDashboard() {
  const [commsOpen, setCommsOpen] = useState(false);
  const [commsType, setCommsType] = useState("slack");
  const [commsId, setCommsId] = useState("main");

  const openComms = (type, id) => {
    if (type) { setCommsType(type); setCommsId(id); }
    setCommsOpen(true);
  };

  return (
    <div style={{background:T.bg,minHeight:"100vh",fontFamily:"Jost,sans-serif",color:T.txt,WebkitFontSmoothing:"antialiased"}}>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",width:600,height:600,top:"-10%",left:"-10%",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(24,60,200,.13),transparent 65%)",filter:"blur(80px)",animation:"drift1 26s ease-in-out infinite"}} />
        <div style={{position:"absolute",width:500,height:500,top:"30%",right:"-10%",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(90,30,190,.09),transparent 65%)",filter:"blur(80px)",animation:"drift2 32s ease-in-out infinite"}} />
        <div style={{position:"absolute",width:400,height:400,bottom:"-5%",left:"30%",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(10,130,110,.07),transparent 65%)",filter:"blur(80px)",animation:"drift3 38s ease-in-out infinite"}} />
      </div>
      <Grain />

      {commsOpen && <CommsCommandCenter onClose={()=>setCommsOpen(false)} defaultType={commsType} defaultId={commsId} />}

      {/* NAV */}
      <div style={{position:"sticky",top:0,zIndex:100}}>
        <div style={{height:52,display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"0 24px",background:"rgba(10,11,16,.92)",backdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(255,255,255,.07)"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontFamily:"DM Serif Display,serif",fontSize:16,color:T.txt}}>
              Joseph <span style={{color:"rgba(255,255,255,.18)",margin:"0 5px"}}>/</span> Amari
            </span>
            <span style={{fontSize:9,color:T.txt4,letterSpacing:".06em",
              padding:"2px 10px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:20}}>Deal Room</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",
              background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.18)",borderRadius:6,cursor:"pointer"}}
              onClick={() => openComms("slack","main")}>
              <div style={{width:4,height:4,borderRadius:"50%",background:T.green,animation:"pulse 2s ease-in-out infinite"}} />
              <span style={{fontSize:9,color:T.green,letterSpacing:".07em",fontWeight:500}}>
                {SLACK_CHANNELS.reduce((a,c)=>a+c.unread,0) + GMAIL_THREADS.filter(t=>t.unread).length} UNREAD
              </span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:8.5,color:T.green,letterSpacing:".08em"}}>
              <Dot color={T.green} pulse /><span>LIVE</span>
            </div>
          </div>
        </div>
        {/* Disclaimer */}
        <div style={{height:22,background:"rgba(255,255,255,.015)",borderBottom:"1px solid rgba(255,255,255,.05)",
          overflow:"hidden",display:"flex",alignItems:"center",paddingLeft:24}}>
          <span style={{fontSize:7.5,color:"rgba(255,255,255,.2)",letterSpacing:".05em",whiteSpace:"nowrap"}}>
            All deal communications are read-only. Internal comms synthesized via Deal Brain. Slack + Gmail require API connection for live data.
          </span>
        </div>
      </div>

      {/* 3-COL LAYOUT */}
      <div style={{position:"relative",zIndex:1,display:"grid",gridTemplateColumns:"220px 1fr 268px",
        height:"calc(100vh - 74px)",overflow:"hidden"}}>

        {/* ── LEFT COL ── */}
        <div style={{borderRight:"1px solid rgba(255,255,255,.07)",padding:"16px 14px",
          overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>

          {/* Deal header */}
          <div style={{paddingBottom:10,borderBottom:"1px solid rgba(255,255,255,.07)"}}>
            <div style={{fontFamily:"DM Serif Display,serif",fontSize:16,fontWeight:300,lineHeight:1.1,marginBottom:3}}>{DEAL.name}</div>
            <div style={{fontSize:8,color:T.txt4,letterSpacing:".04em",marginBottom:8}}>NYSE: MAR · Enterprise · $285K ACV</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              <span style={{fontSize:7.5,fontWeight:500,letterSpacing:".06em",padding:"2px 7px",borderRadius:3,
                color:T.amber,background:"rgba(245,166,35,.12)",border:"1px solid rgba(245,166,35,.2)"}}>{DEAL.stage}</span>
              <span style={{fontSize:7.5,fontWeight:500,letterSpacing:".06em",padding:"2px 7px",borderRadius:3,
                color:T.red,background:"rgba(255,96,96,.1)",border:"1px solid rgba(255,96,96,.18)"}}>⚠ {DEAL.risk}</span>
            </div>
          </div>

          {/* Deal meta */}
          <div>
            <SecHdr label="Deal Meta" />
            {[["ACV","$285,000",T.green],["Close Target","Q3 2026",T.blue],["Owner","Joey Amari",T.txt2],
              ["Score","72 / 100",T.amber],["Stage","Technical Eval",T.amber],["Last Activity","Today",T.green]].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",
                borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <span style={{fontSize:9,color:T.txt4}}>{l}</span>
                <span style={{fontSize:9.5,color:c,fontWeight:400}}>{v}</span>
              </div>
            ))}
          </div>

          {/* Deal team */}
          <div>
            <SecHdr label="Deal Team" />
            {[["Joey Amari","AE",T.blue],["Sarah Chen","Solutions Engineer",T.teal],
              ["Diana Park","Finance",T.pink],["Marcus Webb","Legal",T.purple],["Alex Torres","Product",T.green]].map(([n,r,c])=>(
              <div key={n} style={{display:"flex",alignItems:"center",gap:7,padding:"4px 0"}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:`${c}18`,border:`1px solid ${c}44`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:7.5,fontWeight:600,color:c,flexShrink:0}}>
                  {n.split(" ").map(w=>w[0]).join("")}
                </div>
                <div>
                  <div style={{fontSize:10,color:T.txt,lineHeight:1.2}}>{n}</div>
                  <div style={{fontSize:8,color:T.txt4}}>{r}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Key stakeholders */}
          <div>
            <SecHdr label="Key Stakeholders" />
            {[["Anthony Capuano","CEO",T.red,"HIGH"],["Drew Pinto","CTO",T.red,"HIGH"],
              ["Leeny Oberg","CFO",T.blue,"MED"],["Naveen Manga","CIO",T.red,"HIGH"],["VP F&B","Open",T.amber,"GAP"]].map(([n,r,c,s])=>(
              <div key={n} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"4px 8px",marginBottom:2,background:"rgba(255,255,255,.03)",
                border:"1px solid rgba(255,255,255,.06)",borderLeft:`2px solid ${c}`,borderRadius:6}}>
                <div>
                  <div style={{fontSize:10,color:T.txt,fontFamily:"DM Serif Display,serif",fontWeight:300}}>{n}</div>
                  <div style={{fontSize:8,color:T.txt4}}>{r}</div>
                </div>
                <span style={{fontSize:7.5,color:c,background:`${c}15`,padding:"1px 5px",borderRadius:3}}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN COL ── */}
        <div style={{padding:"16px 20px 0 20px",overflowY:"auto",display:"flex",flexDirection:"column",gap:12,
          maskImage:"linear-gradient(to bottom,black 0%,black 88%,transparent 100%)",
          WebkitMaskImage:"linear-gradient(to bottom,black 0%,black 88%,transparent 100%)"}}>

          {/* Deal Brain search */}
          <DealBrainSearch />

          {/* Comms feed preview */}
          <CommsFeedPreview onOpenComms={openComms} />

          {/* Deal Brain insights */}
          <div style={{...CARD, padding:"14px 14px"}}>
            <Sheen />
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
              <Dot color={T.blue} />
              <span style={{fontSize:9,fontWeight:500,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.55)"}}>Intelligence Digest</span>
              <span style={{fontSize:8,color:T.txt4,fontStyle:"italic"}}>from Deal Brain</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {BRAIN_INSIGHTS.map((ins,i) => (
                <div key={i} style={{padding:"9px 11px",background:"rgba(255,255,255,.03)",
                  border:`1px solid ${ins.color}22`,borderLeft:`2px solid ${ins.color}`,borderRadius:9}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <span style={{fontSize:9,color:ins.color}}>{ins.icon}</span>
                    <span style={{fontSize:10.5,fontWeight:500,color:T.txt,fontFamily:"DM Serif Display,serif",fontWeight:300}}>{ins.title}</span>
                    <span style={{marginLeft:"auto",fontSize:7.5,color:ins.color,
                      background:`${ins.color}12`,padding:"1px 5px",borderRadius:3,letterSpacing:".05em",textTransform:"uppercase",flexShrink:0}}>{ins.type}</span>
                  </div>
                  <div style={{fontSize:10.5,color:T.txt2,lineHeight:1.6}}>{ins.body}</div>
                  <div style={{marginTop:5,fontSize:8,color:T.txt4,fontStyle:"italic"}}>{ins.source}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Open items */}
          <div style={{...CARD, padding:"14px 14px"}}>
            <Sheen />
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
              <Dot color={T.amber} />
              <span style={{fontSize:9,fontWeight:500,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.55)"}}>Open Items</span>
              <span style={{fontSize:8,color:T.red,background:"rgba(255,96,96,.1)",padding:"1px 6px",borderRadius:10,border:"1px solid rgba(255,96,96,.18)"}}>
                {OPEN_ITEMS.filter(i=>i.status==="open").length} open
              </span>
            </div>
            {OPEN_ITEMS.map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 0",
                borderBottom:"1px solid rgba(255,255,255,.05)"}}>
                <div style={{width:4,height:4,borderRadius:"50%",background:item.color,marginTop:5,flexShrink:0}} />
                <div style={{flex:1}}>
                  <div style={{fontSize:10.5,color:T.txt,lineHeight:1.4}}>{item.text}</div>
                  <div style={{fontSize:8.5,color:T.txt4,marginTop:1}}>{item.owner} · Due {item.due}</div>
                </div>
                <span style={{fontSize:7.5,color:item.color,background:`${item.color}12`,
                  padding:"1px 6px",borderRadius:3,flexShrink:0}}>{item.status}</span>
              </div>
            ))}
          </div>

          {/* Feature requests */}
          <div style={{...CARD, padding:"14px 14px"}}>
            <Sheen />
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
              <Dot color={T.purple} />
              <span style={{fontSize:9,fontWeight:500,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.55)"}}>Feature Requests</span>
              <span style={{fontSize:8,color:T.txt4}}>linked to product sheet</span>
            </div>
            {FEATURE_REQUESTS.map((fr,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",
                borderBottom:"1px solid rgba(255,255,255,.05)"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:10.5,color:T.txt}}>{fr.req}</div>
                  <div style={{fontSize:8.5,color:T.txt4,marginTop:1}}>{fr.champion}</div>
                </div>
                <span style={{fontSize:7.5,fontWeight:500,color:fr.color,background:`${fr.color}12`,
                  padding:"1px 6px",borderRadius:3,flexShrink:0,whiteSpace:"nowrap"}}>{fr.status}</span>
                <span style={{fontSize:7.5,color:T.txt4,flexShrink:0}}>{fr.priority}</span>
              </div>
            ))}
          </div>

        </div>

        {/* ── RIGHT COL ── */}
        <div style={{borderLeft:"1px solid rgba(255,255,255,.07)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Channel selector tabs */}
          <div style={{padding:"10px 12px 0",flexShrink:0}}>
            <div style={{display:"flex",gap:4,overflowX:"auto",scrollbarWidth:"none",paddingBottom:8,
              borderBottom:"1px solid rgba(255,255,255,.07)"}}>
              {SLACK_CHANNELS.map(ch=>(
                <button key={ch.id} onClick={()=>{}} style={{
                  padding:"4px 9px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",
                  borderRadius:6,cursor:"pointer",fontFamily:"Jost,sans-serif",fontSize:8.5,
                  color:ch.unread>0?T.green:"rgba(255,255,255,.35)",whiteSpace:"nowrap",letterSpacing:".03em",
                  flexShrink:0}}>
                  #{ch.name.replace("marriott-","")}
                  {ch.unread>0 && <span style={{marginLeft:4,fontSize:7.5,color:ch.urgent?T.red:T.green}}>·{ch.unread}</span>}
                </button>
              ))}
            </div>
          </div>
          {/* Live Slack preview in right col */}
          <div style={{flex:1,overflow:"hidden"}}>
            <SlackViewer channelId="main" />
          </div>
        </div>

      </div>
    </div>
  );
}
