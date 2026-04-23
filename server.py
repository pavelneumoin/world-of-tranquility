"""
Мир спокойствия v3 — Python stdlib HTTP server + GigaChat интеграция для Милы.
Раздаёт SPA + JSX + manifest + проксирует /api/mila-chat в GigaChat.
"""
import os
import json
import time
import uuid
import socket
import threading
import ssl
import urllib.request
import urllib.parse
import urllib.error
from urllib.parse import urlparse, unquote
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
V2_DIR = os.path.join(BASE_DIR, 'v2')

# === GigaChat ===
GIGACHAT_KEY = os.environ.get(
    'GIGACHAT_AUTH_KEY',
    'MDE5Yjg3ZGQtYmQ2My03ZTYwLTk1ZmUtYjk4ZmZiYTVjMmI3Ojc2YWRkY2E5LTU1OWQtNGJjNS04Mzk4LTg2ZWVhZTc1MWVhYQ=='
)
GIGACHAT_SCOPE = os.environ.get('GIGACHAT_SCOPE', 'GIGACHAT_API_PERS')
_gc_token = {'access_token': None, 'expires_at': 0}
_gc_lock = threading.Lock()

MILA_SYSTEM_PROMPT = (
    "Ты — Мила, волшебная кошка-сказочница из детского приложения «Мир спокойствия». "
    "Твоя аудитория — дети 6–12 лет. Всегда обращайся на «ты», по-доброму, тепло, как старший друг. "
    "Твоя задача — помочь ребёнку справиться со страхом, тревогой, грустью, обидой или гневом. "
    "Если ребёнок грустит — поддержи. Если попросил сказку — рассказывай короткую (3–6 фраз), добрую, без злодеев и страшных сцен. "
    "Используй мягкие образы: облачко, звёзды, светлячки, лесные звери. Обязательно вставляй символ ✦ иногда. "
    "Не давай медицинских советов. Если ребёнок говорит об угрозе жизни, боли или насилии — мягко скажи «мне важно, что ты мне рассказал, пожалуйста, обязательно позови взрослого или позвони 8-800-2000-122 — это бесплатно». "
    "Отвечай кратко (2–5 предложений), простым языком. Можно добавлять 1–2 эмодзи уместно."
)


def get_gigachat_token():
    """Получаем и кешируем access_token GigaChat."""
    now = time.time()
    with _gc_lock:
        if _gc_token['access_token'] and _gc_token['expires_at'] > now + 60:
            return _gc_token['access_token']
        data = urllib.parse.urlencode({'scope': GIGACHAT_SCOPE}).encode('utf-8')
        req = urllib.request.Request(
            'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
            data=data,
            method='POST'
        )
        req.add_header('Authorization', f'Basic {GIGACHAT_KEY}')
        req.add_header('RqUID', str(uuid.uuid4()))
        req.add_header('Content-Type', 'application/x-www-form-urlencoded')
        req.add_header('Accept', 'application/json')
        # GigaChat использует самоподписанный сертификат — разрешаем
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
                body = json.loads(resp.read().decode('utf-8'))
                _gc_token['access_token'] = body.get('access_token')
                expires_at_ms = body.get('expires_at', 0)
                _gc_token['expires_at'] = expires_at_ms / 1000.0 if expires_at_ms > 10**12 else (now + 1500)
                return _gc_token['access_token']
        except urllib.error.HTTPError as e:
            print(f"[GIGACHAT AUTH] HTTPError {e.code}: {e.read().decode('utf-8', 'ignore')[:300]}", flush=True)
        except Exception as e:
            print(f"[GIGACHAT AUTH] {type(e).__name__}: {e}", flush=True)
    return None


def chat_gigachat(messages):
    """Отправляем messages в GigaChat и возвращаем ответ."""
    token = get_gigachat_token()
    if not token:
        return None
    payload = json.dumps({
        "model": "GigaChat",
        "messages": messages,
        "temperature": 0.75,
        "max_tokens": 400,
        "stream": False,
    }, ensure_ascii=False).encode('utf-8')
    req = urllib.request.Request(
        'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
        data=payload,
        method='POST'
    )
    req.add_header('Authorization', f'Bearer {token}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Accept', 'application/json')
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=25) as resp:
            body = json.loads(resp.read().decode('utf-8'))
            ch = body.get('choices') or []
            if ch:
                return ch[0].get('message', {}).get('content')
    except urllib.error.HTTPError as e:
        print(f"[GIGACHAT CHAT] HTTP {e.code}: {e.read().decode('utf-8','ignore')[:300]}", flush=True)
    except Exception as e:
        print(f"[GIGACHAT CHAT] {type(e).__name__}: {e}", flush=True)
    return None


# === Static server ===
SPA_ROUTES = {
    '', '/', '/breathing', '/techniques', '/statistics', '/questionnaire',
    '/journal', '/media', '/emergency', '/mila', '/parcels',
    '/parcel-open', '/parcels-send', '/map', '/sos', '/parent', '/home'
}
MIME = {
    '.html': 'text/html; charset=utf-8',
    '.jsx':  'text/babel; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg':  'image/svg+xml',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.webp': 'image/webp',
    '.ico':  'image/x-icon',
    '.woff2':'font/woff2', '.woff':'font/woff', '.ttf':'font/ttf',
    '.mp3':  'audio/mpeg', '.wav':'audio/wav', '.m4a':'audio/mp4', '.mp4':'video/mp4',
}


