<?php
// Cognexa site forms (fit call, about contact, newsletter) -> email.
// Set the inbox that should receive enquiries:
$TO = '';
$FROM = 'website@cognexadigital.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
if (!empty($_POST['bot-field'])) { http_response_code(200); exit; }   // honeypot: pretend success
if ($TO === '') { http_response_code(500); exit; }

$form = preg_replace('/[^a-z0-9-]/i', '', $_POST['form-name'] ?? 'website');
$lines = [];
foreach ($_POST as $k => $v) {
  if (in_array($k, ['bot-field', 'form-name'], true)) continue;
  $v = is_array($v) ? implode(', ', $v) : $v;
  $lines[] = ucfirst(str_replace(['-', '_'], ' ', $k)) . ': ' . trim(substr((string)$v, 0, 5000));
}
if (!$lines) { http_response_code(400); exit; }

$headers = "From: Cognexa website <$FROM>\r\nContent-Type: text/plain; charset=UTF-8\r\n";
$reply = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
if ($reply) $headers .= "Reply-To: $reply\r\n";

$ok = mail($TO, "New $form enquiry from cognexadigital.com", implode("\n", $lines) . "\n", $headers, "-f$FROM");
http_response_code($ok ? 200 : 500);
