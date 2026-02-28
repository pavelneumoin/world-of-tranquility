"""
Мир спокойствия - HTTP сервер
Реструктурированная версия с отдельными шаблонами, статическими файлами и SQLite БД (Glassmorphism Zen)
"""

import socket
import threading
import json
import time
import os
import sqlite3
from datetime import datetime
from urllib.parse import urlparse, parse_qs

class SimpleHTTPServer:
    """Простой HTTP сервер для сайта управления стрессом (SQLite)"""

    def __init__(self, host='localhost', port=5000):
        self.host = host
        self.port = port
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.running = False
        
        # Пути к файлам
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.templates_dir = os.path.join(self.base_dir, 'templates')
        self.static_dir = os.path.join(self.base_dir, 'static')
        self.db_path = os.path.join(self.base_dir, 'data.db')
        
        self.init_db()

    def get_db_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        """Инициализация SQLite базы данных"""
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS stress_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                level INTEGER NOT NULL,
                timestamp TEXT NOT NULL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS journal_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                mood TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS questionnaires (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data_json TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
        ''')
        
        conn.commit()
        conn.close()

    def start(self):
        """Запуск сервера"""
        try:
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            self.running = True

            print(f"Сервер запущен на http://{self.host}:{self.port}")
            print("База данных SQLite подключена (data.db)")

            while self.running:
                try:
                    client_socket, addr = self.server_socket.accept()
                    client_thread = threading.Thread(
                        target=self.handle_client,
                        args=(client_socket, addr)
                    )
                    client_thread.daemon = True
                    client_thread.start()
                except OSError:
                    break
        except OSError as e:
            if e.errno == 48 or e.errno == 10048:
                print(f"Порт {self.port} уже занят!")
                return False
            else:
                raise
        return True

    def stop(self):
        """Остановка сервера"""
        self.running = False
        self.server_socket.close()
        print("Сервер остановлен")

    def handle_client(self, client_socket, addr):
        """Обработка клиентского соединения"""
        try:
            request_data = client_socket.recv(4096).decode('utf-8')
            if not request_data:
                return

            request_lines = request_data.split('\n')
            if not request_lines:
                return

            first_line = request_lines[0]
            parts = first_line.split(' ')
            if len(parts) < 2:
                return
                
            method, path = parts[0], parts[1]
            response = self.route_request(method, path, request_data)
            client_socket.sendall(response)

        except Exception as e:
            print(f"Ошибка обработки запроса: {e}")
        finally:
            client_socket.close()

    def route_request(self, method, path, request_data):
        """Маршрутизация запросов"""
        parsed_path = urlparse(path)
        path = parsed_path.path

        # Strip /tranquility prefix for Nginx proxy
        if path.startswith('/tranquility'):
            path = path[len('/tranquility'):]
            if path == '':
                path = '/'

        # API endpoints
        if method == 'GET':
            if path == '/api/stats':
                return self.json_response(self.get_stats())
            elif path == '/api/techniques':
                return self.json_response(self.get_techniques())

        # POST запросы
        if method == 'POST':
            if path == '/api/log-stress':
                return self.handle_stress_log(request_data)
            elif path == '/api/start-breathing':
                return self.json_response({"status": "success", "message": "Дыхательное упражнение начато"})
            elif path == '/api/submit-feedback':
                return self.handle_feedback_submission(request_data)
            elif path == '/api/submit-journal':
                return self.handle_journal_submission(request_data)

        # Статические файлы
        if method == 'GET' and path.startswith('/static/'):
            return self.serve_static(path)

        # HTML страницы
        if method == 'GET':
            page_map = {
                '/': 'index.html',
                '/breathing': 'breathing.html',
                '/techniques': 'techniques.html',
                '/statistics': 'statistics.html',
                '/questionnaire': 'questionnaire.html',
                '/journal': 'journal.html',
                '/media': 'media.html',
                '/emergency': 'emergency.html',
            }
            
            if path in page_map:
                return self.serve_template(page_map[path])
            elif path == '/favicon.ico':
                return self.favicon_response()

        return self.error_response(404, "Страница не найдена")

    def serve_template(self, template_name):
        """Загрузка HTML шаблона из файла"""
        try:
            template_path = os.path.join(self.templates_dir, template_name)
            with open(template_path, 'r', encoding='utf-8') as f:
                html = f.read()
            return self.html_response(html)
        except FileNotFoundError:
            return self.error_response(404, f"Шаблон {template_name} не найден")

    def serve_static(self, path):
        """Раздача статических файлов"""
        try:
            file_path = path[8:]  # strip /static/
            full_path = os.path.join(self.static_dir, file_path.replace('/', os.sep))
            
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if path.endswith('.css'): content_type = 'text/css'
            elif path.endswith('.js'): content_type = 'application/javascript'
            else: content_type = 'text/plain'
            
            return self.static_response(content, content_type)
        except Exception:
            return self.error_response(404, "Файл не найден")

    def html_response(self, html):
        body = html.encode('utf-8')
        headers = ["HTTP/1.1 200 OK", "Content-Type: text/html; charset=utf-8", f"Content-Length: {len(body)}", "Connection: close", "", ""]
        return "\r\n".join(headers).encode('utf-8') + body

    def json_response(self, data):
        json_data = json.dumps(data, ensure_ascii=False, indent=2)
        body = json_data.encode('utf-8')
        headers = ["HTTP/1.1 200 OK", "Content-Type: application/json; charset=utf-8", "Access-Control-Allow-Origin: *", f"Content-Length: {len(body)}", "Connection: close", "", ""]
        return "\r\n".join(headers).encode('utf-8') + body

    def static_response(self, content, content_type):
        body = content.encode('utf-8')
        headers = ["HTTP/1.1 200 OK", f"Content-Type: {content_type}; charset=utf-8", f"Content-Length: {len(body)}", "Connection: close", "", ""]
        return "\r\n".join(headers).encode('utf-8') + body

    def favicon_response(self):
        return "\r\n".join(["HTTP/1.1 204 No Content", "Connection: close", "", ""]).encode('utf-8')

    def error_response(self, code, message):
        html = f"<html><body><h1>Ошибка {code}</h1><p>{message}</p></body></html>"
        body = html.encode('utf-8')
        headers = [f"HTTP/1.1 {code} Error", "Content-Type: text/html; charset=utf-8", f"Content-Length: {len(body)}", "Connection: close", "", ""]
        return "\r\n".join(headers).encode('utf-8') + body

    def parse_body(self, request_data):
        lines = request_data.split('\\n')
        body_start = False
        body = ""
        for line in lines:
            if line.strip() == '':
                body_start = True
                continue
            if body_start:
                body += line
        return body

    def handle_stress_log(self, request_data):
        try:
            body = self.parse_body(request_data)
            data = json.loads(body) if body else {}
            level = int(data.get('level', 0))
            ts = datetime.now().isoformat()
            
            conn = self.get_db_connection()
            conn.execute('INSERT INTO stress_logs (level, timestamp) VALUES (?, ?)', (level, ts))
            conn.commit()
            conn.close()

            print(f"Получен уровень стресса: {level}")
            return self.json_response({"status": "success", "message": "Уровень стресса записан", "level": level})
        except Exception as e:
            return self.json_response({"status": "error", "message": str(e)})

    def handle_feedback_submission(self, request_data):
        try:
            body = self.parse_body(request_data)
            data_json = body if body else "{}"
            ts = datetime.now().isoformat()
            
            conn = self.get_db_connection()
            conn.execute('INSERT INTO questionnaires (data_json, timestamp) VALUES (?, ?)', (data_json, ts))
            conn.commit()
            conn.close()
            
            print(f"Получена анкета")
            return self.json_response({"status": "success", "message": "Анкета успешно отправлена!"})
        except Exception as e:
            return self.json_response({"status": "error", "message": str(e)})

    def handle_journal_submission(self, request_data):
        try:
            body = self.parse_body(request_data)
            data = json.loads(body) if body else {}
            text = data.get("text", "")
            mood = data.get("mood", "neutral")
            ts = datetime.now().isoformat()
            
            conn = self.get_db_connection()
            conn.execute('INSERT INTO journal_entries (text, mood, timestamp) VALUES (?, ?, ?)', (text, mood, ts))
            conn.commit()
            conn.close()

            print(f"Получена запись в журнал")
            return self.json_response({"status": "success", "message": "Запись сохранена"})
        except Exception as e:
            return self.json_response({"status": "error", "message": str(e)})

    def get_stats(self):
        conn = self.get_db_connection()
        c_logs = conn.execute('SELECT COUNT(*) FROM stress_logs').fetchone()[0]
        c_journal = conn.execute('SELECT COUNT(*) FROM journal_entries').fetchone()[0]
        c_quest = conn.execute('SELECT COUNT(*) FROM questionnaires').fetchone()[0]
        
        # Get raw logs for Chart.js
        logs = conn.execute('SELECT level, timestamp FROM stress_logs ORDER BY timestamp ASC').fetchall()
        logs_list = [{"level": r['level'], "timestamp": r['timestamp']} for r in logs]
        
        conn.close()

        return {
            "status": "success",
            "data": {
                "server": "Мир спокойствия",
                "version": "3.0.0 (SQLite Edition)",
                "timestamp": datetime.now().isoformat(),
                "questionnaires_count": c_quest,
                "journal_entries_count": c_journal,
                "stress_logs_count": c_logs,
                "stress_logs_data": logs_list
            }
        }

    def get_techniques(self):
        """Получение списка техник"""
        return {
            "breathing_techniques": [
                {"id": 1, "name": "4-7-8", "description": "Вдох 4с, задержка 7с, выдох 8с"},
                {"id": 2, "name": "Квадратное", "description": "4-4-4-4"},
                {"id": 3, "name": "Диафрагмальное", "description": "Дыхание животом"}
            ]
        }

def main():
    print("=" * 50)
    print("МИР СПОКОЙСТВИЯ v3.0 (SQLite)")
    print("=" * 50)
    port = int(os.environ.get('PORT', 5001))
    host = '0.0.0.0' if os.environ.get('RENDER') else 'localhost'
    server = SimpleHTTPServer(host=host, port=port)
    
    if server.start():
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            server.stop()
    else:
        print(f"Не удалось запустить сервер на порту {port}")

if __name__ == "__main__":
    main()
