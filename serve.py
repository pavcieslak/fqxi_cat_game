"""
Simple dev server that serves this folder at /fqxi/ with live-reload injection.
Usage:  python serve.py
Then open: http://localhost:3000/fqxi/
"""
import os, hashlib, socketserver
from http.server import SimpleHTTPRequestHandler
from pathlib import Path

PORT = 3000
ROOT = Path(__file__).parent
PREFIX = "/fqxi"

LIVERELOAD_JS = """
<script>
(function(){
  var last = null;
  function poll(){
    fetch("/__livereload__").then(r=>r.text()).then(h=>{
      if(last && h !== last){ location.reload(); }
      last = h;
      setTimeout(poll, 800);
    }).catch(()=>setTimeout(poll, 2000));
  }
  poll();
})();
</script>
"""

def dir_hash():
    h = hashlib.md5()
    for f in sorted(ROOT.rglob("*")):
        if f.is_file() and ".git" not in str(f) and "serve.py" not in str(f):
            try:
                h.update(str(f.stat().st_mtime).encode())
            except:
                pass
    return h.hexdigest()

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def translate_path(self, path):
        # Strip /fqxi prefix before resolving to filesystem
        if path.startswith(PREFIX):
            path = path[len(PREFIX):] or "/"
        return super().translate_path(path)

    def do_GET(self):
        if self.path == "/__livereload__":
            data = dir_hash().encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(data)
            return
        super().do_GET()

    def send_head(self):
        # Inject live-reload script into HTML responses
        path = self.translate_path(self.path)
        if path.endswith(".html") or path.endswith("/"):
            # Find the actual file
            if os.path.isdir(path):
                for idx in ["index.html", "index.htm"]:
                    candidate = os.path.join(path, idx)
                    if os.path.exists(candidate):
                        path = candidate
                        break
            if path.endswith(".html") and os.path.exists(path):
                with open(path, "rb") as f:
                    content = f.read()
                injected = content.replace(b"</body>", LIVERELOAD_JS.encode() + b"</body>")
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(injected)))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(injected)
                return None  # already wrote
        return super().send_head()

    def log_message(self, fmt, *args):
        # Suppress noisy livereload poll requests
        request_path = str(args[0]) if args else ""
        if "/__livereload__" not in request_path:
            super().log_message(fmt, *args)

class ThreadedServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    print(f"Serving at http://localhost:{PORT}{PREFIX}/")
    print("Press Ctrl+C to stop.\n")
    with ThreadedServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
