from PIL import Image
import sys

img = Image.open('public/screenshots/IMG_6070.PNG')
pixels = img.load()
width, height = img.size

# The bottom nav is white with blue icons. We need to find where the product cards end.
# Product cards have a subtle gray border and white background.
# Let's just output an HTML page that has horizontal red lines every 1% from 170% to 195% so I can look at it exactly.
html = "<html><body style='margin:0; position:relative; width: 500px;'>"
html += f"<img src='public/screenshots/IMG_6070.PNG' style='width: 100%; display:block;'>"
# Since width = 500, 1% of width = 5px.
for pct in range(1700, 1850, 5):
    p = pct / 10.0
    html += f"<div style='position:absolute; top:{p}vw; width:100%; height:1px; background:red; z-index:10; font-size:10px; color:red;'>{p}%</div>"
html += "</body></html>"

with open("public/measure.html", "w") as f:
    f.write(html)
print("measure.html created")
