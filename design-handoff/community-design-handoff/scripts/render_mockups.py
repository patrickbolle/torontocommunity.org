from pathlib import Path
from playwright.sync_api import sync_playwright
import re,base64
root=Path(__file__).resolve().parents[1]
p=root/'mockups'
shared=(root/'tokens/shared.css').read_text()
with sync_playwright() as b:
 browser=b.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for name in ['homepage-toronto','homepage-vancouver','category-toronto','group-toronto','guide-toronto','homepage-toronto-mobile','homepage-vancouver-mobile']:
  mobile=name.endswith('-mobile')
  base=name.replace('-mobile','')
  html=(p/f'{base}.html').read_text()
  city='vancouver' if 'vancouver' in name else 'toronto'
  css=shared+(root/f'tokens/{city}.css').read_text()
  html=re.sub(r'<link rel="stylesheet"[^>]+>', '', html)
  html=html.replace('</head>',f'<style>{css}</style></head>')
  def embed(match):
   path=(p/match.group(1)).resolve()
   svg=path.read_bytes()
   return 'src="data:image/svg+xml;base64,'+base64.b64encode(svg).decode()+'"'
  html=re.sub(r'src="(\.\./assets/[^\"]+\.svg)"', embed, html)
  page=browser.new_page(viewport={'width':390 if mobile else 1440,'height':844 if mobile else 900},device_scale_factor=1)
  page.set_content(html,wait_until='load')
  page.screenshot(path=str(p/f'{name}.png'),full_page=True)
  page.close()
 browser.close()
print('Rendered screenshots')
