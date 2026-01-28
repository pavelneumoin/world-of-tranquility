"""
Мир спокойствия - HTTP сервер
Реструктурированная версия с отдельными шаблонами и статическими файлами
"""

import socket
import threading
import json
import time
import os
from datetime import datetime
from urllib.parse import urlparse, parse_qs


class SimpleHTTPServer:
    """Простой HTTP сервер для сайта управления стрессом"""

    def __init__(self, host='localhost', port=5000):
        self.host = host
        self.port = port
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.running = False
        
        # Хранилище данных
        self.questionnaires = []
        self.journal_entries = []
        self.stress_logs = []
        
        # Пути к файлам
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.templates_dir = os.path.join(self.base_dir, 'templates')
        self.static_dir = os.path.join(self.base_dir, 'static')

    def start(self):
        """Запуск сервера"""
        try:
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            self.running = True

            print(f"Сервер запущен на http://{self.host}:{self.port}")
            print("=" * 50)
            print("Откройте в браузере: http://localhost:" + str(self.port))
            print("=" * 50)

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

        # API endpoints
        if method == 'GET':
            if path == '/api/stats':
                return self.json_response(self.get_stats())
            elif path == '/api/techniques':
                return self.json_response(self.get_techniques())
            elif path == '/api/feedback':
                return self.json_response(self.get_feedback())
            elif path == '/api/questionnaires':
                return self.json_response(self.get_questionnaires())
            elif path == '/api/journal':
                return self.json_response(self.get_journal())
            elif path == '/api/stats/summary':
                return self.json_response(self.get_stats_summary())

        # POST запросы
        if method == 'POST':
            if path == '/api/log-stress':
                return self.handle_stress_log(request_data)
            elif path == '/api/start-breathing':
                return self.json_response({
                    "status": "success",
                    "message": "Дыхательное упражнение начато"
                })
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
            # Убираем /static/ из пути
            file_path = path[8:]  # len('/static/') = 8
            full_path = os.path.join(self.static_dir, file_path.replace('/', os.sep))
            
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Определяем Content-Type
            if path.endswith('.css'):
                content_type = 'text/css'
            elif path.endswith('.js'):
                content_type = 'application/javascript'
            else:
                content_type = 'text/plain'
            
            return self.static_response(content, content_type)
        except FileNotFoundError:
            return self.error_response(404, "Файл не найден")

    def html_response(self, html):
        """Формирование HTML ответа"""
        body = html.encode('utf-8')
        headers = [
            "HTTP/1.1 200 OK",
            "Content-Type: text/html; charset=utf-8",
            f"Content-Length: {len(body)}",
            "Connection: close",
            "",
            ""
        ]
        return "\r\n".join(headers).encode('utf-8') + body

    def json_response(self, data):
        """Формирование JSON ответа"""
        json_data = json.dumps(data, ensure_ascii=False, indent=2)
        body = json_data.encode('utf-8')
        headers = [
            "HTTP/1.1 200 OK",
            "Content-Type: application/json; charset=utf-8",
            "Access-Control-Allow-Origin: *",
            f"Content-Length: {len(body)}",
            "Connection: close",
            "",
            ""
        ]
        return "\r\n".join(headers).encode('utf-8') + body

    def static_response(self, content, content_type):
        """Формирование ответа для статических файлов"""
        body = content.encode('utf-8')
        headers = [
            "HTTP/1.1 200 OK",
            f"Content-Type: {content_type}; charset=utf-8",
            f"Content-Length: {len(body)}",
            "Connection: close",
            "",
            ""
        ]
        return "\r\n".join(headers).encode('utf-8') + body

    def favicon_response(self):
        """Пустой ответ для favicon"""
        headers = [
            "HTTP/1.1 204 No Content",
            "Connection: close",
            "",
            ""
        ]
        return "\r\n".join(headers).encode('utf-8')

    def error_response(self, code, message):
        """Формирование ответа с ошибкой"""
        html = f"""
        <!DOCTYPE html>
        <html>
        <head><title>Ошибка {code}</title></head>
        <body>
            <h1>Ошибка {code}</h1>
            <p>{message}</p>
            <a href="/">Вернуться на главную</a>
        </body>
        </html>
        """
        body = html.encode('utf-8')
        status = 'Not Found' if code == 404 else 'Error'
        headers = [
            f"HTTP/1.1 {code} {status}",
            "Content-Type: text/html; charset=utf-8",
            f"Content-Length: {len(body)}",
            "Connection: close",
            "",
            ""
        ]
        return "\r\n".join(headers).encode('utf-8') + body

    def parse_body(self, request_data):
        """Извлечение тела запроса"""
        lines = request_data.split('\n')
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
        """Обработка логирования стресса"""
        try:
            body = self.parse_body(request_data)
            data = json.loads(body) if body else {}
            
            stress_entry = {
                "level": int(data.get('level', 0)),
                "timestamp": datetime.now().isoformat()
            }
            self.stress_logs.append(stress_entry)
            print(f"Получен уровень стресса: {stress_entry['level']}")

            return self.json_response({
                "status": "success",
                "message": "Уровень стресса записан",
                "level": stress_entry['level']
            })
        except Exception as e:
            return self.json_response({"status": "error", "message": str(e)})

    def handle_feedback_submission(self, request_data):
        """Обработка отправки анкеты"""
        try:
            body = self.parse_body(request_data)
            data = json.loads(body) if body else {}
            
            questionnaire_entry = {
                "data": data,
                "timestamp": datetime.now().isoformat()
            }
            self.questionnaires.append(questionnaire_entry)
            print(f"Получена анкета №{len(self.questionnaires)}")

            return self.json_response({
                "status": "success",
                "message": "Анкета успешно отправлена! Спасибо за ваши ответы."
            })
        except Exception as e:
            return self.json_response({"status": "error", "message": str(e)})

    def handle_journal_submission(self, request_data):
        """Обработка отправки записи в журнал"""
        try:
            body = self.parse_body(request_data)
            data = json.loads(body) if body else {}
            
            journal_entry = {
                "text": data.get("text", ""),
                "mood": data.get("mood", "neutral"),
                "timestamp": datetime.now().isoformat()
            }
            self.journal_entries.append(journal_entry)
            print(f"Получена запись в журнал №{len(self.journal_entries)}")

            return self.json_response({
                "status": "success",
                "message": "Запись сохранена в вашем журнале"
            })
        except Exception as e:
            return self.json_response({"status": "error", "message": str(e)})

    def get_stats(self):
        """Получение статистики"""
        return {
            "status": "success",
            "data": {
                "server": "Мир спокойствия",
                "version": "2.0.0",
                "timestamp": datetime.now().isoformat(),
                "questionnaires_count": len(self.questionnaires),
                "journal_entries_count": len(self.journal_entries),
                "stress_logs_count": len(self.stress_logs)
            }
        }

    def get_stats_summary(self):
        """Полная статистика"""
        stress_reductions = []
        for q in self.questionnaires:
            before = q.get('data', {}).get('before', {})
            after = q.get('data', {}).get('after', {})
            if before.get('stress') and after.get('stress'):
                reduction = int(before['stress']) - int(after['stress'])
                if reduction > 0:
                    stress_reductions.append(reduction)

        avg_stress_reduction = round((sum(stress_reductions) / len(stress_reductions) * 10)) if stress_reductions else 0

        return {
            "status": "success",
            "stats": {
                "totalQuestionnaires": len(self.questionnaires),
                "totalJournalEntries": len(self.journal_entries),
                "totalStressLogs": len(self.stress_logs),
                "avgStressReduction": avg_stress_reduction,
                "avgPracticeDuration": 15
            }
        }

    def get_questionnaires(self):
        """Получение всех анкет"""
        return {
            "status": "success",
            "questionnaires": self.questionnaires[-50:],
            "total": len(self.questionnaires)
        }

    def get_journal(self):
        """Получение всех записей журнала"""
        return {
            "status": "success",
            "entries": self.journal_entries[-50:],
            "total": len(self.journal_entries)
        }

    def get_feedback(self):
        """Получение всех отзывов"""
        return {
            "status": "success",
            "journalEntries": self.journal_entries[-10:],
            "questionnairesCount": len(self.questionnaires)
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
    """Запуск сервера"""
    print("=" * 50)
    print("МИР СПОКОЙСТВИЯ v2.0")
    print("Реструктурированная версия")
    print("=" * 50)

    # Получаем порт из переменной окружения (для Render) или используем 5000
    port = int(os.environ.get('PORT', 5000))
    
    # На Render используем 0.0.0.0, локально - localhost
    host = '0.0.0.0' if os.environ.get('RENDER') else 'localhost'
    
    server = SimpleHTTPServer(host=host, port=port)
    print(f"Запуск сервера на {host}:{port}...")

    if server.start():
        print(f"\nСервер запущен на http://{host}:{port}")
        print("=" * 50)
        print("Доступные страницы:")
        print("  • Главная: /")
        print("  • Дыхательные практики: /breathing")
        print("  • Техники релаксации: /techniques")
        print("  • Статистика: /statistics")
        print("  • Анкетирование: /questionnaire")
        print("  • Личный журнал: /journal")
        print("  • Медиа контент: /media")
        print("  • Экстренная помощь: /emergency")
        print("=" * 50)
        print("Для остановки нажмите Ctrl+C")

        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            server.stop()
            print(f"\nСтатистика сервера:")
            print(f"  • Анкет: {len(server.questionnaires)}")
            print(f"  • Записей в журнале: {len(server.journal_entries)}")
            print(f"  • Логов стресса: {len(server.stress_logs)}")
    else:
        print(f"Не удалось запустить сервер на порту {port}")


if __name__ == "__main__":
    main()
