// Export du bilan du partenariat (Superprof + Spliiit) depuis le cockpit (head-of-sales.html, index.html).
// Tout se passe dans le tableau de bord, sans page intermédiaire : la modale lit les données
// (cse-spliit-report), le document est rendu dans une iframe cachée (srcdoc, bilan-doc.js),
// chaque page est photographiée (html2canvas) puis assemblée en PDF (jsPDF) et téléchargée.
// window.print() n'est pas utilisé : il est bloqué dans la modale HubSpot.
// Les chiffres saisis pour la page Superprof, le contrat et le début du partenariat sont
// enregistrés pour le CSE (POST cse-spliit-report) et repris aux exports suivants.
(function () {
  'use strict';
  var API = 'https://yhtxrjegdeuwkcjvkfkt.supabase.co/functions/v1/cse-spliit-report';
  var VERSION = '5';
  var LIBS = {
    jspdf: { src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', sri: 'sha384-JcnsjUPPylna1s1fvi1u12X5qjY5OL56iySh75FdtrwhO/SWXgMjoVqcKyIIWOLk' },
    html2canvas: { src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', sri: 'sha384-ZZ1pncU3bQe8y31yfZdMFdSpttDoPmOZg2wguVK9almUodir1PghgT0eY7Mrty8H' }
  };
  var CAVEAT_CSS = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap';
  var ICONE = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true"><path d="M6 21H18M12 3V17M7 12L12 17L17 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICO_SP = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M12 3L2 8.5L12 14L22 8.5L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M6 11V16C6 16 8.5 18.5 12 18.5C15.5 18.5 18 16 18 16V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var ICO_SL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="2"/><path d="M3 10H21" stroke="currentColor" stroke-width="2"/><path d="M7 15H11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var ICO_OK = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true"><path d="M5 12.5L10 17.5L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var CSS = [
    '.bsx-back{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.5);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);font-family:inherit;font-size:13px;line-height:1.5}',
    '.bsx-back[hidden]{display:none!important}',
    '.bsx-box{width:min(660px,100%);max-height:calc(100vh - 32px);background:#fff;color:var(--slate-900,#0f172a);border-radius:18px;box-shadow:0 30px 80px -20px rgba(15,23,42,.45),0 0 0 1px rgba(15,23,42,.06);display:flex;flex-direction:column;overflow:hidden;animation:bsxIn .22s cubic-bezier(.2,.8,.2,1) both}',
    '@keyframes bsxIn{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}',
    '.bsx-head{position:relative;flex:none;padding:18px 20px 16px;color:#fff;background:linear-gradient(135deg,#4f46e5 0%,#6366f1 50%,#8b5cf6 100%);overflow:hidden}',
    '.bsx-head:before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 85% 0%,rgba(255,255,255,.22) 0%,transparent 55%)}',
    '.bsx-head>*{position:relative}',
    '.bsx-eyebrow{font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.72)}',
    '.bsx-head h2{margin:2px 0 0;font-size:19px;font-weight:800;line-height:1.2;color:#fff;padding-right:40px}',
    '.bsx-head p{margin:4px 0 0;font-size:12px;color:rgba(255,255,255,.82)}',
    '.bsx-x{position:absolute;right:14px;top:14px;width:30px;height:30px;border:none;border-radius:10px;background:rgba(255,255,255,.16);color:#fff;font:inherit;font-size:17px;line-height:1;cursor:pointer;transition:background .15s}',
    '.bsx-x:hover{background:rgba(255,255,255,.3)}',
    '.bsx-scroll{flex:1;overflow:auto;padding:16px 20px 6px;display:flex;flex-direction:column;gap:14px}',
    '.bsx-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '.bsx-card{border-radius:14px;padding:12px 13px;border:1px solid var(--slate-200,#e2e8f0);background:linear-gradient(180deg,#fff,var(--slate-50,#f8fafc))}',
    '.bsx-card-h{display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:800;color:var(--slate-700,#334155);margin-bottom:9px}',
    '.bsx-card-h i{width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex:none}',
    '.bsx-card.sp .bsx-card-h i{background:#fff1f1;color:#e5484d}',
    '.bsx-card.sl .bsx-card-h i{background:#e0e7ff;color:#4338ca}',
    '.bsx-card-h small{margin-left:auto;font-size:10.5px;font-weight:600;color:var(--slate-400,#94a3b8)}',
    '.bsx-kv{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px}',
    '.bsx-kv div b{display:block;font-size:17px;font-weight:800;line-height:1.15;color:var(--slate-900,#0f172a);font-variant-numeric:tabular-nums}',
    '.bsx-kv div span{display:block;font-size:10.5px;line-height:1.3;color:var(--slate-600,#475569)}',
    '.bsx-kv div.hl b{color:#059669}',
    '.bsx-f{display:flex;flex-direction:column;gap:4px;min-width:0}',
    '.bsx-f label{font-size:11.5px;font-weight:700;color:var(--slate-700,#334155)}',
    '.bsx-f input{font-family:inherit;font-size:12.5px;color:var(--slate-900,#0f172a);background:var(--slate-50,#f8fafc);border:1.5px solid var(--slate-200,#e2e8f0);border-radius:10px;padding:8px 11px;min-width:0;outline:none;font-variant-numeric:tabular-nums;transition:border-color .15s,box-shadow .15s,background .15s}',
    '.bsx-f input:focus{border-color:var(--indigo,#6366f1);box-shadow:0 0 0 3px rgba(99,102,241,.14);background:#fff}',
    '.bsx-f input[readonly]{background:transparent;border-style:dashed;color:var(--slate-600,#475569)}',
    '.bsx-f.err input{border-color:var(--rose,#f43f5e)}',
    '.bsx-f.chg input{border-color:#a5b4fc;background:#eef2ff}',
    '.bsx-d{font-size:11px;line-height:1.45;color:var(--slate-600,#475569)}',
    '.bsx-d b{color:var(--slate-700,#334155)}',
    '.bsx-m{font-size:11px;color:var(--slate-400,#94a3b8);display:flex;flex-wrap:wrap;gap:4px;align-items:center}',
    '.bsx-tag{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;color:#4338ca;background:#eef2ff;border-radius:999px;padding:1px 7px}',
    '.bsx-lien,.bsx-m button{font:inherit;font-size:11px;border:none;background:none;padding:0;color:var(--indigo-dark,#4f46e5);font-weight:600;cursor:pointer}',
    '.bsx-lien:hover,.bsx-m button:hover{text-decoration:underline}',
    '.bsx-e{font-size:11px;font-weight:600;color:#e11d48}',
    '.bsx-e:empty{display:none}',
    '.bsx-tabs{display:flex;gap:2px;padding:3px;border-radius:12px;background:var(--slate-100,#f1f5f9);border:1px solid var(--slate-200,#e2e8f0)}',
    '.bsx-tab{flex:1;border:none;background:transparent;border-radius:9px;padding:6px 8px;font:inherit;font-size:11.5px;font-weight:700;color:var(--slate-600,#475569);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background .15s,color .15s,box-shadow .15s}',
    '.bsx-tab[aria-selected="true"]{background:#fff;color:#4338ca;box-shadow:0 1px 3px rgba(15,23,42,.12)}',
    '.bsx-tab .n{min-width:16px;height:16px;border-radius:999px;background:#6366f1;color:#fff;font-size:10px;line-height:16px;padding:0 4px}',
    '.bsx-tab .n:empty{display:none}',
    '.bsx-panel{display:flex;flex-direction:column;gap:12px}',
    '.bsx-panel[hidden]{display:none}',
    '.bsx-grp{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.bsx-grp .full{grid-column:1/-1}',
    '.bsx-intro{font-size:11.5px;line-height:1.5;color:var(--slate-600,#475569);background:var(--slate-50,#f8fafc);border:1px solid var(--slate-200,#e2e8f0);border-radius:10px;padding:8px 11px}',
    '.bsx-th{display:grid;gap:6px}',
    '.bsx-th div{display:grid;grid-template-columns:22px 1fr;align-items:center;gap:6px}',
    '.bsx-th div span{width:22px;height:22px;border-radius:999px;background:#fff1f1;color:#e5484d;font-size:11px;font-weight:800;text-align:center;line-height:22px}',
    '.bsx-prix{width:100%;border-collapse:collapse;font-size:11.5px;font-variant-numeric:tabular-nums}',
    '.bsx-prix th{text-align:left;font-size:10px;font-weight:700;color:var(--slate-400,#94a3b8);text-transform:uppercase;letter-spacing:.04em;padding:0 6px 6px;border-bottom:1px solid var(--slate-200,#e2e8f0);position:sticky;top:0;background:#fff}',
    '.bsx-prix td{padding:4px 6px;border-bottom:1px solid var(--slate-100,#f1f5f9);vertical-align:middle}',
    '.bsx-prix td.n{text-align:right;color:var(--slate-600,#475569)}',
    '.bsx-prix input{width:66px;font-family:inherit;font-size:12px;text-align:right;border:1.5px solid var(--slate-200,#e2e8f0);border-radius:8px;padding:4px 6px;background:var(--slate-50,#f8fafc);outline:none}',
    '.bsx-prix input:focus{border-color:var(--indigo,#6366f1);background:#fff}',
    '.bsx-prix input.chg{border-color:#a5b4fc;background:#eef2ff}',
    '.bsx-prix input.err{border-color:var(--rose,#f43f5e)}',
    '.bsx-prix a{color:var(--indigo-dark,#4f46e5);text-decoration:none;font-size:11px}',
    '.bsx-prix .o{display:block;font-size:10.5px;color:var(--slate-400,#94a3b8)}',
    '.bsx-prix-wrap{max-height:280px;overflow:auto;border:1px solid var(--slate-200,#e2e8f0);border-radius:12px;padding:6px 4px 2px}',
    '.bsx-foot{flex:none;display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:12px 20px 16px;border-top:1px solid var(--slate-100,#f1f5f9);background:#fff}',
    '.bsx-status{flex:1 1 220px;font-size:11.5px;line-height:1.45;color:var(--slate-600,#475569);min-height:16px}',
    '.bsx-status button{font:inherit;font-size:11.5px;border:none;background:none;padding:0;color:var(--indigo-dark,#4f46e5);font-weight:700;cursor:pointer;text-decoration:underline}',
    '.bsx-status .ok{display:inline-flex;align-items:center;gap:5px;color:#059669;font-weight:700}',
    '.bsx-prog{height:4px;border-radius:999px;background:var(--slate-100,#f1f5f9);overflow:hidden;margin-top:6px}',
    '.bsx-prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#818cf8,#8b5cf6);transition:width .25s}',
    '.bsx-btn{font-family:inherit;font-size:12.5px;font-weight:700;border-radius:10px;padding:8px 16px;cursor:pointer;border:1px solid transparent;display:inline-flex;align-items:center;gap:6px;line-height:1.3;transition:opacity .15s,transform .15s,box-shadow .15s,background .15s}',
    '.bsx-btn[disabled]{opacity:.5;cursor:not-allowed;transform:none}',
    '.bsx-light{background:var(--slate-100,#f1f5f9);border-color:var(--slate-200,#e2e8f0);color:var(--slate-600,#475569)}',
    '.bsx-light:hover{background:var(--slate-200,#e2e8f0)}',
    '.bsx-primary{background:linear-gradient(135deg,#7c3aed,#6366f1);color:#fff;box-shadow:0 4px 14px -4px rgba(99,102,241,.55)}',
    '.bsx-primary:hover:not([disabled]){transform:translateY(-1px);box-shadow:0 8px 20px -6px rgba(99,102,241,.6)}',
    '.bsx-btn:focus-visible,.bsx-x:focus-visible,.bsx-tab:focus-visible,.bsx-lien:focus-visible,.bsx-m button:focus-visible,.bsx-status button:focus-visible{outline:2px solid var(--indigo,#6366f1);outline-offset:2px}',
    '.bsx-x:focus-visible{outline-color:#fff}',
    '.bsx-load{padding:22px 0;font-size:12px;color:var(--slate-400,#94a3b8);text-align:center}',
    '.bsx-frame{position:fixed;left:-10000px;top:0;width:820px;height:1200px;border:0;opacity:0;pointer-events:none}',
    '@media (max-width:560px){.bsx-cards,.bsx-grp{grid-template-columns:1fr}}',
    'body.dark .bsx-back{background:rgba(2,6,23,.65)}',
    'body.dark .bsx-box,body.dark .bsx-foot,body.dark .bsx-prix th{background:#1e293b;color:#f8fafc}',
    'body.dark .bsx-head{background:linear-gradient(135deg,#3730a3,#4c1d95)}',
    'body.dark .bsx-card{background:#0f172a;border-color:#334155}',
    'body.dark .bsx-card-h,body.dark .bsx-f label,body.dark .bsx-d b{color:#e2e8f0}',
    'body.dark .bsx-kv div b{color:#f1f5f9}',
    'body.dark .bsx-kv div span,body.dark .bsx-status,body.dark .bsx-d,body.dark .bsx-intro{color:#94a3b8}',
    'body.dark .bsx-intro,body.dark .bsx-tabs{background:#0f172a;border-color:#334155}',
    'body.dark .bsx-tab{color:#94a3b8}body.dark .bsx-tab[aria-selected="true"]{background:#334155;color:#c7d2fe}',
    'body.dark .bsx-m,body.dark .bsx-load,body.dark .bsx-prix th{color:#64748b}',
    'body.dark .bsx-light{background:#334155;border-color:#475569;color:#cbd5e1}',
    'body.dark .bsx-light:hover{background:#475569}',
    'body.dark .bsx-f input,body.dark .bsx-prix input{background:#0f172a;color:#e2e8f0;border-color:#334155;color-scheme:dark}',
    'body.dark .bsx-f input:focus,body.dark .bsx-prix input:focus{background:#1e293b;border-color:var(--indigo,#6366f1)}',
    'body.dark .bsx-f.chg input,body.dark .bsx-prix input.chg{background:rgba(99,102,241,.16)}',
    'body.dark .bsx-prix td,body.dark .bsx-foot{border-color:#334155}',
    'body.dark .bsx-prix-wrap{border-color:#334155}',
    'body.dark .bsx-tag{background:rgba(99,102,241,.2);color:#c7d2fe}',
    'body.dark .bsx-lien,body.dark .bsx-m button,body.dark .bsx-status button,body.dark .bsx-prix a{color:#a5b4fc}',
    'body.dark .bsx-e{color:#fb7185}'
  ].join('\n');

  // Champs numériques modifiables : clé du modèle, onglet, libellé, explication, où, enregistré ?
  var CHAMPS = [
    { k: 'membres', t: 'sp', l: 'Utilisateurs inscrits', d: 'Salariés qui ont <b>activé leur compte Superprof</b> dans l\'espace du CSE.', o: 'Pages 1 à 4 (base des pourcentages).', saved: true, src: 'base du cockpit' },
    { k: 'mer', t: 'sp', l: 'Mises en relation', d: 'Demandes de cours envoyées par les salariés à un professeur, <b>depuis le début</b> du partenariat.', o: 'Page 2 (Superprof).', saved: true, src: 'base du cockpit' },
    { k: 'adressables', t: 'sl', l: 'Salariés adressables', d: 'Salariés <b>couverts par l\'offre</b> (quota de la fiche CSE).', o: 'Page 3 : part des salariés inscrits.', src: 'fiche CSE' },
    { k: 'beneficiaires', t: 'sl', l: 'Bénéficiaires Spliiit', d: 'Salariés qui ont <b>activé leur cagnotte</b> Spliiit.', o: 'Pages 1 à 5 (économies par bénéficiaire).', src: 'Spliiit' },
    { k: 'abonnes', t: 'sl', l: 'Abonnés en cours', d: 'Bénéficiaires avec <b>au moins un abonnement actif</b> (« utilisateurs actifs » chez Spliiit).', o: 'Pages 3 à 5 (moyennes par abonné).', src: 'Spliiit' }
  ];
  var ONGLETS = [{ id: 'sp', l: 'Superprof' }, { id: 'sl', l: 'Spliiit' }, { id: 'px', l: 'Prix' }, { id: 'dc', l: 'Document' }];

  var el = null, ctx = null, rapport = null, polices = [], mesure = null, init = null, saisie = null;
  var dernierFocus = null, enCours = false, cibleAppui = null, dernierPdf = null, ongletActif = 'sp';
  var luA = 0, annule = false; // date de lecture du rapport (liens signés des polices : 1 h) ; fermeture pendant la génération
  var cacheRessources = {};

  function int(n) { return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(+n || 0)); }
  function eur(n, d) { return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }).format(+n || 0) + ' €'; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function $(sel) { return el.querySelector(sel); }
  function lisible(msg) { var e = new Error(msg); e.lisible = true; return e; }
  function egal(a, b) { return JSON.stringify(a == null ? null : a) === JSON.stringify(b == null ? null : b); }

  function charger(src, sri) {
    return new Promise(function (ok, ko) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      if (sri) { s.integrity = sri; s.crossOrigin = 'anonymous'; }
      s.onload = function () { ok(); };
      s.onerror = function () { ko(lisible('Une bibliothèque n\'a pas pu être chargée. Vérifiez la connexion puis réessayez.')); };
      document.head.appendChild(s);
    });
  }
  function bilanDoc() { return window.BilanDoc ? Promise.resolve() : charger('bilan-doc.js?v=' + VERSION); }
  var MOIS_OK = /^\d{4}-(0[1-9]|1[0-2])$/;
  function dateOk(s) {
    var m = String(s || '').match(/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);
    if (!m) return false;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
  }

  // ── Modale ───────────────────────────────────────────────────────────────
  function construire() {
    if (el) return;
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    el = document.createElement('div');
    el.className = 'bsx-back';
    el.hidden = true;
    el.innerHTML =
      '<div class="bsx-box" role="dialog" aria-modal="true" aria-labelledby="bsx-titre">' +
        '<div class="bsx-head"><div class="bsx-eyebrow">Bilan du partenariat · PDF</div><h2 id="bsx-titre">Bilan du partenariat</h2><p id="bsx-sous">Superprof + Spliiit</p>' +
        '<button type="button" class="bsx-x" data-bsx="fermer" aria-label="Fermer">×</button></div>' +
        '<form class="bsx-scroll" novalidate><div class="bsx-load">Lecture des données…</div></form>' +
        '<div class="bsx-foot"><div class="bsx-status" role="status" aria-live="polite"></div>' +
          '<button type="button" class="bsx-btn bsx-light" data-bsx="fermer">Fermer</button>' +
          '<button type="button" class="bsx-btn bsx-primary" data-bsx="generer" disabled>' + ICONE + 'Générer le PDF</button></div>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('pointerdown', function (e) { cibleAppui = e.target; });
    el.addEventListener('click', function (e) {
      if (e.target === el) { if (cibleAppui === el) fermer(); return; }
      var t = e.target.closest ? e.target.closest('[data-bsx],[data-reset],[data-onglet]') : null;
      if (!t) return;
      if (t.getAttribute('data-onglet')) { onglet(t.getAttribute('data-onglet')); return; }
      var k = t.getAttribute('data-reset');
      if (k) { retablir(k); return; }
      var a = t.getAttribute('data-bsx');
      if (a === 'fermer') fermer();
      if (a === 'generer') generer();
      if (a === 'retelecharger' && dernierPdf) telecharger(dernierPdf);
      if (a === 'ouvrir' && dernierPdf) window.open(dernierPdf.url, '_blank', 'noopener');
      if (a === 'prix-reset') reinitPrix();
    });
    // Les contrôles croisés (inscrits ≥ bénéficiaires ≥ abonnés…) dépendent de plusieurs champs :
    // toute saisie efface les messages, revérifiés à la génération.
    el.addEventListener('input', function () {
      [].forEach.call(el.querySelectorAll('.bsx-f.err'), function (f) { erreur(f.getAttribute('data-k'), ''); });
      if (!enCours) statut('');
      maj();
    });
    el.addEventListener('submit', function (e) { e.preventDefault(); generer(); });
    document.addEventListener('keydown', function (e) {
      if (!el || el.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); fermer(); return; }
      if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT' && el.contains(e.target)) { e.preventDefault(); generer(); return; }
      if (e.key !== 'Tab') return;
      var f = [].slice.call(el.querySelectorAll('button:not([disabled]),input:not([readonly]),a[href]')).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (!el.contains(document.activeElement)) { e.preventDefault(); f[0].focus(); return; }
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }

  function statut(html, prog) {
    $('.bsx-status').innerHTML = (html || '') + (prog != null ? '<div class="bsx-prog"><i style="width:' + Math.round(100 * prog) + '%"></i></div>' : '');
  }
  function erreur(k, msg) {
    var f = el.querySelector('[data-k="' + k + '"]');
    if (!f) return;
    f.classList.toggle('err', !!msg);
    var i = f.querySelector('input'); if (i) i.setAttribute('aria-invalid', msg ? 'true' : 'false');
    var e = f.querySelector('.bsx-e'); if (e) e.textContent = msg || '';
  }
  function onglet(id) {
    ongletActif = id;
    [].forEach.call(el.querySelectorAll('.bsx-tab'), function (b) { b.setAttribute('aria-selected', b.getAttribute('data-onglet') === id ? 'true' : 'false'); });
    [].forEach.call(el.querySelectorAll('.bsx-panel'), function (p) { p.hidden = p.getAttribute('data-panel') !== id; });
  }
  function enregistre(k) { return rapport && rapport.valeurs && init && mesure && !egal(init[k], mesure[k]); }
  function meta(k, texte, saved) {
    return '<div class="bsx-m">' + texte + (saved ? ' <span class="bsx-tag">' + ICO_OK.replace('15', '11').replace('15', '11') + 'enregistré pour ce CSE</span>' : '') +
      ' · <button type="button" data-reset="' + k + '">valeur mesurée</button></div>';
  }
  function champ(c, val) {
    return '<div class="bsx-f" data-k="' + c.k + '"><label for="bsx-' + c.k + '">' + c.l + '</label>' +
      '<input id="bsx-' + c.k + '" name="' + c.k + '" type="number" min="0" step="1" inputmode="numeric" value="' + esc(val) + '">' +
      '<div class="bsx-d">' + c.d + ' <b>Où :</b> ' + c.o + '</div>' +
      meta(c.k, 'Mesuré : ' + int(mesure[c.k]) + ' (' + c.src + ')', c.saved && enregistre(c.k)) +
      '<div class="bsx-e" role="alert"></div></div>';
  }

  function formulaire() {
    var v = saisie || init;
    var u = rapport.utilisateurs || {};
    var services = (rapport.services || []).filter(function (s) { return +s.abonnements > 0; });
    var infos = Object.create(null);
    (rapport.prix || []).forEach(function (p) { infos[p.service] = p; });
    var lignesPrix = services.map(function (s) {
      var i = infos[s.service] || {};
      var p = v.prix[s.service] || {};
      var champPrix = function (cle, libelle) {
        return '<td><input type="number" min="0" step="0.01" inputmode="decimal" data-prix="' + esc(s.service) + '" data-cle="' + cle + '" value="' + (p[cle] == null ? '' : p[cle]) + '" aria-label="' + libelle + ' ' + esc(s.service) + '"></td>';
      };
      return '<tr><td>' + esc(s.service) + (i.offre ? '<span class="o">' + esc(i.offre) + '</span>' : '<span class="o">aucun prix relevé</span>') + '</td>' +
        '<td class="n">' + int(s.abonnements) + '</td>' + champPrix('public', 'Prix public mensuel') + champPrix('spliiit', 'Prix Spliiit mensuel') +
        '<td>' + (/^https:\/\//.test(i.source || '') ? '<a href="' + esc(i.source) + '" target="_blank" rel="noopener noreferrer">source</a>' : '') + '</td></tr>';
    }).join('');
    var th = [0, 1, 2].map(function (i) {
      return '<div><span>' + (i + 1) + '</span><input id="bsx-th' + i + '" name="th' + i + '" type="text" maxlength="120" autocomplete="off" value="' + esc((v.thematiques || [])[i] || '') + '" placeholder="Ex. Musique - Piano, Batterie" aria-label="Thématique ' + (i + 1) + '"></div>';
    }).join('');
    var parOnglet = function (t) { return CHAMPS.filter(function (c) { return c.t === t; }).map(function (c) { return champ(c, v[c.k]); }).join(''); };
    $('.bsx-scroll').innerHTML =
      '<div class="bsx-cards">' +
        '<div class="bsx-card sp"><div class="bsx-card-h"><i>' + ICO_SP + '</i>Superprof<small id="bsx-acces"></small></div><div class="bsx-kv" id="bsx-kv-sp"></div></div>' +
        '<div class="bsx-card sl"><div class="bsx-card-h"><i>' + ICO_SL + '</i>Spliiit<small>données au ' + esc(window.BilanDoc.jourTxt(window.BilanDoc.veille(rapport.dernier_releve.snapshot_date))) + '</small></div><div class="bsx-kv" id="bsx-kv-sl"></div></div>' +
      '</div>' +
      '<div class="bsx-f" data-k="nom"><label for="bsx-nom">Nom du CSE affiché</label><input id="bsx-nom" name="nom" type="text" autocomplete="off" maxlength="120" value="' + esc(v.nom) + '"><div class="bsx-e" role="alert"></div></div>' +
      '<div class="bsx-tabs" role="tablist" aria-label="Chiffres du bilan">' + ONGLETS.map(function (o) {
        return '<button type="button" class="bsx-tab" role="tab" data-onglet="' + o.id + '" aria-selected="false">' + o.l + '<span class="n" id="bsx-n-' + o.id + '"></span></button>';
      }).join('') + '</div>' +
      '<div class="bsx-panel" data-panel="sp" role="tabpanel">' +
        '<div class="bsx-intro">Chiffres de la page Superprof (page 2). Ils sont <b>enregistrés pour ce CSE</b> et repris au prochain export.</div>' +
        '<div class="bsx-grp">' + parOnglet('sp') +
          '<div class="bsx-f" data-k="accesFin"><label for="bsx-accesFin">Accès Superprof + Spliiit jusqu\'au</label><input id="bsx-accesFin" name="accesFin" type="date" value="' + esc(v.accesFin) + '"><div class="bsx-d"><b>Où :</b> page 2. Laissez vide pour ne pas l\'afficher.</div>' + meta('accesFin', 'Fiche CSE : ' + (mesure.accesFin ? esc(window.BilanDoc.jourTxt(mesure.accesFin)) : 'non renseignée'), enregistre('accesFin')) + '<div class="bsx-e" role="alert"></div></div>' +
          '<div class="bsx-f full" data-k="thematiques"><label>Top 3 des thématiques demandées</label><div class="bsx-th">' + th + '</div><div class="bsx-d">Une thématique par ligne, au format « Catégorie - détail » (la catégorie s\'affiche en gras). <b>Où :</b> page 2.</div>' +
            meta('thematiques', 'Mesuré : ' + esc((mesure.thematiques || []).join(', ') || 'aucun sujet'), enregistre('thematiques')) + '<div class="bsx-e" role="alert"></div></div>' +
        '</div></div>' +
      '<div class="bsx-panel" data-panel="sl" role="tabpanel" hidden>' +
        '<div class="bsx-intro">Chiffres du jour, à ne modifier que si vous avez un chiffre officiel plus juste (Spliiit ou CSE). Pourcentages, moyennes et économies sont recalculés. Le document n\'indique pas qu\'un chiffre a été modifié.</div>' +
        '<div class="bsx-grp">' + parOnglet('sl') +
          '<div class="bsx-f"><label>Abonnements en cours</label><input type="text" readonly value="' + int(u.abonnements_en_cours) + '"><div class="bsx-d">Mesuré par Spliiit, <b>non modifiable</b> : base des économies et de la moyenne par abonné.</div></div>' +
        '</div></div>' +
      '<div class="bsx-panel" data-panel="px" role="tabpanel" hidden>' +
        '<div class="bsx-intro"><b>Prix public</b> : offre individuelle mensuelle équivalente, en France, TTC. <b>Prix Spliiit</b> : participation mensuelle pour une place, frais compris. Économie d\'un service = (prix public − prix Spliiit) × abonnements en cours. Un service sans l\'un des deux prix n\'est pas compté. · <button type="button" class="bsx-lien" data-bsx="prix-reset">rétablir tous les prix</button></div>' +
        '<div class="bsx-prix-wrap"><table class="bsx-prix"><thead><tr><th>Service</th><th style="text-align:right">Abonnés</th><th>Public</th><th>Spliiit</th><th></th></tr></thead><tbody>' + lignesPrix + '</tbody></table></div>' +
      '</div>' +
      '<div class="bsx-panel" data-panel="dc" role="tabpanel" hidden><div class="bsx-grp">' +
        '<div class="bsx-f" data-k="contrat"><label for="bsx-contrat">Cagnotte au contrat (€ par salarié et par an)</label><input id="bsx-contrat" name="contrat" type="number" min="0" step="0.01" inputmode="decimal" placeholder="Optionnel, ex. 160" value="' + (v.contrat == null ? '' : v.contrat) + '"><div class="bsx-d">Affichée page 5 sous les économies. Laissez vide pour ne pas l\'afficher.</div>' + (enregistre('contrat') ? '<div class="bsx-m"><span class="bsx-tag">enregistré pour ce CSE</span></div>' : '') + '<div class="bsx-e" role="alert"></div></div>' +
        '<div class="bsx-f" data-k="debut"><label for="bsx-debut">Début du partenariat</label><input id="bsx-debut" name="debut" type="month" max="' + esc(mesure.moisDonnees) + '" value="' + esc(v.debut) + '"><div class="bsx-d"><b>Où :</b> couverture (« De … à … »). La fin est le mois des données.</div>' + meta('debut', 'Par défaut : création du CSE', enregistre('debut')) + '<div class="bsx-e" role="alert"></div></div>' +
      '</div></div>';
    onglet(ongletActif);
    $('[data-bsx="generer"]').disabled = false;
    maj();
    setTimeout(function () { var i = $('#bsx-nom'); if (i && !el.hidden) i.focus(); }, 30);
  }

  function retablir(k) {
    if (k === 'thematiques') { [0, 1, 2].forEach(function (i) { $('#bsx-th' + i).value = (mesure.thematiques || [])[i] || ''; }); }
    else { var i = $('#bsx-' + k); if (i) i.value = mesure[k] == null ? '' : mesure[k]; }
    erreur(k, ''); maj();
  }
  function prixMesure(i) {
    var p = mesure.prix[i.getAttribute('data-prix')] || {};
    var v = p[i.getAttribute('data-cle')];
    return v == null ? '' : v;
  }
  function reinitPrix() {
    [].forEach.call(el.querySelectorAll('[data-prix]'), function (i) { i.value = prixMesure(i); });
    maj();
  }

  // Lit le formulaire ; erreurs par champ. Renvoie { ref, erreurs }.
  function lire() {
    var ref = { nom: (String(($('#bsx-nom') || {}).value || '').trim().slice(0, 120)) || mesure.nom, prix: Object.create(null) };
    var err = {};
    CHAMPS.forEach(function (c) {
      var i = $('#bsx-' + c.k);
      if (!i) { ref[c.k] = init[c.k]; return; }
      if (i.validity && i.validity.badInput) { err[c.k] = 'Saisissez un nombre entier, sans espace.'; ref[c.k] = init[c.k]; return; }
      if (i.value === '') { ref[c.k] = mesure[c.k]; return; }
      var n = Number(i.value);
      if (!isFinite(n) || n < 0 || Math.floor(n) !== n || n > 1000000) { err[c.k] = 'Saisissez un nombre entier positif.'; ref[c.k] = init[c.k]; return; }
      ref[c.k] = n;
    });
    if (!err.membres && ref.membres <= 0) err.membres = 'Il faut au moins un inscrit.';
    if (!err.adressables && !err.membres && ref.adressables > 0 && ref.membres > ref.adressables) err.adressables = 'Doit être au moins égal aux inscrits (' + int(ref.membres) + ').';
    if (!err.beneficiaires && !err.membres && ref.beneficiaires > ref.membres) err.beneficiaires = 'Ne peut pas dépasser les inscrits Superprof (' + int(ref.membres) + ').';
    if (!err.beneficiaires && ref.beneficiaires <= 0) err.beneficiaires = 'Il faut au moins un bénéficiaire.';
    if (!err.abonnes && !err.beneficiaires && ref.abonnes > ref.beneficiaires) err.abonnes = 'Ne peut pas dépasser les bénéficiaires (' + int(ref.beneficiaires) + ').';
    if (!err.abonnes && ref.abonnes <= 0) err.abonnes = 'Il faut au moins un abonné.';
    var fin = String((($('#bsx-accesFin') || {}).value) || '');
    if (fin && !dateOk(fin)) err.accesFin = 'Choisissez une date valide.';
    ref.accesFin = err.accesFin ? init.accesFin : fin;
    ref.thematiques = [0, 1, 2].map(function (i) { var x = $('#bsx-th' + i); return x ? String(x.value || '').replace(/\s+/g, ' ').trim().slice(0, 120) : ''; }).filter(Boolean);
    var ci = $('#bsx-contrat'), c = String((ci && ci.value) || '').trim().replace(',', '.');
    ref.contrat = null;
    if (ci && ci.validity && ci.validity.badInput) err.contrat = 'Saisissez un montant en chiffres (ex. 160), ou laissez vide.';
    else if (c !== '') { var n = Number(c); if (!isFinite(n) || n <= 0 || n > 100000) err.contrat = 'Saisissez un montant positif, ou laissez vide.'; else ref.contrat = Math.round(n * 100) / 100; }
    var d = String((($('#bsx-debut') || {}).value) || '');
    if (d && !MOIS_OK.test(d)) err.debut = 'Choisissez un mois valide.';
    else if (d && mesure.moisDonnees && d > mesure.moisDonnees) err.debut = 'Doit précéder le mois des données (' + window.BilanDoc.moisTxt(mesure.moisDonnees) + ').';
    ref.debut = (!err.debut && d) || mesure.debut;
    var prixErr = false;
    [].forEach.call(el.querySelectorAll('[data-prix]'), function (i) {
      var s = i.getAttribute('data-prix'), cle = i.getAttribute('data-cle'), raw = String(i.value || '').trim();
      var bad = (i.validity && i.validity.badInput) || (raw !== '' && !(Number(raw) >= 0 && Number(raw) < 1000));
      i.classList.toggle('err', !!bad);
      i.classList.toggle('chg', !bad && raw !== String(prixMesure(i)));
      if (!ref.prix[s]) ref.prix[s] = Object.create(null);
      if (bad) { prixErr = true; var m0 = prixMesure(i); ref.prix[s][cle] = m0 === '' ? null : m0; return; }
      ref.prix[s][cle] = raw === '' ? null : Math.round(Number(raw) * 100) / 100;
    });
    if (prixErr) err.prix = 'Un prix est invalide (nombre positif, en euros).';
    return { ref: ref, erreurs: err };
  }

  // Aperçu en direct + marquage des champs modifiés + compteurs par onglet.
  function maj() {
    if (!rapport || !$('#bsx-kv-sp')) return;
    var r = lire(), ref = r.ref;
    var n = { sp: 0, sl: 0, px: 0, dc: 0 };
    CHAMPS.forEach(function (c) {
      var f = el.querySelector('[data-k="' + c.k + '"]');
      var chg = ref[c.k] !== mesure[c.k];
      if (f) f.classList.toggle('chg', chg);
      if (chg) n[c.t] += 1;
    });
    var marque = function (k, chg, t) { var f = el.querySelector('[data-k="' + k + '"]'); if (f) f.classList.toggle('chg', chg); if (chg) n[t] += 1; };
    marque('accesFin', !egal(ref.accesFin || '', mesure.accesFin || ''), 'sp');
    marque('thematiques', !egal(ref.thematiques, (mesure.thematiques || []).filter(Boolean)), 'sp');
    marque('contrat', ref.contrat != null, 'dc');
    marque('debut', ref.debut !== mesure.debut, 'dc');
    n.px = el.querySelectorAll('[data-prix].chg').length;
    Object.keys(n).forEach(function (k) { var b = $('#bsx-n-' + k); if (b) b.textContent = n[k] ? String(n[k]) : ''; });
    var m = window.BilanDoc.calculer(rapport, ref);
    var kv = function (l) { return l.map(function (x) { return '<div' + (x[2] ? ' class="hl"' : '') + '><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join(''); };
    $('#bsx-kv-sp').innerHTML = kv([[int(m.membres), 'utilisateurs inscrits'], [int(m.mer), 'mises en relation']]);
    $('#bsx-acces').textContent = m.accesFin ? 'jusqu\'au ' + window.BilanDoc.jourTxt(m.accesFin) : '';
    $('#bsx-kv-sl').innerHTML = kv([[int(m.beneficiaires), 'bénéficiaires'], [int(m.abonnes), 'abonnés en cours'], [eur(m.ecoMois), 'économisés par mois', true], [eur(m.parAbonneMois, 2), 'par abonné et par mois', true]]);
    $('#bsx-titre').textContent = 'Bilan du partenariat · ' + m.nom;
  }

  function valider() {
    var r = lire();
    Object.keys(r.erreurs).forEach(function (k) { erreur(k, r.erreurs[k]); });
    var cles = Object.keys(r.erreurs);
    if (!cles.length) return r.ref;
    var cible = cles[0] === 'prix' ? 'px' : (CHAMPS.filter(function (c) { return c.k === cles[0]; })[0] || {}).t || (/^(contrat|debut)$/.test(cles[0]) ? 'dc' : 'sp');
    onglet(cible);
    var premier = el.querySelector('.bsx-panel:not([hidden]) .bsx-f.err input, .bsx-panel:not([hidden]) [data-prix].err');
    if (premier) premier.focus();
    statut(esc(r.erreurs[cles[0]]));
    return null;
  }

  // Valeurs à garder pour ce CSE : null = revenir à la mesure (efface la valeur enregistrée).
  function aEnregistrer(ref) {
    var cles = window.BilanDoc.CLES, out = {}, n = 0;
    Object.keys(cles).forEach(function (k) {
      var champ = cles[k], v = ref[champ], m = mesure[champ];
      if (champ === 'thematiques') m = (m || []).filter(Boolean);
      var cible = (v == null || egal(v, m) || (v === '' && !m)) ? null : v;
      if (champ === 'accesFin' && v === '' && m) cible = ''; // date effacée exprès : masquer l'accès
      var avant = rapport.valeurs ? (rapport.valeurs[k] == null ? null : rapport.valeurs[k]) : null;
      if (!egal(cible, avant)) { out[k] = cible; n += 1; }
    });
    return n ? out : null;
  }
  function enregistrer(ref) {
    var valeurs = aEnregistrer(ref);
    if (!valeurs) return Promise.resolve(true);
    var qs = ctx.cseId ? 'cse_id=' + encodeURIComponent(ctx.cseId) : 'hubspot_company_id=' + encodeURIComponent(ctx.hubspotId);
    return avecDelai(fetch(API + '?' + qs, { method: 'POST', headers: { Authorization: 'Bearer ' + ctx.token, 'Content-Type': 'application/json' }, body: JSON.stringify({ valeurs: valeurs }) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok || !j.ok) throw new Error('save'); rapport.valeurs = j.valeurs; return true; }); }), 10000)
      .catch(function () { return false; });
  }

  // ── Ressources du document (data: URL, pour un rendu sans chargement externe) ──
  function enDataUrl(blob) {
    return new Promise(function (ok, ko) { var f = new FileReader(); f.onload = function () { ok(f.result); }; f.onerror = ko; f.readAsDataURL(blob); });
  }
  function avecDelai(p, ms) { return Promise.race([p, new Promise(function (_, ko) { setTimeout(function () { ko(new Error('délai')); }, ms); })]); }
  function svgColore(url, fg) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('svg'); return r.text(); }).then(function (t) {
      if (!/^<svg[\s>]/.test(t.trim())) throw new Error('svg');
      // Dimensions explicites : html2canvas ignore un SVG sans largeur ni hauteur.
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(t.trim().replace(/^<svg/, '<svg width="96" height="96" fill="' + fg + '"'));
    });
  }
  function favicon(domain) {
    return fetch(API + '?favicon=' + encodeURIComponent(domain), { headers: { Authorization: 'Bearer ' + ctx.token } })
      .then(function (r) { if (!r.ok) throw new Error('favicon'); return r.blob(); })
      .then(function (b) { return enDataUrl(/^image\//.test(b.type) ? b : new Blob([b], { type: 'image/png' })); });
  }
  function ressources() {
    var services = (rapport.services || []).filter(function (s) { return +s.abonnements > 0; }).map(function (s) { return s.service; });
    var logos = {};
    var taches = services.map(function (s) {
      if (cacheRessources['logo:' + s]) { logos[s] = cacheRessources['logo:' + s]; return Promise.resolve(); }
      var src = window.BilanDoc.sourceLogo(s);
      if (!src) return Promise.resolve();
      var p = src.type === 'glyph'
        ? svgColore(src.url, src.fg).then(function (d) { return { type: 'glyph', src: d, bg: src.bg }; })
        : favicon(src.domain).then(function (d) { return { type: 'logo', src: d }; });
      return avecDelai(p, 8000).then(function (v) { cacheRessources['logo:' + s] = v; logos[s] = v; }, function () {});
    });
    var fonts = Promise.all(polices.map(function (f) {
      var cle = 'police:' + f.weight;
      if (cacheRessources[cle]) return Promise.resolve(cacheRessources[cle]);
      return avecDelai(fetch(f.url).then(function (r) { if (!r.ok) throw new Error('police'); return r.blob(); }).then(enDataUrl), 10000)
        .then(function (d) { cacheRessources[cle] = { weight: f.weight, src: d.replace(/^data:[^;,]*/, 'data:font/otf') }; return cacheRessources[cle]; }, function () { return null; });
    })).then(function (l) { return l.filter(Boolean); });
    var caveat = cacheRessources.caveat ? Promise.resolve(cacheRessources.caveat)
      : avecDelai(fetch(CAVEAT_CSS).then(function (r) { return r.text(); }).then(function (t) {
          var blocs = t.split('@font-face');
          var latin = blocs.filter(function (b) { return /\/\* latin \*\//.test('/*' + b) || /U\+0000-00FF/.test(b); }).pop() || blocs.pop();
          var m = latin && latin.match(/url\((https:[^)]+\.woff2)\)/);
          if (!m) throw new Error('caveat');
          return fetch(m[1]).then(function (r) { return r.blob(); }).then(enDataUrl);
        }), 8000).then(function (d) { cacheRessources.caveat = d; return d; }, function () { return null; });
    var spliiit = cacheRessources.spliiit ? Promise.resolve(cacheRessources.spliiit)
      : fetch('spliiit-logo.png').then(function (r) { if (!r.ok) throw new Error('logo'); return r.blob(); }).then(enDataUrl)
          .then(function (d) { cacheRessources.spliiit = d; return d; }, function () { return ''; });
    return Promise.all([fonts, caveat, spliiit, Promise.all(taches)]).then(function (x) {
      return { fonts: x[0], caveat: x[1], spliiit: x[2], logos: logos, spLogo: window.BilanDoc.spLogo('#FF6363') };
    });
  }

  // ── Génération du PDF ────────────────────────────────────────────────────
  function nomFichier(m) {
    var nom = String(m.nom || 'CSE').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    return 'Bilan partenariat Superprof Spliiit - ' + nom + ' - ' + m.arrete.slice(0, 7) + '.pdf';
  }
  function telecharger(pdf) {
    var a = document.createElement('a');
    a.href = pdf.url; a.download = pdf.nom; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  }
  function attendreImages(doc) {
    var imgs = [].slice.call(doc.images);
    return Promise.all(imgs.map(function (i) { return i.decode ? i.decode().catch(function () {}) : Promise.resolve(); }));
  }
  function rendre(html) {
    return new Promise(function (ok, ko) {
      var f = document.createElement('iframe');
      f.className = 'bsx-frame';
      f.setAttribute('aria-hidden', 'true');
      f.tabIndex = -1;
      f.title = 'Bilan du partenariat';
      f.onload = function () { ok(f); };
      f.onerror = function () { ko(lisible('Le bilan n\'a pas pu être préparé.')); };
      f.srcdoc = html;
      document.body.appendChild(f);
    });
  }

  function generer() {
    if (enCours || !rapport) return;
    var ref = valider();
    if (!ref) return;
    enCours = true; annule = false;
    saisie = ref;
    $('[data-bsx="generer"]').disabled = true;
    var frame = null, sauve = true;
    var stop = function (v) { if (annule) throw lisible('Génération annulée.'); return v; };
    statut('Préparation des polices et des logos…', 0.05);
    var policesFraiches = Date.now() - luA > 45 * 60 * 1000
      ? lireRapport().then(function (j) { polices = Array.isArray(j.fonts) ? j.fonts : polices; luA = Date.now(); }, function () {})
      : Promise.resolve();
    avecDelai(policesFraiches.then(function () {
      return Promise.all([ressources(), window.jspdf ? null : charger(LIBS.jspdf.src, LIBS.jspdf.sri), enregistrer(ref)]);
    }), 45000).catch(function (e) { throw e && e.lisible ? e : lisible('Les ressources du bilan n\'ont pas pu être chargées (connexion lente ?). Réessayez.'); })
      .then(stop)
      .then(function (x) {
        var assets = x[0];
        sauve = x[2];
        var m = window.BilanDoc.calculer(rapport, ref);
        var html = window.BilanDoc.html(m, assets).replace('</body>',
          '<script src="' + LIBS.html2canvas.src + '" integrity="' + LIBS.html2canvas.sri + '" crossorigin="anonymous"><\/script></body>');
        statut('Mise en page du bilan…', 0.15);
        return rendre(html).then(function (f) { frame = f; return { m: m }; });
      })
      .then(function (o) {
        var win = frame.contentWindow, doc = frame.contentDocument;
        var attendu = 0;
        return new Promise(function (ok, ko) {
          (function attente() {
            if (annule) return ko(lisible('Génération annulée.'));
            if (win.html2canvas) return ok();
            if ((attendu += 100) > 15000) return ko(lisible('Le moteur de rendu PDF n\'a pas pu être chargé. Réessayez.'));
            setTimeout(attente, 100);
          })();
        }).then(function () {
          return Promise.all([doc.fonts ? doc.fonts.ready : null, attendreImages(doc)]);
        }).then(function () {
          var pages = [].slice.call(doc.querySelectorAll('.page'));
          var pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
          var i = 0;
          function suivante() {
            if (i >= pages.length) return Promise.resolve();
            if (annule) return Promise.reject(lisible('Génération annulée.'));
            statut('Création du PDF : page ' + (i + 1) + ' sur ' + pages.length + '…', 0.2 + 0.75 * i / pages.length);
            return avecDelai(win.html2canvas(pages[i], { scale: 2, backgroundColor: '#ffffff', logging: false, useCORS: false, windowWidth: 820, windowHeight: 1200 }), 30000)
              .catch(function (e) { throw e && e.lisible ? e : lisible('La page ' + (i + 1) + ' n\'a pas pu être rendue. Réessayez.'); })
              .then(function (canvas) {
                if (i > 0) pdf.addPage('a4', 'portrait');
                pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
                i += 1;
                return suivante();
              });
          }
          return suivante().then(function () {
            pdf.setProperties({ title: 'Bilan du partenariat · ' + o.m.nom, author: 'Superprof', creator: 'Superprof' });
            var blob = pdf.output('blob');
            if (dernierPdf) URL.revokeObjectURL(dernierPdf.url);
            dernierPdf = { url: URL.createObjectURL(blob), nom: nomFichier(o.m), taille: blob.size };
            telecharger(dernierPdf);
            statut('<span class="ok">' + ICO_OK + 'PDF prêt</span> ' + esc(dernierPdf.nom) + ' (' + Math.max(1, Math.round(blob.size / 1024)) + ' Ko). Pas de téléchargement ? <button type="button" data-bsx="retelecharger">Télécharger</button> · <button type="button" data-bsx="ouvrir">ouvrir le PDF</button>' +
              (sauve ? '' : '<br>Les chiffres saisis n\'ont pas pu être enregistrés pour ce CSE.'));
          });
        });
      })
      .catch(function (e) {
        if (annule) return;
        console.error('bilan-export', e);
        statut(esc(e && e.lisible ? e.message : 'Le PDF n\'a pas pu être créé. Réessayez dans un instant.'));
      })
      .then(function () {
        if (frame) frame.remove();
        enCours = false;
        if (el) $('[data-bsx="generer"]').disabled = !rapport;
      });
  }

  function fermer() {
    if (!el || el.hidden) return;
    if (enCours) annule = true; // la génération en cours s'arrête à l'étape suivante
    el.hidden = true;
    if (dernierFocus && document.contains(dernierFocus) && dernierFocus.focus) dernierFocus.focus();
  }

  function lireRapport() {
    var qs = ctx.cseId ? 'cse_id=' + encodeURIComponent(ctx.cseId) : 'hubspot_company_id=' + encodeURIComponent(ctx.hubspotId);
    return fetch(API + '?' + qs, { headers: { Authorization: 'Bearer ' + ctx.token } }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (j) {
        if (!r.ok || !j || !j.ok) throw lisible(r.status === 404 ? 'Ce CSE n\'a pas de données Spliiit.' : (r.status === 401 ? 'Accès refusé : rechargez le cockpit puis réessayez.' : 'Les données n\'ont pas pu être lues. Réessayez dans un instant.'));
        return j;
      });
    });
  }

  function ouvrir(o) {
    if (!o || !o.token || (!o.cseId && !o.hubspotId)) return;
    construire();
    if (!el.hidden) return;
    var memeCse = ctx && rapport && !enCours && Date.now() - luA < 45 * 60 * 1000 && ctx.cseId === (o.cseId || '') && ctx.hubspotId === (o.hubspotId || '');
    ctx = { token: o.token, cseId: o.cseId || '', hubspotId: o.hubspotId || '' };
    dernierFocus = document.activeElement;
    el.hidden = false;
    statut('');
    if (memeCse) { formulaire(); return; }
    rapport = null; mesure = null; init = null; saisie = null; polices = []; ongletActif = 'sp';
    $('#bsx-titre').textContent = 'Bilan du partenariat';
    $('#bsx-sous').textContent = 'Superprof + Spliiit';
    $('[data-bsx="generer"]').disabled = true;
    $('.bsx-scroll').innerHTML = '<div class="bsx-load">Lecture des données…</div>';
    $('.bsx-x').focus();
    var demande = ctx;
    Promise.all([lireRapport(), bilanDoc()]).then(function (x) {
      if (ctx !== demande) return;
      var j = x[0], r = j.report;
      if (!r || !r.utilisateurs || !r.dernier_releve) throw lisible('Ce CSE n\'a pas encore de relevé Spliiit exploitable.');
      rapport = r;
      luA = Date.now();
      polices = Array.isArray(j.fonts) ? j.fonts : [];
      mesure = window.BilanDoc.mesures(r);
      init = window.BilanDoc.initiales(r);
      $('#bsx-sous').textContent = 'Superprof + Spliiit · PDF de 7 pages, prêt à envoyer au CSE';
      formulaire();
    }).catch(function (e) {
      if (ctx !== demande) return;
      $('.bsx-scroll').innerHTML = '<div class="bsx-load">' + esc(e && e.lisible ? e.message : 'Connexion impossible au serveur. Réessayez dans un instant.') + '</div>';
    });
  }

  window.BilanSpliiit = { ouvrir: ouvrir, icone: ICONE };
})();
