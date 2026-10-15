// Export du bilan Spliiit depuis le cockpit (head-of-sales.html, index.html).
// Tout se passe dans le tableau de bord, sans page intermédiaire : la modale lit les données
// (cse-spliit-report), le document est rendu dans une iframe cachée (srcdoc, bilan-doc.js),
// chaque page est photographiée (html2canvas) puis assemblée en PDF (jsPDF) et téléchargée.
// window.print() n'est pas utilisé : il est bloqué dans la modale HubSpot.
(function () {
  'use strict';
  var API = 'https://yhtxrjegdeuwkcjvkfkt.supabase.co/functions/v1/cse-spliit-report';
  var VERSION = '4';
  var LIBS = {
    jspdf: { src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', sri: 'sha384-JcnsjUPPylna1s1fvi1u12X5qjY5OL56iySh75FdtrwhO/SWXgMjoVqcKyIIWOLk' },
    html2canvas: { src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', sri: 'sha384-ZZ1pncU3bQe8y31yfZdMFdSpttDoPmOZg2wguVK9almUodir1PghgT0eY7Mrty8H' }
  };
  var CAVEAT_CSS = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap';
  var ICONE = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true"><path d="M6 21H18M12 3V17M7 12L12 17L17 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var CSS = [
    '.bsx-back{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.45);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-family:inherit;font-size:13px;line-height:1.5}',
    '.bsx-back[hidden]{display:none!important}',
    '.bsx-box{width:min(620px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#fff;color:var(--slate-900,#0f172a);border-radius:14px;border:1px solid rgba(0,0,0,.06);box-shadow:0 1px 2px rgba(0,0,0,.05),0 18px 48px -12px rgba(15,23,42,.35);display:flex;flex-direction:column;animation:bsxIn .18s ease both}',
    '@keyframes bsxIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '.bsx-accent{height:3px;flex:none;background:linear-gradient(90deg,#818cf8,#6366f1)}',
    '.bsx-head{display:flex;align-items:flex-start;gap:10px;padding:14px 16px 0}',
    '.bsx-ico{width:30px;height:30px;border-radius:8px;background:#e0e7ff;color:#4338ca;display:flex;align-items:center;justify-content:center;flex:none}',
    '.bsx-head h2{margin:0;font-size:14px;font-weight:800;color:var(--slate-900,#0f172a);line-height:1.3}',
    '.bsx-head p{margin:3px 0 0;font-size:11.5px;line-height:1.5;color:var(--slate-600,#475569)}',
    '.bsx-x{margin-left:auto;flex:none;width:28px;height:28px;border:1px solid var(--slate-200,#e2e8f0);border-radius:8px;background:var(--slate-100,#f1f5f9);color:var(--slate-600,#475569);font:inherit;font-size:16px;line-height:1;cursor:pointer}',
    '.bsx-x:hover{background:var(--slate-200,#e2e8f0)}',
    '.bsx-body{padding:12px 16px 2px;display:flex;flex-direction:column;gap:12px}',
    '.bsx-f{display:flex;flex-direction:column;gap:4px;min-width:0}',
    '.bsx-f label{font-size:11.5px;font-weight:700;color:var(--slate-700,#334155)}',
    '.bsx-f input{font-family:inherit;font-size:12.5px;color:var(--slate-900,#0f172a);background:var(--slate-50,#f8fafc);border:1.5px solid var(--slate-200,#e2e8f0);border-radius:10px;padding:8px 11px;min-width:0;outline:none;font-variant-numeric:tabular-nums;transition:border-color .15s,box-shadow .15s}',
    '.bsx-f input:focus{border-color:var(--indigo,#6366f1);box-shadow:0 0 0 3px rgba(99,102,241,.12);background:#fff}',
    '.bsx-f input[readonly]{background:transparent;border-style:dashed;color:var(--slate-600,#475569)}',
    '.bsx-f.err input{border-color:var(--rose,#f43f5e)}',
    '.bsx-f.chg input{border-color:#a5b4fc;background:#eef2ff}',
    '.bsx-d{font-size:11px;line-height:1.45;color:var(--slate-600,#475569)}',
    '.bsx-d b{color:var(--slate-700,#334155)}',
    '.bsx-m{font-size:11px;color:var(--slate-400,#94a3b8)}',
    '.bsx-m button{font:inherit;font-size:11px;border:none;background:none;padding:0;color:var(--indigo-dark,#4f46e5);font-weight:600;cursor:pointer}',
    '.bsx-m button:hover{text-decoration:underline}',
    '.bsx-e{font-size:11px;font-weight:600;color:#e11d48}',
    '.bsx-lien{font:inherit;font-size:11px;border:none;background:none;padding:0;color:var(--indigo-dark,#4f46e5);font-weight:600;cursor:pointer}',
    '.bsx-lien:hover{text-decoration:underline}',
    '.bsx-e:empty{display:none}',
    '.bsx-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}',
    '.bsx-chip{background:var(--slate-50,#f8fafc);border:1px solid var(--slate-200,#e2e8f0);border-radius:10px;padding:7px 9px}',
    '.bsx-chip b{display:block;font-size:15px;font-weight:800;color:var(--slate-900,#0f172a);font-variant-numeric:tabular-nums;line-height:1.2}',
    '.bsx-chip span{font-size:10.5px;color:var(--slate-600,#475569);line-height:1.3;display:block}',
    '.bsx-chip.val{background:#eef2ff;border-color:#e0e7ff}.bsx-chip.val b{color:#4338ca}',
    '.bsx-sumt{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--slate-400,#94a3b8)}',
    'details.bsx-adv{border:1px solid var(--slate-200,#e2e8f0);border-radius:12px;background:#fff}',
    'details.bsx-adv>summary{cursor:pointer;list-style:none;padding:10px 12px;font-size:12px;font-weight:700;color:var(--slate-700,#334155);display:flex;align-items:center;gap:8px}',
    'details.bsx-adv>summary::-webkit-details-marker{display:none}',
    'details.bsx-adv>summary:before{content:"";width:6px;height:6px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(-45deg);transition:transform .15s;flex:none}',
    'details.bsx-adv[open]>summary:before{transform:rotate(45deg)}',
    'details.bsx-adv>summary small{font-weight:500;color:var(--slate-400,#94a3b8);margin-left:auto}',
    '.bsx-adv-in{padding:0 12px 12px;display:flex;flex-direction:column;gap:12px}',
    '.bsx-intro{font-size:11.5px;line-height:1.5;color:var(--slate-600,#475569);background:#eef2ff;border:1px solid #e0e7ff;border-radius:10px;padding:8px 11px}',
    '.bsx-grp{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.bsx-grp .full{grid-column:1/-1}',
    '.bsx-sep{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--slate-400,#94a3b8);border-top:1px solid var(--slate-200,#e2e8f0);padding-top:10px}',
    '.bsx-prix{width:100%;border-collapse:collapse;font-size:11.5px;font-variant-numeric:tabular-nums}',
    '.bsx-prix th{text-align:left;font-size:10px;font-weight:700;color:var(--slate-400,#94a3b8);text-transform:uppercase;letter-spacing:.04em;padding:0 6px 6px;border-bottom:1px solid var(--slate-200,#e2e8f0)}',
    '.bsx-prix td{padding:4px 6px;border-bottom:1px solid var(--slate-100,#f1f5f9);vertical-align:middle}',
    '.bsx-prix td.n{text-align:right;color:var(--slate-600,#475569)}',
    '.bsx-prix input{width:68px;font-family:inherit;font-size:12px;text-align:right;border:1.5px solid var(--slate-200,#e2e8f0);border-radius:8px;padding:4px 6px;background:var(--slate-50,#f8fafc);outline:none}',
    '.bsx-prix input:focus{border-color:var(--indigo,#6366f1);background:#fff}',
    '.bsx-prix input.chg{border-color:#a5b4fc;background:#eef2ff}',
    '.bsx-prix input.err{border-color:var(--rose,#f43f5e)}',
    '.bsx-prix a{color:var(--indigo-dark,#4f46e5);text-decoration:none;font-size:11px}',
    '.bsx-prix .o{display:block;font-size:10.5px;color:var(--slate-400,#94a3b8)}',
    '.bsx-foot{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:12px 16px 14px}',
    '.bsx-status{flex:1 1 200px;font-size:11.5px;line-height:1.45;color:var(--slate-600,#475569);min-height:16px}',
    '.bsx-status button{font:inherit;font-size:11.5px;border:none;background:none;padding:0;color:var(--indigo-dark,#4f46e5);font-weight:700;cursor:pointer;text-decoration:underline}',
    '.bsx-prog{height:4px;border-radius:999px;background:var(--slate-100,#f1f5f9);overflow:hidden;margin-top:6px}',
    '.bsx-prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#818cf8,#6366f1);transition:width .2s}',
    '.bsx-btn{font-family:inherit;font-size:12.5px;font-weight:700;border-radius:9px;padding:7px 16px;cursor:pointer;border:1px solid transparent;display:inline-flex;align-items:center;gap:6px;line-height:1.3;transition:opacity .15s,transform .15s,box-shadow .15s,background .15s}',
    '.bsx-btn[disabled]{opacity:.5;cursor:not-allowed;transform:none}',
    '.bsx-light{background:var(--slate-100,#f1f5f9);border-color:var(--slate-200,#e2e8f0);color:var(--slate-600,#475569)}',
    '.bsx-light:hover{background:var(--slate-200,#e2e8f0)}',
    '.bsx-primary{background:linear-gradient(135deg,#7c3aed,#6366f1);color:#fff;box-shadow:0 2px 8px rgba(99,102,241,.35)}',
    '.bsx-primary:hover:not([disabled]){opacity:.9;transform:translateY(-1px);box-shadow:0 4px 14px rgba(99,102,241,.45)}',
    '.bsx-btn:focus-visible,.bsx-x:focus-visible,.bsx-m button:focus-visible,.bsx-status button:focus-visible,details.bsx-adv>summary:focus-visible{outline:2px solid var(--indigo,#6366f1);outline-offset:2px}',
    '.bsx-load{padding:14px 0;font-size:12px;color:var(--slate-400,#94a3b8)}',
    '.bsx-frame{position:fixed;left:-10000px;top:0;width:820px;height:1200px;border:0;opacity:0;pointer-events:none}',
    '@media (max-width:540px){.bsx-grp{grid-template-columns:1fr}}',
    'body.dark .bsx-back{background:rgba(2,6,23,.6)}',
    'body.dark .bsx-box,body.dark details.bsx-adv{background:#1e293b;color:#f8fafc;border-color:rgba(255,255,255,.07)}',
    'body.dark .bsx-head h2,body.dark .bsx-chip b{color:#f1f5f9}',
    'body.dark .bsx-head p,body.dark .bsx-status,body.dark .bsx-d,body.dark .bsx-chip span{color:#94a3b8}',
    'body.dark .bsx-ico{background:#3730a3;color:#a5b4fc}',
    'body.dark .bsx-f label,body.dark details.bsx-adv>summary,body.dark .bsx-d b{color:#e2e8f0}',
    'body.dark .bsx-m,body.dark .bsx-sep,body.dark .bsx-load,body.dark .bsx-sumt,body.dark .bsx-prix th{color:#64748b}',
    'body.dark .bsx-x,body.dark .bsx-light{background:#334155;border-color:#475569;color:#94a3b8}',
    'body.dark .bsx-x:hover,body.dark .bsx-light:hover{background:#475569}',
    'body.dark .bsx-f input,body.dark .bsx-prix input{background:#1e293b;color:#e2e8f0;border-color:#334155;color-scheme:dark}',
    'body.dark .bsx-f input:focus{background:#263248;border-color:var(--indigo,#6366f1)}',
    'body.dark .bsx-chip{background:#0f172a;border-color:#334155}',
    'body.dark .bsx-chip.val,body.dark .bsx-intro{background:rgba(99,102,241,.12);border-color:rgba(99,102,241,.25);color:#cbd5e1}',
    'body.dark .bsx-chip.val b,body.dark .bsx-m button,body.dark .bsx-status button,body.dark .bsx-prix a,body.dark .bsx-lien{color:#a5b4fc}',
    'body.dark .bsx-prix td{border-bottom-color:#334155}',
    'body.dark .bsx-e{color:#fb7185}'
  ].join('\n');

  // Champs modifiables (paramètres avancés) : libellé, explication, où le chiffre apparaît.
  var CHAMPS = [
    { k: 'membres', l: 'Membres Superprof', d: 'Salariés qui ont <b>activé leur compte Superprof</b> dans l\'espace du CSE (carte « Membres » du cockpit).', o: 'Couverture, pages 2 et 3. Base du pourcentage de bénéficiaires.' },
    { k: 'adressables', l: 'Salariés adressables', d: 'Salariés <b>couverts par l\'offre</b> (quota de la fiche CSE).', o: 'Page 2 : part des salariés devenus membres.' },
    { k: 'beneficiaires', l: 'Bénéficiaires Spliiit', d: 'Membres qui ont <b>activé leur cagnotte</b> Spliiit.', o: 'Couverture, pages 2, 3 et 4 (valeur par bénéficiaire).' },
    { k: 'abonnes', l: 'Abonnés en cours', d: 'Bénéficiaires qui ont <b>au moins un abonnement actif</b> aujourd\'hui (« utilisateurs actifs » chez Spliiit).', o: 'Pages 2 à 4 : abonnements par abonné, valeur par abonné.' }
  ];

  var el = null, ctx = null, rapport = null, polices = [], mesure = null, saisie = null;
  var dernierFocus = null, enCours = false, cibleAppui = null, dernierPdf = null;
  var cacheRessources = {};

  function int(n) { return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(+n || 0)); }
  function eur(n, d) { return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }).format(+n || 0) + ' €'; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function $(sel) { return el.querySelector(sel); }
  function lisible(msg) { var e = new Error(msg); e.lisible = true; return e; }

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
  function bilanDoc() {
    return window.BilanDoc ? Promise.resolve() : charger('bilan-doc.js?v=' + VERSION);
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
        '<div class="bsx-accent"></div>' +
        '<div class="bsx-head"><div class="bsx-ico">' + ICONE + '</div><div><h2 id="bsx-titre">Bilan Spliiit</h2><p>Bilan PDF du partenariat, prêt à envoyer au CSE. Les chiffres sont ceux du jour ; vous pouvez les ajuster dans les paramètres avancés.</p></div>' +
        '<button type="button" class="bsx-x" data-bsx="fermer" aria-label="Fermer">×</button></div>' +
        '<form class="bsx-body" novalidate><div class="bsx-load">Lecture des données Spliiit…</div></form>' +
        '<div class="bsx-foot"><div class="bsx-status" role="status" aria-live="polite"></div>' +
          '<button type="button" class="bsx-btn bsx-light" data-bsx="fermer">Fermer</button>' +
          '<button type="button" class="bsx-btn bsx-primary" data-bsx="generer" disabled>' + ICONE + 'Générer le PDF</button></div>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('pointerdown', function (e) { cibleAppui = e.target; });
    el.addEventListener('click', function (e) {
      if (e.target === el) { if (cibleAppui === el && !enCours) fermer(); return; }
      var t = e.target.closest ? e.target.closest('[data-bsx],[data-reset]') : null;
      if (!t) return;
      var k = t.getAttribute('data-reset');
      if (k) { var i = $('#bsx-' + k); if (i) { i.value = mesure[k] == null ? '' : mesure[k]; } erreur(k, ''); maj(); return; }
      var a = t.getAttribute('data-bsx');
      if (a === 'fermer' && !enCours) fermer();
      if (a === 'generer') generer();
      if (a === 'retelecharger' && dernierPdf) telecharger(dernierPdf);
      if (a === 'ouvrir' && dernierPdf) window.open(dernierPdf.url, '_blank', 'noopener');
      if (a === 'prix-reset') reinitPrix();
    });
    el.addEventListener('input', function (e) { var n = e.target && e.target.name; if (n) erreur(n, ''); maj(); });
    el.addEventListener('submit', function (e) { e.preventDefault(); generer(); });
    document.addEventListener('keydown', function (e) {
      if (!el || el.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); if (!enCours) fermer(); return; }
      if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT' && el.contains(e.target)) { e.preventDefault(); generer(); return; }
      if (e.key !== 'Tab') return;
      var f = [].slice.call(el.querySelectorAll('button:not([disabled]),input:not([readonly]),a[href],summary')).filter(function (x) { return x.offsetParent !== null; });
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
  function champ(c, val) {
    return '<div class="bsx-f" data-k="' + c.k + '"><label for="bsx-' + c.k + '">' + c.l + '</label>' +
      '<input id="bsx-' + c.k + '" name="' + c.k + '" type="number" min="0" step="1" inputmode="numeric" value="' + esc(val) + '">' +
      '<div class="bsx-d">' + c.d + '<br><b>Où :</b> ' + c.o + '</div>' +
      '<div class="bsx-m">Mesuré : ' + int(mesure[c.k]) + ' · <button type="button" data-reset="' + c.k + '">rétablir</button></div>' +
      '<div class="bsx-e" role="alert"></div></div>';
  }

  function formulaire() {
    var v = saisie || mesure;
    var u = rapport.utilisateurs || {};
    var services = (rapport.services || []).filter(function (s) { return +s.abonnements > 0; });
    var infos = {};
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
    $('.bsx-body').innerHTML =
      '<div class="bsx-f" data-k="nom"><label for="bsx-nom">Nom du CSE affiché</label><input id="bsx-nom" name="nom" type="text" autocomplete="off" maxlength="120" value="' + esc(v.nom) + '"><div class="bsx-e" role="alert"></div></div>' +
      '<div><div class="bsx-sumt">Le bilan contiendra</div><div class="bsx-sum" id="bsx-sum"></div></div>' +
      '<details class="bsx-adv"><summary>Paramètres avancés : modifier les chiffres du bilan<small id="bsx-nmod"></small></summary><div class="bsx-adv-in">' +
        '<div class="bsx-intro">Chaque chiffre est pré-rempli avec la donnée du jour. Ne le modifiez que si vous avez une source plus juste (chiffre officiel de Spliiit ou du CSE). Les pourcentages, moyennes et valeurs du bilan sont recalculés à partir de ces chiffres. Le document n\'indique pas qu\'un chiffre a été modifié.</div>' +
        '<div class="bsx-sep">Membres et bénéficiaires</div>' +
        '<div class="bsx-grp">' + CHAMPS.map(function (c) { return champ(c, v[c.k]); }).join('') +
          '<div class="bsx-f full"><label>Abonnements en cours</label><input type="text" readonly value="' + int(u.abonnements_en_cours) + '"><div class="bsx-d">Abonnements actifs des bénéficiaires, mesurés par Spliiit. <b>Non modifiable</b> : c\'est la base du calcul de la valeur au prix public (page 4) et de la moyenne par abonné.</div></div>' +
        '</div>' +
        '<div class="bsx-sep">Contrat et période</div>' +
        '<div class="bsx-grp">' +
          '<div class="bsx-f" data-k="contrat"><label for="bsx-contrat">Cagnotte au contrat (€ par salarié et par an)</label><input id="bsx-contrat" name="contrat" type="number" min="0" step="0.01" inputmode="decimal" placeholder="Optionnel, ex. 160" value="' + (v.contrat == null ? '' : v.contrat) + '"><div class="bsx-d">Montant prévu au contrat. <b>Où :</b> page 4, sous la valeur des abonnements. Laissez vide pour ne pas l\'afficher.</div><div class="bsx-e" role="alert"></div></div>' +
          '<div class="bsx-f" data-k="debut"><label for="bsx-debut">Début du partenariat</label><input id="bsx-debut" name="debut" type="month" max="' + esc(mesure.moisDonnees) + '" value="' + esc(v.debut) + '"><div class="bsx-d"><b>Où :</b> couverture (« De … à … »). La fin est le mois des données.</div><div class="bsx-m">Par défaut : création du CSE · <button type="button" data-reset="debut">rétablir</button></div><div class="bsx-e" role="alert"></div></div>' +
        '</div>' +
        '<div class="bsx-sep">Prix par service (économies)</div>' +
        '<div class="bsx-d"><b>Prix public</b> : offre individuelle mensuelle équivalente, en France, TTC, relevée sur le site du service. <b>Prix Spliiit</b> : participation mensuelle pour une place, frais compris. Économie d\'un service = (prix public − prix Spliiit) × abonnements en cours. Corrigez un prix s\'il a changé : les économies sont recalculées. Un service sans l\'un des deux prix n\'est pas compté. · <button type="button" class="bsx-lien" data-bsx="prix-reset">rétablir tous les prix</button></div>' +
        '<div style="max-height:260px;overflow:auto"><table class="bsx-prix"><thead><tr><th>Service</th><th style="text-align:right">Abonnés</th><th>Prix public</th><th>Prix Spliiit</th><th></th></tr></thead><tbody>' + lignesPrix + '</tbody></table></div>' +
      '</div></details>';
    $('[data-bsx="generer"]').disabled = false;
    maj();
    setTimeout(function () { var i = $('#bsx-nom'); if (i && !el.hidden) i.focus(); }, 30);
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
    var ref = { nom: (String(($('#bsx-nom') || {}).value || '').trim().slice(0, 120)) || mesure.nom, prix: {} };
    var err = {};
    CHAMPS.forEach(function (c) {
      var i = $('#bsx-' + c.k);
      if (!i) { ref[c.k] = mesure[c.k]; return; }
      if (i.validity && i.validity.badInput) { err[c.k] = 'Saisissez un nombre entier, sans espace.'; ref[c.k] = mesure[c.k]; return; }
      if (i.value === '') { ref[c.k] = mesure[c.k]; return; }
      var n = Number(i.value);
      if (!isFinite(n) || n < 0 || Math.floor(n) !== n) { err[c.k] = 'Saisissez un nombre entier positif.'; ref[c.k] = mesure[c.k]; return; }
      ref[c.k] = n;
    });
    if (!err.membres && ref.membres <= 0) err.membres = 'Il faut au moins un membre.';
    if (!err.adressables && !err.membres && ref.adressables > 0 && ref.membres > ref.adressables) err.adressables = 'Doit être au moins égal aux membres (' + int(ref.membres) + ').';
    if (!err.beneficiaires && !err.membres && ref.beneficiaires > ref.membres) err.beneficiaires = 'Ne peut pas dépasser les membres (' + int(ref.membres) + ').';
    if (!err.beneficiaires && ref.beneficiaires <= 0) err.beneficiaires = 'Il faut au moins un bénéficiaire.';
    if (!err.abonnes && !err.beneficiaires && ref.abonnes > ref.beneficiaires) err.abonnes = 'Ne peut pas dépasser les bénéficiaires (' + int(ref.beneficiaires) + ').';
    if (!err.abonnes && ref.abonnes <= 0) err.abonnes = 'Il faut au moins un abonné.';
    var ci = $('#bsx-contrat'), c = String((ci && ci.value) || '').trim().replace(',', '.');
    ref.contrat = null;
    if (ci && ci.validity && ci.validity.badInput) err.contrat = 'Saisissez un montant en chiffres (ex. 160), ou laissez vide.';
    else if (c !== '') { var n = Number(c); if (!isFinite(n) || n <= 0 || n > 100000) err.contrat = 'Saisissez un montant positif, ou laissez vide.'; else ref.contrat = Math.round(n * 100) / 100; }
    var d = String((($('#bsx-debut') || {}).value) || '');
    if (d && !/^\d{4}-\d{2}$/.test(d)) err.debut = 'Choisissez un mois.';
    else if (d && mesure.moisDonnees && d > mesure.moisDonnees) err.debut = 'Doit précéder le mois des données (' + window.BilanDoc.moisTxt(mesure.moisDonnees) + ').';
    ref.debut = (!err.debut && d) || mesure.debut;
    var prixErr = false;
    [].forEach.call(el.querySelectorAll('[data-prix]'), function (i) {
      var s = i.getAttribute('data-prix'), cle = i.getAttribute('data-cle'), raw = String(i.value || '').trim();
      var bad = (i.validity && i.validity.badInput) || (raw !== '' && !(Number(raw) >= 0 && Number(raw) < 1000));
      i.classList.toggle('err', !!bad);
      i.classList.toggle('chg', !bad && raw !== String(prixMesure(i)));
      if (!ref.prix[s]) ref.prix[s] = {};
      if (bad) { prixErr = true; var m0 = prixMesure(i); ref.prix[s][cle] = m0 === '' ? null : m0; return; }
      ref.prix[s][cle] = raw === '' ? null : Math.round(Number(raw) * 100) / 100;
    });
    if (prixErr) err.prix = 'Un prix est invalide (nombre positif, en euros).';
    return { ref: ref, erreurs: err };
  }

  // Résumé en direct + marquage des champs modifiés.
  function maj() {
    if (!rapport || !$('#bsx-sum')) return;
    var r = lire();
    var nmod = 0;
    CHAMPS.forEach(function (c) {
      var f = el.querySelector('[data-k="' + c.k + '"]');
      var chg = r.ref[c.k] !== mesure[c.k];
      if (f) f.classList.toggle('chg', chg);
      if (chg) nmod += 1;
    });
    nmod += el.querySelectorAll('[data-prix].chg').length;
    if (r.ref.contrat != null) nmod += 1;
    $('#bsx-nmod').textContent = nmod ? nmod + ' modification' + (nmod > 1 ? 's' : '') : 'aucune modification';
    var m = window.BilanDoc.calculer(rapport, r.ref);
    $('#bsx-sum').innerHTML = [
      [int(m.membres), 'membres Superprof'], [int(m.beneficiaires), 'bénéficiaires'], [int(m.abonnes), 'abonnés en cours'],
      [int(m.abonnements), 'abonnements en cours'], [eur(m.ecoMois), 'économisés par mois', true], [eur(m.parAbonneMois, 2), 'économisés par abonné et par mois', true]
    ].map(function (x) { return '<div class="bsx-chip' + (x[2] ? ' val' : '') + '"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('');
  }

  function valider() {
    var r = lire();
    Object.keys(r.erreurs).forEach(function (k) { erreur(k, r.erreurs[k]); });
    var cles = Object.keys(r.erreurs);
    if (!cles.length) return r.ref;
    var adv = $('details.bsx-adv'); if (adv) adv.open = true;
    var premier = el.querySelector('.bsx-f.err input, [data-prix].err');
    if (premier) premier.focus();
    if (r.erreurs.prix) statut(esc(r.erreurs.prix));
    return null;
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
      if (cacheRessources['logo:' + s] !== undefined) { if (cacheRessources['logo:' + s]) logos[s] = cacheRessources['logo:' + s]; return Promise.resolve(); }
      var src = window.BilanDoc.sourceLogo(s);
      if (!src) return Promise.resolve();
      var p = src.type === 'glyph'
        ? svgColore(src.url, src.fg).then(function (d) { return { type: 'glyph', src: d, bg: src.bg }; })
        : favicon(src.domain).then(function (d) { return { type: 'logo', src: d }; });
      return avecDelai(p, 8000).then(function (v) { cacheRessources['logo:' + s] = v; logos[s] = v; }, function () { cacheRessources['logo:' + s] = null; });
    });
    var fonts = Promise.all(polices.map(function (f) {
      return avecDelai(fetch(f.url).then(function (r) { if (!r.ok) throw new Error('police'); return r.blob(); }).then(enDataUrl), 10000)
        .then(function (d) { return { weight: f.weight, src: d.replace(/^data:[^;,]*/, 'data:font/otf') }; }, function () { return null; });
    })).then(function (l) { return l.filter(Boolean); });
    var caveat = cacheRessources.caveat !== undefined ? Promise.resolve(cacheRessources.caveat)
      : avecDelai(fetch(CAVEAT_CSS).then(function (r) { return r.text(); }).then(function (t) {
          var blocs = t.split('@font-face');
          var latin = blocs.filter(function (b) { return /\/\* latin \*\//.test('/*' + b) || /U\+0000-00FF/.test(b); }).pop() || blocs.pop();
          var m = latin && latin.match(/url\((https:[^)]+\.woff2)\)/);
          if (!m) throw new Error('caveat');
          return fetch(m[1]).then(function (r) { return r.blob(); }).then(enDataUrl);
        }), 8000).then(function (d) { cacheRessources.caveat = d; return d; }, function () { cacheRessources.caveat = null; return null; });
    var spliiit = cacheRessources.spliiit !== undefined ? Promise.resolve(cacheRessources.spliiit)
      : fetch('spliiit-logo.png').then(function (r) { if (!r.ok) throw new Error('logo'); return r.blob(); }).then(enDataUrl)
          .then(function (d) { cacheRessources.spliiit = d; return d; }, function () { cacheRessources.spliiit = ''; return ''; });
    return Promise.all([fonts, caveat, spliiit, Promise.all(taches)]).then(function (x) {
      return { fonts: x[0], caveat: x[1], spliiit: x[2], logos: logos, spLogo: window.BilanDoc.spLogo('#FF6363') };
    });
  }

  // ── Génération du PDF ────────────────────────────────────────────────────
  function nomFichier(m) {
    var nom = String(m.nom || 'CSE').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    return 'Bilan Spliiit - ' + nom + ' - ' + m.arrete.slice(0, 7) + '.pdf';
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
      f.title = 'Bilan Spliiit';
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
    enCours = true;
    saisie = ref;
    $('[data-bsx="generer"]').disabled = true;
    var frame = null;
    statut('Préparation des polices et des logos…', 0.05);
    Promise.all([ressources(), window.jspdf ? null : charger(LIBS.jspdf.src, LIBS.jspdf.sri)])
      .then(function (x) {
        var assets = x[0];
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
            statut('Création du PDF : page ' + (i + 1) + ' sur ' + pages.length + '…', 0.2 + 0.75 * i / pages.length);
            return win.html2canvas(pages[i], { scale: 2, backgroundColor: '#ffffff', logging: false, useCORS: false, windowWidth: 820, windowHeight: 1200 })
              .then(function (canvas) {
                if (i > 0) pdf.addPage('a4', 'portrait');
                pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
                i += 1;
                return suivante();
              });
          }
          return suivante().then(function () {
            pdf.setProperties({ title: 'Bilan Spliiit · ' + o.m.nom, author: 'Superprof', creator: 'Superprof' });
            var blob = pdf.output('blob');
            if (dernierPdf) URL.revokeObjectURL(dernierPdf.url);
            dernierPdf = { url: URL.createObjectURL(blob), nom: nomFichier(o.m), taille: blob.size };
            telecharger(dernierPdf);
            statut('PDF prêt : <b>' + esc(dernierPdf.nom) + '</b> (' + Math.max(1, Math.round(blob.size / 1024)) + ' Ko). Si le téléchargement n\'a pas démarré : <button type="button" data-bsx="retelecharger">télécharger</button> ou <button type="button" data-bsx="ouvrir">ouvrir le PDF</button>.');
          });
        });
      })
      .catch(function (e) {
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
    el.hidden = true;
    if (dernierFocus && document.contains(dernierFocus) && dernierFocus.focus) dernierFocus.focus();
  }

  function lireRapport() {
    var qs = ctx.cseId ? 'cse_id=' + encodeURIComponent(ctx.cseId) : 'hubspot_company_id=' + encodeURIComponent(ctx.hubspotId);
    return fetch(API + '?' + qs, { headers: { Authorization: 'Bearer ' + ctx.token } }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (j) {
        if (!r.ok || !j || !j.ok) throw lisible(r.status === 404 ? 'Ce CSE n\'a pas de données Spliiit.' : (r.status === 401 ? 'Accès refusé : rechargez le cockpit puis réessayez.' : 'Les données Spliiit n\'ont pas pu être lues. Réessayez dans un instant.'));
        return j;
      });
    });
  }

  function ouvrir(o) {
    if (!o || !o.token || (!o.cseId && !o.hubspotId)) return;
    construire();
    if (!el.hidden) return;
    var memeCse = ctx && rapport && ctx.cseId === (o.cseId || '') && ctx.hubspotId === (o.hubspotId || '');
    ctx = { token: o.token, cseId: o.cseId || '', hubspotId: o.hubspotId || '' };
    dernierFocus = document.activeElement;
    el.hidden = false;
    statut('');
    if (memeCse) { formulaire(); return; }
    rapport = null; mesure = null; saisie = null; polices = [];
    $('#bsx-titre').textContent = 'Bilan Spliiit';
    $('[data-bsx="generer"]').disabled = true;
    $('.bsx-body').innerHTML = '<div class="bsx-load">Lecture des données Spliiit…</div>';
    $('.bsx-x').focus();
    var demande = ctx;
    Promise.all([lireRapport(), bilanDoc()]).then(function (x) {
      if (ctx !== demande) return;
      var j = x[0], r = j.report;
      if (!r || !r.utilisateurs || !r.dernier_releve) throw lisible('Ce CSE n\'a pas encore de relevé Spliiit exploitable.');
      rapport = r;
      polices = Array.isArray(j.fonts) ? j.fonts : [];
      mesure = window.BilanDoc.mesures(r);
      $('#bsx-titre').textContent = 'Bilan Spliiit · ' + mesure.nom;
      formulaire();
    }).catch(function (e) {
      if (ctx !== demande) return;
      $('.bsx-body').innerHTML = '<div class="bsx-load">' + esc(e && e.lisible ? e.message : 'Connexion impossible au serveur. Réessayez dans un instant.') + '</div>';
    });
  }

  window.BilanSpliiit = { ouvrir: ouvrir, icone: ICONE };
})();
