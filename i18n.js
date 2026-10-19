const i18n = {
  fr: {
    title: "Grain Film",
    intensity: "Intensité",
    size: "Taille du grain",
    tint: "Teinte",
    speed: "Vitesse animation",
    bg: "Image de fond",
    clear: "Effacer fond",
    export: "Exporter PNG"
  },
  en: {
    title: "Film Grain",
    intensity: "Intensity",
    size: "Grain size",
    tint: "Tint",
    speed: "Animation speed",
    bg: "Background image",
    clear: "Clear background",
    export: "Export PNG"
  },
  tz: {
    title: "Aghrum n usinima",
    intensity: "Tizri",
    size: "Teɣzi n ugrum",
    tint: "Ini",
    speed: "Arured n unful",
    bg: "Tawlaft n ugemmar",
    clear: "Kkes agemmar",
    export: "Suffeg PNG"
  }
};

let currentLang = localStorage.getItem('lang') || 'fr';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'tz' ? 'ber' : lang;
  document.getElementById('title').textContent = i18n[lang].title;
  document.getElementById('lbl-intensity').textContent = i18n[lang].intensity;
  document.getElementById('lbl-size').textContent = i18n[lang].size;
  document.getElementById('lbl-tint').textContent = i18n[lang].tint;
  document.getElementById('lbl-speed').textContent = i18n[lang].speed;
  document.getElementById('lbl-bg').textContent = i18n[lang].bg;
  document.getElementById('clear-bg').textContent = i18n[lang].clear;
  document.getElementById('export-png').textContent = i18n[lang].export;
  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.querySelectorAll('.lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

setLang(currentLang);
