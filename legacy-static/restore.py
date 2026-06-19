import re

html_content = """                                <div class="toolbar-group" data-category="Style">
                                    <button class="toolbar-btn" data-command="bold" data-tooltip="Bold"><i data-lucide="bold"></i></button>
                                    <button class="toolbar-btn" data-command="italic" data-tooltip="Italic"><i data-lucide="italic"></i></button>
                                    <button class="toolbar-btn" data-command="underline" data-tooltip="Underline"><i data-lucide="underline"></i></button>
                                    <button class="toolbar-btn" data-command="strikeThrough" data-tooltip="Strikethrough"><i data-lucide="strikethrough"></i></button>
                                </div>
                                <div class="toolbar-group" data-category="Script">
                                    <button class="toolbar-btn" data-command="subscript" data-tooltip="Subscript"><i data-lucide="subscript"></i></button>
                                    <button class="toolbar-btn" data-command="superscript" data-tooltip="Superscript"><i data-lucide="superscript"></i></button>
                                </div>
                                <div class="toolbar-group" data-category="Color">
                                    <input type="color" class="toolbar-color" id="fg-color" data-tooltip="Text Color" data-command="foreColor">
                                    <input type="color" class="toolbar-color" id="bg-color" data-tooltip="Background Color" data-command="hiliteColor">
                                </div>
                                <!-- Row 2 -->
                                <div class="toolbar-group" data-category="Format">
                                    <div class="custom-dropdown" id="format-dropdown">
                                        <button type="button" class="custom-dropdown-toggle" id="format-dropdown-toggle" data-tooltip="Formatting">
                                            <span id="format-dropdown-label">Paragraph</span>
                                            <i data-lucide="chevron-down" style="width:16px;height:16px;"></i>
                                        </button>
                                        <div class="custom-dropdown-menu" id="format-dropdown-menu">
                                            <div class="dropdown-item" data-value="P">Paragraph</div>
                                            <div class="dropdown-item" data-value="H1">Heading 1</div>
                                            <div class="dropdown-item" data-value="H2">Heading 2</div>
                                            <div class="dropdown-item" data-value="H3">Heading 3</div>
                                            <div class="dropdown-item" data-value="H4">Heading 4</div>
                                            <div class="dropdown-item" data-value="H5">Heading 5</div>
                                            <div class="dropdown-item" data-value="H6">Heading 6</div>
                                        </div>
                                    </div>
                                    <button class="toolbar-btn" data-custom="blockquote" data-tooltip="Blockquote"><i data-lucide="quote"></i></button>
                                    <button class="toolbar-btn" data-custom="codeblock" data-tooltip="Code Block"><i data-lucide="code"></i></button>
                                </div>
                                <!-- Row 3 -->
                                <div class="toolbar-group" data-category="Lists">
                                    <button class="toolbar-btn" data-command="insertUnorderedList" data-tooltip="Bullet List"><i data-lucide="list"></i></button>
                                    <button class="toolbar-btn" data-command="insertOrderedList" data-tooltip="Numbered List"><i data-lucide="list-ordered"></i></button>
                                    <button class="toolbar-btn" data-custom="checklist" data-tooltip="Checklist"><i data-lucide="check-square"></i></button>
                                </div>
                                <div class="toolbar-group" data-category="Indent">
                                    <button class="toolbar-btn" data-command="outdent" data-tooltip="Decrease Indent"><i data-lucide="outdent"></i></button>
                                    <button class="toolbar-btn" data-command="indent" data-tooltip="Increase Indent"><i data-lucide="indent"></i></button>
                                </div>
                                <div class="toolbar-group" data-category="Align">
                                    <button class="toolbar-btn" data-command="justifyLeft" data-tooltip="Align Left"><i data-lucide="align-left"></i></button>
                                    <button class="toolbar-btn" data-command="justifyCenter" data-tooltip="Align Center"><i data-lucide="align-center"></i></button>
                                    <button class="toolbar-btn" data-command="justifyRight" data-tooltip="Align Right"><i data-lucide="align-right"></i></button>
                                    <button class="toolbar-btn" data-command="justifyFull" data-tooltip="Justify"><i data-lucide="align-justify"></i></button>
                                </div>
                                <!-- Row 4 -->
                                <div class="toolbar-group" data-category="Insert">
                                    <button class="toolbar-btn" data-custom="link" data-tooltip="Insert Link"><i data-lucide="link"></i></button>
                                    <button class="toolbar-btn" data-custom="image" data-tooltip="Insert Image"><i data-lucide="image-plus"></i></button>
                                    <button class="toolbar-btn" data-custom="video" data-tooltip="Insert Video"><i data-lucide="video"></i></button>
                                    <button class="toolbar-btn" data-custom="table" data-tooltip="Insert Table"><i data-lucide="table"></i></button>
                                    <button class="toolbar-btn" data-command="insertHorizontalRule" data-tooltip="Horizontal Rule"><i data-lucide="minus"></i></button>
                                    <button class="toolbar-btn" data-custom="specialchar" data-tooltip="Special Character"><i data-lucide="type"></i></button>
                                </div>
                                <!-- Row 5 -->
                                <div class="toolbar-group" data-category="Tools">
                                    <button class="toolbar-btn" data-command="removeFormat" data-tooltip="Clear Formatting"><i data-lucide="eraser"></i></button>
                                    <button class="toolbar-btn" data-custom="source" data-tooltip="Source Code"><i data-lucide="terminal"></i></button>
                                    <button class="toolbar-btn" data-custom="zen" data-tooltip="Zen Mode"><i data-lucide="maximize-2"></i></button>
                                    <button class="toolbar-btn" data-custom="preview" data-tooltip="Preview Mode"><i data-lucide="monitor"></i></button>
                                </div>"""

with open('/workspaces/esbpowerline/cms/index.html', 'r') as f:
    html = f.read()

# find the <div class="toolbar-group" data-category="Style"> block and replace until the end of Row 5
html = re.sub(r'<div class="toolbar-group" data-category="Style">.*<!-- Row 5 -->.*?</div>\s*</div>', html_content + '\n                            </div>', html, flags=re.DOTALL)

with open('/workspaces/esbpowerline/cms/index.html', 'w') as f:
    f.write(html)
