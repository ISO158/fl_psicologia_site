<?php
/* ===========================================================
   Recebe o formulário do site e envia por e-mail.
   Requer hospedagem com PHP e envio de e-mail habilitado.
   =========================================================== */
require __DIR__ . '/config.php';

function voltar(string $destino): void {
    header('Location: ' . $destino, true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    voltar('../index.html#contato');
}

// Anti-spam: campo invisível preenchido = robô
if (!empty($_POST['site'])) {
    voltar('../obrigado.html');
}

// Limite simples: 1 envio a cada 60 s por sessão
session_start();
if (isset($_SESSION['ultimo_envio']) && time() - $_SESSION['ultimo_envio'] < 60) {
    voltar('../index.html?erro=espera#contato');
}

function campo(string $nome, int $max): string {
    $v = trim((string)($_POST[$nome] ?? ''));
    $v = str_replace(["\r", "\0"], '', $v);
    return mb_substr(strip_tags($v), 0, $max);
}

$nome       = campo('nome', 80);
$telefone   = campo('telefone', 20);
$email      = campo('email', 120);
$modalidade = campo('modalidade', 60);
$mensagem   = campo('mensagem', 800);
$aceite     = !empty($_POST['aceite']);

$telDigitos = preg_replace('/\D/', '', $telefone);
$emailOk    = $email === '' || filter_var($email, FILTER_VALIDATE_EMAIL);

if (mb_strlen($nome) < 2 || strlen($telDigitos) < 10 || $modalidade === '' || !$aceite || !$emailOk) {
    voltar('../index.html?erro=dados#contato');
}

$corpo  = "Novo contato pelo site\n";
$corpo .= "-------------------------------\n";
$corpo .= "Nome: {$nome}\n";
$corpo .= "WhatsApp: {$telefone}\n";
$corpo .= "E-mail: " . ($email ?: '(não informado)') . "\n";
$corpo .= "Interesse: {$modalidade}\n\n";
$corpo .= "Mensagem:\n" . ($mensagem ?: '(sem mensagem)') . "\n\n";
$corpo .= "Responder pelo WhatsApp: https://wa.me/55{$telDigitos}\n";
$corpo .= "Enviado em: " . date('d/m/Y H:i') . "\n";

$cabecalhos = [
    'From: Site Tamilis Alvares <' . EMAIL_REMETENTE . '>',
    'Content-Type: text/plain; charset=UTF-8',
];
if ($email) {
    $cabecalhos[] = 'Reply-To: ' . $email;
}

$assunto = '=?UTF-8?B?' . base64_encode(ASSUNTO) . '?=';
$enviado = @mail(EMAIL_DESTINO, $assunto, $corpo, implode("\r\n", $cabecalhos));

if ($enviado) {
    $_SESSION['ultimo_envio'] = time();
    voltar('../obrigado.html');
}
voltar('../index.html?erro=envio#contato');
