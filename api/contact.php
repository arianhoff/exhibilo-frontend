<?php
// --- CORS seguro para dev/prod ---
$allowed_origins = ['https://exhibilo.com.ar','https://www.exhibilo.com.ar','http://localhost:5173'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
  header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
  header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204); exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

// --- Lee JSON o x-www-form-urlencoded ---
$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!$data) { $data = $_POST; }

// Honeypot (campo oculto "website" debe venir vacío)
if (!empty($data['website'] ?? '')) {
  echo json_encode(['ok' => true]); // silencio a bots
  exit;
}

// --- Sanitizar/validar ---
$name    = trim($data['name']    ?? '');
$email   = trim($data['email']   ?? '');
$phone   = trim($data['phone']   ?? '');
$company = trim($data['company'] ?? '');
$message = trim($data['message'] ?? '');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'Datos inválidos']);
  exit;
}

// --- Armar correo ---
$to      = 'ventas@exhibilo.com.ar';  // CAMBIAR si querés otro destino
$subject = 'Nueva consulta desde la web';
$body = "Nombre: $name\nEmail: $email\nTeléfono: $phone\nEmpresa: $company\n\nMensaje:\n$message\n";
$fromEmail = 'no-reply@exhibilo.com.ar'; // usar tu dominio
$headers  = "From: Exhibilo <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// --- Enviar ---
$ok = @mail($to, '=?UTF-8?B?'.base64_encode($subject).'?=', $body, $headers);

if ($ok) {
  echo json_encode(['ok' => true, 'message' => 'Enviado']);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el correo']);
}
