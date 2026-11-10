/* =========================================================
   Tamilis Alvares · Psicóloga — scripts do site
   ========================================================= */

/* ---------- CONFIGURAÇÕES (edite aqui) ---------- */
const CONFIG = {
  whatsapp: '5511986071270',
  mensagemPadrao: 'Olá, Tamilis! Vim pelo site e gostaria de saber mais sobre os atendimentos.',

  // Google Ads — preencha quando criar a conta/conversões.
  // Enquanto estiver com "XXXX", nenhuma tag é carregada.
  googleAdsId: 'AW-XXXXXXXXXX',
  conversaoWhatsapp: 'AW-XXXXXXXXXX/XXXXXXXXXXXXXXXX',   // clique no WhatsApp
  conversaoFormulario: 'AW-XXXXXXXXXX/XXXXXXXXXXXXXXXX'  // envio do formulário (usada em obrigado.html)
};

/* ---------- Google Ads + consentimento (LGPD / Consent Mode) ---------- */
const adsAtivo = !CONFIG.googleAdsId.includes('XXXX');
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
window.gtag = gtag;

function lerConsentimento(){ try { return localStorage.getItem('consentimento'); } catch(e){ return null; } }
function salvarConsentimento(v){ try { localStorage.setItem('consentimento', v); } catch(e){} }

if (adsAtivo) {
  const ok = lerConsentimento() === 'sim';
  gtag('consent', 'default', {
    ad_storage: ok ? 'granted' : 'denied',
    ad_user_data: ok ? 'granted' : 'denied',
    ad_personalization: ok ? 'granted' : 'denied',
    analytics_storage: ok ? 'granted' : 'denied'
  });
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.googleAdsId;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', CONFIG.googleAdsId);
}

function registrarConversao(sendTo){
  if (adsAtivo && !sendTo.includes('XXXX')) gtag('event', 'conversion', { send_to: sendTo });
}

/* ---------- Aviso de cookies ---------- */
const avisoCookies = document.getElementById('cookies');
if (avisoCookies && adsAtivo && !lerConsentimento()) {
  setTimeout(() => avisoCookies.classList.add('ver'), 1200);
  document.getElementById('cookies-sim').onclick = () => {
    salvarConsentimento('sim');
    gtag('consent', 'update', { ad_storage:'granted', ad_user_data:'granted', ad_personalization:'granted', analytics_storage:'granted' });
    avisoCookies.classList.remove('ver');
  };
  document.getElementById('cookies-nao').onclick = () => { salvarConsentimento('nao'); avisoCookies.classList.remove('ver'); };
}

/* ---------- Links do WhatsApp ---------- */
document.querySelectorAll('.js-wpp').forEach(a => {
  const msg = a.dataset.msg || CONFIG.mensagemPadrao;
  a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  a.target = '_blank';
  a.rel = 'noopener';
  a.addEventListener('click', () => {
    registrarConversao(CONFIG.conversaoWhatsapp);
    if (adsAtivo) gtag('event', 'clique_whatsapp', { origem: a.dataset.origem || 'site' });
  });
});

/* ---------- Cabeçalho ao rolar ---------- */
const topo = document.getElementById('topo');
if (topo) {
  const aoRolar = () => topo.classList.toggle('rolou', window.scrollY > 40);
  addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();
}

/* ---------- Menu mobile ---------- */
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
if (burger && menu) {
  const fechar = () => { menu.classList.remove('aberto'); burger.classList.remove('aberto'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const abriu = menu.classList.toggle('aberto');
    burger.classList.toggle('aberto', abriu);
    burger.setAttribute('aria-expanded', abriu);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', fechar));
}

/* ---------- Animações de entrada conforme o scroll ---------- */
const elementos = document.querySelectorAll('[data-r]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  elementos.forEach(el => io.observe(el));
} else {
  elementos.forEach(el => el.classList.add('in'));
}

/* ---------- Formulário de contato ---------- */
const form = document.getElementById('form-contato');
if (form) {
  const msg = document.getElementById('form-msg');
  // máscara simples de telefone
  const tel = form.querySelector('#telefone');
  tel.addEventListener('input', () => {
    let d = tel.value.replace(/\D/g, '').slice(0, 11);
    if (d.length > 6) tel.value = `(${d.slice(0,2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    else if (d.length > 2) tel.value = `(${d.slice(0,2)}) ${d.slice(2)}`;
    else tel.value = d;
  });
  // mensagens de retorno do php/contato.php
  const erro = new URLSearchParams(location.search).get('erro');
  const erros = {
    dados: 'Confira os dados: nome, WhatsApp, interesse e o aceite são obrigatórios.',
    espera: 'Recebemos um envio há pouco. Aguarde um minuto para enviar novamente.',
    envio: 'Não foi possível enviar agora. Por favor, fale comigo pelo WhatsApp.'
  };
  if (erro && erros[erro]) { msg.style.color = '#a04a6a'; msg.textContent = erros[erro]; }

  form.addEventListener('submit', e => {
    const nome = form.nome.value.trim();
    const fone = form.telefone.value.replace(/\D/g, '');
    if (nome.length < 2 || fone.length < 10 || !form.modalidade.value || !form.aceite.checked) {
      e.preventDefault();
      msg.style.color = '#a04a6a';
      msg.textContent = 'Por favor, preencha nome, WhatsApp, interesse e confirme o aceite.';
    }
  });
}

/* ---------- Ano no rodapé ---------- */
const ano = document.getElementById('ano');
if (ano) ano.textContent = new Date().getFullYear();
