# Site — Tamilis Alvares · Psicóloga

## Estrutura
```
site/
├── index.html                  página principal
├── obrigado.html               página após envio do formulário (conversão do Google Ads)
├── politica-de-privacidade.html
├── css/style.css               cores, fontes, layout e animações
├── js/main.js                  WhatsApp, animações, menu, Google Ads, cookies
├── php/config.php              e-mail que recebe os contatos  ← editar
├── php/contato.php             envio do formulário
├── img/ilustracoes/            ilustrações em traço fino (SVG)
├── img/fotos/                  fotos da psicóloga
├── robots.txt / sitemap.xml    para o Google
└── .htaccess                   HTTPS, cache e proteção (servidor Apache)
```

## Como trocar as fotos
Salve as fotos em `img/fotos/` com estes nomes exatos:
- `foto-principal.jpg` — primeira foto (moldura redonda). Ideal: quadrada, 900×900 px.
- `foto-sobre.jpg` — seção "Sobre mim" (moldura espelho orgânico). Ideal: vertical, 800×1000 px.

Enquanto não existirem, aparece a ilustração "sua foto aqui".

## Antes de publicar
1. Trocar `SEUDOMINIO.com.br` pelo domínio real (index.html, robots.txt, sitemap.xml).
2. Em `php/config.php`, colocar o e-mail que vai receber os contatos.
3. Completar a formação na seção "Sobre mim" (index.html, procure por "a preencher").
4. Adicionar o link do Instagram no rodapé (procure por `aria-label="Instagram"`).

## Google Ads
Em `js/main.js`, no bloco CONFIG, preencha:
- `googleAdsId` — ex.: `AW-123456789`
- `conversaoWhatsapp` — conversão "clique no WhatsApp" (ID/rótulo)
- `conversaoFormulario` — conversão "envio de formulário" (disparada em obrigado.html)

Enquanto estiver com "XXXX", nenhuma tag do Google é carregada. O aviso de cookies (LGPD)
aparece automaticamente quando o ID é preenchido, e as tags só gravam cookies após o aceite.

## Hospedagem
Qualquer hospedagem com PHP (Hostinger, Locaweb, HostGator etc.). Envie a pasta inteira para `public_html`.
