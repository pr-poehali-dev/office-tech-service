import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

def handler(event: dict, context) -> dict:
    """Обработка заявок с сайта и отправка на email"""
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        name = body.get('name', '').strip()
        phone = body.get('phone', '').strip()
        email = body.get('email', '').strip()
        message = body.get('message', '').strip()
        
        if not all([name, phone, email, message]):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'All fields are required'}),
                'isBase64Encoded': False
            }
        
        smtp_email = os.environ.get('SMTP_EMAIL')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        recipient_email = os.environ.get('RECIPIENT_EMAIL')
        
        if not all([smtp_email, smtp_password, recipient_email]):
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Email configuration is missing'}),
                'isBase64Encoded': False
            }
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Новая заявка с сайта от {name}'
        msg['From'] = smtp_email
        msg['To'] = recipient_email
        
        html_body = f"""
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #1A1F2C;">Новая заявка с сайта ТехноСервис</h2>
            <p><strong>Дата:</strong> {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
            <hr style="border: 1px solid #E5E7EB;">
            <p><strong>Имя:</strong> {name}</p>
            <p><strong>Телефон:</strong> {phone}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Сообщение:</strong></p>
            <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px;">
              {message}
            </div>
          </body>
        </html>
        """
        
        html_part = MIMEText(html_body, 'html', 'utf-8')
        msg.attach(html_part)
        
        if '@gmail.com' in smtp_email:
            smtp_server = 'smtp.gmail.com'
            smtp_port = 587
        elif '@yandex.ru' in smtp_email or '@ya.ru' in smtp_email:
            smtp_server = 'smtp.yandex.ru'
            smtp_port = 587
        elif '@mail.ru' in smtp_email:
            smtp_server = 'smtp.mail.ru'
            smtp_port = 587
        else:
            smtp_server = 'smtp.gmail.com'
            smtp_port = 587
        
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Inquiry sent successfully'}),
            'isBase64Encoded': False
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
