// Export du bilan Spliiit depuis le cockpit (head-of-sales.html, index.html).
// La modale des chiffres de référence s'ouvre dans le tableau de bord ; le bilan
// (bilan-spliiit.html) est chargé en coulisse dans une iframe puis imprimé en PDF.
// Si la page hôte (HubSpot) bloque l'impression, on propose d'ouvrir le bilan dans
// un onglet, qui lance l'impression tout seul.
// Le secret du cockpit n'apparaît dans aucune URL : le bilan le demande par postMessage
// (même origine) à la fenêtre qui l'a ouvert, iframe ou onglet.
(function () {
  'use strict';
  var API = 'https://yhtxrjegdeuwkcjvkfkt.supabase.co/functions/v1/cse-spliit-report';
  var PAGE = 'bilan-spliiit.html';
  var VERSION = '3';
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var ICONE = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true"><path d="M6 21H18M12 3V17M7 12L12 17L17 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var CSS = [
    '.bsx-back{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.45);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-family:inherit;font-size:13px;line-height:1.5}',
    '.bsx-back[hidden]{display:none!important}',
    '.bsx-box{width:min(540px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#fff;color:var(--slate-900,#0f172a);border-radius:14px;border:1px solid rgba(0,0,0,.06);box-shadow:0 1px 2px rgba(0,0,0,.05),0 18px 48px -12px rgba(15,23,42,.35);display:flex;flex-direction:column;animation:bsxIn .18s ease both}',
    '@keyframes bsxIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '.bsx-accent{height:3px;flex:none;background:linear-gradient(90deg,#818cf8,#6366f1)}',
    '.bsx-head{display:flex;align-items:flex-start;gap:10px;padding:14px 16px 0}',
    '.bsx-ico{width:30px;height:30px;border-radius:8px;background:#e0e7ff;color:#4338ca;display:flex;align-items:center;justify-content:center;flex:none}',
    '.bsx-head h2{margin:0;font-size:14px;font-weight:800;color:var(--slate-900,#0f172a);line-height:1.3}',
    '.bsx-head p{margin:3px 0 0;font-size:11.5px;line-height:1.5;color:var(--slate-600,#475569)}',
    '.bsx-x{margin-left:auto;flex:none;width:28px;height:28px;border:1px solid var(--slate-200,#e2e8f0);border-radius:8px;background:var(--slate-100,#f1f5f9);color:var(--slate-600,#475569);font:inherit;font-size:16px;line-height:1;cursor:pointer}',
    '.bsx-x:hover{background:var(--slate-200,#e2e8f0)}',
    '.bsx-body{padding:12px 16px 2px;display:grid;grid-template-columns:1fr 1fr;gap:10px 12px}',
    '.bsx-f{display:flex;flex-direction:column;gap:4px;min-width:0}',
    '.bsx-f.full{grid-column:1/-1}',
    '.bsx-f label{font-size:11.5px;font-weight:700;color:var(--slate-700,#334155)}',
    '.bsx-f input{font-family:inherit;font-size:12.5px;color:var(--slate-900,#0f172a);background:var(--slate-50,#f8fafc);border:1.5px solid var(--slate-200,#e2e8f0);border-radius:10px;padding:8px 11px;min-width:0;outline:none;font-variant-numeric:tabular-nums;transition:border-color .15s,box-shadow .15s}',
    '.bsx-f input:focus{border-color:var(--indigo,#6366f1);box-shadow:0 0 0 3px rgba(99,102,241,.12);background:#fff}',
    '.bsx-f.err input{border-color:var(--rose,#f43f5e)}',
    '.bsx-m{font-size:11px;color:var(--slate-400,#94a3b8);min-height:15px}',
    '.bsx-m button{font:inherit;font-size:11px;border:none;background:none;padding:0;color:var(--indigo-dark,#4f46e5);font-weight:600;cursor:pointer}',
    '.bsx-m button:hover{text-decoration:underline}',
    '.bsx-e{font-size:11px;font-weight:600;color:#e11d48;min-height:0}',
    '.bsx-e:empty{display:none}',
    '.bsx-taux{grid-column:1/-1;font-size:11.5px;line-height:1.5;color:var(--slate-600,#475569);background:#eef2ff;border:1px solid #e0e7ff;border-radius:10px;padding:8px 11px}',
    '.bsx-taux b{color:#4338ca}',
    '.bsx-sep{grid-column:1/-1;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--slate-400,#94a3b8);margin-top:2px}',
    '.bsx-foot{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:12px 16px 14px}',
    '.bsx-status{flex:1 1 180px;font-size:11px;line-height:1.45;color:var(--slate-600,#475569);min-height:16px}',
    '.bsx-status a{color:var(--indigo-dark,#4f46e5);font-weight:700}',
    '.bsx-btn{font-family:inherit;font-size:12.5px;font-weight:700;border-radius:9px;padding:7px 16px;cursor:pointer;border:1px solid transparent;display:inline-flex;align-items:center;gap:6px;line-height:1.3;transition:opacity .15s,transform .15s,box-shadow .15s,background .15s}',
    '.bsx-btn[disabled]{opacity:.5;cursor:not-allowed;transform:none}',
    '.bsx-light{background:var(--slate-100,#f1f5f9);border-color:var(--slate-200,#e2e8f0);color:var(--slate-600,#475569)}',
    '.bsx-light:hover{background:var(--slate-200,#e2e8f0)}',
    '.bsx-primary{background:linear-gradient(135deg,#7c3aed,#6366f1);color:#fff;box-shadow:0 2px 8px rgba(99,102,241,.35)}',
    '.bsx-primary:hover:not([disabled]){opacity:.9;transform:translateY(-1px);box-shadow:0 4px 14px rgba(99,102,241,.45)}',
    '.bsx-btn:focus-visible,.bsx-x:focus-visible,.bsx-status a:focus-visible,.bsx-m button:focus-visible{outline:2px solid var(--indigo,#6366f1);outline-offset:2px}',
    '.bsx-load{grid-column:1/-1;padding:14px 0;font-size:12px;color:var(--slate-400,#94a3b8)}',
    '.bsx-frame{position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;opacity:0;pointer-events:none}',
    '@media (max-width:520px){.bsx-body{grid-template-columns:1fr}}',
    'body.dark .bsx-back{background:rgba(2,6,23,.6)}',
    'body.dark .bsx-box{background:#1e293b;color:#f8fafc;border-color:rgba(255,255,255,.07)}',
    'body.dark .bsx-head h2{color:#f1f5f9}',
    'body.dark .bsx-head p,body.dark .bsx-status{color:#94a3b8}',
    'body.dark .bsx-ico{background:#3730a3;color:#a5b4fc}',
    'body.dark .bsx-f label{color:#e2e8f0}',
    'body.dark .bsx-m,body.dark .bsx-sep,body.dark .bsx-load{color:#64748b}',
    'body.dark .bsx-x,body.dark .bsx-light{background:#334155;border-color:#475569;color:#94a3b8}',
    'body.dark .bsx-x:hover,body.dark .bsx-light:hover{background:#475569}',
    'body.dark .bsx-f input{background:#1e293b;color:#e2e8f0;border-color:#334155;color-scheme:dark}',
    'body.dark .bsx-f input:focus{background:#263248;border-color:var(--indigo,#6366f1)}',
    'body.dark .bsx-taux{background:rgba(99,102,241,.12);border-color:rgba(99,102,241,.25);color:#cbd5e1}',
    'body.dark .bsx-taux b,body.dark .bsx-m button,body.dark .bsx-status a{color:#a5b4fc}',
    'body.dark .bsx-e{color:#fb7185}'
  ].join('\n');

  var el = null;          // racine de la modale
  var ctx = null;         // { token, cseId, hubspotId }
  var mesure = null;      // valeurs mesurées
  var rapport = null;
  var saisie = null;      // dernières valeurs générées pour ce CSE (pré-remplissage)
  var moisMax = '';       // mois des données (AAAA-MM) : borne du début du partenariat
  var dernierFocus = null;
  var frame = null;
  var enCours = false;
  var minuteur = null;
  var refCourante = null;
  var ongletsPermis = false; // un onglet de repli a été proposé : il peut demander le jeton
  var cibleAppui = null;     // cible du pointerdown (fermeture par clic sur le fond seulement)

  function int(n) { return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(+n || 0)); }
  function pct(a, b) { return b > 0 ? int(100 * a / b) + ' %' : '–'; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function $(sel) { return el.querySelector(sel); }
  function moisLabel(ym) { var p = String(ym || '').split('-'); return p.length === 2 ? MOIS[+p[1] - 1] + ' ' + p[0] : ''; }
  // Un relevé est pris le matin : il décrit l'état de la veille.
  function veille(s) {
    var m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] - 1)).toISOString().slice(0, 10) : '';
  }
  // Même arrondi que le bilan (plus fort reste) : la part « cagnottes vidées » est identique.
  function partVidees(rep) {
    var v = (rep || []).map(Number), tot = v.reduce(function (a, b) { return a + b; }, 0);
    if (!(tot > 0) || v.length !== 6) return null;
    var brut = v.map(function (x) { return 100 * x / tot; });
    var parts = brut.map(Math.floor);
    var reste = 100 - parts.reduce(function (a, b) { return a + b; }, 0);
    brut.map(function (b, i) { return [b - Math.floor(b), i]; }).sort(function (a, b) { return b[0] - a[0]; })
      .forEach(function (x) { if (reste > 0) { parts[x[1]] += 1; reste -= 1; } });
    return parts[5];
  }

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
        '<div class="bsx-head"><div class="bsx-ico">' + ICONE + '</div><div><h2 id="bsx-titre">Bilan Spliiit</h2><p>Chiffres pré-remplis avec les données Spliiit. Vous pouvez les remplacer par ceux communiqués par Spliiit ou par le CSE : les taux et moyennes du bilan sont calculés à partir d\'eux.</p></div>' +
        '<button type="button" class="bsx-x" data-bsx="fermer" aria-label="Fermer">×</button></div>' +
        '<form class="bsx-body" novalidate>' +
          '<div class="bsx-load">Lecture des données Spliiit…</div>' +
        '</form>' +
        '<div class="bsx-foot"><div class="bsx-status" role="status" aria-live="polite"></div>' +
          '<button type="button" class="bsx-btn bsx-light" data-bsx="fermer">Annuler</button>' +
          '<button type="button" class="bsx-btn bsx-primary" data-bsx="generer" disabled>' + ICONE + 'Générer le PDF</button></div>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('pointerdown', function (e) { cibleAppui = e.target; });
    el.addEventListener('click', function (e) {
      // Fond : seulement si l'appui ET le relâchement ont eu lieu sur le fond (pas une
      // sélection de texte qui déborde, pas le 2e clic d'un double clic sur l'icône).
      if (e.target === el) { if (cibleAppui === el) fermer(); return; }
      var t = e.target.closest ? e.target.closest('[data-bsx],[data-reset]') : null;
      if (!t) return;
      if (t.getAttribute('data-reset')) {
        var k = t.getAttribute('data-reset');
        $('#bsx-' + k).value = mesure[k] == null ? '' : mesure[k];
        erreur(k, ''); retirerLien();
        return;
      }
      var a = t.getAttribute('data-bsx');
      if (a === 'fermer') fermer();
      if (a === 'generer') generer();
    });
    // Toute modification invalide le lien d'onglet déjà proposé (il porterait d'anciens chiffres).
    el.addEventListener('input', function (e) { if (e.target && e.target.name) { erreur(e.target.name, ''); retirerLien(); } });
    el.addEventListener('submit', function (e) { e.preventDefault(); generer(); });
    document.addEventListener('keydown', function (e) {
      if (!el || el.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); fermer(); return; }
      if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT' && el.contains(e.target)) { e.preventDefault(); generer(); return; }
      if (e.key !== 'Tab') return;
      var f = [].slice.call(el.querySelectorAll('button:not([disabled]),input,a[href]')).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (!el.contains(document.activeElement)) { e.preventDefault(); f[0].focus(); return; }
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    window.addEventListener('message', surMessage);
  }

  function statut(html) { $('.bsx-status').innerHTML = html || ''; }
  function retirerLien() { if (el.querySelector('[data-bsx="onglet"]')) statut(''); }
  function erreur(k, msg) {
    var f = el.querySelector('[data-k="' + k + '"]');
    if (!f) return;
    f.classList.toggle('err', !!msg);
    var i = f.querySelector('input'); if (i) i.setAttribute('aria-invalid', msg ? 'true' : 'false');
    var e = f.querySelector('.bsx-e'); if (e) e.textContent = msg || '';
  }

  function champ(k, label, type, attrs, mesureTxt, full) {
    return '<div class="bsx-f' + (full ? ' full' : '') + '" data-k="' + k + '"><label for="bsx-' + k + '">' + label + '</label>' +
      '<input id="bsx-' + k + '" name="' + k + '" type="' + type + '" ' + attrs + ' aria-describedby="bsx-e-' + k + '">' +
      (mesureTxt ? '<div class="bsx-m">' + mesureTxt + ' · <button type="button" data-reset="' + k + '">rétablir</button></div>' : '') +
      '<div class="bsx-e" id="bsx-e-' + k + '" role="alert"></div></div>';
  }

  function formulaire() {
    var u = rapport.utilisateurs;
    var vid = partVidees(u.repartition_utilisation);
    $('.bsx-body').innerHTML =
      champ('nom', 'Nom du CSE affiché', 'text', 'autocomplete="off" maxlength="120"', '', true) +
      champ('inscrits', 'Salariés inscrits', 'number', 'min="1" step="1" inputmode="numeric"', 'Mesuré : ' + int(mesure.inscrits)) +
      champ('utilisateurs', 'Bénéficiaires', 'number', 'min="1" step="1" inputmode="numeric"', 'Mesuré : ' + int(mesure.utilisateurs)) +
      '<div class="bsx-taux">Calculés à partir des données Spliiit : <b>' + pct(u.actifs, u.beneficiaires) + '</b> des bénéficiaires ont un abonnement en cours, <b>' + (vid == null ? pct(u.cagnottes_videes, u.beneficiaires) : vid + ' %') + '</b> ont vidé leur cagnotte.</div>' +
      '<div class="bsx-sep">Contrat et période</div>' +
      champ('contrat', 'Cagnotte par salarié au contrat (€)', 'number', 'min="0" step="0.01" inputmode="decimal" placeholder="Optionnel, ex. 160"', '') +
      champ('debut', 'Début du partenariat', 'month', moisMax ? 'max="' + moisMax + '"' : '', mesure.debut ? 'Par défaut : ' + esc(moisLabel(mesure.debut)) : '');
    var v = saisie || mesure;
    ['nom', 'inscrits', 'utilisateurs', 'contrat', 'debut'].forEach(function (k) { $('#bsx-' + k).value = v[k] == null ? '' : v[k]; });
    $('[data-bsx="generer"]').disabled = false;
    setTimeout(function () { var i = $('#bsx-inscrits'); if (i && !el.hidden) i.focus(); }, 30);
  }

  function lisible(msg) { var e = new Error(msg); e.lisible = true; return e; }

  function lire() {
    var qs = ctx.cseId ? 'cse_id=' + encodeURIComponent(ctx.cseId) : 'hubspot_company_id=' + encodeURIComponent(ctx.hubspotId);
    return fetch(API + '?' + qs, { headers: { Authorization: 'Bearer ' + ctx.token } }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (j) {
        if (!r.ok || !j || !j.ok) throw lisible(r.status === 404 ? 'Ce CSE n\'a pas de données Spliiit.' : (r.status === 401 ? 'Accès refusé : rechargez le cockpit puis réessayez.' : 'Les données Spliiit n\'ont pas pu être lues. Réessayez dans un instant.'));
        return j.report;
      });
    });
  }

  // Mêmes règles que bilan-spliiit.html (qui revérifie de son côté). Renvoie { form, envoi } :
  // form = valeurs affichées (pré-remplissage suivant), envoi = ce qui part vers le bilan,
  // avec null pour un chiffre laissé à sa valeur mesurée (le bilan reprend alors sa propre
  // mesure, à jour).
  function valider() {
    var v = {}, err = {};
    ['inscrits', 'utilisateurs'].forEach(function (k) {
      var input = $('#bsx-' + k), raw = input.value;
      if (input.validity && input.validity.badInput) { err[k] = 'Saisissez un nombre entier positif, sans espace.'; return; }
      if (raw === '') { v[k] = mesure[k]; return; }
      var n = Number(raw);
      if (!isFinite(n) || n < 0 || Math.floor(n) !== n) { err[k] = 'Saisissez un nombre entier positif.'; return; }
      v[k] = n;
    });
    if (!err.inscrits && v.inscrits <= 0) err.inscrits = 'Il faut au moins un salarié inscrit.';
    if (!err.inscrits && !err.utilisateurs && v.utilisateurs > v.inscrits) err.utilisateurs = 'Ne peut pas dépasser les salariés inscrits (' + int(v.inscrits) + ').';
    if (!err.utilisateurs && v.utilisateurs <= 0) err.utilisateurs = 'Il faut au moins un bénéficiaire.';
    var ci = $('#bsx-contrat'), c = String(ci.value || '').trim().replace(',', '.');
    v.contrat = null;
    if (ci.validity && ci.validity.badInput) err.contrat = 'Saisissez un montant en chiffres (ex. 160), ou laissez vide.';
    else if (c !== '') { var n = Number(c); if (!isFinite(n) || n <= 0) err.contrat = 'Saisissez un montant positif, ou laissez vide.'; else v.contrat = Math.round(n * 100) / 100; }
    var d = $('#bsx-debut').value;
    if (d && !/^\d{4}-\d{2}$/.test(d)) err.debut = 'Choisissez un mois.';
    else if (d && moisMax && d > moisMax) err.debut = 'Doit précéder les données (' + moisLabel(moisMax) + ').';
    v.debut = d || mesure.debut;
    v.nom = String($('#bsx-nom').value || '').trim().slice(0, 120) || mesure.nom;
    ['inscrits', 'utilisateurs', 'contrat', 'debut'].forEach(function (k) { erreur(k, err[k] || ''); });
    var premier = el.querySelector('.bsx-f.err input');
    if (premier) { premier.focus(); return null; }
    return {
      form: v,
      envoi: {
        nom: v.nom === mesure.nom ? null : v.nom,
        inscrits: v.inscrits === mesure.inscrits ? null : v.inscrits,
        utilisateurs: v.utilisateurs === mesure.utilisateurs ? null : v.utilisateurs,
        contrat: v.contrat,
        debut: v.debut === mesure.debut ? null : v.debut
      }
    };
  }

  function b64url(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function urlBilan(ref, embed) {
    var q = new URLSearchParams({ _v: VERSION });
    if (ctx.cseId) q.set('cse_id', ctx.cseId); else q.set('hubspot_company_id', ctx.hubspotId);
    if (embed) q.set('embed', '1');
    return PAGE + '?' + q.toString() + '#r=' + b64url(ref);
  }

  function nettoyer() {
    clearTimeout(minuteur);
    if (frame) { frame.remove(); frame = null; }
    enCours = false;
    if (el) $('[data-bsx="generer"]').disabled = !rapport;
  }

  function openerDe(w) { try { return w.opener; } catch (_) { return null; } }

  function surMessage(e) {
    if (e.origin !== location.origin || !e.source) return;
    var d = e.data || {};
    var depuisFrame = !!frame && e.source === frame.contentWindow;
    // Jeton demandé par le bilan : iframe en cours, ou onglet de repli ouvert depuis ce cockpit.
    if (d.type === 'bilan-jeton?') {
      if (ctx && ctx.token && (depuisFrame || (ongletsPermis && openerDe(e.source) === window))) {
        e.source.postMessage({ type: 'bilan-jeton', token: ctx.token }, location.origin);
      }
      return;
    }
    if (!depuisFrame) return;
    if (d.type === 'bilan-pret') {
      clearTimeout(minuteur);
      statut('Ouverture de l\'impression : choisissez « Enregistrer au format PDF ».');
      frame.contentWindow.postMessage({ type: 'bilan-imprimer' }, location.origin);
    } else if (d.type === 'bilan-imprime') {
      if (+d.ms < 400) repli(); // impression refusée par la page hôte : retour immédiat
      else { nettoyer(); fermer(); }
    } else if (d.type === 'bilan-erreur') {
      statut(esc(d.message || 'Le bilan n\'a pas pu être préparé.'));
      nettoyer();
    }
  }
  // Ouverture dans un onglet par un vrai lien (clic de l'utilisateur, jamais bloqué) ;
  // l'onglet demande le jeton à cette page (rel="opener") puis lance l'impression.
  function repli() {
    ongletsPermis = true;
    var ref = Object.assign({}, refCourante, { print: true });
    statut('L\'impression est bloquée ici. <a href="' + esc(urlBilan(ref, false)) + '" target="_blank" rel="opener" data-bsx="onglet">Ouvrir le bilan dans un onglet</a> pour l\'enregistrer en PDF.');
    nettoyer();
    var a = el.querySelector('[data-bsx="onglet"]'); if (a) a.focus();
  }

  function generer() {
    if (enCours || !rapport) return;
    var r = valider();
    if (!r) return;
    enCours = true;
    refCourante = r.envoi;
    saisie = r.form;
    $('[data-bsx="generer"]').disabled = true;
    statut('Préparation du bilan…');
    frame = document.createElement('iframe');
    frame.className = 'bsx-frame';
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.title = 'Bilan Spliiit';
    frame.src = urlBilan(r.envoi, true);
    document.body.appendChild(frame);
    minuteur = setTimeout(function () { if (enCours) repli(); }, 20000);
  }

  function fermer() {
    if (!el || el.hidden) return;
    nettoyer();
    el.hidden = true;
    if (dernierFocus && document.contains(dernierFocus) && dernierFocus.focus) dernierFocus.focus();
  }

  function ouvrir(o) {
    if (!o || !o.token || (!o.cseId && !o.hubspotId)) return;
    construire();
    if (!el.hidden) return; // déjà ouverte (double clic, Entrée sur l'icône)
    nettoyer();
    var memeCse = ctx && rapport && ctx.cseId === (o.cseId || '') && ctx.hubspotId === (o.hubspotId || '');
    ctx = { token: o.token, cseId: o.cseId || '', hubspotId: o.hubspotId || '' };
    dernierFocus = document.activeElement;
    el.hidden = false;
    statut('');
    if (memeCse) { formulaire(); return; }
    rapport = null; mesure = null; saisie = null; moisMax = '';
    $('#bsx-titre').textContent = 'Bilan Spliiit';
    $('[data-bsx="generer"]').disabled = true;
    $('.bsx-body').innerHTML = '<div class="bsx-load">Lecture des données Spliiit…</div>';
    $('.bsx-x').focus();
    var demande = ctx;
    lire().then(function (r) {
      if (ctx !== demande) return;
      var u = r && r.utilisateurs, last = r && r.dernier_releve;
      if (!u || !last) throw lisible('Ce CSE n\'a pas encore de relevé Spliiit exploitable.');
      var cree = String((r.cse && r.cse.created_date) || '').match(/^(\d{4})-(\d{2})/);
      rapport = r;
      moisMax = veille(last.snapshot_date).slice(0, 7);
      mesure = {
        nom: String((r.cse && r.cse.name) || last.cse_name || 'CSE').trim(),
        inscrits: +last.codes_generes || 0,
        utilisateurs: +u.beneficiaires || 0,
        contrat: null,
        debut: cree ? cree[1] + '-' + cree[2] : ((r.mois && r.mois[0] && r.mois[0].mois) || '')
      };
      $('#bsx-titre').textContent = 'Bilan Spliiit · ' + mesure.nom;
      formulaire();
    }).catch(function (e) {
      if (ctx !== demande) return;
      $('.bsx-body').innerHTML = '<div class="bsx-load">' + esc(e && e.lisible ? e.message : 'Connexion impossible au serveur. Réessayez dans un instant.') + '</div>';
    });
  }

  window.BilanSpliiit = { ouvrir: ouvrir, icone: ICONE };
})();
