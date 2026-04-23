import os
import subprocess

media_dir = "static/media"
os.makedirs(media_dir, exist_ok=True)

queries = {
    "rain": "ytsearch1:1 minute rain sound relaxing no music",
    "forest": "ytsearch1:1 minute forest birds nature sounds",
    "fire": "ytsearch1:1 minute fireplace crackling sound",
    "ocean": "ytsearch1:1 minute ocean waves beach sound",
    "zen": "ytsearch1:1 minute tibetan singing bowl meditation",
    "stream": "ytsearch1:1 minute mountain stream river water sound",
    "white_noise": "ytsearch1:1 minute pure white noise",
    "meditatively": "ytsearch1:2 minutes background meditation music relaxing calm"
}

print("Searching and downloading short high-quality M4A tracks via yt-dlp...")
for filename, query in queries.items():
    filepath = os.path.join(media_dir, f"{filename}.%(ext)s")
    print(f"Downloading {filename}...")
    
    cmd = [
        "./yt-dlp", "-I", "1", "-f", "140", 
        "--max-downloads", "1",
        "-o", filepath,
        query
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print(f"Successfully downloaded {filename}")
    except subprocess.CalledProcessError as e:
        print(f"Error downloading {filename}: {e}")

print("Done downloading audio files.")
