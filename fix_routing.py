import os
import glob

base_dir = r"e:\YA\YandexDisk\Latex\Проекты 10С\Проекты\Почкина\ИТ проект\world-of-tranquility"

# Fix HTML templates
templates_dir = os.path.join(base_dir, "templates")
for filepath in glob.glob(os.path.join(templates_dir, "*.html")):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace absolute root paths with /tranquility prefix
    content = content.replace('href="/"', 'href="/tranquility/"')
    content = content.replace('href="/breathing"', 'href="/tranquility/breathing"')
    content = content.replace('href="/techniques"', 'href="/tranquility/techniques"')
    content = content.replace('href="/statistics"', 'href="/tranquility/statistics"')
    content = content.replace('href="/questionnaire"', 'href="/tranquility/questionnaire"')
    content = content.replace('href="/journal"', 'href="/tranquility/journal"')
    content = content.replace('href="/media"', 'href="/tranquility/media"')
    content = content.replace('href="/emergency"', 'href="/tranquility/emergency"')
    
    # Fix static assets
    content = content.replace('href="/static/', 'href="/tranquility/static/')
    content = content.replace('src="/static/', 'src="/tranquility/static/')
    
    # Fix API calls in inline scripts
    content = content.replace("fetch('/api/", "fetch('/tranquility/api/")
    content = content.replace('fetch("/api/', 'fetch("/tranquility/api/')

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

# Fix JS files
js_dir = os.path.join(base_dir, "static", "js")
for filepath in glob.glob(os.path.join(js_dir, "*.js")):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace("fetch('/api/", "fetch('/tranquility/api/")
    content = content.replace('fetch("/api/', 'fetch("/tranquility/api/')
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Routing fixed successfully!")
