import socket
import threading
import json
import time
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
        # Разделяем хранилище на анкеты и записи журнала
        self.questionnaires = []  # Хранилище для анкет
        self.journal_entries = []  # Хранилище для записей журнала
        self.stress_logs = []  # Хранилище для логов стресса

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
                print("Попробуйте другой порт или закройте другие программы")
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
            request_data = client_socket.recv(1024).decode('utf-8')

            if not request_data:
                return

            # Парсим запрос
            request_lines = request_data.split('\n')
            if not request_lines:
                return

            first_line = request_lines[0]
            method, path, _ = first_line.split(' ', 2)

            # Маршрутизация
            response = self.route_request(method, path, request_data)

            # Отправляем ответ
            client_socket.sendall(response.encode('utf-8'))

        except Exception as e:
            print(f"Ошибка обработки запроса: {e}")
        finally:
            client_socket.close()

    def route_request(self, method, path, request_data):
        """Маршрутизация запросов"""
        parsed_path = urlparse(path)
        path = parsed_path.path

        # API endpoints
        if method == 'GET' and path == '/api/stats':
            return self.json_response(self.get_stats())
        elif method == 'GET' and path == '/api/techniques':
            return self.json_response(self.get_techniques())
        elif method == 'GET' and path == '/api/feedback':
            return self.json_response(self.get_feedback())
        elif method == 'GET' and path == '/api/questionnaires':
            return self.json_response(self.get_questionnaires())
        elif method == 'GET' and path == '/api/journal':
            return self.json_response(self.get_journal())
        elif method == 'GET' and path == '/api/stats/summary':
            return self.json_response(self.get_stats_summary())

        # Основные страницы
        if method == 'GET':
            if path == '/':
                return self.html_response(self.get_main_page())
            elif path == '/breathing':
                return self.html_response(self.get_breathing_page())
            elif path == '/techniques':
                return self.html_response(self.get_techniques_page())
            elif path == '/statistics':
                return self.html_response(self.get_statistics_page())
            elif path == '/emergency':
                return self.html_response(self.get_emergency_page())
            elif path == '/questionnaire':
                return self.html_response(self.get_questionnaire_page())
            elif path == '/journal':
                return self.html_response(self.get_journal_page())
            elif path == '/media':
                return self.html_response(self.get_media_page())
            elif path == '/style.css':
                return self.css_response()
            elif path == '/script.js':
                return self.js_response()
            elif path == '/favicon.ico':
                return self.favicon_response()

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

        # Страница не найдена
        return self.error_response(404, "Страница не найдена")

    def get_main_page(self):
        """Главная страница"""
        return """
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Мир спокойствия</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    color: #333;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }

                nav {
                    background: white;
                    padding: 1rem 0;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #667eea;
                    text-decoration: none;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    list-style: none;
                }

                .nav-links a {
                    text-decoration: none;
                    color: #333;
                    font-weight: 500;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    transition: all 0.3s;
                }

                .nav-links a:hover {
                    background: #667eea;
                    color: white;
                }

                .hero {
                    text-align: center;
                    padding: 4rem 0;
                    color: white;
                }

                .hero h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .features {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin: 3rem 0;
                }

                .feature-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    text-decoration: none;
                    color: #333;
                    display: block;
                    transition: transform 0.3s;
                }

                .feature-card:hover {
                    transform: translateY(-5px);
                }

                .feature-icon {
                    font-size: 2.5rem;
                    color: #667eea;
                    margin-bottom: 1rem;
                }

                footer {
                    background: #333;
                    color: white;
                    text-align: center;
                    padding: 2rem 0;
                    margin-top: 3rem;
                }

                .stress-tracker {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    margin: 2rem 0;
                }

                .stress-buttons {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    margin: 1rem 0;
                }

                .stress-btn {
                    width: 40px;
                    height: 40px;
                    border: none;
                    border-radius: 50%;
                    background: #e0e0e0;
                    cursor: pointer;
                    font-weight: bold;
                }

                .stress-btn:hover {
                    background: #667eea;
                    color: white;
                }

                .new-features {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin: 3rem 0;
                }

                .new-feature {
                    background: rgba(255, 255, 255, 0.9);
                    padding: 1.5rem;
                    border-radius: 10px;
                    text-align: center;
                }

                .new-feature i {
                    font-size: 2rem;
                    color: #667eea;
                    margin-bottom: 1rem;
                }
            </style>
        </head>
        <body>
            <nav>
                <div class="container nav-container">
                    <a href="/" class="logo">
                        <i class="fas fa-spa"></i>
                        <span>Мир спокойствия</span>
                    </a>

                    <ul class="nav-links">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/breathing">Дыхание</a></li>
                        <li><a href="/techniques">Техники</a></li>
                        <li><a href="/statistics">Статистика</a></li>
                        <li><a href="/questionnaire">Анкета</a></li>
                        <li><a href="/journal">Журнал</a></li>
                        <li><a href="/media">Медиа</a></li>
                        <li><a href="/emergency">Помощь</a></li>
                    </ul>
                </div>
            </nav>

            <div class="container">
                <div class="hero">
                    <h1><i class="fas fa-spa"></i> Мир спокойствия</h1>
                    <p>Техники управления стрессом и дыхательные практики</p>

                    <div style="margin-top: 2rem;">
                        <a href="/breathing" style="
                            background: white;
                            color: #667eea;
                            padding: 1rem 2rem;
                            border-radius: 50px;
                            text-decoration: none;
                            font-weight: bold;
                            display: inline-block;
                            margin: 0 1rem;
                        ">
                            <i class="fas fa-wind"></i> Дыхательные упражнения
                        </a>
                        <a href="/emergency" style="
                            background: #ff6b6b;
                            color: white;
                            padding: 1rem 2rem;
                            border-radius: 50px;
                            text-decoration: none;
                            font-weight: bold;
                            display: inline-block;
                            margin: 0 1rem;
                        ">
                            <i class="fas fa-first-aid"></i> Экстренная помощь
                        </a>
                    </div>
                </div>

                <div class="new-features">
                    <a href="/questionnaire" class="new-feature">
                        <i class="fas fa-clipboard-check"></i>
                        <h3>Анкетирование</h3>
                        <p>Оцените своё состояние до и после практик</p>
                    </a>

                    <a href="/journal" class="new-feature">
                        <i class="fas fa-book"></i>
                        <h3>Личный журнал</h3>
                        <p>Записывайте свои мысли и ощущения</p>
                    </a>

                    <a href="/media" class="new-feature">
                        <i class="fas fa-photo-video"></i>
                        <h3>Медитативный контент</h3>
                        <p>Расслабляющие видео и изображения</p>
                    </a>
                </div>

                <div class="features">
                    <a href="/breathing" class="feature-card">
                        <div class="feature-icon"><i class="fas fa-lungs"></i></div>
                        <h3>Дыхательные техники</h3>
                        <p>Практики для снижения тревожности и панических атак</p>
                    </a>

                    <a href="/techniques" class="feature-card">
                        <div class="feature-icon"><i class="fas fa-brain"></i></div>
                        <h3>Медитация</h3>
                        <p>Техники для тренировки внимания и снижения стресса</p>
                    </a>

                    <a href="/statistics" class="feature-card">
                        <div class="feature-icon"><i class="fas fa-heartbeat"></i></div>
                        <h3>Статистика</h3>
                        <p>Анализ вашего прогресса и эффективности практик</p>
                    </a>
                </div>

                <div class="stress-tracker">
                    <h2>Оцените ваш уровень стресса</h2>
                    <p>От 1 (спокоен) до 10 (паника):</p>
                    <div class="stress-buttons">
                        <button class="stress-btn" data-level="1">1</button>
                        <button class="stress-btn" data-level="2">2</button>
                        <button class="stress-btn" data-level="3">3</button>
                        <button class="stress-btn" data-level="4">4</button>
                        <button class="stress-btn" data-level="5">5</button>
                        <button class="stress-btn" data-level="6">6</button>
                        <button class="stress-btn" data-level="7">7</button>
                        <button class="stress-btn" data-level="8">8</button>
                        <button class="stress-btn" data-level="9">9</button>
                        <button class="stress-btn" data-level="10">10</button>
                    </div>

                    <div id="stressResult" style="
                        margin-top: 1rem;
                        padding: 1rem;
                        border-radius: 5px;
                        background: #f0f8ff;
                        display: none;
                    "></div>
                </div>

                <div style="
                    text-align: center;
                    padding: 3rem;
                    background: white;
                    border-radius: 10px;
                    margin: 2rem 0;
                ">
                    <p style="font-style: italic; font-size: 1.2rem;">
                        "Самый большой враг спокойствия - не внешние обстоятельства, а наша реакция на них"
                    </p>
                </div>
            </div>

            <footer>
                <div class="container">
                    <p>© 2025 Мир спокойствия. Создано с заботой о вашем психическом здоровье.</p>
                    <p><small>Информация предоставлена в ознакомительных целях.</small></p>
                </div>
            </footer>

            <script>
                // Трекер стресса
                document.querySelectorAll('.stress-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const level = this.getAttribute('data-level');
                        const result = document.getElementById('stressResult');

                        let message = '';
                        if (level <= 3) {
                            message = 'Низкий уровень стресса. Продолжайте профилактические практики.';
                            result.style.background = '#d4edda';
                            result.style.color = '#155724';
                        } else if (level <= 6) {
                            message = 'Умеренный уровень стресса. Рекомендуется дыхательное упражнение.';
                            result.style.background = '#fff3cd';
                            result.style.color = '#856404';
                        } else {
                            message = 'Высокий уровень стресса. Используйте технику заземления.';
                            result.style.background = '#f8d7da';
                            result.style.color = '#721c24';
                        }

                        result.innerHTML = '<h3>Уровень стресса: ' + level + '/10</h3><p>' + message + '</p>';
                        result.style.display = 'block';

                        // Отправляем на сервер
                        fetch('/api/log-stress', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({level: level, time: new Date().toISOString()})
                        });
                    });
                });
            </script>
        </body>
        </html>
        """

    def get_questionnaire_page(self):
        """Страница анкетирования"""
        return """
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Анкетирование</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    min-height: 100vh;
                }

                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }

                nav {
                    background: white;
                    padding: 1rem 0;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #667eea;
                    text-decoration: none;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    list-style: none;
                }

                .questionnaire-section {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    margin: 2rem 0;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }

                .scale-item {
                    margin: 1.5rem 0;
                    padding: 1rem;
                    background: #f8f9fa;
                    border-radius: 8px;
                }

                .scale-labels {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 0.5rem;
                    font-size: 0.9rem;
                    color: #666;
                }

                input[type="range"] {
                    width: 100%;
                    margin: 0.5rem 0;
                }

                textarea {
                    width: 100%;
                    height: 100px;
                    padding: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-family: inherit;
                    margin: 1rem 0;
                }

                .btn-submit {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 5px;
                    font-size: 1rem;
                    cursor: pointer;
                    margin-top: 1rem;
                    width: 100%;
                }

                .btn-submit:hover {
                    background: #764ba2;
                }

                .message {
                    padding: 1rem;
                    border-radius: 5px;
                    margin: 1rem 0;
                    display: none;
                }

                .success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }

                .error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
            </style>
        </head>
        <body>
            <nav>
                <div class="nav-container">
                    <a href="/" class="logo">
                        <i class="fas fa-spa"></i>
                        <span>Мир спокойствия</span>
                    </a>

                    <ul class="nav-links">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/breathing">Дыхание</a></li>
                        <li><a href="/techniques">Техники</a></li>
                        <li><a href="/statistics">Статистика</a></li>
                        <li><a href="/questionnaire">Анкета</a></li>
                        <li><a href="/journal">Журнал</a></li>
                        <li><a href="/media">Медиа</a></li>
                        <li><a href="/emergency">Помощь</a></li>
                    </ul>
                </div>
            </nav>

            <div class="container">
                <h1 style="text-align: center; color: #333;">
                    <i class="fas fa-clipboard-check"></i> Анкетирование
                </h1>

                <div class="questionnaire-section">
                    <h2>Оцените ваше состояние ДО практики</h2>

                    <div class="scale-item">
                        <label>Уровень тревожности:</label>
                        <input type="range" id="anxiety-before" min="0" max="10" value="5">
                        <div class="scale-labels">
                            <span>Спокойствие</span>
                            <span>Умеренно</span>
                            <span>Сильная тревога</span>
                        </div>
                    </div>

                    <div class="scale-item">
                        <label>Уровень стресса:</label>
                        <input type="range" id="stress-before" min="0" max="10" value="5">
                        <div class="scale-labels">
                            <span>Расслаблен</span>
                            <span>Средне</span>
                            <span>Сильный стресс</span>
                        </div>
                    </div>

                    <div class="scale-item">
                        <label>Настроение:</label>
                        <input type="range" id="mood-before" min="0" max="10" value="5">
                        <div class="scale-labels">
                            <span>Плохое</span>
                            <span>Нормальное</span>
                            <span>Отличное</span>
                        </div>
                    </div>

                    <label>Что вы чувствуете в данный момент?</label>
                    <textarea id="feelings-before" placeholder="Опишите ваши ощущения..."></textarea>
                </div>

                <div class="questionnaire-section">
                    <h2>Оцените ваше состояние ПОСЛЕ практики</h2>

                    <div class="scale-item">
                        <label>Уровень тревожности:</label>
                        <input type="range" id="anxiety-after" min="0" max="10" value="5">
                        <div class="scale-labels">
                            <span>Спокойствие</span>
                            <span>Умеренно</span>
                            <span>Сильная тревога</span>
                        </div>
                    </div>

                    <div class="scale-item">
                        <label>Уровень стресса:</label>
                        <input type="range" id="stress-after" min="0" max="10" value="5">
                        <div class="scale-labels">
                            <span>Расслаблен</span>
                            <span>Средне</span>
                            <span>Сильный стресс</span>
                        </div>
                    </div>

                    <div class="scale-item">
                        <label>Настроение:</label>
                        <input type="range" id="mood-after" min="0" max="10" value="5">
                        <div class="scale-labels">
                            <span>Плохое</span>
                            <span>Нормальное</span>
                            <span>Отличное</span>
                        </div>
                    </div>

                    <label>Как изменились ваши ощущения?</label>
                    <textarea id="feelings-after" placeholder="Опишите изменения..."></textarea>

                    <label>Какая техника вам помогла больше всего?</label>
                    <select id="technique" style="width: 100%; padding: 0.5rem; margin: 1rem 0;">
                        <option value="breathing-4-7-8">Дыхание 4-7-8</option>
                        <option value="breathing-square">Квадратное дыхание</option>
                        <option value="muscle-relaxation">Мышечная релаксация</option>
                        <option value="grounding">Техника заземления</option>
                        <option value="meditation">Медитация</option>
                    </select>
                </div>

                <div id="message" class="message"></div>

                <button class="btn-submit" onclick="submitQuestionnaire()">
                    <i class="fas fa-paper-plane"></i> Отправить анкету
                </button>

                <div style="text-align: center; margin-top: 2rem; color: #666;">
                    <p><small>Ваши ответы помогут нам улучшить сервис. Все данные анонимны.</small></p>
                </div>
            </div>

            <script>
                function submitQuestionnaire() {
                    const questionnaire = {
                        before: {
                            anxiety: document.getElementById('anxiety-before').value,
                            stress: document.getElementById('stress-before').value,
                            mood: document.getElementById('mood-before').value,
                            feelings: document.getElementById('feelings-before').value
                        },
                        after: {
                            anxiety: document.getElementById('anxiety-after').value,
                            stress: document.getElementById('stress-after').value,
                            mood: document.getElementById('mood-after').value,
                            feelings: document.getElementById('feelings-after').value
                        },
                        technique: document.getElementById('technique').value,
                        timestamp: new Date().toISOString()
                    };

                    fetch('/api/submit-feedback', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(questionnaire)
                    })
                    .then(response => response.json())
                    .then(data => {
                        const message = document.getElementById('message');
                        message.textContent = data.message;
                        message.className = 'message success';
                        message.style.display = 'block';

                        if (data.status === 'success') {
                            // Очищаем форму
                            document.querySelectorAll('input[type="range"]').forEach(input => input.value = 5);
                            document.querySelectorAll('textarea').forEach(ta => ta.value = '');
                        }
                    })
                    .catch(error => {
                        const message = document.getElementById('message');
                        message.textContent = 'Ошибка отправки анкеты';
                        message.className = 'message error';
                        message.style.display = 'block';
                    });
                }
            </script>
        </body>
        </html>
        """

    def get_journal_page(self):
        """Страница журнала"""
        return """
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Личный журнал</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
                    min-height: 100vh;
                }

                .container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 20px;
                }

                nav {
                    background: white;
                    padding: 1rem 0;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #667eea;
                    text-decoration: none;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    list-style: none;
                }

                .journal-editor {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    margin: 2rem 0;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }

                textarea {
                    width: 100%;
                    height: 200px;
                    padding: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-family: inherit;
                    font-size: 1rem;
                    margin: 1rem 0;
                    resize: vertical;
                }

                .btn-submit {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 5px;
                    font-size: 1rem;
                    cursor: pointer;
                    margin-top: 1rem;
                }

                .btn-submit:hover {
                    background: #764ba2;
                }

                .journal-entries {
                    margin-top: 3rem;
                }

                .journal-entry {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin: 1rem 0;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.08);
                }

                .entry-date {
                    color: #667eea;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }

                .entry-content {
                    color: #333;
                    line-height: 1.6;
                }

                .message {
                    padding: 1rem;
                    border-radius: 5px;
                    margin: 1rem 0;
                    display: none;
                }

                .success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }

                .mood-selector {
                    display: flex;
                    gap: 0.5rem;
                    margin: 1rem 0;
                    flex-wrap: wrap;
                }

                .mood-btn {
                    padding: 0.5rem 1rem;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .mood-btn:hover, .mood-btn.active {
                    background: #667eea;
                    color: white;
                    border-color: #667eea;
                }
            </style>
        </head>
        <body>
            <nav>
                <div class="nav-container">
                    <a href="/" class="logo">
                        <i class="fas fa-spa"></i>
                        <span>Мир спокойствия</span>
                    </a>

                    <ul class="nav-links">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/breathing">Дыхание</a></li>
                        <li><a href="/techniques">Техники</a></li>
                        <li><a href="/statistics">Статистика</a></li>
                        <li><a href="/questionnaire">Анкета</a></li>
                        <li><a href="/journal">Журнал</a></li>
                        <li><a href="/media">Медиа</a></li>
                        <li><a href="/emergency">Помощь</a></li>
                    </ul>
                </div>
            </nav>

            <div class="container">
                <h1 style="text-align: center; color: #333;">
                    <i class="fas fa-book"></i> Личный журнал ощущений
                </h1>

                <div class="journal-editor">
                    <h2>Новая запись</h2>

                    <div>
                        <label>Как вы себя чувствуете?</label>
                        <div class="mood-selector">
                            <button class="mood-btn" data-mood="happy">😊 Счастлив</button>
                            <button class="mood-btn" data-mood="calm">😌 Спокоен</button>
                            <button class="mood-btn" data-mood="neutral">😐 Нейтрально</button>
                            <button class="mood-btn" data-mood="anxious">😟 Тревожно</button>
                            <button class="mood-btn" data-mood="stressed">😫 Стресс</button>
                            <button class="mood-btn" data-mood="angry">😠 Злость</button>
                        </div>
                    </div>

                    <textarea id="journal-text" placeholder="Опишите ваши мысли, чувства и ощущения. Что вызвало эти эмоции? Как вы справляетесь?"></textarea>

                    <div id="message" class="message"></div>

                    <button class="btn-submit" onclick="saveJournalEntry()">
                        <i class="fas fa-save"></i> Сохранить запись
                    </button>
                </div>

                <div class="journal-entries">
                    <h2>Мои записи</h2>
                    <div id="entries-container">
                        <!-- Записи будут загружаться здесь -->
                    </div>
                </div>
            </div>

            <script>
                let selectedMood = 'neutral';

                // Инициализация выбора настроения
                document.querySelectorAll('.mood-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        selectedMood = this.getAttribute('data-mood');
                    });
                });

                // Активируем кнопку по умолчанию
                document.querySelector('.mood-btn[data-mood="neutral"]').classList.add('active');

                function saveJournalEntry() {
                    const entry = {
                        text: document.getElementById('journal-text').value,
                        mood: selectedMood,
                        timestamp: new Date().toISOString()
                    };

                    if (!entry.text.trim()) {
                        showMessage('Пожалуйста, напишите что-нибудь', 'error');
                        return;
                    }

                    fetch('/api/submit-journal', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(entry)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            showMessage('Запись сохранена успешно!', 'success');
                            document.getElementById('journal-text').value = '';
                            loadJournalEntries();
                        } else {
                            showMessage('Ошибка сохранения: ' + data.message, 'error');
                        }
                    })
                    .catch(error => {
                        showMessage('Ошибка соединения с сервером', 'error');
                    });
                }

                function showMessage(text, type) {
                    const message = document.getElementById('message');
                    message.textContent = text;
                    message.className = 'message ' + type;
                    message.style.display = 'block';

                    setTimeout(() => {
                        message.style.display = 'none';
                    }, 3000);
                }

                function loadJournalEntries() {
                    fetch('/api/journal')
                        .then(response => response.json())
                        .then(data => {
                            const container = document.getElementById('entries-container');
                            if (data.status === 'success' && data.entries && data.entries.length > 0) {
                                container.innerHTML = '';
                                data.entries.forEach(entry => {
                                    const date = new Date(entry.timestamp);
                                    const moodIcons = {
                                        'happy': '😊',
                                        'calm': '😌',
                                        'neutral': '😐',
                                        'anxious': '😟',
                                        'stressed': '😫',
                                        'angry': '😠'
                                    };

                                    const entryHTML = `
                                        <div class="journal-entry">
                                            <div class="entry-date">
                                                ${moodIcons[entry.mood] || '📝'} ${date.toLocaleString('ru-RU')}
                                            </div>
                                            <div class="entry-content">
                                                ${entry.text.replace(/\\n/g, '<br>')}
                                            </div>
                                        </div>
                                    `;
                                    container.insertAdjacentHTML('afterbegin', entryHTML);
                                });
                            } else {
                                container.innerHTML = '<p style="text-align: center; color: #666;">Записей пока нет</p>';
                            }
                        })
                        .catch(error => {
                            console.error('Ошибка загрузки записей:', error);
                        });
                }

                // Загружаем записи при загрузке страницы
                document.addEventListener('DOMContentLoaded', loadJournalEntries);
            </script>
        </body>
        </html>
        """

    def get_media_page(self):
        """Страница медиа"""
        return """
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Медиа</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                    min-height: 100vh;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }

                nav {
                    background: white;
                    padding: 1rem 0;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #667eea;
                    text-decoration: none;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    list-style: none;
                }

                .media-section {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    margin: 2rem 0;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }

                .audio-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin: 2rem 0;
                }

                .audio-card {
                    background: #f8f9fa;
                    padding: 1rem;
                    border-radius: 8px;
                    border-left: 4px solid #667eea;
                }

                .audio-title {
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                    color: #333;
                }

                .audio-description {
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 0.5rem;
                }

                .video-container {
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0;
                    margin: 1rem 0;
                }

                .video-container iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                }

                .meditation-timer {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 2rem;
                    border-radius: 10px;
                    text-align: center;
                    margin: 2rem 0;
                }

                .timer-display {
                    font-size: 3rem;
                    font-weight: bold;
                    margin: 1rem 0;
                }

                .timer-controls {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin: 1rem 0;
                }

                .timer-btn {
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 0.5rem 1.5rem;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <nav>
                <div class="nav-container">
                    <a href="/" class="logo">
                        <i class="fas fa-spa"></i>
                        <span>Мир спокойствия</span>
                    </a>

                    <ul class="nav-links">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/breathing">Дыхание</a></li>
                        <li><a href="/techniques">Техники</a></li>
                        <li><a href="/statistics">Статистика</a></li>
                        <li><a href="/questionnaire">Анкета</a></li>
                        <li><a href="/journal">Журнал</a></li>
                        <li><a href="/media">Медиа</a></li>
                        <li><a href="/emergency">Помощь</a></li>
                    </ul>
                </div>
            </nav>

            <div class="container">
                <h1 style="text-align: center; color: #333;">
                    <i class="fas fa-photo-video"></i> Медиа для релаксации
                </h1>

                <div class="meditation-timer">
                    <h2><i class="fas fa-clock"></i> Таймер медитации</h2>
                    <div class="timer-display" id="timer">05:00</div>
                    <div class="timer-controls">
                        <button class="timer-btn" onclick="startTimer()">▶️ Старт</button>
                        <button class="timer-btn" onclick="pauseTimer()">⏸️ Пауза</button>
                        <button class="timer-btn" onclick="resetTimer()">🔄 Сброс</button>
                    </div>
                    <div style="margin-top: 1rem;">
                        <button class="timer-btn" onclick="setTimer(300)">5 мин</button>
                        <button class="timer-btn" onclick="setTimer(600)">10 мин</button>
                        <button class="timer-btn" onclick="setTimer(900)">15 мин</button>
                    </div>
                </div>

                <div class="media-section">
                    <h2><i class="fas fa-music"></i> Аудио для медитации</h2>

                    <div class="audio-grid">
                        <div class="audio-card">
                            <div class="audio-title">Дзен-медитация</div>
                            <div class="audio-description">Звуки поющих чаш и ветра</div>
                            <audio controls style="width: 100%; margin-top: 0.5rem;">
                                <source src="https://assets.mixkit.co/music/preview/mixkit-zen-meditation-2216.mp3" type="audio/mpeg">
                                Ваш браузер не поддерживает аудио элемент.
                            </audio>
                        </div>

                        <div class="audio-card">
                            <div class="audio-title">Дождь в лесу</div>
                            <div class="audio-description">Успокаивающий звук дождя</div>
                            <audio controls style="width: 100%; margin-top: 0.5rem;">
                                <source src="https://assets.mixkit.co/music/preview/mixkit-rain-forest-1195.mp3" type="audio/mpeg">
                                Ваш браузер не поддерживает аудио элемент.
                            </audio>
                        </div>

                        <div class="audio-card">
                            <div class="audio-title">Морские волны</div>
                            <div class="audio-description">Звук прибоя и чаек</div>
                            <audio controls style="width: 100%; margin-top: 0.5rem;">
                                <source src="https://assets.mixkit.co/music/preview/mixkit-sea-waves-1185.mp3" type="audio/mpeg">
                                Ваш браузер не поддерживает аудио элемент.
                            </audio>
                        </div>

                        <div class="audio-card">
                            <div class="audio-title">Тропический лес</div>
                            <div class="audio-description">Звуки тропического леса с птицами</div>
                            <audio controls style="width: 100%; margin-top: 0.5rem;">
                                <source src="https://assets.mixkit.co/music/preview/mixkit-tropical-forest-1194.mp3" type="audio/mpeg">
                                Ваш браузер не поддерживает аудио элемент.
                            </audio>
                        </div>

                        <div class="audio-card">
                            <div class="audio-title">Костер</div>
                            <div class="audio-description">Треск костра для расслабления</div>
                            <audio controls style="width: 100%; margin-top: 0.5rem;">
                                <source src="https://assets.mixkit.co/music/preview/mixkit-campfire-crackles-1330.mp3" type="audio/mpeg">
                                Ваш браузер не поддерживает аудио элемент.
                            </audio>
                        </div>

                        <div class="audio-card">
                            <div class="audio-title">Ручей в горах</div>
                            <div class="audio-description">Звук горного ручья</div>
                            <audio controls style="width: 100%; margin-top: 0.5rem;">
                                <source src="https://assets.mixkit.co/music/preview/mixkit-mountain-stream-1191.mp3" type="audio/mpeg">
                                Ваш браузер не поддерживает аудио элемент.
                            </audio>
                        </div>

                        <div class="audio-card">
                            <div class="audio-title">Белый шум</div>
                            <div class="audio-description">Белый шум для концентрации</div>
                            <audio controls style="width: 100%; margin-top: 0.5rem;">
                                <source src="https://assets.mixkit.co/music/preview/mixkit-white-noise-246.mp3" type="audio/mpeg">
                                Ваш браузер не поддерживает аудио элемент.
                            </audio>
                        </div>

                        <div class="audio-card">
                            <div class="audio-title">Медитативная музыка</div>
                            <div class="audio-description">Мягкая медитативная музыка</div>
                            <audio controls style="width: 100%; margin-top: 0.5rem;">
                                <source src="https://assets.mixkit.co/music/preview/mixkit-meditative-2218.mp3" type="audio/mpeg">
                                Ваш браузер не поддерживает аудио элемент.
                            </audio>
                        </div>
                    </div>
                </div>

                <div class="media-section">
                    <h2><i class="fas fa-water"></i> Видео природы</h2>
                    <div class="video-container">
                        <iframe src="https://www.youtube.com/embed/2OEL4P1Rz04?rel=0&amp;controls=1&amp;showinfo=0" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                        </iframe>
                    </div>
                    <p style="text-align: center; color: #666; margin-top: 1rem;">
                        Видео с успокаивающими звуками природы для медитации и релаксации
                    </p>
                </div>
            </div>

            <script>
                let timerInterval;
                let timerSeconds = 300;
                let isTimerRunning = false;

                function updateTimerDisplay() {
                    const minutes = Math.floor(timerSeconds / 60);
                    const seconds = timerSeconds % 60;
                    document.getElementById('timer').textContent = 
                        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }

                function startTimer() {
                    if (isTimerRunning) return;
                    isTimerRunning = true;

                    timerInterval = setInterval(() => {
                        if (timerSeconds > 0) {
                            timerSeconds--;
                            updateTimerDisplay();
                        } else {
                            clearInterval(timerInterval);
                            isTimerRunning = false;
                            alert('⏰ Время медитации истекло! Сделайте глубокий вдох и медленный выдох.');
                        }
                    }, 1000);
                }

                function pauseTimer() {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                }

                function resetTimer() {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    timerSeconds = 300;
                    updateTimerDisplay();
                }

                function setTimer(seconds) {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    timerSeconds = seconds;
                    updateTimerDisplay();
                }

                updateTimerDisplay();
            </script>
        </body>
        </html>
        """

    def get_statistics_page(self):
        """Страница статистики"""
        return """
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Статистика</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    min-height: 100vh;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }

                nav {
                    background: white;
                    padding: 1rem 0;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #667eea;
                    text-decoration: none;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    list-style: none;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin: 2rem 0;
                }

                .stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    text-align: center;
                }

                .stat-icon {
                    font-size: 2rem;
                    color: #667eea;
                    margin-bottom: 1rem;
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #333;
                    margin: 0.5rem 0;
                }

                .stat-label {
                    color: #666;
                    font-size: 0.9rem;
                }

                .data-section {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    margin: 2rem 0;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
            </style>
        </head>
        <body>
            <nav>
                <div class="nav-container">
                    <a href="/" class="logo">
                        <i class="fas fa-spa"></i>
                        <span>Мир спокойствия</span>
                    </a>

                    <ul class="nav-links">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/breathing">Дыхание</a></li>
                        <li><a href="/techniques">Техники</a></li>
                        <li><a href="/statistics">Статистика</a></li>
                        <li><a href="/questionnaire">Анкета</a></li>
                        <li><a href="/journal">Журнал</a></li>
                        <li><a href="/media">Медиа</a></li>
                        <li><a href="/emergency">Помощь</a></li>
                    </ul>
                </div>
            </nav>

            <div class="container">
                <h1 style="text-align: center; color: #333;">
                    <i class="fas fa-chart-bar"></i> Статистика
                </h1>

                <div class="stats-grid" id="stats-grid">
                    <!-- Статистика будет загружена динамически -->
                </div>

                <div class="data-section">
                    <h2><i class="fas fa-database"></i> Данные сервера</h2>
                    <div id="server-data" style="text-align: center; padding: 1rem;">
                        Загрузка данных...
                    </div>
                </div>
            </div>

            <script>
                function loadStatistics() {
                    fetch('/api/stats/summary')
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                updateStatsGrid(data);
                                updateServerData(data);
                            }
                        })
                        .catch(error => {
                            console.error('Ошибка загрузки статистики:', error);
                        });
                }

                function updateStatsGrid(data) {
                    const grid = document.getElementById('stats-grid');
                    const stats = data.stats;

                    const statCards = `
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-file-signature"></i></div>
                            <div class="stat-value">${stats.totalQuestionnaires || 0}</div>
                            <div class="stat-label">Заполненных анкет</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-book"></i></div>
                            <div class="stat-value">${stats.totalJournalEntries || 0}</div>
                            <div class="stat-label">Записей в журнале</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-heartbeat"></i></div>
                            <div class="stat-value">${stats.avgStressReduction || 0}%</div>
                            <div class="stat-label">Снижение стресса</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-history"></i></div>
                            <div class="stat-value">${stats.totalStressLogs || 0}</div>
                            <div class="stat-label">Измерений стресса</div>
                        </div>
                    `;

                    grid.innerHTML = statCards;
                }

                function updateServerData(data) {
                    const container = document.getElementById('server-data');
                    const stats = data.stats;

                    const html = `
                        <p><strong>Всего данных:</strong> ${stats.totalQuestionnaires + stats.totalJournalEntries + stats.totalStressLogs}</p>
                        <p><strong>Среднее снижение стресса:</strong> ${stats.avgStressReduction || 0}%</p>
                        <p><strong>Последнее обновление:</strong> ${new Date().toLocaleString('ru-RU')}</p>
                    `;

                    container.innerHTML = html;
                }

                document.addEventListener('DOMContentLoaded', loadStatistics);
            </script>
        </body>
        </html>
        """

    def get_breathing_page(self):
        """Страница дыхательных упражнений"""
        return """
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Дыхательные практики</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
                    min-height: 100vh;
                }

                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px;
                }

                nav {
                    background: white;
                    padding: 1rem 0;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #667eea;
                    text-decoration: none;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    list-style: none;
                }

                .technique-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    margin: 2rem 0;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }

                .breathing-animation {
                    width: 200px;
                    height: 200px;
                    margin: 2rem auto;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 2rem;
                    font-weight: bold;
                    animation: breathe 8s infinite ease-in-out;
                }

                @keyframes breathe {
                    0%, 100% { transform: scale(0.8); }
                    33% { transform: scale(1.2); }
                    66% { transform: scale(1); }
                }

                .steps {
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                }

                .steps li {
                    margin: 0.5rem 0;
                }

                .btn-start {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 5px;
                    font-size: 1rem;
                    cursor: pointer;
                    margin-top: 1rem;
                    width: 100%;
                }

                .btn-start:hover {
                    background: #764ba2;
                }
            </style>
        </head>
        <body>
            <nav>
                <div class="nav-container">
                    <a href="/" class="logo">
                        <i class="fas fa-spa"></i>
                        <span>Мир спокойствия</span>
                    </a>

                    <ul class="nav-links">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/breathing">Дыхание</a></li>
                        <li><a href="/techniques">Техники</a></li>
                        <li><a href="/statistics">Статистика</a></li>
                        <li><a href="/questionnaire">Анкета</a></li>
                        <li><a href="/journal">Журнал</a></li>
                        <li><a href="/media">Медиа</a></li>
                        <li><a href="/emergency">Помощь</a></li>
                    </ul>
                </div>
            </nav>

            <div class="container">
                <h1 style="text-align: center; color: #333;">
                    <i class="fas fa-lungs"></i> Дыхательные практики
                </h1>

                <div class="technique-card">
                    <h2>Техника 4-7-8</h2>
                    <p>Эта техника помогает быстро успокоиться и снизить тревожность.</p>

                    <div class="breathing-animation" id="breathing-circle">
                        Дышите
                    </div>

                    <h3>Шаги:</h3>
                    <ol class="steps">
                        <li>Сядьте в удобное положение, выпрямите спину</li>
                        <li>Медленно вдохните через нос на 4 счета</li>
                        <li>Задержите дыхание на 7 счетов</li>
                        <li>Медленно выдохните через рот на 8 счетов</li>
                        <li>Повторите 4-5 раз</li>
                    </ol>

                    <button class="btn-start" onclick="startBreathing()">
                        <i class="fas fa-play"></i> Начать упражнение
                    </button>
                </div>

                <div class="technique-card">
                    <h2>Квадратное дыхание</h2>
                    <p>Техника для концентрации и снятия напряжения.</p>

                    <h3>Шаги:</h3>
                    <ol class="steps">
                        <li>Вдохните через нос на 4 счета</li>
                        <li>Задержите дыхание на 4 счета</li>
                        <li>Выдохните через нос на 4 счета</li>
                        <li>Задержите дыхание на 4 счета</li>
                        <li>Повторите 5-10 раз</li>
                    </ol>
                </div>

                <div class="technique-card">
                    <h2>Диафрагмальное дыхание</h2>
                    <p>Дыхание животом для глубокого расслабления.</p>

                    <h3>Шаги:</h3>
                    <ol class="steps">
                        <li>Лягте на спину или сядьте удобно</li>
                        <li>Положите одну руку на грудь, другую на живот</li>
                        <li>Медленно вдохните через нос, наполняя живот воздухом</li>
                        <li>Рука на животе должна подниматься, на груди - оставаться неподвижной</li>
                        <li>Медленно выдохните через слегка сжатые губы</li>
                        <li>Повторите 5-10 раз</li>
                    </ol>
                </div>
            </div>

            <script>
                let isBreathing = false;
                let breathingInterval;

                function startBreathing() {
                    if (isBreathing) {
                        clearInterval(breathingInterval);
                        document.querySelector('.btn-start').innerHTML = '<i class="fas fa-play"></i> Начать упражнение';
                        document.getElementById('breathing-circle').textContent = 'Дышите';
                        isBreathing = false;
                    } else {
                        document.querySelector('.btn-start').innerHTML = '<i class="fas fa-stop"></i> Остановить';

                        let step = 0;
                        const steps = ['Вдох', 'Задержка', 'Выдох', 'Пауза'];
                        const times = [4000, 7000, 8000, 2000];

                        breathingInterval = setInterval(() => {
                            const circle = document.getElementById('breathing-circle');
                            circle.textContent = steps[step];
                            circle.style.animation = 'none';
                            setTimeout(() => {
                                circle.style.animation = 'breathe 8s infinite ease-in-out';
                            }, 10);

                            step = (step + 1) % steps.length;
                        }, 4000); // Изменяем каждые 4 секунды

                        isBreathing = true;

                        // Отправляем запрос на сервер
                        fetch('/api/start-breathing', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({technique: '4-7-8', startTime: new Date().toISOString()})
                        });
                    }
                }
            </script>
        </body>
        </html>
        """

    def get_techniques_page(self):
        """Страница техник релаксации"""
        return """
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Техники релаксации</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
                    min-height: 100vh;
                }

                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px;
                }

                nav {
                    background: white;
                    padding: 1rem 0;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #667eea;
                    text-decoration: none;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    list-style: none;
                }

                .technique-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    margin: 2rem 0;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }

                .steps {
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                }

                .steps li {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                }

                .benefits {
                    background: #f0f8ff;
                    padding: 1rem;
                    border-radius: 8px;
                    margin: 1rem 0;
                    border-left: 4px solid #667eea;
                }

                .benefits h4 {
                    margin-top: 0;
                    color: #667eea;
                }
            </style>
        </head>
        <body>
            <nav>
                <div class="nav-container">
                    <a href="/" class="logo">
                        <i class="fas fa-spa"></i>
                        <span>Мир спокойствия</span>
                    </a>

                    <ul class="nav-links">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/breathing">Дыхание</a></li>
                        <li><a href="/techniques">Техники</a></li>
                        <li><a href="/statistics">Статистика</a></li>
                        <li><a href="/questionnaire">Анкета</a></li>
                        <li><a href="/journal">Журнал</a></li>
                        <li><a href="/media">Медиа</a></li>
                        <li><a href="/emergency">Помощь</a></li>
                    </ul>
                </div>
            </nav>

            <div class="container">
                <h1 style="text-align: center; color: #333;">
                    <i class="fas fa-brain"></i> Техники релаксации
                </h1>

                <div class="technique-card">
                    <h2>Прогрессивная мышечная релаксация</h2>
                    <p>Техника поочередного напряжения и расслабления мышц для снятия физического напряжения.</p>

                    <div class="benefits">
                        <h4>Преимущества:</h4>
                        <ul>
                            <li>Снижение мышечного напряжения</li>
                            <li>Улучшение сна</li>
                            <li>Снижение тревожности</li>
                            <li>Повышение осознанности тела</li>
                        </ul>
                    </div>

                    <h3>Шаги:</h3>
                    <ol class="steps">
                        <li>Сядьте или лягте в удобное положение</li>
                        <li>Начните с мышц лица - сильно зажмурьтесь на 5 секунд, затем расслабьте на 30 секунд</li>
                        <li>Напрягите мышцы шеи и плеч, подняв плечи к ушам на 5 секунд, затем расслабьте</li>
                        <li>Сожмите кулаки на 5 секунд, затем расслабьте руки</li>
                        <li>Напрягите мышцы живота на 5 секунд, затем расслабьте</li>
                        <li>Напрягите мышцы ног, вытянув носки на 5 секунд, затем расслабьте</li>
                        <li>Повторите весь цикл 2-3 раза</li>
                    </ol>
                </div>

                <div class="technique-card">
                    <h2>Техника заземления 5-4-3-2-1</h2>
                    <p>Метод для возвращения в настоящее при тревоге или панической атаке.</p>

                    <div class="benefits">
                        <h4>Преимущества:</h4>
                        <ul>
                            <li>Быстрое снижение тревоги</li>
                            <li>Возвращение в настоящее</li>
                            <li>Улучшение концентрации</li>
                            <li>Простота выполнения</li>
                        </ul>
                    </div>

                    <h3>Шаги:</h3>
                    <ol class="steps">
                        <li><strong>5 вещей, которые вы видите:</strong> найдите и назовите 5 предметов вокруг</li>
                        <li><strong>4 вещи, которые вы чувствуете:</strong> обратите внимание на 4 тактильных ощущения</li>
                        <li><strong>3 вещи, которые вы слышите:</strong> прислушайтесь к 3 звукам вокруг</li>
                        <li><strong>2 вещи, которые вы чувствуете на запах:</strong> найдите 2 запаха</li>
                        <li><strong>1 вещь, которую вы можете попробовать на вкус:</strong> обратите внимание на вкус во рту</li>
                    </ol>
                </div>

                <div class="technique-card">
                    <h2>Визуализация безопасного места</h2>
                    <p>Техника мысленного создания успокаивающего образа для расслабления.</p>

                    <div class="benefits">
                        <h4>Преимущества:</h4>
                        <ul>
                            <li>Снижение стресса</li>
                            <li>Развитие воображения</li>
                            <li>Создание внутреннего ресурса спокойствия</li>
                            <li>Улучшение настроения</li>
                        </ul>
                    </div>

                    <h3>Шаги:</h3>
                    <ol class="steps">
                        <li>Закройте глаза и сделайте 3 глубоких вдоха</li>
                        <li>Представьте место, где вы чувствуете себя абсолютно безопасно и спокойно</li>
                        <li>Добавьте детали: какие цвета вы видите? Какие звуки слышите?</li>
                        <li>Какие запахи чувствуете? Какие тактильные ощущения?</li>
                        <li>Побудьте в этом месте 5-10 минут, наслаждаясь ощущением безопасности</li>
                        <li>Медленно вернитесь в настоящее, сделав глубокий вдох</li>
                    </ol>
                </div>

                <div class="technique-card">
                    <h2>Медитация осознанности</h2>
                    <p>Практика наблюдения за мыслями и чувствами без оценки.</p>

                    <div class="benefits">
                        <h4>Преимущества:</h4>
                        <ul>
                            <li>Улучшение концентрации</li>
                            <li>Снижение реактивности</li>
                            <li>Повышение самосознания</li>
                            <li>Снижение уровня кортизола</li>
                        </ul>
                    </div>

                    <h3>Шаги:</h3>
                    <ol class="steps">
                        <li>Сядьте удобно с прямой спиной</li>
                        <li>Закройте глаза и сосредоточьтесь на дыхании</li>
                        <li>Когда мысли приходят, просто отмечайте их и возвращайтесь к дыханию</li>
                        <li>Не пытайтесь остановить мысли, просто наблюдайте за ними</li>
                        <li>Начните с 5 минут в день, постепенно увеличивая время</li>
                        <li>Будьте добры к себе, если ум часто отвлекается</li>
                    </ol>
                </div>
            </div>
        </body>
        </html>
        """

    def get_emergency_page(self):
        """Страница экстренной помощи"""
        return """
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Экстренная помощь</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
                    min-height: 100vh;
                }

                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px;
                }

                nav {
                    background: white;
                    padding: 1rem 0;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #667eea;
                    text-decoration: none;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    list-style: none;
                }

                .emergency-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    margin: 2rem 0;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    border-left: 6px solid #ff6b6b;
                }

                .hotline {
                    background: #ff6b6b;
                    color: white;
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin: 1rem 0;
                    text-align: center;
                }

                .hotline-number {
                    font-size: 2rem;
                    font-weight: bold;
                    margin: 0.5rem 0;
                }

                .technique-card {
                    background: #f0f8ff;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin: 1rem 0;
                    border-left: 4px solid #667eea;
                }

                .btn-calm {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 5px;
                    font-size: 1rem;
                    cursor: pointer;
                    margin-top: 1rem;
                    width: 100%;
                }

                .btn-calm:hover {
                    background: #764ba2;
                }

                .breathing-guide {
                    text-align: center;
                    margin: 2rem 0;
                    padding: 1rem;
                    background: #e3f2fd;
                    border-radius: 10px;
                }

                .count {
                    font-size: 3rem;
                    font-weight: bold;
                    color: #667eea;
                    margin: 1rem 0;
                }
            </style>
        </head>
        <body>
            <nav>
                <div class="nav-container">
                    <a href="/" class="logo">
                        <i class="fas fa-spa"></i>
                        <span>Мир спокойствия</span>
                    </a>

                    <ul class="nav-links">
                        <li><a href="/">Главная</a></li>
                        <li><a href="/breathing">Дыхание</a></li>
                        <li><a href="/techniques">Техники</a></li>
                        <li><a href="/statistics">Статистика</a></li>
                        <li><a href="/questionnaire">Анкета</a></li>
                        <li><a href="/journal">Журнал</a></li>
                        <li><a href="/media">Медиа</a></li>
                        <li><a href="/emergency">Помощь</a></li>
                    </ul>
                </div>
            </nav>

            <div class="container">
                <h1 style="text-align: center; color: #333;">
                    <i class="fas fa-first-aid"></i> Экстренная помощь при стрессе
                </h1>

                <div class="hotline">
                    <h3><i class="fas fa-phone"></i> Телефоны доверия (Россия):</h3>
                    <div class="hotline-number">8-800-2000-122</div>
                    <p>Единый общероссийский телефон доверия для детей, подростков и их родителей</p>
                    <div class="hotline-number">8-800-333-44-34</div>
                    <p>Кризисная линия доверия (круглосуточно, бесплатно)</p>
                </div>

                <div class="emergency-card">
                    <h2>Если прямо сейчас тяжело:</h2>

                    <div class="breathing-guide">
                        <h3>ДЫШИТЕ СО МНОЙ</h3>
                        <div class="count" id="breath-count">4</div>
                        <p id="breath-instruction">Вдох</p>
                        <button class="btn-calm" onclick="startCalmBreathing()">
                            <i class="fas fa-play"></i> Начать успокаивающее дыхание
                        </button>
                    </div>

                    <div class="technique-card">
                        <h4>Техника заземления 5-4-3-2-1 (сделайте прямо сейчас):</h4>
                        <ol>
                            <li>Назовите <strong>5</strong> вещей, которые видите вокруг</li>
                            <li>Почувствуйте <strong>4</strong> тактильных ощущения (одежда, пол, воздух)</li>
                            <li>Услышьте <strong>3</strong> звука в комнате</li>
                            <li>Обнаружьте <strong>2</strong> запаха</li>
                            <li>Почувствуйте <strong>1</strong> вкус во рту</li>
                        </ol>
                    </div>

                    <div class="technique-card">
                        <h4>Физическое заземление:</h4>
                        <ul>
                            <li>Опустите руки в холодную воду</li>
                            <li>Сожмите и разожмите кулаки 10 раз</li>
                            <li>Попрыгайте на месте 30 секунд</li>
                            <li>Обнимите себя крепко</li>
                            <li>Потянитесь как кошка</li>
                        </ul>
                    </div>
                </div>

                <div class="emergency-card">
                    <h2>Что делать при панической атаке:</h2>

                    <ol>
                        <li><strong>Напомните себе:</strong> "Это паническая атака, она пройдет"</li>
                        <li><strong>Сосредоточьтесь на дыхании:</strong> вдох на 4, задержка на 4, выдох на 6</li>
                        <li><strong>Заземлитесь:</strong> найдите опору для рук или ног</li>
                        <li><strong>Используйте холод:</strong> приложите что-то холодное к запястьям или лицу</li>
                        <li><strong>Не сопротивляйтесь:</strong> позвольте чувствам быть, они пройдут</li>
                        <li><strong>После приступа:</strong> выпейте воды, отдохните, похвалите себя</li>
                    </ol>
                </div>

                <div class="emergency-card">
                    <h2>Экстренный план самопомощи:</h2>

                    <h4>Шаг 1: Физическое успокоение (выберите одно):</h4>
                    <ul>
                        <li>Дыхание 4-7-8</li>
                        <li>Прогулка быстрым шагом 10 минут</li>
                        <li>Контрастный душ</li>
                        <li>Массаж рук или стоп</li>
                    </ul>

                    <h4>Шаг 2: Эмоциональная разрядка (выберите одно):</h4>
                    <ul>
                        <li>Напишите все, что чувствуете, на бумаге</li>
                        <li>Поплачьте, если хочется</li>
                        <li>Поговорите с кем-то, кому доверяете</li>
                        <li>Послушайте успокаивающую музыку</li>
                    </ul>

                    <h4>Шаг 3: Отвлечение внимания (выберите одно):</h4>
                    <ul>
                        <li>Сосчитайте предметы определенного цвета в комнате</li>
                        <li>Назовите все, что видите, начиная с буквы А</li>
                        <li>Решите простую математическую задачу</li>
                        <li>Вспомните слова песни или стихотворения</li>
                    </ul>
                </div>

                <div class="emergency-card">
                    <h2>Когда обращаться за профессиональной помощью:</h2>

                    <ul>
                        <li>Панические атаки случаются чаще 2 раз в неделю</li>
                        <li>Тревога мешает работать, учиться, общаться</li>
                        <li>Появились мысли о самоповреждении</li>
                        <li>Нарушен сон более 2 недель</li>
                        <li>Потеря аппетита или переедание</li>
                        <li>Чувство безнадежности длится более 2 недель</li>
                    </ul>

                    <p style="margin-top: 1rem; font-style: italic;">
                        <strong>Важно:</strong> Обращение за помощью - признак силы, а не слабости. 
                        Психологи и психотерапевты обучены помогать в таких ситуациях.
                    </p>
                </div>
            </div>

            <script>
                let isCalmBreathing = false;
                let calmInterval;
                let breathPhase = 'inhale';
                let count = 4;

                function startCalmBreathing() {
                    if (isCalmBreathing) {
                        clearInterval(calmInterval);
                        document.querySelector('.btn-calm').innerHTML = '<i class="fas fa-play"></i> Начать успокаивающее дыхание';
                        document.getElementById('breath-count').textContent = '4';
                        document.getElementById('breath-instruction').textContent = 'Вдох';
                        isCalmBreathing = false;
                    } else {
                        document.querySelector('.btn-calm').innerHTML = '<i class="fas fa-stop"></i> Остановить';

                        count = 4;
                        breathPhase = 'inhale';

                        calmInterval = setInterval(() => {
                            const countElement = document.getElementById('breath-count');
                            const instructionElement = document.getElementById('breath-instruction');

                            countElement.textContent = count;

                            if (breathPhase === 'inhale') {
                                instructionElement.textContent = 'Вдох';
                                if (count === 1) {
                                    breathPhase = 'hold';
                                    count = 4;
                                } else {
                                    count--;
                                }
                            } else if (breathPhase === 'hold') {
                                instructionElement.textContent = 'Задержка';
                                if (count === 1) {
                                    breathPhase = 'exhale';
                                    count = 6;
                                } else {
                                    count--;
                                }
                            } else if (breathPhase === 'exhale') {
                                instructionElement.textContent = 'Выдох';
                                if (count === 1) {
                                    breathPhase = 'inhale';
                                    count = 4;
                                } else {
                                    count--;
                                }
                            }
                        }, 1000);

                        isCalmBreathing = true;
                    }
                }

                // Автоматически запускаем успокаивающее дыхание при загрузке страницы
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(startCalmBreathing, 2000);
                });
            </script>
        </body>
        </html>
        """

    def html_response(self, html):
        headers = [
            "HTTP/1.1 200 OK",
            "Content-Type: text/html; charset=utf-8",
            f"Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}",
            "Connection: close",
            f"Content-Length: {len(html.encode('utf-8'))}",
            "",
            html
        ]
        return "\r\n".join(headers)

    def json_response(self, data):
        json_data = json.dumps(data, ensure_ascii=False, indent=2)
        headers = [
            "HTTP/1.1 200 OK",
            "Content-Type: application/json; charset=utf-8",
            "Access-Control-Allow-Origin: *",
            f"Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}",
            "Connection: close",
            f"Content-Length: {len(json_data.encode('utf-8'))}",
            "",
            json_data
        ]
        return "\r\n".join(headers)

    def css_response(self):
        css = """body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }"""
        headers = [
            "HTTP/1.1 200 OK",
            "Content-Type: text/css; charset=utf-8",
            f"Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}",
            "Connection: close",
            f"Content-Length: {len(css.encode('utf-8'))}",
            "",
            css
        ]
        return "\r\n".join(headers)

    def js_response(self):
        js = """console.log('Сайт для управления стрессом загружен');"""
        headers = [
            "HTTP/1.1 200 OK",
            "Content-Type: application/javascript; charset=utf-8",
            f"Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}",
            "Connection: close",
            f"Content-Length: {len(js.encode('utf-8'))}",
            "",
            js
        ]
        return "\r\n".join(headers)

    def favicon_response(self):
        headers = [
            "HTTP/1.1 204 No Content",
            f"Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}",
            "Connection: close",
            "",
            ""
        ]
        return "\r\n".join(headers)

    def error_response(self, code, message):
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
        headers = [
            f"HTTP/1.1 {code} {'Not Found' if code == 404 else 'Error'}",
            "Content-Type: text/html; charset=utf-8",
            f"Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}",
            "Connection: close",
            f"Content-Length: {len(html.encode('utf-8'))}",
            "",
            html
        ]
        return "\r\n".join(headers)

    def handle_stress_log(self, request_data):
        try:
            lines = request_data.split('\n')
            body_start = False
            body = ""

            for line in lines:
                if line == '':
                    body_start = True
                    continue
                if body_start:
                    body += line

            data = json.loads(body) if body else {}

            # Сохраняем лог стресса
            stress_entry = {
                "level": int(data.get('level', 0)),
                "timestamp": datetime.now().isoformat()
            }
            self.stress_logs.append(stress_entry)

            print(f"Получен уровень стресса: {stress_entry['level']}")

            return self.json_response({
                "status": "success",
                "message": "Уровень стресса записан",
                "timestamp": stress_entry['timestamp'],
                "level": stress_entry['level']
            })

        except json.JSONDecodeError:
            return self.json_response({
                "status": "error",
                "message": "Неверный формат JSON"
            })
        except Exception as e:
            return self.json_response({
                "status": "error",
                "message": f"Ошибка: {str(e)}"
            })

    def handle_feedback_submission(self, request_data):
        """Обработка отправки анкеты"""
        try:
            lines = request_data.split('\n')
            body_start = False
            body = ""

            for line in lines:
                if line == '':
                    body_start = True
                    continue
                if body_start:
                    body += line

            data = json.loads(body) if body else {}

            # Сохраняем анкету
            questionnaire_entry = {
                "data": data,
                "timestamp": datetime.now().isoformat()
            }
            self.questionnaires.append(questionnaire_entry)

            print(f"Получена анкета №{len(self.questionnaires)} от пользователя")

            return self.json_response({
                "status": "success",
                "message": "Анкета успешно отправлена! Спасибо за ваши ответы.",
                "timestamp": questionnaire_entry['timestamp'],
                "questionnaire_id": len(self.questionnaires)
            })

        except json.JSONDecodeError:
            return self.json_response({
                "status": "error",
                "message": "Неверный формат данных"
            })
        except Exception as e:
            return self.json_response({
                "status": "error",
                "message": f"Ошибка обработки: {str(e)}"
            })

    def handle_journal_submission(self, request_data):
        """Обработка отправки записи в журнал"""
        try:
            lines = request_data.split('\n')
            body_start = False
            body = ""

            for line in lines:
                if line == '':
                    body_start = True
                    continue
                if body_start:
                    body += line

            data = json.loads(body) if body else {}

            # Сохраняем запись в журнал
            journal_entry = {
                "text": data.get("text", ""),
                "mood": data.get("mood", "neutral"),
                "timestamp": datetime.now().isoformat()
            }
            self.journal_entries.append(journal_entry)

            print(f"Получена запись в журнал №{len(self.journal_entries)}: {journal_entry['mood']}")

            return self.json_response({
                "status": "success",
                "message": "Запись сохранена в вашем журнале",
                "timestamp": journal_entry['timestamp'],
                "entry_id": len(self.journal_entries)
            })

        except json.JSONDecodeError:
            return self.json_response({
                "status": "error",
                "message": "Неверный формат данных"
            })
        except Exception as e:
            return self.json_response({
                "status": "error",
                "message": f"Ошибка обработки: {str(e)}"
            })

    def get_stats(self):
        return {
            "status": "success",
            "data": {
                "server": "Сервер управления стрессом",
                "version": "1.2.0",
                "timestamp": datetime.now().isoformat(),
                "questionnaires_count": len(self.questionnaires),
                "journal_entries_count": len(self.journal_entries),
                "stress_logs_count": len(self.stress_logs)
            }
        }

    def get_stats_summary(self):
        """Полная статистика для страницы статистики"""
        # Анализ анкет
        stress_reductions = []
        mood_distribution = {}
        techniques_stats = {}

        for q in self.questionnaires:
            before = q.get('data', {}).get('before', {})
            after = q.get('data', {}).get('after', {})

            if before.get('stress') and after.get('stress'):
                reduction = int(before['stress']) - int(after['stress'])
                if reduction > 0:
                    stress_reductions.append(reduction)

            technique = q.get('data', {}).get('technique')
            if technique:
                techniques_stats[technique] = techniques_stats.get(technique, 0) + 1

        # Распределение настроений из журнала
        for entry in self.journal_entries:
            mood = entry.get('mood', 'neutral')
            mood_distribution[mood] = mood_distribution.get(mood, 0) + 1

        avg_stress_reduction = round((sum(stress_reductions) / len(stress_reductions) * 10)) if stress_reductions else 0

        return {
            "status": "success",
            "stats": {
                "totalQuestionnaires": len(self.questionnaires),
                "totalJournalEntries": len(self.journal_entries),
                "totalStressLogs": len(self.stress_logs),
                "avgStressReduction": avg_stress_reduction,
                "avgPracticeDuration": 15
            },
            "moodDistribution": mood_distribution,
            "techniquesStats": techniques_stats
        }

    def get_questionnaires(self):
        """Получение всех анкет"""
        return {
            "status": "success",
            "questionnaires": self.questionnaires[-50:],
            "total": len(self.questionnaires),
            "timestamp": datetime.now().isoformat()
        }

    def get_journal(self):
        """Получение всех записей журнала"""
        return {
            "status": "success",
            "entries": self.journal_entries[-50:],
            "total": len(self.journal_entries),
            "timestamp": datetime.now().isoformat()
        }

    def get_feedback(self):
        """Получение всех отзывов (для обратной совместимости)"""
        return {
            "status": "success",
            "journalEntries": self.journal_entries[-10:],
            "questionnairesCount": len(self.questionnaires),
            "totalEntries": len(self.journal_entries) + len(self.questionnaires),
            "timestamp": datetime.now().isoformat()
        }

    def get_techniques(self):
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
    print("САЙТ ДЛЯ УПРАВЛЕНИЯ СТРЕССОМ v1.2")
    print("=" * 50)
    print("Новые функции:")
    print("  • Раздельное хранение анкет и записей журнала")
    print("  • Детальная статистика эффективности практик")
    print("  • 10 аудиодорожек для медитации")
    print("  • Анализ настроений и эффективности техник")
    print("=" * 50)

    ports_to_try = [5000, 5001, 5002, 8080, 8000]

    for port in ports_to_try:
        server = SimpleHTTPServer(port=port)
        print(f"Пробуем запустить на порту {port}...")

        if server.start():
            print(f"Сервер успешно запущен на порту {port}")
            print(f"Откройте в браузере: http://localhost:{port}")
            print("=" * 50)
            print("Доступные страницы:")
            print("   • Главная: /")
            print("   • Дыхательные практики: /breathing")
            print("   • Техники релаксации: /techniques")
            print("   • Статистика и анализ: /statistics")
            print("   • Анкетирование: /questionnaire")
            print("   • Личный журнал: /journal")
            print("   • Медиа контент (8 аудио): /media")
            print("   • Экстренная помощь: /emergency")
            print("=" * 50)
            print("Для остановки нажмите Ctrl+C")

            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                server.stop()
                print("\nСтатистика сервера:")
                print(f"  • Анкет сохранено: {len(server.questionnaires)}")
                print(f"  • Записей в журнале: {len(server.journal_entries)}")
                print(f"  • Логов стресса: {len(server.stress_logs)}")
                break
        else:
            print(f"Порт {port} занят, пробуем следующий...")
            continue


if __name__ == "__main__":
    main()