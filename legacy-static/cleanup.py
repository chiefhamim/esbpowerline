import re

with open('/workspaces/esbpowerline/js/app.js', 'r') as f:
    js = f.read()

# Remove the dynamic color logic in js/app.js
dynamic_color_logic = r'\s*// Update dynamic colors based on context.*?root\.style\.setProperty\(\'--color-primary-glow\'.*?\);'
js = re.sub(dynamic_color_logic, '', js, flags=re.DOTALL)

with open('/workspaces/esbpowerline/js/app.js', 'w') as f:
    f.write(js)
