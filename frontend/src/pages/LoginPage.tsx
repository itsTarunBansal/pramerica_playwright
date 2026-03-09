import { useState, FormEvent, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser, saveSession } from "../auth/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await authenticateUser(username, password);
    setLoading(false);
    if (result.success && result.user) {
      saveSession(result.user);
      setTransitioning(true);
      setTimeout(() => navigate("/", { replace: true }), 2600);
    } else {
      setError(result.error ?? "Authentication failed.");
    }
  }

  useEffect(() => {
    const el = particlesRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const p = document.createElement("div");
      p.className = "k-ptcl";
      p.style.left = (5 + Math.random() * 90) + "%";
      p.style.bottom = (2 + Math.random() * 15) + "%";
      const sz = (1 + Math.random() * 2.5) + "px";
      p.style.width = sz;
      p.style.height = sz;
      p.style.animationDuration = (3 + Math.random() * 4) + "s";
      p.style.animationDelay = (Math.random() * 0.5) + "s";
      el.appendChild(p);
      setTimeout(() => p.remove(), 8000);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{KRYPTONITE_CSS}</style>
      {transitioning && <KryptoniteLoader />}
      <div className="k-atmosphere" />
      <div className="k-crystal-scene" id="kCrystalScene">
        {CRYSTAL_CLUSTERS}
      </div>
      <div className="k-ground-fog" />
      <div className="k-particles" ref={particlesRef} />

      <div className="k-login-panel" ref={panelRef}>
        <div className="k-scan-line" />
        <div className="k-refraction">
          <div className="k-shard" style={{top:"-10%",left:"60%",width:80,height:"140%",opacity:.6,transform:"rotate(12deg)"}} />
          <div className="k-shard" style={{top:"-10%",left:"25%",width:50,height:"130%",opacity:.4,transform:"rotate(-8deg)"}} />
          <div className="k-shard" style={{top:"-10%",left:"80%",width:35,height:"120%",opacity:.3,transform:"rotate(18deg)"}} />
        </div>

        <div className="k-emblem">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,2 90,27 90,73 50,98 10,73 10,27" fill="none" stroke="rgba(57,255,20,0.3)" strokeWidth="1.5"/>
            <polygon points="50,12 80,32 80,68 50,88 20,68 20,32" fill="rgba(57,255,20,0.04)" stroke="rgba(57,255,20,0.2)" strokeWidth="1"/>
            <polygon points="50,28 68,42 68,58 50,72 32,58 32,42" fill="rgba(57,255,20,0.08)" stroke="rgba(57,255,20,0.35)" strokeWidth="1"/>
            <polygon points="50,36 58,46 58,54 50,64 42,54 42,46" fill="rgba(57,255,20,0.2)" stroke="rgba(57,255,20,0.5)" strokeWidth="0.8"/>
            <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(57,255,20,0.06)" strokeWidth="0.5"/>
            <line x1="10" y1="27" x2="90" y2="73" stroke="rgba(57,255,20,0.06)" strokeWidth="0.5"/>
            <line x1="90" y1="27" x2="10" y2="73" stroke="rgba(57,255,20,0.06)" strokeWidth="0.5"/>
            <circle cx="50" cy="50" r="4" fill="rgba(57,255,20,0.5)">
              <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(57,255,20,0.1)" strokeWidth="0.5">
              <animate attributeName="r" values="7;10;7" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>

        <div className="k-login-title">Kryptonite</div>
        <div className="k-login-subtitle">We Automate Your Testing</div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="k-field" style={{animationDelay:"2.8s"}}>
            <label className="k-field-label">Username</label>
            <div className="k-field-input-wrap">
              <svg className="k-field-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(57,255,20,0.7)" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text"
                placeholder="Enter Username"
                autoComplete="off"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="k-field" style={{animationDelay:"2.95s"}}>
            <label className="k-field-label">Password</label>
            <div className="k-field-input-wrap">
              <svg className="k-field-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(57,255,20,0.7)" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type={showPw ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button className="k-eye-toggle" type="button" onClick={() => setShowPw(v => !v)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(57,255,20,0.7)" strokeWidth="1.5">
                  {showPw
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {error && <p className="k-error" role="alert">{error}</p>}

          <button className={`k-login-btn${loading ? " loading" : ""}`} type="submit" disabled={loading}>
            <span className="btn-text">Initialize</span>
            <div className="btn-loader">
              <span/><span/><span/><span/>
            </div>
          </button>
        </form>

        <div className="k-bottom-row">
          <a href="#" className="k-bottom-link">Recover Access</a>
        </div>

        <div className="k-status">
          <div className="k-status-dot"/>
          <span className="k-status-text">Secure Channel Active</span>
        </div>
      </div>
    </>
  );
}

// ── Kryptonite Loader overlay (shown on successful auth) ──
function KryptoniteLoader() {
  const loaderParticlesRef = useRef<HTMLDivElement>(null);
  const statuses = ["Authenticating","Decrypting","Verifying","Connecting","Authorizing"];
  const [si, setSi] = useState(0);
  const [txtVisible, setTxtVisible] = useState(true);

  useEffect(() => {
    const el = loaderParticlesRef.current;
    if (!el) return;
    const iv = setInterval(() => {
      const p = document.createElement("div");
      p.className = "kl-p";
      p.style.left = (5 + Math.random() * 90) + "%";
      p.style.bottom = (5 + Math.random() * 20) + "%";
      const sz = (1 + Math.random() * 2) + "px";
      p.style.width = sz; p.style.height = sz;
      p.style.animationDuration = (3 + Math.random() * 3) + "s";
      el.appendChild(p);
      setTimeout(() => p.remove(), 7000);
    }, 200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setTxtVisible(false);
      setTimeout(() => { setSi(s => (s + 1) % statuses.length); setTxtVisible(true); }, 200);
    }, 2400);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      <style>{LOADER_CSS}</style>
      <div className="kl-overlay">
        <div className="kl-atmo" />
        <div className="kl-shards">
          {LOADER_SHARDS}
        </div>
        <div className="kl-particles" ref={loaderParticlesRef} />
        <div className="kl-scanline" />
        <div className="kl-card">
          <div className="kl-card-scan" />
          <div className="kl-hex-ring">
            <svg className="kl-ring3" width="80" height="80" viewBox="0 0 80 80" fill="none">
              <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="none" stroke="rgba(57,255,20,0.08)" strokeWidth="1" strokeDasharray="4 6"/>
            </svg>
            <svg className="kl-ring2" width="80" height="80" viewBox="0 0 80 80" fill="none">
              <polygon points="40,10 66,26 66,54 40,70 14,54 14,26" fill="none" stroke="rgba(57,255,20,0.18)" strokeWidth="1" strokeDasharray="6 4"/>
            </svg>
            <svg className="kl-ring1" width="80" height="80" viewBox="0 0 80 80" fill="none">
              <polygon points="40,16 62,30 62,50 40,64 18,50 18,30" fill="none" stroke="rgba(57,255,20,0.35)" strokeWidth="1.5" strokeDasharray="8 3"/>
            </svg>
            <svg className="kl-emblem" viewBox="0 0 100 100" fill="none">
              <polygon points="50,4 84,24 84,76 50,96 16,76 16,24" fill="rgba(57,255,20,0.04)" stroke="rgba(57,255,20,0.2)" strokeWidth="1"/>
              <polygon points="50,14 74,30 74,70 50,86 26,70 26,30" fill="rgba(57,255,20,0.06)" stroke="rgba(57,255,20,0.3)" strokeWidth="0.8"/>
              <polygon points="50,28 66,40 66,60 50,72 34,60 34,40" fill="rgba(57,255,20,0.1)" stroke="rgba(57,255,20,0.45)" strokeWidth="0.8"/>
              <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(57,255,20,0.05)" strokeWidth="0.5"/>
              <line x1="16" y1="24" x2="84" y2="76" stroke="rgba(57,255,20,0.05)" strokeWidth="0.5"/>
              <line x1="84" y1="24" x2="16" y2="76" stroke="rgba(57,255,20,0.05)" strokeWidth="0.5"/>
              <polygon points="50,14 66,24 58,40 42,40 34,24" fill="rgba(200,255,200,0.06)"/>
              <circle cx="50" cy="50" r="5" fill="rgba(57,255,20,0.6)">
                <animate attributeName="r" values="4;7;4" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite"/>
              </circle>
              <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(57,255,20,0.15)" strokeWidth="0.5">
                <animate attributeName="r" values="9;14;9" dur="2.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.1;0.35;0.1" dur="2.2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          <div className="kl-label">Kryptonite</div>
          <div className="kl-sublabel">Initializing...</div>
          <div className="kl-progress-wrap">
            <div className="kl-progress-track"><div className="kl-progress-bar"/></div>
            <div className="kl-progress-dots">
              {[0,1,2,3,4,5].map(i => <div key={i} className="kl-pdot" style={{animationDelay:`${i*0.3}s`}}/>)}
            </div>
          </div>
          <div className="kl-status">
            <div className="kl-status-dot"/>
            <span style={{opacity: txtVisible ? 1 : 0, transition:"opacity 0.3s"}}>{statuses[si]}</span>
          </div>
        </div>
      </div>
    </>
  );
}

const LOADER_SHARDS = (() => {
  const configs = [
    {l:2,w:18,h:100,rot:-5,d:0},{l:6,w:26,h:160,rot:2,d:.2},{l:10,w:14,h:75,rot:-10,d:.4},
    {l:80,w:22,h:130,rot:6,d:.1},{l:86,w:30,h:185,rot:-3,d:.3},{l:91,w:16,h:85,rot:12,d:.5},{l:94,w:20,h:110,rot:-2,d:.7},
  ];
  return configs.map((c,i) => (
    <div key={i} className="kl-shard" style={{left:`${c.l}%`,width:c.w,height:c.h,transform:`rotate(${c.rot}deg)`,animationDelay:`${c.d}s`}}>
      <div className="kl-shard-face"/>
    </div>
  ));
})();

const LOADER_CSS = `
.kl-overlay{position:fixed;inset:0;z-index:1000;background:#040706;display:flex;align-items:center;justify-content:center;animation:klSwingIn .5s cubic-bezier(0.34,1.56,0.64,1) forwards;}
@keyframes klSwingIn{0%{opacity:0;transform:perspective(800px) rotateX(-20deg) scale(0.92)}100%{opacity:1;transform:perspective(800px) rotateX(0deg) scale(1)}}
.kl-atmo{position:fixed;inset:0;pointer-events:none;background:radial-gradient(ellipse 80% 60% at 50% 110%,rgba(10,40,15,0.6) 0%,transparent 60%);}
.kl-shards{position:fixed;inset:0;pointer-events:none;overflow:hidden;}
.kl-shard{position:absolute;bottom:0;clip-path:polygon(50% 0%,82% 16%,78% 82%,58% 100%,38% 100%,22% 82%,18% 16%);animation:klShardPulse 3s ease-in-out infinite;}
.kl-shard-face{width:100%;height:100%;background:linear-gradient(170deg,rgba(160,255,140,0.12) 0%,rgba(34,204,68,0.4) 20%,rgba(10,102,34,0.55) 50%,rgba(4,61,18,0.7) 75%,rgba(2,26,8,0.95) 100%);}
@keyframes klShardPulse{0%,100%{opacity:.6}50%{opacity:1}}
.kl-particles{position:fixed;inset:0;pointer-events:none;overflow:hidden;}
.kl-p{position:absolute;border-radius:50%;background:#39ff14;opacity:0;animation:klFloatP linear infinite;}
@keyframes klFloatP{0%{opacity:0;transform:translateY(0) scale(.3)}15%{opacity:.6}70%{opacity:.15}100%{opacity:0;transform:translateY(-180px) scale(0)}}
.kl-scanline{position:fixed;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(57,255,20,0.012) 3px,rgba(57,255,20,0.012) 4px);z-index:99;}
.kl-card{position:relative;z-index:10;width:240px;padding:36px 28px 28px;background:linear-gradient(160deg,rgba(10,20,14,0.94) 0%,rgba(6,12,8,0.97) 100%);border:1px solid rgba(57,255,20,0.08);border-top:1px solid rgba(57,255,20,0.18);box-shadow:0 0 60px rgba(57,255,20,0.05),0 24px 60px rgba(0,0,0,0.7),inset 0 1px 0 rgba(57,255,20,0.07);display:flex;flex-direction:column;align-items:center;gap:20px;}
.kl-card::before,.kl-card::after{content:'';position:absolute;width:20px;height:20px;border-color:rgba(57,255,20,0.3);border-style:solid;border-width:0;}
.kl-card::before{top:-1px;left:-1px;border-top-width:1px;border-left-width:1px;}
.kl-card::after{bottom:-1px;right:-1px;border-bottom-width:1px;border-right-width:1px;}
.kl-card-scan{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(57,255,20,0.2),transparent);animation:klCardScan 2s linear infinite;z-index:20;}
@keyframes klCardScan{0%{top:0}100%{top:100%}}
.kl-hex-ring{width:80px;height:80px;position:relative;display:flex;align-items:center;justify-content:center;}
.kl-hex-ring svg{position:absolute;top:0;left:0;}
.kl-ring1{animation:klSpin1 1.8s linear infinite;}
.kl-ring2{animation:klSpin2 2.4s linear infinite;}
.kl-ring3{animation:klSpin3 3.2s linear infinite;}
@keyframes klSpin1{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes klSpin2{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
@keyframes klSpin3{from{transform:rotate(30deg)}to{transform:rotate(390deg)}}
.kl-emblem{width:56px;height:56px;animation:klEmblemGlow 2s ease-in-out infinite;filter:drop-shadow(0 0 14px rgba(57,255,20,0.4));}
@keyframes klEmblemGlow{0%,100%{filter:drop-shadow(0 0 10px rgba(57,255,20,0.3))}50%{filter:drop-shadow(0 0 24px rgba(57,255,20,0.7)) drop-shadow(0 0 50px rgba(57,255,20,0.2))}}
.kl-label{font-family:'Orbitron',monospace;font-size:8px;letter-spacing:6px;font-weight:700;text-transform:uppercase;color:#39ff14;text-shadow:0 0 16px rgba(57,255,20,0.35);}
.kl-sublabel{font-family:'Rajdhani',sans-serif;font-size:10px;letter-spacing:4px;font-weight:300;text-transform:uppercase;color:rgba(57,255,20,0.35);margin-top:-14px;}
.kl-progress-wrap{width:100%;display:flex;flex-direction:column;gap:8px;}
.kl-progress-track{width:100%;height:2px;background:rgba(57,255,20,0.06);border:1px solid rgba(57,255,20,0.08);overflow:hidden;position:relative;}
.kl-progress-bar{height:100%;background:linear-gradient(90deg,transparent,#22cc44,#39ff14,rgba(160,255,140,0.9));box-shadow:0 0 8px rgba(57,255,20,0.6),0 0 20px rgba(57,255,20,0.2);animation:klProgressFill 2.4s cubic-bezier(0.4,0,0.2,1) infinite;transform-origin:left;}
@keyframes klProgressFill{0%{width:0%;opacity:1}60%{width:100%;opacity:1}80%{width:100%;opacity:0.4}100%{width:100%;opacity:0}}
.kl-progress-dots{display:flex;justify-content:space-between;padding:0 2px;}
.kl-pdot{width:3px;height:3px;border-radius:50%;background:rgba(57,255,20,0.15);animation:klDotLight 2.4s ease-in-out infinite;}
@keyframes klDotLight{0%,100%{background:rgba(57,255,20,0.1)}50%{background:#39ff14;box-shadow:0 0 6px #39ff14;}}
.kl-status{display:flex;align-items:center;gap:8px;font-family:'Rajdhani',sans-serif;font-size:10px;letter-spacing:3px;color:rgba(57,255,20,0.5);text-transform:uppercase;}
.kl-status-dot{width:5px;height:5px;border-radius:50%;background:#39ff14;box-shadow:0 0 8px #39ff14;animation:klStatusPulse 1.2s ease-in-out infinite;}
@keyframes klStatusPulse{0%,100%{opacity:.4;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}
`;

// ── Background crystal formations (static JSX) ──
const CRYSTAL_CLUSTERS = (() => {
  const clusters = [
    {x:2,  y:78, shards:[{w:24,h:120,rot:-6,d:0},{w:32,h:180,rot:2,d:.2},{w:18,h:90,rot:-12,d:.35},{w:28,h:150,rot:5,d:.5},{w:20,h:100,rot:-3,d:.65},{w:14,h:65,rot:10,d:.8},{w:26,h:135,rot:-1,d:.95}]},
    {x:80, y:76, shards:[{w:20,h:95,rot:8,d:.1},{w:30,h:170,rot:-3,d:.3},{w:16,h:75,rot:14,d:.45},{w:34,h:195,rot:-1,d:.6},{w:22,h:110,rot:6,d:.75},{w:18,h:80,rot:-9,d:.9},{w:28,h:155,rot:3,d:1.05},{w:14,h:60,rot:11,d:1.2}]},
    {x:-1, y:82, shards:[{w:18,h:100,rot:-4,d:.4},{w:24,h:140,rot:2,d:.6},{w:14,h:70,rot:-10,d:.75}]},
    {x:94, y:80, shards:[{w:20,h:110,rot:5,d:.5},{w:26,h:150,rot:-2,d:.7},{w:16,h:80,rot:12,d:.85}]},
    {x:28, y:88, shards:[{w:12,h:50,rot:-7,d:1},{w:16,h:75,rot:3,d:1.15},{w:10,h:40,rot:9,d:1.3}]},
    {x:68, y:87, shards:[{w:14,h:55,rot:6,d:1.1},{w:18,h:80,rot:-4,d:1.25},{w:10,h:38,rot:11,d:1.4}]},
  ];
  const hues = [
    "linear-gradient(170deg,rgba(160,255,140,0.15) 0%,rgba(34,204,68,0.5) 15%,rgba(10,102,34,0.6) 40%,rgba(4,61,18,0.7) 65%,rgba(2,26,8,0.9) 100%)",
    "linear-gradient(168deg,rgba(140,255,180,0.12) 0%,rgba(26,170,68,0.45) 15%,rgba(10,119,48,0.55) 40%,rgba(4,77,24,0.7) 65%,rgba(1,26,6,0.92) 100%)",
    "linear-gradient(172deg,rgba(180,255,160,0.1) 0%,rgba(40,187,58,0.5) 15%,rgba(12,102,37,0.6) 40%,rgba(4,61,18,0.72) 65%,rgba(2,26,8,0.95) 100%)",
  ];
  let idx = 0;
  const elements: JSX.Element[] = [];
  clusters.forEach(cluster => {
    cluster.shards.forEach((s, i) => {
      const key = `c${cluster.x}-${i}`;
      elements.push(
        <div
          key={key}
          className="k-bg-crystal"
          style={{
            left: (cluster.x + i * 2.2) + "%",
            bottom: (100 - cluster.y) + "%",
            width: s.w,
            height: s.h,
            animation: `kBgGrow 3.5s cubic-bezier(0.22,0.61,0.36,1) ${s.d}s forwards`,
          }}
        >
          <div className="k-face" style={{background: hues[idx % 3]}}>
            <div className="k-inner-glow" style={{animationDelay: (Math.random()*2.5).toFixed(1)+"s"}}/>
          </div>
        </div>
      );
      idx++;
    });
  });
  return elements;
})();

// ── Full Kryptonite CSS ──
const KRYPTONITE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600&display=swap');

html,body{height:100%;overflow:hidden}
body{background:#040706;font-family:'Rajdhani',sans-serif;color:rgba(57,255,20,0.8);display:flex;align-items:center;justify-content:center;}

.k-atmosphere{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 90% 70% at 50% 100%,rgba(10,40,15,0.5) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 20% 80%,rgba(57,255,20,0.02) 0%,transparent 50%),radial-gradient(ellipse 60% 50% at 80% 80%,rgba(57,255,20,0.02) 0%,transparent 50%);}

.k-crystal-scene{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;}

.k-bg-crystal{position:absolute;clip-path:polygon(50% 0%,82% 16%,78% 82%,58% 100%,38% 100%,22% 82%,18% 16%);transform-origin:bottom center;opacity:0;}
.k-face{width:100%;height:100%;position:relative;overflow:hidden;}
.k-face::before{content:'';position:absolute;inset:0;background:linear-gradient(155deg,transparent 28%,rgba(57,255,20,0.1) 29%,transparent 31%),linear-gradient(168deg,transparent 48%,rgba(160,255,140,0.06) 49%,transparent 51%),linear-gradient(162deg,transparent 66%,rgba(57,255,20,0.08) 67%,transparent 69%);mix-blend-mode:screen;}
.k-face::after{content:'';position:absolute;top:3%;left:15%;width:32%;height:50%;background:linear-gradient(168deg,rgba(255,255,255,0.25) 0%,rgba(200,255,200,0.08) 30%,transparent 55%);clip-path:polygon(8% 0%,92% 0%,68% 100%,32% 100%);}
.k-inner-glow{position:absolute;top:25%;left:20%;width:60%;height:45%;background:radial-gradient(ellipse,rgba(160,255,140,0.4) 0%,rgba(57,255,20,0.1) 40%,transparent 70%);mix-blend-mode:screen;animation:kIPulse 3s ease-in-out infinite;}

@keyframes kBgGrow{0%{opacity:0;transform:scaleY(0) scaleX(0.6)}20%{opacity:0.4}70%{opacity:0.8;transform:scaleY(0.9) scaleX(0.98)}85%{transform:scaleY(1.02) scaleX(1.01)}100%{opacity:1;transform:scaleY(1) scaleX(1)}}
@keyframes kIPulse{0%,100%{opacity:.35}50%{opacity:.75}}

.k-ground-fog{position:fixed;bottom:0;left:0;right:0;height:220px;z-index:2;pointer-events:none;background:linear-gradient(0deg,rgba(4,7,6,0.95) 0%,rgba(10,40,15,0.3) 40%,transparent 100%);}
.k-ground-fog::before{content:'';position:absolute;bottom:0;left:-10%;right:-10%;height:120px;background:radial-gradient(ellipse 100% 100% at 50% 100%,rgba(57,255,20,0.04) 0%,transparent 70%);animation:kFogDrift 8s ease-in-out infinite alternate;}
@keyframes kFogDrift{0%{transform:translateX(-3%)}100%{transform:translateX(3%)}}

.k-particles{position:fixed;inset:0;z-index:3;pointer-events:none;overflow:hidden;}
.k-ptcl{position:absolute;border-radius:50%;background:#39ff14;opacity:0;animation:kFloatP 5s ease-out infinite;}
@keyframes kFloatP{0%{opacity:0;transform:translateY(0) scale(.4)}12%{opacity:.5}60%{opacity:.2}100%{opacity:0;transform:translateY(-220px) scale(0)}}

.k-login-panel{position:relative;z-index:10;width:420px;padding:52px 44px 44px;background:linear-gradient(170deg,rgba(10,20,14,0.92) 0%,rgba(6,12,8,0.96) 100%);border:1px solid rgba(57,255,20,0.08);border-top:1px solid rgba(57,255,20,0.15);backdrop-filter:blur(20px);box-shadow:0 0 80px rgba(57,255,20,0.04),0 40px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(57,255,20,0.06);opacity:0;animation:kPanelReveal 1.2s cubic-bezier(0.16,1,0.3,1) 1.8s forwards;overflow:visible;transition:border-color .4s,box-shadow .4s;}
.k-login-panel::before,.k-login-panel::after{content:'';position:absolute;width:28px;height:28px;border-color:rgba(57,255,20,0.25);border-style:solid;border-width:0;}
.k-login-panel::before{top:-1px;left:-1px;border-top-width:1px;border-left-width:1px;}
.k-login-panel::after{bottom:-1px;right:-1px;border-bottom-width:1px;border-right-width:1px;}
@keyframes kPanelReveal{0%{opacity:0;transform:translateY(30px) scale(0.97)}100%{opacity:1;transform:translateY(0) scale(1)}}

.k-scan-line{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(57,255,20,0.15),transparent);animation:kScanMove 4s linear infinite;pointer-events:none;z-index:20;}
@keyframes kScanMove{0%{top:0}100%{top:100%}}

.k-refraction{position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:0;overflow:hidden;}
.k-shard{position:absolute;background:linear-gradient(160deg,rgba(57,255,20,0.02),rgba(57,255,20,0.005));clip-path:polygon(30% 0%,70% 0%,100% 100%,0% 100%);}

.k-emblem{width:72px;height:72px;margin:0 auto 32px;position:relative;opacity:0;animation:kEmblemIn 1s ease-out 2.3s forwards;}
.k-emblem svg{width:100%;height:100%;filter:drop-shadow(0 0 18px rgba(57,255,20,0.3));}
@keyframes kEmblemIn{0%{opacity:0;transform:scale(0.5) rotate(-10deg)}60%{transform:scale(1.05) rotate(2deg)}100%{opacity:1;transform:scale(1) rotate(0deg)}}

.k-login-title{font-family:'Orbitron',monospace;font-weight:900;font-size:13px;letter-spacing:10px;text-align:center;text-transform:uppercase;color:#39ff14;text-shadow:0 0 20px rgba(57,255,20,0.35),0 0 60px rgba(57,255,20,0.1);margin-bottom:6px;opacity:0;animation:kTxtIn .8s ease-out 2.5s forwards;}
.k-login-subtitle{font-family:'Rajdhani',sans-serif;font-weight:300;font-size:12px;letter-spacing:6px;text-align:center;text-transform:uppercase;color:rgba(57,255,20,0.35);margin-bottom:36px;opacity:0;animation:kTxtIn .8s ease-out 2.7s forwards;}
@keyframes kTxtIn{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}

.k-field{position:relative;margin-bottom:22px;opacity:0;animation:kFieldIn .7s ease-out forwards;}
@keyframes kFieldIn{0%{opacity:0;transform:translateX(-12px)}100%{opacity:1;transform:translateX(0)}}
.k-field-label{font-family:'Orbitron',monospace;font-size:9px;letter-spacing:5px;text-transform:uppercase;color:rgba(57,255,20,0.4);margin-bottom:8px;display:block;transition:color .3s ease;}
.k-field-input-wrap{position:relative;border:1px solid rgba(57,255,20,0.1);background:rgba(4,12,6,0.6);transition:all .4s ease;overflow:hidden;}
.k-field-input-wrap::before{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:linear-gradient(90deg,#39ff14,rgba(57,255,20,0.3));transition:width .5s cubic-bezier(0.22,0.61,0.36,1);}
.k-field-input-wrap:focus-within{border-color:rgba(57,255,20,0.25);box-shadow:0 0 25px rgba(57,255,20,0.06),inset 0 0 20px rgba(57,255,20,0.02);}
.k-field-input-wrap:focus-within::before{width:100%;}
.k-field:has(.k-field-input-wrap:focus-within) .k-field-label{color:rgba(57,255,20,0.7);}
.k-field-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:16px;height:16px;opacity:0.35;transition:opacity .3s ease;}
.k-field-input-wrap:focus-within .k-field-icon{opacity:0.7;}
.k-field input{width:100%;padding:14px 14px 14px 42px;background:transparent;border:none;outline:none;font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:500;letter-spacing:2px;color:rgba(57,255,20,0.85);caret-color:#39ff14;}
.k-field input::placeholder{color:rgba(57,255,20,0.18);font-weight:300;letter-spacing:3px;}
.k-field input:-webkit-autofill{-webkit-box-shadow:0 0 0 50px rgba(4,12,6,1) inset;-webkit-text-fill-color:rgba(57,255,20,0.85);}
.k-field input:disabled{opacity:0.5;cursor:not-allowed;}

.k-eye-toggle{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;padding:4px;opacity:0.3;transition:opacity .3s ease;}
.k-eye-toggle:hover{opacity:0.7;}
.k-eye-toggle svg{width:16px;height:16px;}

.k-error{font-size:13px;color:#ff4444;background:rgba(255,40,40,0.08);border:1px solid rgba(255,40,40,0.2);border-radius:4px;padding:9px 12px;margin:0 0 14px;letter-spacing:1px;}

.k-login-btn{width:100%;padding:16px;margin-top:12px;font-family:'Orbitron',monospace;font-size:11px;font-weight:700;letter-spacing:8px;text-transform:uppercase;color:#040706;background:linear-gradient(135deg,#22cc44,#39ff14);border:none;cursor:pointer;position:relative;overflow:hidden;transition:all .4s ease;opacity:0;animation:kBtnIn .8s ease-out 3.1s forwards;box-shadow:0 0 30px rgba(57,255,20,0.15),0 4px 20px rgba(0,0,0,0.4);}
.k-login-btn:hover{box-shadow:0 0 50px rgba(57,255,20,0.3),0 4px 30px rgba(0,0,0,0.5);transform:translateY(-1px);letter-spacing:10px;}
.k-login-btn:active{transform:translateY(1px);box-shadow:0 0 20px rgba(57,255,20,0.2);}
.k-login-btn:disabled{cursor:not-allowed;}
.k-login-btn::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transition:left .6s ease;}
.k-login-btn:hover::before{left:140%;}
@keyframes kBtnIn{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}

.k-login-btn .btn-text{transition:opacity .3s;}
.k-login-btn.loading .btn-text{opacity:0;}
.btn-loader{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:6px;opacity:0;transition:opacity .3s ease;}
.k-login-btn.loading .btn-loader{opacity:1;}
.btn-loader span{width:4px;height:14px;background:#040706;animation:kBarPulse .8s ease-in-out infinite;}
.btn-loader span:nth-child(2){animation-delay:.15s;}
.btn-loader span:nth-child(3){animation-delay:.3s;}
.btn-loader span:nth-child(4){animation-delay:.45s;}
@keyframes kBarPulse{0%,100%{transform:scaleY(.4);opacity:.4}50%{transform:scaleY(1);opacity:1}}

.k-bottom-row{display:flex;justify-content:space-between;align-items:center;margin-top:24px;opacity:0;animation:kTxtIn .7s ease-out 3.3s forwards;}
.k-bottom-link{font-family:'Rajdhani',sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(57,255,20,0.3);text-decoration:none;transition:all .3s ease;position:relative;}
.k-bottom-link:hover{color:rgba(57,255,20,0.7);}
.k-bottom-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:#39ff14;transition:width .3s ease;}
.k-bottom-link:hover::after{width:100%;}

.k-status{display:flex;align-items:center;gap:8px;margin-top:28px;justify-content:center;opacity:0;animation:kTxtIn .7s ease-out 3.5s forwards;}
.k-status-dot{width:6px;height:6px;border-radius:50%;background:#39ff14;box-shadow:0 0 8px rgba(57,255,20,0.35);animation:kDotPulse 2s ease-in-out infinite;}
@keyframes kDotPulse{0%,100%{opacity:.4;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}
.k-status-text{font-size:10px;letter-spacing:5px;text-transform:uppercase;color:rgba(57,255,20,0.3);}
`;
