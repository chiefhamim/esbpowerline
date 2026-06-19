import json

log_path = "/home/codespace/.gemini/antigravity-cli/brain/d2c2ae35-366d-44b5-8d2e-bda85d9b730d/.system_generated/logs/transcript_full.jsonl"

index_html_original = None
style_css_original = None

with open(log_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            # Check for replace_file_content or write_to_file or view_file that contains the original code.
            # But the subagent's FIRST replace_file_content has the diff, which means it doesn't have the full original file.
            # However, if it used `view_file`, it got the full file content!
            if data.get('type') == 'TOOL_RESPONSE' and 'view_file' in data.get('content', ''):
                content = data['content']
                if 'file:///workspaces/esbpowerline/index.html' in content and not index_html_original:
                    # parse out the lines
                    lines = content.split('\n')
                    parsed_lines = []
                    start_parsing = False
                    for l in lines:
                        if 'The following code has been modified' in l:
                            start_parsing = True
                            continue
                        if 'The above content does NOT show the entire file' in l:
                            break
                        if start_parsing:
                            # remove the line number prefix e.g. "1: "
                            if ':' in l:
                                parsed_lines.append(l.split(':', 1)[1][1:])
                    
                    if len(parsed_lines) > 500:
                        index_html_original = '\n'.join(parsed_lines)
                        
                if 'file:///workspaces/esbpowerline/css/style.css' in content and not style_css_original:
                    lines = content.split('\n')
                    parsed_lines = []
                    start_parsing = False
                    for l in lines:
                        if 'The following code has been modified' in l:
                            start_parsing = True
                            continue
                        if 'The above content does NOT show the entire file' in l:
                            break
                        if start_parsing:
                            if ':' in l:
                                parsed_lines.append(l.split(':', 1)[1][1:])
                                
                    if len(parsed_lines) > 1000:
                        style_css_original = '\n'.join(parsed_lines)
                        
        except Exception as e:
            pass

if index_html_original:
    with open('/workspaces/esbpowerline/index.html.original', 'w') as f:
        f.write(index_html_original)
    print("Found index.html")
    
if style_css_original:
    with open('/workspaces/esbpowerline/css/style.css.original', 'w') as f:
        f.write(style_css_original)
    print("Found style.css")

