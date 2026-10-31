<?php
/**
 * WebGlobal Contact Form Email Processor
 * Target Recipient: sales.mv@webgbl.com
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Only POST requests are accepted.'
    ]);
    exit;
}

// Decode POST or JSON body
$input = $_POST;
if (empty($input)) {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}

// Extract inputs
$name    = isset($input['name']) ? trim(strip_tags($input['name'])) : '';
$email   = isset($input['email']) ? trim(filter_var($input['email'], FILTER_SANITIZE_EMAIL)) : '';
if (empty($email) && isset($input['email3'])) {
    $email = trim(filter_var($input['email3'], FILTER_SANITIZE_EMAIL));
}
$number  = isset($input['number']) ? trim(strip_tags($input['number'])) : '';
if (empty($number) && isset($input['phone'])) {
    $number = trim(strip_tags($input['phone']));
}
$subject = isset($input['subject']) ? trim(strip_tags($input['subject'])) : '';
$message = isset($input['message']) ? trim(strip_tags($input['message'])) : '';

$errors = [];

if (empty($name) || mb_strlen($name) < 2) {
    $errors['name'] = 'Please enter your name (at least 2 characters).';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address.';
}

if (empty($number) || !preg_match('/^[0-9+()\s\-]{7,25}$/', $number)) {
    $errors['number'] = 'Please enter a valid phone number (at least 7 digits).';
}

if (empty($subject) || mb_strlen($subject) < 2) {
    $errors['subject'] = 'Please enter a subject (at least 2 characters).';
}

if (empty($message) || mb_strlen($message) < 5) {
    $errors['message'] = 'Please enter your message (at least 5 characters).';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please correct the errors in the form.',
        'errors'  => $errors
    ]);
    exit;
}

// Recipient email
$to = 'sales.mv@webgbl.com';
$emailSubject = 'WebGlobal Contact Form: ' . $subject;

$safeName    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safeNumber  = htmlspecialchars($number, ENT_QUOTES, 'UTF-8');
$safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
$dateSubmitted = date('Y-m-d H:i:s T');

$htmlContent = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <title>New Website Contact Form Submission</title>
</head>
<body style='font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px;'>
  <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);'>
    <div style='background-color: #318ce7; padding: 25px 30px; text-align: center;'>
      <h2 style='color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;'>New Website Inquiry</h2>
      <p style='color: #eaf4fd; margin: 5px 0 0 0; font-size: 14px;'>WebGlobal Contact Form</p>
    </div>
    <div style='padding: 30px;'>
      <table style='width: 100%; border-collapse: collapse;'>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 120px; color: #555;'>Name:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #222;'>{$safeName}</td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;'>Email:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #318ce7;'><a href='mailto:{$safeEmail}' style='color: #318ce7; text-decoration: none;'>{$safeEmail}</a></td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;'>Phone:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #222;'><a href='tel:{$safeNumber}' style='color: #222; text-decoration: none;'>{$safeNumber}</a></td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;'>Subject:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #222;'>{$safeSubject}</td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;'>Date:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #777; font-size: 13px;'>{$dateSubmitted}</td>
        </tr>
      </table>
      <div style='margin-top: 25px;'>
        <p style='font-weight: bold; color: #555; margin-bottom: 8px;'>Message Content:</p>
        <div style='background-color: #f8fafc; border-left: 4px solid #318ce7; padding: 15px 20px; border-radius: 4px; color: #333; line-height: 1.6;'>
          {$safeMessage}
        </div>
      </div>
    </div>
    <div style='background-color: #f8fafc; padding: 15px 30px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #888;'>
      This inquiry was submitted from the WebGlobal contact form and sent to sales.mv@webgbl.com.
    </div>
  </div>
</body>
</html>
";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: WebGlobal Inquiry <noreply@webgbl.com>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion()
];

$sent = @mail($to, $emailSubject, $htmlContent, implode("\r\n", $headers));

if ($sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully to sales.mv@webgbl.com.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to send email directly via server mail agent. Please contact sales.mv@webgbl.com directly.'
    ]);
}