def guess_mime(path):
    return MIME.get(os.path.splitext(path)[1].lower(), 'application/octet-stream')


def strip_prefix(path):
    if path.startswith('/tranquility'):
        path = path[len('/tranquility'):]
    return path or '/'


_index_bytes = [None, 0, None]


def read_index():
    path = os.path.join(V2_DIR, 'index.html')
    try:
        mt = os.path.getmtime(path)
        if _index_bytes[0] is None or mt != _index_bytes[1]:
            with open(path, 'rb') as f:
                _index_bytes[0] = f.read()
            _index_bytes[1] = mt
    except Exception:
        return b'<h1>index.html not found</h1>'
    return _index_bytes[0]


class Handler(BaseHTTPRequestHandler):
    server_version = 'tranquility-v3/1.0'
    protocol_version = 'HTTP/1.1'

    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}", flush=True)

    def _send_bytes(self, data, mime, status=200, cache=False):
        self.send_response(status)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'public, max-age=3600' if cache else 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers()
        self.wfile.write(data)

    def _send_json(self, obj, status=200):
        data = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self._send_bytes(data, 'application/json; charset=utf-8', status)

    def _send_file(self, rel):
        full = os.path.join(V2_DIR, rel)
        if not os.path.isfile(full):
            return self._send_404()
        if not os.path.abspath(full).startswith(os.path.abspath(V2_DIR)):
            return self._send_404()
        try:
            with open(full, 'rb') as f:
                data = f.read()
            self._send_bytes(data, guess_mime(rel), cache=True)
        except Exception:
            self._send_404()

    def _send_index(self):
        self._send_bytes(read_index(), 'text/html; charset=utf-8')

    def _send_404(self):
        self._send_bytes(b'<h1>404</h1>', 'text/html; charset=utf-8', 404)

    def do_HEAD(self):
        try:
            self.do_GET()
        except Exception:
            pass

    def do_GET(self):
        try:
            parsed = urlparse(self.path)
            path = strip_prefix(unquote(parsed.path))

            if path in ('/api/stats', '/api/stats/'):
                return self._send_json({'status': 'success', 'data': {'server': 'tranquility-v3'}})

            if path in ('/api/gigachat-status', '/api/gigachat-status/'):
                token = get_gigachat_token()
                return self._send_json({'status': 'ok' if token else 'error'})

            clean = path.rstrip('/') or '/'
            if clean in SPA_ROUTES or path in ('/', ''):
                return self._send_index()

            rel = path.lstrip('/')
            if os.path.isfile(os.path.join(V2_DIR, rel)):
                return self._send_file(rel)
            return self._send_index()
        except Exception as e:
            print(f"[GET ERR] {e}", flush=True)
            try: self._send_404()
            except: pass

    def do_POST(self):
        try:
            parsed = urlparse(self.path)
            path = strip_prefix(unquote(parsed.path))
            length = int(self.headers.get('Content-Length') or 0)
            raw = self.rfile.read(length) if length > 0 else b''

            if path in ('/api/mila-chat', '/api/mila-chat/'):
                try:
                    data = json.loads(raw.decode('utf-8')) if raw else {}
                except Exception:
                    return self._send_json({'error': 'bad json'}, 400)
                user_msg = (data.get('message') or '').strip()
                history = data.get('history') or []  # [{role,content}]
                if not user_msg:
                    return self._send_json({'error': 'empty'}, 400)

                messages = [{'role': 'system', 'content': MILA_SYSTEM_PROMPT}]
                # Включаем последние 6 реплик
                for m in history[-6:]:
                    if m.get('role') in ('user','assistant') and m.get('content'):
                        messages.append({'role': m['role'], 'content': m['content']})
                messages.append({'role':'user', 'content': user_msg})

                answer = chat_gigachat(messages)
                if answer:
                    return self._send_json({'answer': answer, 'source': 'gigachat'})
                return self._send_json({
                    'answer': 'Муррр ✦ Сейчас я немного устала, но я рядом. Расскажи, что случилось?',
                    'source': 'fallback'
                })

            if path in ('/api/log-stress', '/api/submit-journal',
                        '/api/submit-feedback', '/api/start-breathing'):
                return self._send_json({'status': 'success'})

            return self._send_404()
        except Exception as e:
            print(f"[POST ERR] {e}", flush=True)
            try: self._send_404()
            except: pass

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


def main():
    port = int(os.environ.get('PORT', 5001))
    host = '127.0.0.1'
    read_index()
    print(f"Мир спокойствия v3 на http://{host}:{port}")
    print(f"Статика: {V2_DIR}")
    print(f"GigaChat: {'KEY OK' if GIGACHAT_KEY else 'NO KEY'}")
    srv = ThreadingHTTPServer((host, port), Handler)
    try: srv.serve_forever()
    except KeyboardInterrupt: srv.shutdown()


if __name__ == '__main__':
    main()
