// Bilan du partenariat Superprof + Spliiit d'un CSE : calcul du modèle et rendu du document
// (7 pages A4) en HTML autonome.
// Utilisé par bilan-export.js : le document est rendu dans une iframe cachée (srcdoc), puis
// chaque page est photographiée et assemblée en PDF dans le navigateur (l'impression est bloquée
// dans la modale HubSpot). Toutes les ressources (polices, logos) arrivent en data: URL, pour que
// le rendu ne dépende d'aucun chargement externe.
// DA Superprof V8 : rose #FF6363 et déclinaisons, noir #121212 ; Buenos Aires ; Caveat en accent.
// Texte toujours #121212 sur rose (blanc sur #FF6363 = 2,9:1, insuffisant).
(function () {
  'use strict';
  var SP_LOGO_SVG = "<svg class=\"sp-logo\" viewBox=\"0 0 120 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M40.3946 7.60882C40.8711 8.23326 41.2275 8.94163 41.4456 9.69761C41.6793 10.485 41.7977 11.3023 41.7965 12.1241C41.8207 13.1773 41.6185 14.2232 41.2038 15.1906C40.8462 16.0054 40.3222 16.7355 39.6659 17.3334C39.0457 17.8883 38.3212 18.3126 37.5353 18.5813C36.7794 18.8462 35.9852 18.9837 35.1847 18.9883C34.676 18.998 34.1679 18.9413 33.6736 18.8194C33.2774 18.7068 32.9176 18.5982 32.594 18.4935V24H28.7324L28.7508 5.85944H32.4731C32.5084 6.09415 32.5353 6.3238 32.5537 6.55007C32.5722 6.77634 32.589 7.00768 32.6074 7.2424C33.0287 6.71184 33.5762 6.29661 34.1991 6.03505C34.8351 5.75778 35.5208 5.61459 36.2139 5.61459C37.8444 5.56917 39.3981 6.31029 40.3946 7.60882ZM80.7741 7.60882C81.2504 8.23326 81.6068 8.94163 81.8251 9.69761C82.0588 10.485 82.177 11.3023 82.176 12.1241C82.2002 13.1773 81.998 14.2232 81.5833 15.1906C81.2257 16.0054 80.7017 16.7355 80.0454 17.3334C79.4267 17.8878 78.7039 18.3121 77.9198 18.5813C77.1639 18.8462 76.3696 18.9837 75.5692 18.9883C75.0603 18.998 74.5524 18.9413 74.0581 18.8194C73.6619 18.7068 73.3019 18.5982 72.9785 18.4935V24H69.1169L69.1253 5.85944H72.8476C72.8828 6.09415 72.9097 6.3238 72.9282 6.55007C72.9466 6.77634 72.9651 7.00768 72.9819 7.2424C73.4035 6.71218 73.9508 6.29695 74.5736 6.03505C75.2094 5.75778 75.8953 5.61459 76.5884 5.61459C78.2205 5.56748 79.7764 6.30877 80.7741 7.60882ZM5.96038 5.41535C6.91773 5.40387 7.8719 5.53187 8.79282 5.79529C9.58949 6.03439 10.3444 6.39609 11.0309 6.86755L9.38717 9.44434C8.93905 9.15542 8.46441 8.91007 7.97011 8.71149C7.39893 8.48775 6.78996 8.37765 6.17697 8.38728C5.58429 8.38728 5.15111 8.4734 4.88247 8.64394C4.6318 8.78292 4.47666 9.04836 4.47784 9.33627C4.47784 9.75166 4.75772 10.059 5.31732 10.2582C5.87693 10.4575 6.63197 10.6826 7.58227 10.9337C8.87626 11.295 9.81581 11.792 10.4013 12.4247C10.9867 13.0573 11.2789 13.8982 11.2777 14.9475C11.2957 15.5885 11.1308 16.2213 10.8026 16.7711C10.4817 17.2836 10.048 17.7151 9.53492 18.0325C8.97767 18.3794 8.36719 18.6315 7.72834 18.7789C7.05255 18.9417 6.35997 19.0237 5.66488 19.0237C4.57807 19.0296 3.49647 18.8743 2.45467 18.5627C1.53257 18.3046 0.688885 17.8194 0 17.1511L1.91572 14.6469C2.39423 15.0658 2.94829 15.3885 3.54768 15.5976C4.17126 15.8407 4.83328 15.9689 5.50202 15.9758C5.98791 15.9902 6.47263 15.9164 6.93251 15.758C7.29214 15.6415 7.52586 15.2926 7.49832 14.9137C7.49966 14.7561 7.45786 14.6013 7.37743 14.4662C7.26427 14.3029 7.11098 14.1719 6.93251 14.0863C6.64255 13.938 6.34033 13.8154 6.02921 13.7199C5.64137 13.5932 5.15111 13.4497 4.55843 13.2859C4.06531 13.155 3.58311 12.9857 3.11619 12.7793C2.65917 12.5836 2.2322 12.3232 1.84856 12.0059C1.47952 11.7 1.1768 11.3212 0.958699 10.8932C0.486067 9.89739 0.51108 8.73513 1.02586 7.76081C1.30557 7.26909 1.68687 6.84357 2.14406 6.51294C2.65799 6.14246 3.23338 5.86688 3.84318 5.69904C4.53224 5.50553 5.24496 5.40995 5.96038 5.41535ZM100.767 5.43052C101.71 5.41768 102.646 5.59752 103.517 5.95905C104.318 6.29288 105.043 6.78629 105.648 7.40955C106.246 8.03095 106.718 8.7633 107.038 9.56588C107.703 11.266 107.703 13.1562 107.038 14.8562C106.393 16.4891 105.122 17.7932 103.512 18.4766C102.643 18.8472 101.706 19.0325 100.762 19.0203C99.8133 19.0315 98.872 18.8462 97.9969 18.4766C97.1927 18.1367 96.4639 17.6389 95.8529 17.0126C95.2557 16.391 94.7841 15.6587 94.4644 14.8562C94.1286 14.0158 93.9592 13.1177 93.9657 12.2119C93.9609 11.3053 94.1319 10.4065 94.4694 9.56588C94.7891 8.76346 95.2607 8.03112 95.8579 7.40955C96.4672 6.7846 97.1967 6.29103 98.002 5.95905C98.8793 5.59836 99.8196 5.4187 100.767 5.43052ZM50.0588 5.42547C50.9859 5.40453 51.9063 5.58859 52.7552 5.96413C53.5104 6.31215 54.1783 6.82633 54.7095 7.46867C55.2599 8.1485 55.6682 8.93302 55.91 9.77529C56.1886 10.7309 56.3249 11.7227 56.3146 12.7185V13.3686H47.3069C47.3237 14.0554 47.6248 14.657 48.2102 15.1737C48.7957 15.6904 49.6004 15.9476 50.6246 15.9454C51.632 15.9454 52.4501 15.7963 53.0793 15.4979C53.5605 15.284 54.0207 15.0256 54.4543 14.7262L56.046 17.1967C55.9016 17.2878 55.6855 17.4369 55.3979 17.6441C55.0474 17.8876 54.6721 18.0925 54.278 18.2554C53.7502 18.4769 53.2048 18.6537 52.6478 18.7839C51.9396 18.9465 51.2149 19.0241 50.4886 19.0153C49.4948 19.0284 48.5072 18.8567 47.5756 18.5087C46.7542 18.2005 46.0057 17.7238 45.3778 17.1088C44.7688 16.5023 44.2999 15.7684 44.0044 14.9593C43.6815 14.0684 43.5217 13.1261 43.5326 12.1782C43.5304 11.3041 43.681 10.4365 43.9775 9.61487C44.2594 8.81836 44.6948 8.08551 45.2586 7.45854C45.8348 6.83072 46.5324 6.32802 47.3086 5.98102C48.175 5.59906 49.113 5.4096 50.0588 5.42547ZM17.4513 5.85944V13.1829C17.4513 13.9056 17.6264 14.4751 17.9768 14.8917C18.3271 15.3083 18.8437 15.516 19.5265 15.5148C19.8904 15.5222 20.251 15.4436 20.5793 15.2852C21.1916 14.9821 21.651 14.4363 21.8469 13.7789C21.9565 13.4373 22.0131 13.0809 22.0148 12.7219V5.85944H25.8764V18.5813H22.1441L22.0349 17.2304C21.5851 17.7471 21.0289 18.1592 20.4046 18.4378C19.7423 18.751 19.0193 18.9131 18.2875 18.9123C16.8323 18.9123 15.6812 18.4783 14.8338 17.6104C13.9864 16.7424 13.564 15.4586 13.5662 13.7587V5.85944H17.4513ZM65.9234 5.61459C66.2166 5.61172 66.5094 5.62979 66.7998 5.66863C67.044 5.70578 67.2832 5.76977 67.5134 5.85944L66.8939 9.30417C66.439 9.16891 65.9662 9.10458 65.4919 9.11336C64.5752 9.11336 63.8331 9.38911 63.2656 9.94077C62.6981 10.4924 62.415 11.2748 62.416 12.2879V18.5813H58.5258V5.85944H62.2481L62.3824 7.45854C62.7617 6.97374 63.2152 6.55261 63.7256 6.21067C64.2909 5.81334 65.0235 5.61459 65.9234 5.61459ZM91.8653 5.61459C92.1583 5.61172 92.4513 5.62979 92.7418 5.66863C92.9864 5.70594 93.2262 5.76994 93.457 5.85944L92.8358 9.30417C92.381 9.16891 91.908 9.10458 91.4339 9.11336C90.5171 9.11336 89.7755 9.38911 89.2092 9.94077C88.6429 10.4924 88.3596 11.2748 88.3596 12.2879V18.5813H84.4678V5.85944H88.1901L88.3244 7.45854C88.7037 6.97374 89.1572 6.55261 89.6676 6.21067C90.2339 5.81334 90.9666 5.61459 91.8653 5.61459ZM116.009 0C116.712 0.0028706 117.411 0.103343 118.086 0.298882C118.79 0.499994 119.443 0.85122 120 1.32892C119.731 1.74432 119.457 2.15583 119.177 2.56329C118.897 2.97074 118.623 3.38225 118.355 3.79765C118.084 3.59755 117.784 3.44203 117.465 3.33666C117.144 3.22572 116.807 3.16882 116.467 3.1678C115.982 3.14585 115.511 3.33396 115.173 3.68451C114.849 4.02223 114.688 4.51023 114.688 5.14852V5.85436H117.681V8.91915H114.688V18.5762H110.826L110.828 8.92422H108.778V5.85942H110.828V5.20762C110.807 4.40723 110.959 3.61156 111.273 2.87567C111.544 2.25866 111.945 1.70801 112.448 1.26138C112.933 0.837205 113.497 0.514684 114.107 0.312391C114.72 0.105538 115.362 0 116.009 0ZM75.6582 8.94281C75.2625 8.93487 74.8703 9.01812 74.5115 9.18597C74.1884 9.3403 73.9023 9.56269 73.672 9.83776C73.446 10.1106 73.2724 10.4232 73.1599 10.7597C73.0459 11.1008 72.9891 11.4586 72.992 11.8185L72.9869 15.2176C73.4906 15.5553 74.2371 15.7242 75.2267 15.7242C76.1792 15.7242 76.9297 15.4034 77.4782 14.7617C78.0267 14.12 78.3009 13.2656 78.3009 12.1984C78.3009 11.7869 78.2514 11.3769 78.1532 10.9776C78.0643 10.6039 77.9085 10.2496 77.6931 9.93233C77.4841 9.63226 77.2072 9.3864 76.8855 9.21467C76.5052 9.02285 76.0833 8.92947 75.6582 8.94281ZM35.2837 8.94281C34.8882 8.93487 34.4958 9.01812 34.137 9.18597C33.8141 9.3403 33.5279 9.56269 33.2975 9.83776C33.0715 10.1106 32.8979 10.4232 32.7854 10.7597C32.6714 11.1008 32.6147 11.4586 32.6175 11.8185L32.6125 15.2176C33.1162 15.5553 33.8628 15.7242 34.8522 15.7242C35.8037 15.7242 36.5542 15.4034 37.1038 14.7617C37.6533 14.12 37.9276 13.2656 37.9265 12.1984C37.9268 11.7869 37.8768 11.3767 37.777 10.9776C37.6896 10.6037 37.5341 10.2494 37.3187 9.93233C37.1095 9.63175 36.8319 9.3859 36.5094 9.21467C36.1298 9.02268 35.7084 8.9293 35.2837 8.94281ZM100.762 8.82121C100.31 8.81378 99.863 8.91088 99.4543 9.1049C99.0827 9.28287 98.7555 9.54241 98.4973 9.86477C98.2404 10.1886 98.0436 10.5566 97.9164 10.9505C97.6477 11.7698 97.6477 12.654 97.9164 13.4733C98.0458 13.8701 98.2422 14.2414 98.4973 14.5709C98.7516 14.9005 99.0796 15.1653 99.4543 15.3443C99.8633 15.5371 100.311 15.633 100.762 15.6246V15.6296C101.21 15.6374 101.653 15.5398 102.057 15.3443C102.428 15.16 102.755 14.8959 103.014 14.5709C103.274 14.245 103.471 13.8726 103.595 13.4733C103.846 12.6513 103.846 11.7725 103.595 10.9505C103.473 10.5539 103.276 10.1849 103.014 9.86477C102.751 9.54714 102.425 9.28811 102.057 9.1049C101.653 8.91003 101.21 8.81277 100.762 8.82121ZM50.0252 8.46325C49.6184 8.45464 49.2144 8.53299 48.8398 8.6929C48.5215 8.83018 48.2329 9.02859 47.9903 9.27715C47.7727 9.50005 47.5986 9.76161 47.4765 10.0488C47.3669 10.3107 47.3099 10.5919 47.3086 10.8762H52.6478C52.6431 10.5924 52.586 10.3119 52.4799 10.0488C52.3684 9.76279 52.2037 9.50089 51.9946 9.27715C51.7648 9.0318 51.4899 8.83339 51.1854 8.6929C50.8204 8.53096 50.424 8.45244 50.0252 8.46325Z\" fill=\"currentColor\"/></svg>";
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  // Logos : vectoriel simple-icons (version figée) sur la couleur de la marque, sinon icône
  // officielle du site (relais favicon de cse-spliit-report), sinon initiale.
  var SI = 'https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/';
  var LOGOS = {
    'netflix': { si: 'netflix', hex: 'E50914' }, 'spotify': { si: 'spotify', hex: '1ED760', fg: '000000' },
    'deezer': { si: 'deezer', hex: 'A238FF' }, 'youtube premium': { si: 'youtube', hex: 'FF0000' }, 'youtube': { si: 'youtube', hex: 'FF0000' },
    'hbo max': { si: 'hbomax', hex: '000000' }, 'max': { si: 'max', hex: '002BE7' }, 'strava': { si: 'strava', hex: 'FC4C02' },
    'duolingo': { si: 'duolingo', hex: '58CC02' }, 'crunchyroll': { si: 'crunchyroll', hex: 'FF5E00' },
    'snapchat+': { si: 'snapchat', hex: 'FFFC00', fg: '000000' }, 'nordvpn': { si: 'nordvpn', hex: '4687FF' }, 'uber one': { si: 'uber', hex: '000000' },
    'paramount+': { si: 'paramountplus', hex: '0064FF' }, "l'équipe": { si: 'lequipe', hex: 'E42829' }, 'apple arcade': { si: 'applearcade', hex: '000000' },
    'apple tv+': { si: 'appletv', hex: '000000' }, 'icloud': { si: 'icloud', hex: '3693F3' }, 'apple one': { si: 'apple', hex: '000000' },
    'bitdefender': { si: 'bitdefender', hex: 'ED1C24' }, 'audible': { si: 'audible', hex: 'F8991C' }, 'apple music': { si: 'applemusic', hex: 'FA243C' },
    'playstation plus': { si: 'playstation', hex: '0070D1' }, 'headspace': { si: 'headspace', hex: 'F47D31' },
    'disney+': { domain: 'disneyplus.com' }, 'canal+': { domain: 'canalplus.com' }, 'prime video': { domain: 'primevideo.com' },
    'nintendo switch': { domain: 'nintendo.com' }, 'ligue1+': { domain: 'ligue1.fr' }, 'microsoft 365': { domain: 'microsoft365.com' },
    'amazon prime': { domain: 'amazon.fr' }, 'cdiscount': { domain: 'cdiscount.com' }, 'tf1+': { domain: 'tf1.fr' }, 'm6+': { domain: 'm6plus.fr' },
    'google one': { domain: 'one.google.com' }, 'amazon music': { domain: 'music.amazon.fr' }, 'adn': { domain: 'animationdigitalnetwork.com' },
    'cyber ghost': { domain: 'cyberghostvpn.com' }, 'molotov tv': { domain: 'molotov.tv' }, 'molotov': { domain: 'molotov.tv' },
    'calm': { domain: 'calm.com' }, 'nextory': { domain: 'nextory.com' }, 'mediapart': { domain: 'mediapart.fr' }, 'truecaller': { domain: 'truecaller.com' },
    'ouest france': { domain: 'ouest-france.fr' }, 'bayam': { domain: 'bayam.tv' }, 'sciences et avenir': { domain: 'sciencesetavenir.fr' },
    'benshi': { domain: 'benshi.fr' }, 'simply': { domain: 'hellosimply.com' }
  };
  var PALETTE = ['#FF6363', '#121212', '#FF9292', '#5D5DEC', '#5BCA8D', '#FFCB3F'];

  // ── Formats ──────────────────────────────────────────────────────────────
  var nf0 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf2 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  // L'espace fine insécable (U+202F) du format fr-FR n'est pas dessinée par html2canvas :
  // on la remplace par l'espace insécable classique.
  function fx(s) { return s.replace(/\u202f/g, '\u00a0'); }
  function int(n) { return fx(nf0.format(Math.round(+n || 0))); }
  function dec1(n) { return fx(nf1.format(+n || 0)); }
  function eur0(n) { return int(n) + '\u00a0€'; }
  function eur2(n) { return fx(nf2.format(+n || 0)) + '\u00a0€'; }
  function pct(a, b) { return b > 0 ? fx(nf0.format(Math.round(100 * a / b))) + '\u00a0%' : '–'; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function acc(n, un, plusieurs) { return Math.round(+n || 0) >= 2 ? plusieurs : un; }
  function acc1(x, un, plusieurs) { return Math.round(10 * (+x || 0)) / 10 >= 2 ? plusieurs : un; }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function jour(s) { var m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? { y: +m[1], m: +m[2], d: +m[3] } : null; }
  function jourTxt(s) { var p = jour(s); return p ? (p.d === 1 ? '1er' : p.d) + ' ' + MOIS[p.m - 1] + ' ' + p.y : ''; }
  function moisTxt(ym) { var p = String(ym || '').split('-'); return p.length >= 2 ? MOIS[+p[1] - 1] + ' ' + p[0] : ''; }
  // Un relevé Spliiit est pris le matin : il décrit l'état de la veille.
  function veille(s) { var p = jour(s); return p ? new Date(Date.UTC(p.y, p.m - 1, p.d - 1)).toISOString().slice(0, 10) : ''; }
  function elide(w) { return /^[aeiouyàâéèêîôûh]/i.test(w); }
  function deMot(w, maj) { return (maj ? (elide(w) ? "D'" : 'De ') : (elide(w) ? "d'" : 'de ')) + w; }
  // Nom d'un CSE précédé de « de » / « pour » : « du CSE X », « pour le CSE X », « d'Orange ».
  var ARTICLE = /^(CSE|CE|CSEC|CCE|comité)\b/i;
  function duNom(n) { return ARTICLE.test(n) ? 'du ' + n : deMot(n); }
  function leNom(n) { return ARTICLE.test(n) ? 'le ' + n : n; }
  function aujourdhui() {
    return new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  }
  // Parts en % qui totalisent exactement 100 (méthode du plus fort reste).
  function parts(valeurs) {
    var tot = valeurs.reduce(function (a, b) { return a + b; }, 0);
    if (!(tot > 0)) return valeurs.map(function () { return 0; });
    var brut = valeurs.map(function (v) { return 100 * v / tot; });
    var p = brut.map(Math.floor);
    var reste = 100 - p.reduce(function (a, b) { return a + b; }, 0);
    brut.map(function (b, i) { return [b - Math.floor(b), i]; }).sort(function (a, b) { return b[0] - a[0]; })
      .forEach(function (x) { if (reste > 0) { p[x[1]] += 1; reste -= 1; } });
    return p;
  }

  function premiers(services, max) {
    var out = [];
    for (var i = 0; i < Math.min(max, services.length); i++) {
      var next = services[i + 1];
      if (next && next.n === services[i].n && i + 1 >= max) break;
      out.push(services[i]);
    }
    while (out.length && services[out.length] && services[out.length].n === out[out.length - 1].n) out.pop();
    return out;
  }

  // ── Valeurs mesurées (cse-spliit-report) ────────────────────────────────
  function mesures(r) {
    var u = r.utilisateurs || {}, last = r.dernier_releve || {};
    var cree = String((r.cse && r.cse.created_date) || '').match(/^(\d{4})-(\d{2})/);
    var prix = Object.create(null);
    (r.prix || []).forEach(function (p) {
      prix[p.service] = { public: p.prix_public == null ? null : +p.prix_public, spliiit: p.prix_spliiit == null ? null : +p.prix_spliiit };
    });
    return {
      nom: String((r.cse && r.cse.name) || last.cse_name || 'CSE').trim(),
      membres: +r.membres_superprof || 0,
      adressables: +r.base_adressable || 0,
      beneficiaires: +u.beneficiaires || 0,
      abonnes: +u.actifs || 0,
      debut: cree ? cree[1] + '-' + cree[2] : ((r.mois && r.mois[0] && r.mois[0].mois) || ''),
      contrat: null,
      prix: prix,
      mer: +(r.superprof && r.superprof.mises_en_relation) || 0,
      thematiques: r.superprof && Array.isArray(r.superprof.top_sujets) ? r.superprof.top_sujets.slice(0, 3) : [],
      accesFin: (r.superprof && r.superprof.acces_fin) || '',
      moisDonnees: veille(last.snapshot_date).slice(0, 7)
    };
  }

  // Valeurs enregistrées pour ce CSE depuis la modale (bilan_cse_valeurs) : prioritaires sur les
  // mesures pour pré-remplir. Clé enregistrée -> champ du modèle.
  var CLES = { inscrits_superprof: 'membres', mises_en_relation: 'mer', thematiques: 'thematiques', acces_fin: 'accesFin', contrat: 'contrat', debut: 'debut' };
  function enregistrees(r) {
    var v = r.valeurs || {}, o = {};
    Object.keys(CLES).forEach(function (k) { if (v[k] != null) o[CLES[k]] = v[k]; }); // '' = masqué
    return o;
  }
  function initiales(r) {
    var m = mesures(r), e = enregistrees(r), o = {};
    Object.keys(m).forEach(function (k) { o[k] = m[k]; });
    Object.keys(e).forEach(function (k) { o[k] = e[k]; });
    return o;
  }

  // ── Modèle du document : chiffres de référence (ref) + détail mesuré (rapport) ──
  function calculer(r, ref) {
    var u = r.utilisateurs || {}, last = r.dernier_releve || {};
    var services = (r.services || []).filter(function (s) { return +s.abonnements > 0; })
      .map(function (s) { return { service: s.service, n: +s.abonnements }; })
      .sort(function (a, b) { return b.n - a.n || a.service.localeCompare(b.service, 'fr'); });
    var nSpliiit = services.reduce(function (a, s) { return a + s.n; }, 0);
    var abonnements = +u.abonnements_en_cours || 0;
    // Spliiit compte un abonnement par code activé : un salarié à deux codes est compté deux
    // fois par service. On ramène la valeur aux abonnements réels (jamais au-dessus).
    var facteur = nSpliiit > 0 ? Math.min(1, abonnements / nSpliiit) : 1;
    var infos = Object.create(null);
    (r.prix || []).forEach(function (p) { infos[p.service] = p; });
    // Économie d'un abonnement = son prix public mensuel (offre individuelle équivalente) : ce que
    // le salarié paierait en s'abonnant directement ; l'abonnement est financé par la cagnotte du CSE.
    var lignes = [], sansPrix = [], dates = [];
    services.forEach(function (s) {
      var p = (ref.prix && ref.prix[s.service]) || {};
      var pub = p.public;
      if (pub == null || !(pub >= 0)) { sansPrix.push(s); return; }
      if (infos[s.service] && infos[s.service].releve_le) dates.push(infos[s.service].releve_le);
      lignes.push({ service: s.service, n: s.n, pub: pub, mois: pub * s.n });
    });
    var brutMois = lignes.reduce(function (a, l) { return a + l.mois; }, 0);
    var ecoMois = brutMois * facteur;
    var cagnotteAn = ref.contrat > 0 && ref.abonnes > 0 ? ref.contrat * ref.abonnes : 0;
    var rep = Array.isArray(u.repartition_abonnements) ? u.repartition_abonnements.map(Number) : [0, 0, 0, 0];
    var top = premiers(services, 3).map(function (s) { return s.service; });
    dates.sort();
    return {
      nom: ref.nom, debut: ref.debut, contrat: ref.contrat,
      mer: +ref.mer || 0, accesFin: ref.accesFin || '',
      thematiques: (ref.thematiques || []).filter(function (x) { return String(x || '').trim(); }).slice(0, 3),
      arrete: veille(last.snapshot_date), edition: aujourdhui(),
      prixReleve: dates.length ? dates[dates.length - 1] : '',
      membres: ref.membres, adressables: ref.adressables, beneficiaires: ref.beneficiaires, abonnes: ref.abonnes,
      abonnements: abonnements,
      abosParAbonne: ref.abonnes > 0 ? abonnements / ref.abonnes : 0,
      repAbos: parts([rep[1] || 0, rep[2] || 0, rep[3] || 0]),
      services: services, nSpliiit: nSpliiit, facteur: facteur,
      lignes: lignes, sansPrix: sansPrix,
      nValorises: lignes.reduce(function (a, l) { return a + l.n; }, 0),
      brutMois: brutMois, ecoMois: ecoMois, ecoAn: 12 * ecoMois, cagnotteAn: cagnotteAn,
      parAbonneMois: ref.abonnes > 0 ? ecoMois / ref.abonnes : 0,
      parBenefMois: ref.beneficiaires > 0 ? ecoMois / ref.beneficiaires : 0,
      top: top
    };
  }

  // ── Logos ────────────────────────────────────────────────────────────────
  function sourceLogo(service) {
    var l = LOGOS[String(service).toLowerCase().trim()];
    if (l && l.si) return { type: 'glyph', url: SI + l.si + '.svg', bg: '#' + l.hex, fg: '#' + (l.fg || 'FFFFFF') };
    if (l && l.domain) return { type: 'logo', domain: l.domain };
    return null;
  }
  function couleur(service, i) { var l = LOGOS[String(service).toLowerCase().trim()]; return l && l.hex ? '#' + l.hex : PALETTE[i % PALETTE.length]; }
  function initiale(service) { return String(service).replace(/[^A-Za-zÀ-ÿ0-9]/g, '').charAt(0).toUpperCase() || '•'; }
  function badge(service, i, logos) {
    var lg = logos && logos[service];
    if (lg && lg.type === 'glyph') return '<div class="svc-badge glyph" style="background:' + lg.bg + '"><img src="' + lg.src + '" alt=""></div>';
    if (lg && lg.type === 'logo') return '<div class="svc-badge logo"><img src="' + lg.src + '" alt=""></div>';
    return '<div class="svc-badge ini">' + esc(initiale(service)) + '</div>';
  }
  function logoPodium(service, logos) {
    var lg = logos && logos[service];
    if (lg && lg.type === 'glyph') return '<div class="pd-logo" style="background:' + lg.bg + '"><img class="g" src="' + lg.src + '" alt=""></div>';
    if (lg && lg.type === 'logo') return '<div class="pd-logo"><img src="' + lg.src + '" alt=""></div>';
    return '';
  }
  function spLogo(couleur) {
    var svg = SP_LOGO_SVG.replace(/currentColor/g, couleur).replace(/^<svg/, '<svg width="240" height="48"');
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // ── Styles ───────────────────────────────────────────────────────────────
  function css(a) {
    var f = (a.fonts || []).map(function (x) {
      return '@font-face{font-family:"Buenos Aires";font-weight:' + x.weight + ';font-style:normal;src:url(' + x.src + ') format("opentype")}';
    }).join('');
    if (a.caveat) f += '@font-face{font-family:"Caveat";font-weight:700;font-style:normal;src:url(' + a.caveat + ') format("woff2")}';
    return f + [
      ':root{--coral:#FF6363;--pink:#FF9292;--pink-soft:#FFC8C8;--pink-pale:#FFF1F1;--green:#5BCA8D;--ink:#121212;--ink-soft:#3D3D3D;--muted:#6B6B6B;--line:#EBEBEB;--cream:#F7F7F7;',
      '--sans:"Buenos Aires",Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;--display:"Buenos Aires",Inter,system-ui,sans-serif;--accent:"Caveat","Segoe Script",cursive}',
      '*{box-sizing:border-box;margin:0;padding:0}',
      'body{font-family:var(--sans);color:var(--ink);background:#fff;-webkit-font-smoothing:antialiased}',
      '.page{width:210mm;height:297mm;position:relative;overflow:hidden;background:#fff;padding:17mm 16mm 22mm;display:flex;flex-direction:column}',
      '.page-foot{position:absolute;left:16mm;right:16mm;bottom:9mm;display:flex;align-items:center;justify-content:space-between;font-size:8.5pt;color:var(--muted);border-top:1px solid var(--line);padding-top:3.5mm}',
      '.pf-left{display:flex;align-items:center;gap:8px}.pf-left img{height:9px;width:auto;display:block}',
      '.eyebrow{display:flex;align-items:center;gap:2.4mm;font:700 8.5pt/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--ink)}',
      '.eyebrow i{width:5mm;height:1.6mm;border-radius:1mm;background:var(--coral);display:block}',
      '.h-page{font-family:var(--display);font-weight:800;font-size:26pt;line-height:1.05;letter-spacing:-.025em;margin:3mm 0 2mm}',
      '.h-page em,.cover-title em,.takeaways h3 em{font-family:var(--accent);font-style:normal;font-weight:700;font-size:1.14em;line-height:.9;letter-spacing:0;color:var(--coral)}',
      '.lead{font-size:10.5pt;line-height:1.55;color:var(--ink-soft);max-width:150mm}',
      '.section-title{font-family:var(--display);font-weight:700;font-size:12.5pt;letter-spacing:-.01em;margin-bottom:3mm}',
      '.section-title small{display:block;margin-top:1mm;font:500 8.5pt var(--sans);color:var(--muted);letter-spacing:0}',
      '.muted{color:var(--muted)}',
      /* Couverture */
      '.cover{background:var(--pink-pale);padding:16mm 16mm 18mm}',
      '.blob1{position:absolute;width:150mm;height:150mm;right:-48mm;top:-40mm;border-radius:50%;background:radial-gradient(circle at 35% 35%,var(--pink-soft) 0%,var(--pink) 45%,var(--coral) 78%)}',
      '.blob2{position:absolute;width:90mm;height:90mm;left:-30mm;bottom:34mm;border-radius:50%;background:radial-gradient(circle at 60% 40%,var(--pink-pale) 0%,var(--pink-soft) 70%,rgba(255,146,146,.45) 100%)}',
      '.cover-top{position:relative;display:flex;align-items:center;gap:12px}',
      '.cover-top .ct-logo{height:20px;width:auto;display:block}',
      '.cover-top .ct-x{font:500 14pt var(--display);color:var(--ink-soft)}',
      '.cover-top .ct-spliiit{height:30px;width:30px;border-radius:8px;background:#fff;padding:3px;box-shadow:0 6px 14px -8px rgba(18,18,18,.4)}',
      '.cover-top .ct-spliiit img{width:24px;height:24px;display:block}',
      '.cover-top .ct-name{font:700 12pt var(--display)}',
      '.cover-body{position:relative;margin-top:44mm;max-width:140mm}',
      '.cover-kicker{display:inline-flex;align-items:center;gap:8px;background:#fff;border-radius:999px;padding:6px 12px;font:600 9pt var(--sans);color:var(--ink-soft);box-shadow:0 6px 16px -10px rgba(18,18,18,.35)}',
      '.cover-kicker i{width:7px;height:7px;border-radius:50%;background:var(--green);display:inline-block}',
      '.cover-title{font-family:var(--display);font-weight:900;font-size:46pt;line-height:.98;letter-spacing:-.035em;margin:7mm 0 5mm}',
      '.cover-cse{font:800 17pt/1.15 var(--display);letter-spacing:-.015em}',
      '.cover-period{margin-top:2mm;font-size:11pt;color:var(--ink-soft)}',
      '.cover-hero{position:absolute;left:16mm;right:16mm;bottom:24mm;display:grid;grid-template-columns:1fr 3.2fr;gap:8mm;align-items:stretch}',
      '.cover-hero.solo{grid-template-columns:1fr}',
      '.hg{display:flex;flex-direction:column}',
      '.hg-t{display:flex;align-items:center;gap:2mm;height:7mm;margin-bottom:2.5mm;font:800 11pt/1 var(--display);color:var(--ink)}',
      '.hg-t .hg-sp{height:15px;width:75px;display:block}',
      '.hg-t .hg-ic{height:24px;width:24px;border-radius:7px;background:#fff;padding:3px;box-shadow:0 6px 14px -8px rgba(18,18,18,.4);display:block}',
      '.hg-t .hg-ic img{width:18px;height:18px;display:block}',
      '.hg-cards{flex:1;display:grid;gap:4mm}',
      '.hero-card{background:#fff;border-radius:16px;padding:6mm 5mm 5mm;box-shadow:0 18px 36px -24px rgba(18,18,18,.45)}',
      '.hero-card .hv{font:900 24pt/1 var(--display);letter-spacing:-.03em;white-space:nowrap}',
      '.hero-card .hv small{font-size:13pt;font-weight:800}',
      '.hero-card .hl{margin-top:2.5mm;font-size:9pt;line-height:1.4;color:var(--ink-soft)}',
      '.hero-card .hbar{height:4px;width:26px;border-radius:4px;margin-bottom:4mm}',
      '.cover-edition{position:absolute;left:16mm;right:16mm;bottom:11mm;display:flex;justify-content:space-between;font-size:8.5pt;color:var(--muted)}',
      /* Chiffres clés */
      '.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin-top:7mm}',
      '.kpis.k5{grid-template-columns:repeat(6,1fr)}',
      '.kpis.k5 .kpi{grid-column:span 2}',
      '.kpis.k5 .kpi:nth-child(n+4){grid-column:span 3}',
      '.kpi{border-radius:14px;padding:5mm 5mm 4.5mm;background:var(--cream);border:1px solid var(--line);display:flex;flex-direction:column;min-height:34mm}',
      '.kpi.accent{background:var(--coral);border-color:var(--coral)}',
      '.kpi.accent .kl,.kpi.accent .ks{color:#2B2B2B}',
      '.kpi .kv{font:900 23pt/1 var(--display);letter-spacing:-.03em}',
      '.kpi .kv small{font-size:12pt;font-weight:800;margin-left:1px}',
      '.kpi .kl{margin-top:2.5mm;font:600 9pt/1.3 var(--sans)}',
      '.kpi .ks{margin-top:auto;padding-top:2mm;font-size:8pt;line-height:1.35;color:var(--muted)}',
      '.takeaways{margin-top:8mm;background:var(--ink);color:#fff;border-radius:18px;padding:7mm 7mm 6mm;position:relative;overflow:hidden}',
      '.takeaways .glow{position:absolute;right:-18mm;top:-18mm;width:55mm;height:55mm;border-radius:50%;background:radial-gradient(circle,rgba(255,99,99,.5),rgba(255,99,99,0) 70%)}',
      '.takeaways h3{position:relative;font:800 13pt var(--display);letter-spacing:-.01em;margin-bottom:4mm}',
      '.takeaways h3 em{color:var(--pink)}',
      '.takeaways ol{position:relative;list-style:none;display:grid;gap:3.2mm}',
      '.takeaways li{display:grid;grid-template-columns:8mm 1fr;align-items:start;font-size:10pt;line-height:1.5;color:#EDEDED}',
      '.takeaways .tn{font:800 9pt/6mm var(--display);width:6mm;height:6mm;border-radius:50%;background:var(--coral);color:var(--ink);text-align:center;margin-top:.3mm}',
      '.takeaways b{color:#fff;font-weight:700}',
      /* Entonnoir */
      '.funnel{display:grid;gap:3.2mm}',
      '.fn-row{display:grid;grid-template-columns:46mm 1fr 24mm;align-items:center;gap:4mm}',
      '.fn-label{font-size:9.5pt;font-weight:600;line-height:1.3}',
      '.fn-label small{display:block;font-weight:400;font-size:7.8pt;color:var(--muted)}',
      '.fn-track{height:11mm;background:var(--cream);border-radius:10px;overflow:hidden}',
      '.fn-fill{height:100%;border-radius:10px;display:flex;align-items:center;justify-content:flex-end;padding-right:3mm;font:800 10.5pt var(--display)}',
      '.fn-pct{text-align:right;font:800 13pt var(--display);letter-spacing:-.02em}',
      '.fn-pct small{display:block;font:500 7.5pt var(--sans);color:var(--muted);letter-spacing:0}',
      '.two{display:grid;grid-template-columns:1.25fr 1fr;gap:6mm}',
      '.panel{border:1px solid var(--line);border-radius:16px;padding:5.5mm;background:#fff}',
      '.panel.cream{background:var(--cream)}',
      '.block{margin-top:8mm}',
      '.hbars{display:grid;gap:3.4mm;margin-top:2mm}',
      '.hb{display:grid;grid-template-columns:28mm 1fr 14mm;align-items:center;gap:3mm;font-size:9.5pt}',
      '.hb-track{height:7mm;background:var(--cream);border-radius:6px;overflow:hidden}',
      '.hb-fill{height:100%;border-radius:6px;background:linear-gradient(90deg,var(--pink),var(--coral))}',
      '.hb-v{text-align:right;font:800 10.5pt var(--display)}',
      '.big{font:900 40pt/1 var(--display);letter-spacing:-.035em}',
      '.big-l{margin-top:2.5mm;font-size:10pt;line-height:1.45;color:var(--ink-soft)}',
      /* Valeur au prix public */
      '.money-hero{display:grid;grid-template-columns:1.15fr 1fr;gap:6mm;margin-top:6mm}',
      '.mh-main{border-radius:18px;padding:6mm 6mm;background:var(--coral);position:relative;overflow:hidden}',
      '.mh-main .mv{position:relative;font:900 34pt/1 var(--display);letter-spacing:-.035em}',
      '.mh-main .mv small{font-size:14pt;font-weight:800}',
      '.mh-main .ml{position:relative;margin-top:3mm;font-size:10pt;line-height:1.45;color:#242424;max-width:80mm}',
      '.mh-side{display:grid;gap:4mm}',
      '.mh-mini{border-radius:14px;background:var(--cream);border:1px solid var(--line);padding:4mm 5mm}',
      '.mh-mini .mv{font:900 16pt/1 var(--display);letter-spacing:-.02em}',
      '.mh-mini .ml{margin-top:1.6mm;font-size:8.6pt;color:var(--ink-soft);line-height:1.35}',
      '.vt-wrap{display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin-top:6mm}',
      'table.vt{width:100%;border-collapse:collapse;font-size:7.3pt}',
      'table.vt b{font-weight:800}',
      '.kpi.eco{background:#EAF8F0;border-color:#CDEFDB}',
      'table.vt th{text-align:right;font:700 6pt/1.2 var(--sans);letter-spacing:.03em;text-transform:uppercase;color:var(--muted);padding:0 .9mm 1.6mm;border-bottom:1.2px solid var(--ink);vertical-align:bottom}',
      'table.vt th:first-child,table.vt td:first-child{text-align:left;padding-left:0}',
      'table.vt td{text-align:right;padding:.95mm .9mm;border-bottom:1px solid var(--line);white-space:nowrap}',
      'table.vt td:first-child{font-weight:600;max-width:24mm;overflow:hidden;text-overflow:ellipsis}',
      'table.vt td.calc{color:var(--muted)}',
      '.vt-total{margin-top:4mm;display:grid;gap:1.8mm}',
      '.vt-row{display:grid;grid-template-columns:1fr 38mm 38mm;gap:3mm;align-items:baseline;font-size:9pt}',
      '.vt-row span{white-space:nowrap}','.vt-row span:first-child{white-space:normal}',
      '.vt-row span:nth-child(n+2){text-align:right}',
      '.vt-row.main{padding-top:2mm;border-top:1.5px solid var(--ink);font:800 10.5pt var(--display)}',
      '.vt-row.sub{color:var(--muted);font-size:8.4pt}',
      '.note{margin-top:3mm;font-size:8pt;line-height:1.45;color:var(--muted)}',
      '.access{display:inline-flex;align-items:center;gap:2.5mm;align-self:flex-start;margin-top:1mm;background:var(--pink-pale);border:1px solid var(--pink-soft);border-radius:999px;padding:2mm 4.5mm;font:700 10pt var(--sans)}',
      '.access i{width:2.4mm;height:2.4mm;border-radius:50%;background:var(--green);display:block}',
      '.ecx{margin-top:14mm;display:grid}',
      '.ecx-bloc{padding:10mm 0 13mm;border-top:1.5px solid var(--ink)}',
      '.ecx-bloc.sec{border-top:1px solid var(--line)}',
      '.ecx-t{font:700 8.5pt/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--ink)}',
      '.ecx-row{display:grid;grid-template-columns:1fr 1.5px 1fr;gap:9mm;margin-top:8mm;align-items:stretch}',
      '.ecx-sep{background:var(--line)}',
      '.ecx-v{font:900 64pt/.9 var(--display);letter-spacing:-.045em;white-space:nowrap;color:var(--coral)}',
      '.ecx-v.ink{color:var(--ink)}',
      '.ecx-v small{font-size:22pt;font-weight:800;letter-spacing:-.01em}',
      '.ecx-bloc.sec .ecx-v{font-size:54pt}',
      '.ecx-bloc.sec .ecx-v small{font-size:18pt}',
      '.ecx-l{margin-top:3mm;font:700 12pt/1.2 var(--display);letter-spacing:-.01em;color:var(--ink-soft)}',
      '.ecx-s{margin-top:8mm;font-size:10pt;line-height:1.5;color:var(--ink-soft)}',
      '.ecx-note{margin-top:auto;margin-bottom:6mm}',
      '.eco-chiffres{display:grid;grid-template-columns:1.1fr 1.5mm 1fr;gap:7mm;margin-top:6mm;align-items:start}',
      '.eco-chiffres .sp-v{font-size:52pt;white-space:nowrap}',
      '.eco-chiffres .sp-u{font-size:15pt}',
      '.eco-chiffres .sp-l{margin-top:2mm}',
      '.sp-u{font-size:18pt;font-weight:800;letter-spacing:-.01em}',
      '.eco-droite{display:grid;gap:4mm}',
      '.eco-v{font:900 26pt/1 var(--display);letter-spacing:-.03em}',
      '.cmp{display:grid;grid-template-columns:23mm 1fr 15mm;align-items:center;gap:1.6mm 2.5mm;margin-top:2.5mm;font-size:8.6pt;color:var(--ink-soft)}',
      '.cmp b{text-align:right;color:var(--ink);font-weight:800}',
      '.cmp-t{height:2.6mm;border-radius:999px;background:var(--cream);overflow:hidden}',
      '.cmp-t i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--pink),var(--coral))}',
      '.cmp-t i.pub{background:#D9D9D9}',
      '.sp-chiffres{display:grid;grid-template-columns:1fr 1.5mm 1fr;gap:8mm;margin-top:20mm;align-items:start}',
      '.sp-sep{width:1.5px;align-self:stretch;background:var(--line)}',
      '.sp-v{font:900 72pt/.9 var(--display);letter-spacing:-.045em;color:var(--coral)}',
      '.sp-v.ink{color:var(--ink)}',
      '.sp-l{margin-top:3mm;font:700 12.5pt/1.3 var(--display);letter-spacing:-.01em}',
      '.sp-s{margin-top:2.5mm;font-size:9.5pt;line-height:1.5;color:var(--ink-soft)}',
      '.sp-bar{margin-top:5mm;height:3mm;border-radius:999px;background:var(--pink-pale);overflow:hidden}',
      '.sp-bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--pink),var(--coral))}',
      '.section-title em.acc{font-family:var(--accent);font-style:normal;font-weight:700;font-size:1.2em;color:var(--coral)}',
      '.th-grid{display:grid;gap:4mm;margin-top:2mm}',
      '.th-card{position:relative;border-radius:16px;background:var(--cream);padding:7mm 5mm 6mm;min-height:78mm;overflow:hidden}',
      '.th-rang{position:absolute;right:4mm;top:1mm;font:900 64pt/1 var(--display);color:var(--pink-soft);letter-spacing:-.04em}',
      '.th-nom{position:relative;font:800 17pt/1.15 var(--display);letter-spacing:-.015em;margin-top:20mm}',
      '.th-tags{position:relative;display:flex;flex-wrap:wrap;gap:1.6mm;margin-top:4mm}',
      '.tag{display:inline-block;font-size:8.6pt;font-weight:600;background:#fff;border:1px solid var(--line);border-radius:999px;padding:1.2mm 2.8mm}',
      '.offre{margin-top:7mm;border-radius:18px;border:1.5px solid var(--line);padding:6mm;background:var(--cream)}',
      '.offre.sp{border-color:var(--coral);background:#fff}',
      '.offre-h{display:flex;align-items:center;gap:3mm;margin-bottom:5mm}',
      '.offre-h img{height:16px;width:auto;display:block}',
      '.offre-h .t{font:800 14pt var(--display)}',
      '.offre-h .s{font-size:9pt;color:var(--muted);font-weight:600}',
      '.duo{display:grid;grid-template-columns:1fr 1fr;gap:4mm}',
      '.duo .kpi{min-height:28mm}',
      '.offre .kpi{background:#fff}.offre .kpi.accent{background:var(--coral)}.offre .kpi.eco{background:#EAF8F0}',
      '.themes{margin-top:6mm}',
      '.themes h4{font:700 11pt var(--display);margin-bottom:2mm}',
      '.theme{display:grid;grid-template-columns:9mm 1fr;align-items:center;gap:2mm;padding:2.8mm 0;border-top:1px solid var(--line);font-size:10.5pt;line-height:1.4}',
      '.theme .tn{font:800 9pt/6.5mm var(--display);width:6.5mm;height:6.5mm;border-radius:50%;background:var(--pink-pale);border:1px solid var(--pink-soft);text-align:center}',
      '.theme b{font-weight:800}',
      '.contract{margin-top:5mm;display:flex;align-items:center;gap:4mm;border:1.5px dashed var(--pink);border-radius:14px;padding:3.5mm 5mm;background:var(--pink-pale);font-size:9.5pt;line-height:1.45}',
      '.contract .cv{font:900 17pt/1 var(--display);white-space:nowrap}',
      /* Services */
      '.podium{display:grid;gap:4mm;margin-top:7mm}',
      '.pd{border-radius:16px;padding:5mm;min-height:30mm;display:flex;flex-direction:column;justify-content:space-between}',
      '.pd-rank{font:800 8.5pt var(--sans);letter-spacing:.12em;text-transform:uppercase}',
      '.pd-name{font:900 16pt/1.05 var(--display);letter-spacing:-.02em}',
      '.pd-v{font-size:9pt}',
      '.pd-logo{width:12mm;height:12mm;border-radius:10px;background:#fff;margin-bottom:3mm;position:relative;overflow:hidden}',
      '.pd-logo img{position:absolute;left:15%;top:15%;width:70%;height:70%}',
      '.pd-logo img.g{left:21%;top:21%;width:58%;height:58%}',
      '.services{display:grid;grid-template-columns:1fr 1fr;gap:2.4mm 8mm;margin-top:5mm}',
      '.svc{display:grid;grid-template-columns:8mm 1fr 12mm;align-items:center;gap:3mm}',
      '.svc-badge{width:8mm;height:8mm;border-radius:9px;position:relative;overflow:hidden;font:800 9pt/8mm var(--display);text-align:center;color:var(--ink)}',
      '.svc-badge.ini{background:var(--pink-pale);border:1px solid var(--pink-soft);line-height:7.6mm}',
      '.svc-badge.logo{background:#fff;border:1px solid var(--line)}',
      '.svc-badge img{position:absolute;left:14%;top:14%;width:72%;height:72%}',
      '.svc-badge.glyph img{left:19%;top:19%;width:62%;height:62%}',
      '.svc-name{font-size:9.2pt;font-weight:600;display:flex;flex-direction:column;gap:1.2mm;min-width:0}',
      '.svc-name span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.svc-track{height:2.2mm;border-radius:3px;background:var(--cream);overflow:hidden}',
      '.svc-fill{height:100%;border-radius:3px}',
      '.svc-v{text-align:right;font:800 11pt var(--display)}',
      /* Méthode */
      '.method{display:grid;gap:3.2mm;margin-top:6mm;font-size:9pt;line-height:1.5;color:var(--ink-soft)}',
      '.method dt{font:700 9.5pt var(--display);color:var(--ink)}',
      '.method dd{margin:.6mm 0 1.6mm}',
      '.note-box{margin-top:6mm;border-radius:14px;background:var(--cream);border:1px solid var(--line);padding:4.5mm 5mm;font-size:8.8pt;line-height:1.5;color:var(--ink-soft)}'
    ].join('');
  }

  // ── Pages ────────────────────────────────────────────────────────────────
  function sourcil(t) { return '<div class="eyebrow"><i></i>' + t + '</div>'; }
  function pied(n, m, a) {
    return '<div class="page-foot"><div class="pf-left"><img src="' + a.spLogo + '" alt="Superprof"><span>Bilan du partenariat · ' + esc(m.nom) + '</span></div><span class="num">' + n + ' / __TOTAL__</span></div>';
  }
  function periode(m) {
    var debut = moisTxt(m.debut), fin = moisTxt(m.arrete.slice(0, 7));
    if (!debut) return cap(fin);
    return debut === fin ? cap(fin) : deMot(debut, true) + ' à ' + fin;
  }

  function carte(couleur, v, l) {
    return '<div class="hero-card"><div class="hbar" style="background:' + couleur + '"></div><div class="hv num">' + v + '</div><div class="hl">' + l + '</div></div>';
  }
  function couvChiffres(m, a) {
    var sp = m.membres > 0 ? carte('#FF6363', int(m.membres),
      acc(m.membres, 'utilisateur inscrit', 'utilisateurs inscrits') + ' sur Superprof' + (m.mer > 0 ? ', ' + int(m.mer) + ' ' + acc(m.mer, 'mise en relation', 'mises en relation') + ' avec un professeur' : '')) : '';
    var sl = [
      carte('#121212', int(m.beneficiaires), acc(m.beneficiaires, 'salarié a activé sa', 'salariés ont activé leur') + ' cagnotte Spliiit'),
      carte('#121212', int(m.abonnements), acc(m.abonnements, 'abonnement en cours', 'abonnements en cours') + ', chez ' + int(m.abonnes) + ' ' + acc(m.abonnes, 'abonné', 'abonnés')),
      m.lignes.length
        ? carte('#5BCA8D', int(m.ecoMois) + '<small> €</small>', 'économisés chaque mois par vos salariés')
        : carte('#5BCA8D', int(m.services.length), acc(m.services.length, 'service souscrit', 'services différents souscrits'))
    ];
    var groupe = function (cls, titre, cartes, n) {
      return '<div class="hg ' + cls + '"><div class="hg-t">' + titre + '</div><div class="hg-cards" style="grid-template-columns:repeat(' + n + ',1fr)">' + cartes + '</div></div>';
    };
    return '<div class="cover-hero' + (sp ? '' : ' solo') + '">' +
      (sp ? groupe('sp', '<img class="hg-sp" src="' + a.spLogo + '" alt="Superprof">', sp, 1) : '') +
      groupe('sl', (a.spliiit ? '<span class="hg-ic"><img src="' + a.spliiit + '" alt=""></span>' : '') + '<span>Spliiit</span>', sl.join(''), 3) +
      '</div>';
  }
  function pCouverture(m, a) {
    return '<section class="page cover"><div class="blob1"></div><div class="blob2"></div>' +
      '<div class="cover-top"><img class="ct-logo" src="' + a.spLogo + '" alt="Superprof"><span class="ct-x">×</span>' +
      (a.spliiit ? '<div class="ct-spliiit"><img src="' + a.spliiit + '" alt=""></div>' : '') + '<span class="ct-name">Spliiit</span></div>' +
      '<div class="cover-body"><span class="cover-kicker"><i></i>Bilan du partenariat Superprof × Spliiit</span>' +
      '<h1 class="cover-title">La cagnotte <em>abonnements</em> de vos salariés</h1>' +
      '<div class="cover-cse">' + esc(m.nom) + '</div><div class="cover-period">' + esc(periode(m)) + '</div></div>' +
      couvChiffres(m, a) +
      '<div class="cover-edition"><span>Données Spliiit au ' + esc(jourTxt(m.arrete)) + '</span><span>Édité le ' + esc(jourTxt(m.edition)) + '</span></div>' +
      '</section>';
  }

  // Page Superprof (cours particuliers) : inscrits rapportés aux salariés adressables, mises en
  // relation, top 3 des thématiques. Volontairement sans chiffre Spliiit (pages suivantes).
  function pSuperprof(m, a, n) {
    var part = m.adressables > 0 ? Math.min(100, 100 * m.membres / m.adressables) : 0;
    var themes = m.thematiques.map(function (x, i) {
      var p = String(x).split(/\s+-\s+/);
      var tete = p.shift(), suite = p.join(' - ');
      var tags = suite ? suite.split(/\s*,\s*/).filter(Boolean).map(function (s) { return '<span class="tag">' + esc(s) + '</span>'; }).join('') : '';
      return '<div class="th-card"><span class="th-rang">' + (i + 1) + '</span><div class="th-nom">' + esc(tete) + '</div>' + (tags ? '<div class="th-tags">' + tags + '</div>' : '') + '</div>';
    }).join('');
    return '<section class="page">' + sourcil('Superprof · Cours particuliers') +
      '<h2 class="h-page">Superprof pour vos <em>salariés</em></h2>' +
      (jour(m.accesFin) ? '<div class="access"><i></i>Accès Superprof + Spliiit jusqu\'au ' + esc(jourTxt(m.accesFin)) + '</div>' : '') +
      '<div class="sp-chiffres">' +
        '<div class="sp-chiffre"><div class="sp-v num">' + int(m.membres) + '</div><div class="sp-l">' + acc(m.membres, 'utilisateur inscrit', 'utilisateurs inscrits') + ' sur Superprof</div>' +
          (m.adressables > 0 ? '<div class="sp-bar"><i style="width:' + part.toFixed(1) + '%"></i></div><div class="sp-s">' + pct(m.membres, m.adressables) + ' des ' + int(m.adressables) + ' salariés adressables</div>' : '') +
        '</div>' +
        '<div class="sp-sep"></div>' +
        '<div class="sp-chiffre"><div class="sp-v num ink">' + int(m.mer) + '</div><div class="sp-l">' + acc(m.mer, 'mise en relation', 'mises en relation') + ' avec un professeur</div>' +
          '<div class="sp-s">Demandes de cours envoyées par vos salariés à un professeur Superprof depuis le début du partenariat.</div>' +
        '</div>' +
      '</div>' +
      (themes ? '<div class="section-title" style="margin-top:22mm">Top ' + m.thematiques.length + ' des thématiques <em class="acc">demandées</em></div><div class="th-grid" style="grid-template-columns:repeat(' + m.thematiques.length + ',1fr)">' + themes + '</div>' : '') +
      pied(n, m, a) + '</section>';
  }

  function kpi(v, l, s, accent, eco) {
    return '<div class="kpi' + (accent ? ' accent' : '') + (eco ? ' eco' : '') + '"><div class="kv num">' + v + '</div><div class="kl">' + l + '</div><div class="ks">' + s + '</div></div>';
  }
  function pEssentiel(m, a, n) {
    var top = m.top.length >= 3 ? m.top[0] + ', ' + m.top[1] + ' et ' + m.top[2] : m.top.join(' et ');
    var items = [
      m.adressables > 0 ? '<b>' + int(m.membres) + ' ' + acc(m.membres, 'salarié', 'salariés') + ' sur ' + int(m.adressables) + '</b> adressables ' + acc(m.membres, 'est membre', 'sont membres') + ' Superprof, soit <b>' + pct(m.membres, m.adressables) + '</b>.' : null,
      '<b>' + int(m.beneficiaires) + ' ' + acc(m.beneficiaires, 'membre', 'membres') + '</b> ' + acc(m.beneficiaires, 'a activé sa', 'ont activé leur') + ' cagnotte Spliiit, soit <b>' + pct(m.beneficiaires, m.membres) + '</b> des membres, et <b>' + int(m.abonnes) + '</b> ' + acc(m.abonnes, 'a', 'ont') + ' un abonnement en cours.',
      m.ecoMois > 0 ? 'Grâce à la cagnotte du CSE' + (m.contrat > 0 ? ' (' + montant(m.contrat) + ' par abonné et par an)' : '') + ', vos salariés économisent <b>' + eur0(m.ecoMois) + ' par mois</b> au prix public, soit <b>' + eur0(m.ecoAn) + ' sur un an</b> et <b>' + eur2(m.parAbonneMois) + '</b> par abonné et par mois.' : null,
      m.abonnes > 0 ? '<b>' + dec1(m.abosParAbonne) + ' ' + acc1(m.abosParAbonne, 'abonnement en cours', 'abonnements en cours') + '</b> en moyenne par abonné' + (top ? ', ' + esc(top) + ' en tête' : '') + '.' : null
    ].filter(Boolean);
    return '<section class="page">' + sourcil("Spliiit · L'essentiel") +
      '<h2 class="h-page">Une cagnotte <em>adoptée</em> par vos salariés</h2>' +
      '<p class="lead">Chiffres clés du partenariat Spliiit ' + esc(duNom(m.nom)) + ". Spliiit permet aux salariés de s'abonner à leurs services préférés (streaming, musique, sport, langues) en utilisant la cagnotte offerte par le CSE.</p>" +
      '<div class="kpis k5">' +
        kpi(int(m.beneficiaires), acc(m.beneficiaires, 'bénéficiaire', 'bénéficiaires') + ' Spliiit', pct(m.beneficiaires, m.membres) + ' des membres ont activé leur cagnotte', true) +
        kpi(int(m.abonnements), acc(m.abonnements, 'abonnement en cours', 'abonnements en cours'), 'chez ' + int(m.abonnes) + ' ' + acc(m.abonnes, 'abonné', 'abonnés')) +
        kpi(dec1(m.abosParAbonne), acc1(m.abosParAbonne, 'abonnement en cours', 'abonnements en cours') + ' par abonné', 'en moyenne') +
        (m.lignes.length ? kpi(fx(nf2.format(m.parAbonneMois)) + '<small>€</small>', 'économisés par abonné et par mois', 'au prix public, soit ' + eur0(12 * m.parAbonneMois) + ' sur un an', false, true)
          : kpi(int(m.abonnes), acc(m.abonnes, 'abonné en cours', 'abonnés en cours'), pct(m.abonnes, m.beneficiaires) + ' des bénéficiaires')) +
        kpi(int(m.services.length), acc(m.services.length, 'service', 'services différents'), 'souscrits par les bénéficiaires') +
      '</div>' +
      '<div class="takeaways"><div class="glow"></div><h3>Ce qu\'il faut <em>retenir</em></h3><ol>' +
        items.map(function (t, i) { return '<li><span class="tn">' + (i + 1) + '</span><span>' + t + '</span></li>'; }).join('') +
      '</ol></div>' + pied(n, m, a) + '</section>';
  }

  function pEngagement(m, a, n) {
    var base = Math.max(1, m.membres);
    var lignes = [
      { l: 'Membres Superprof', s: "compte activé dans l'espace CSE", v: m.membres, bg: '#121212', fg: '#fff', p: '100 %', ps: 'base' },
      { l: 'Bénéficiaires', s: 'cagnotte Spliiit activée', v: m.beneficiaires, bg: '#FF6363', fg: '#121212', p: pct(m.beneficiaires, m.membres), ps: 'des membres' },
      { l: 'Abonnés en cours', s: 'au moins un abonnement actif', v: m.abonnes, bg: '#FF9292', fg: '#121212', p: pct(m.abonnes, m.beneficiaires), ps: 'des bénéficiaires' }
    ].map(function (r) {
      var w = Math.min(100, Math.max(6, 100 * r.v / base)).toFixed(1);
      return '<div class="fn-row"><div class="fn-label">' + r.l + '<small>' + r.s + '</small></div>' +
        '<div class="fn-track"><div class="fn-fill" style="width:' + w + '%;background:' + r.bg + ';color:' + r.fg + '">' + int(r.v) + '</div></div>' +
        '<div class="fn-pct num">' + r.p + '<small>' + r.ps + '</small></div></div>';
    }).join('');
    var libelles = ['1 abonnement', '2 abonnements', '3 ou plus'];
    var max = Math.max(1, Math.max.apply(null, m.repAbos));
    var barres = m.repAbos.map(function (p, i) {
      return '<div class="hb"><span>' + libelles[i] + '</span><div class="hb-track"><div class="hb-fill" style="width:' + (100 * p / max).toFixed(1) + '%"></div></div><span class="hb-v num">' + p + ' %</span></div>';
    }).join('');
    return '<section class="page">' + sourcil('Spliiit · Engagement') +
      '<h2 class="h-page">De l\'inscription à l\'<em>abonnement</em></h2>' +
      '<p class="lead">Des membres Superprof aux bénéficiaires de la cagnotte, puis aux salariés qui ont un abonnement en cours.</p>' +
      '<div class="block"><div class="funnel">' + lignes + '</div></div>' +
      '<div class="two block">' +
        '<div class="panel"><div class="section-title">Abonnements en cours par abonné<small>part des abonnés</small></div><div class="hbars">' + barres + '</div></div>' +
        '<div class="panel cream"><div class="big num">' + dec1(m.abosParAbonne) + '</div><div class="big-l">' + acc1(m.abosParAbonne, 'abonnement en cours', 'abonnements en cours') + ' en moyenne par abonné : <b>' + int(m.abonnements) + '</b> ' + acc(m.abonnements, 'abonnement', 'abonnements') + ' pour <b>' + int(m.abonnes) + '</b> ' + acc(m.abonnes, 'abonné', 'abonnés') + '.</div></div>' +
      '</div>' + pied(n, m, a) + '</section>';
  }

  function e2(n) { return fx(nf2.format(+n || 0)); }
  function e0(n) { return fx(nf0.format(Math.round(+n || 0))); }
  function montant(v) { return Number.isInteger(+v) ? eur0(v) : eur2(v); }
  function pEconomies(m, a, n) {
    if (!m.lignes.length) {
      return '<section class="page">' + sourcil('Spliiit · Économies des salariés') + '<h2 class="h-page">Ce que vos salariés <em>économisent</em></h2>' +
        '<p class="lead">Aucun prix public n\'est encore relevé pour les services souscrits : les économies ne sont pas calculées dans ce bilan.</p>' + pied(n, m, a) + '</section>';
    }
    var corrige = m.facteur < 1, doublons = m.nSpliiit - m.abonnements;
    var cagn = m.contrat > 0;
    var deux = function (v1, l1, v2, l2, cls) {
      return '<div class="ecx-row' + (cls ? ' ' + cls : '') + '"><div><div class="ecx-v num">' + v1 + '<small> €</small></div><div class="ecx-l">' + l1 + '</div></div>' +
        '<div class="ecx-sep"></div><div><div class="ecx-v ink num">' + v2 + '<small> €</small></div><div class="ecx-l">' + l2 + '</div></div></div>';
    };
    var notes = [];
    notes.push('Prix public : offre individuelle mensuelle équivalente, en France, TTC' + (m.prixReleve ? ', relevés le ' + esc(jourTxt(m.prixReleve)) : '') + '. Sur un an = mensuel × 12, à abonnements constants.');
    if (corrige) notes.push(int(doublons) + ' ' + acc(doublons, 'abonnement compté', 'abonnements comptés') + ' deux fois par Spliiit (salariés à deux codes) : total corrigé en proportion (× ' + int(m.abonnements) + '/' + int(m.nSpliiit) + ').');
    if (m.sansPrix.length) notes.push('Sans prix public relevé, non comptés : ' + m.sansPrix.map(function (s) { return esc(s.service) + ' (' + s.n + ')'; }).join(', ') + '.');
    if (cagn && m.cagnotteAn > 0) notes.push('Cagnotte du CSE : ' + montant(m.contrat) + ' × ' + int(m.abonnes) + ' ' + acc(m.abonnes, 'abonné', 'abonnés') + ' = ' + eur0(m.cagnotteAn) + ' par an.');
    var nf = function (v) { return fx(nf0.format(Math.round(v))); };
    return '<section class="page">' + sourcil('Spliiit · Économies des salariés') +
      '<h2 class="h-page">Ce que vos salariés <em>économisent</em></h2>' +
      '<p class="lead">Le prix public de leurs abonnements en cours' + (cagn ? ', qu\'ils économisent grâce à la cagnotte du CSE (' + montant(m.contrat) + ' par abonné et par an) utilisée sur Spliiit.' : ', tel qu\'ils le paieraient en s\'abonnant directement à chaque service.') + '</p>' +
      '<div class="ecx">' +
        '<div class="ecx-bloc"><div class="ecx-t">Économies de vos salariés</div>' +
          deux(nf(m.ecoMois), 'par mois', nf(m.ecoAn), 'sur un an') +
          '<div class="ecx-s">Au prix public de leurs <b>' + int(m.abonnements) + ' abonnements en cours</b>, dans ' + int(m.lignes.length) + ' ' + acc(m.lignes.length, 'service', 'services') + '.</div></div>' +
        (m.abonnes > 0 ? '<div class="ecx-bloc sec"><div class="ecx-t">Par abonné</div>' +
          deux(fx(nf2.format(m.parAbonneMois)), 'par mois', nf(12 * m.parAbonneMois), 'sur un an') +
          '<div class="ecx-s">En moyenne pour chacun des <b>' + int(m.abonnes) + ' ' + acc(m.abonnes, 'abonné', 'abonnés') + '</b>' + (m.abosParAbonne > 0 ? ', avec ' + dec1(m.abosParAbonne) + ' ' + acc1(m.abosParAbonne, 'abonnement en cours', 'abonnements en cours') + ' chacun' : '') + '.</div></div>' : '') +
      '</div>' +
      '<p class="note ecx-note">' + notes.join(' ') + '</p>' + pied(n, m, a) + '</section>';
  }

  function pServices(m, a, n) {
    var tot = m.nSpliiit;
    if (!m.services.length) {
      return '<section class="page">' + sourcil('Spliiit · Services souscrits') + '<h2 class="h-page">Les <em>abonnements</em> de vos salariés</h2>' +
        '<p class="lead">Aucun abonnement en cours n\'est enregistré par Spliiit au ' + esc(jourTxt(m.arrete)) + '.</p>' + pied(n, m, a) + '</section>';
    }
    var liste = m.services.slice(0, 20), reste = m.services.slice(20);
    var max = Math.max(1, liste[0].n);
    var couleurs = [{ bg: '#FF6363', fg: '#121212' }, { bg: '#FFC8C8', fg: '#121212' }, { bg: '#121212', fg: '#fff' }];
    var pod = premiers(m.services, 3);
    var rang = function (s) { return 1 + m.services.filter(function (o) { return o.n > s.n; }).length; };
    var exaequo = function (s) { return m.services.filter(function (o) { return o.n === s.n; }).length > 1; };
    var podium = pod.map(function (s, i) {
      var r = rang(s);
      return '<div class="pd" style="background:' + couleurs[i].bg + ';color:' + couleurs[i].fg + '">' + logoPodium(s.service, a.logos) +
        '<span class="pd-rank">' + r + (r === 1 ? 'er' : 'e') + ' service' + (exaequo(s) ? ' ex aequo' : '') + '</span>' +
        '<div><div class="pd-name">' + esc(s.service) + '</div><div class="pd-v num">' + int(s.n) + ' ' + acc(s.n, 'abonnement', 'abonnements') + ' · ' + pct(s.n, tot) + '</div></div></div>';
    }).join('');
    var items = liste.map(function (s, i) {
      return '<div class="svc">' + badge(s.service, i, a.logos) +
        '<div class="svc-name"><span>' + esc(s.service) + '</span><div class="svc-track"><div class="svc-fill" style="width:' + (100 * s.n / max).toFixed(1) + '%;background:' + couleur(s.service, i) + '"></div></div></div>' +
        '<div class="svc-v num">' + int(s.n) + '</div></div>';
    }).join('');
    return '<section class="page">' + sourcil('Spliiit · Services souscrits') +
      '<h2 class="h-page">Les <em>abonnements</em> préférés de vos salariés</h2>' +
      '<p class="lead">' + int(m.services.length) + ' ' + acc(m.services.length, 'service souscrit', 'services différents souscrits') + ' par les bénéficiaires, au ' + esc(jourTxt(m.arrete)) + '. Nombre d\'abonnements en cours par service.</p>' +
      (podium ? '<div class="podium" style="grid-template-columns:repeat(' + pod.length + ',1fr)">' + podium + '</div>' : '') +
      '<div class="services">' + items + '</div>' +
      (reste.length ? '<p class="muted" style="font-size:8.5pt;margin-top:4mm">Et ' + int(reste.length) + ' ' + acc(reste.length, 'autre service', 'autres services') + ' : ' + esc(reste.map(function (s) { return s.service; }).join(', ')) + '.</p>' : '') +
      pied(n, m, a) + '</section>';
  }

  function pMethode(m, a, n) {
    return '<section class="page">' + sourcil('Sources et méthode') +
      '<h2 class="h-page">Comment lire ce <em>bilan</em></h2><dl class="method">' +
      '<dt>Sources des données</dt><dd>Relevés quotidiens transmis par Spliiit à Superprof, pris chaque matin : un relevé décrit l\'état de la veille au soir. Données Spliiit arrêtées au ' + esc(jourTxt(m.arrete)) + '. Chiffres Superprof à la date d\'édition.</dd>' +
      '<dt>Utilisateurs inscrits (membres Superprof)</dt><dd>Salariés ayant activé leur compte Superprof dans l\'espace du CSE' + (m.adressables > 0 ? ', rapportés aux ' + int(m.adressables) + ' salariés adressables prévus par l\'offre' : '') + '.</dd>' +
      '<dt>Mises en relation</dt><dd>Demandes de cours envoyées par les salariés à un professeur Superprof depuis le début du partenariat.</dd>' +
      '<dt>Bénéficiaires</dt><dd>Salariés ayant activé leur cagnotte sur Spliiit.</dd>' +
      '<dt>Abonnés en cours</dt><dd>Bénéficiaires ayant au moins un abonnement actif à la date des données.</dd>' +
      '<dt>Abonnements en cours</dt><dd>Abonnements actifs des bénéficiaires à la date des données. Un abonné peut en avoir plusieurs.</dd>' +
      '<dt>Économies des salariés</dt><dd>Pour chaque service : prix public mensuel de l\'offre individuelle équivalente (en France, TTC) × abonnements en cours, soit ce que les salariés paieraient en s\'abonnant directement' + (m.contrat > 0 ? ' ; leurs abonnements sont financés par la cagnotte du CSE (' + montant(m.contrat) + ' par abonné et par an) utilisée sur Spliiit' : '') + '. Total corrigé des abonnements comptés deux fois par Spliiit' + (m.prixReleve ? '. Prix relevés le ' + esc(jourTxt(m.prixReleve)) : '') + '. Sur un an = mensuel × 12, à abonnements constants.</dd>' +
      '<dt>Services souscrits</dt><dd>Abonnements en cours par service, tels que comptés par Spliiit à la date des données.</dd>' +
      '</dl><div class="note-box">Document établi par Superprof pour ' + esc(leNom(m.nom)) + '. Pour toute question sur ce bilan, contactez votre interlocuteur Superprof.</div>' +
      pied(n, m, a) + '</section>';
  }

  // Document complet (HTML autonome). a = { fonts:[{weight,src}], caveat, spLogo, spliiit, logos:{service:{type,src,bg}} }
  function html(m, a) {
    var pages = [pCouverture(m, a), pSuperprof(m, a, 2), pEssentiel(m, a, 3), pEngagement(m, a, 4), pEconomies(m, a, 5), pServices(m, a, 6), pMethode(m, a, 7)];
    return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bilan du partenariat</title><style>' + css(a) + '</style></head><body>' +
      pages.join('').replace(/__TOTAL__/g, String(pages.length)) + '</body></html>';
  }

  window.BilanDoc = { mesures: mesures, initiales: initiales, CLES: CLES, calculer: calculer, html: html, sourceLogo: sourceLogo, spLogo: spLogo, veille: veille, moisTxt: moisTxt, jourTxt: jourTxt };
})();
