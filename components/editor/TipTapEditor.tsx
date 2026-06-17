'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { useCallback, useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ModernTooltip } from '@/components/shared/ModernTooltip';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Code,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Table as TableIcon, Minus, RemoveFormatting,
  Pilcrow, Code2, CornerDownLeft, IndentIncrease, IndentDecrease,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minBodyHeight?: number;
}

const MOD = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';

const TOOLBAR_ITEMS: Record<string, { label: string; hint: string; shortcut?: string }> = {
  bold: { label: 'Bold', hint: 'Emphasize key terms', shortcut: `${MOD}+B` },
  italic: { label: 'Italic', hint: 'Subtle emphasis or attribution', shortcut: `${MOD}+I` },
  underline: { label: 'Underline', hint: 'Highlight linked phrasing', shortcut: `${MOD}+U` },
  strike: { label: 'Strikethrough', hint: 'Mark revised or withdrawn text', shortcut: `${MOD}+Shift+S` },
  h1: { label: 'Heading 1', hint: 'Major section break', shortcut: `${MOD}+Alt+1` },
  h2: { label: 'Heading 2', hint: 'Sub-section within the story', shortcut: `${MOD}+Alt+2` },
  h3: { label: 'Heading 3', hint: 'Minor heading or sidebar note', shortcut: `${MOD}+Alt+3` },
  alignLeft: { label: 'Align left', hint: 'Default body alignment' },
  alignCenter: { label: 'Align center', hint: 'Center pull quotes or captions' },
  alignRight: { label: 'Align right', hint: 'Right-align callouts' },
  alignJustify: { label: 'Justify', hint: 'Even edges for dense copy' },
  bulletList: { label: 'Bullet list', hint: 'Unordered key points' },
  orderedList: { label: 'Numbered list', hint: 'Sequential steps or rankings' },
  blockquote: { label: 'Blockquote', hint: 'Quoted source or pull quote' },
  codeBlock: { label: 'Code block', hint: 'Technical snippets or data' },
  link: { label: 'Insert link', hint: 'Add hyperlinks to sources' },
  image: { label: 'Insert image', hint: 'Upload inline visuals' },
  table: { label: 'Insert table', hint: 'Structured figures or comparisons' },
  hr: { label: 'Divider', hint: 'Separate story sections' },
  inlineCode: { label: 'Inline code', hint: 'Mark a short code fragment' },
  hardBreak: { label: 'Line break', hint: 'Insert a line break within a paragraph' },
  indent: { label: 'Indent list item', hint: 'Nest the current list item' },
  outdent: { label: 'Outdent list item', hint: 'Move list item up one level' },
  clear: { label: 'Clear formatting', hint: 'Strip styles from selection' },
  undo: { label: 'Undo', hint: 'Revert last change', shortcut: `${MOD}+Z` },
  redo: { label: 'Redo', hint: 'Reapply undone change', shortcut: `${MOD}+Shift+Z` },
  paragraph: { label: 'Paragraph', hint: 'Return selection to body text', shortcut: `${MOD}+Alt+0` },
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  toolKey,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  toolKey: keyof typeof TOOLBAR_ITEMS;
  children: React.ReactNode;
}) {
  const meta = TOOLBAR_ITEMS[toolKey];
  const hint = meta.shortcut ? `${meta.hint} · ${meta.shortcut}` : meta.hint;
  return (
    <ModernTooltip
      label={meta.label}
      hint={hint}
      variant="editor"
      fast
      side="top"
      showDelayMs={120}
      className="tiptap-toolbar__item"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClick}
        disabled={disabled}
        className={cn('tiptap-toolbar__btn', active && 'tiptap-toolbar__btn--active')}
        aria-label={meta.label}
      >
        {children}
      </Button>
    </ModernTooltip>
  );
}

function runEditorShortcut(editor: Editor, event: KeyboardEvent): boolean {
  const mod = event.metaKey || event.ctrlKey;
  if (!mod) return false;

  const key = event.key.toLowerCase();
  const shift = event.shiftKey;
  const alt = event.altKey;

  const run = (fn: () => void) => {
    event.preventDefault();
    fn();
    return true;
  };

  if (!shift && !alt && key === 'b') return run(() => { editor.chain().focus().toggleBold().run(); });
  if (!shift && !alt && key === 'i') return run(() => { editor.chain().focus().toggleItalic().run(); });
  if (!shift && !alt && key === 'u') return run(() => { editor.chain().focus().toggleUnderline().run(); });
  if (shift && !alt && key === 's') return run(() => { editor.chain().focus().toggleStrike().run(); });
  if (!shift && key === 'z') return run(() => { editor.chain().focus().undo().run(); });
  if (shift && key === 'z') return run(() => { editor.chain().focus().redo().run(); });
  if (alt && key === '1') return run(() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); });
  if (alt && key === '2') return run(() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); });
  if (alt && key === '3') return run(() => { editor.chain().focus().toggleHeading({ level: 3 }).run(); });
  if (alt && key === '0') return run(() => { editor.chain().focus().setParagraph().run(); });

  return false;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = 'Start writing your article...',
  minBodyHeight = 360,
}: TipTapEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const syncBodyHeightRef = useRef<(() => void) | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ horizontalRule: false }),
      Underline,
      HorizontalRule,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
      syncBodyHeightRef.current?.();
    },
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none',
        style: `min-height: ${minBodyHeight}px`,
      },
      handlePaste: (_view, _event) => {
        requestAnimationFrame(() => syncBodyHeightRef.current?.());
        return false;
      },
      handleKeyDown: (_view, event) => {
        const ed = editorRef.current;
        if (!ed) return false;
        return runEditorShortcut(ed, event);
      },
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const proseMirror = editor.view.dom;

    const syncBodyHeight = () => {
      const nextHeight = Math.max(minBodyHeight, proseMirror.scrollHeight);
      proseMirror.style.minHeight = `${nextHeight}px`;
    };

    syncBodyHeightRef.current = syncBodyHeight;
    syncBodyHeight();

    const resizeObserver = new ResizeObserver(() => syncBodyHeight());
    resizeObserver.observe(proseMirror);

    editor.on('create', syncBodyHeight);
    editor.on('transaction', syncBodyHeight);

    return () => {
      resizeObserver.disconnect();
      editor.off('create', syncBodyHeight);
      editor.off('transaction', syncBodyHeight);
      syncBodyHeightRef.current = null;
    };
  }, [editor, minBodyHeight]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
      requestAnimationFrame(() => syncBodyHeightRef.current?.());
    }
  }, [content, editor]);

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) return;
      const { url } = await res.json();
      editor.chain().focus().setImage({ src: url }).run();
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('URL', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="tiptap-editor" aria-busy="true" aria-label="Loading editor">
        <div className="tiptap-toolbar tiptap-toolbar--loading" />
        <div className="tiptap-editor__body tiptap-editor__body--loading">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-muted/30 animate-pulse" style={{ width: `${90 - i * 10}%` }} />
          ))}
        </div>
      </div>
    );
  }

  const Divider = () => <span className="tiptap-toolbar__divider" aria-hidden />;

  return (
    <div className="tiptap-editor tiptap-editor--sticky-toolbar">
      <div className="tiptap-toolbar tiptap-toolbar--ribbon tiptap-toolbar--sticky">
        <div className="tiptap-toolbar__group" role="group" aria-label="Text style">
          <ToolbarButton toolKey="bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="strike" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough className="h-3 w-3" />
          </ToolbarButton>
        </div>
        <Divider />
        <div className="tiptap-toolbar__group" role="group" aria-label="Structure">
          <ToolbarButton toolKey="paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
            <Pilcrow className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="h1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="h2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="h3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="h-3 w-3" />
          </ToolbarButton>
        </div>
        <Divider />
        <div className="tiptap-toolbar__group" role="group" aria-label="Alignment">
          <ToolbarButton toolKey="alignLeft" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            <AlignLeft className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="alignCenter" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            <AlignCenter className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="alignRight" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            <AlignRight className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="alignJustify" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
            <AlignJustify className="h-3 w-3" />
          </ToolbarButton>
        </div>
        <Divider />
        <div className="tiptap-toolbar__group" role="group" aria-label="Lists">
          <ToolbarButton toolKey="bulletList" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="orderedList" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="indent" onClick={() => editor.chain().focus().sinkListItem('listItem').run()}>
            <IndentIncrease className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="outdent" onClick={() => editor.chain().focus().liftListItem('listItem').run()}>
            <IndentDecrease className="h-3 w-3" />
          </ToolbarButton>
        </div>
        <Divider />
        <div className="tiptap-toolbar__group" role="group" aria-label="Rich blocks">
          <ToolbarButton toolKey="blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="codeBlock" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Code className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="inlineCode" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
            <Code2 className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="hardBreak" onClick={() => editor.chain().focus().setHardBreak().run()}>
            <CornerDownLeft className="h-3 w-3" />
          </ToolbarButton>
        </div>
        <Divider />
        <div className="tiptap-toolbar__group" role="group" aria-label="Insert">
          <ToolbarButton toolKey="link" active={editor.isActive('link')} onClick={setLink}>
            <LinkIcon className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="image" onClick={addImage}>
            <ImageIcon className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="table" onClick={insertTable}>
            <TableIcon className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="hr" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus className="h-3 w-3" />
          </ToolbarButton>
        </div>
        <Divider />
        <div className="tiptap-toolbar__group tiptap-toolbar__group--end" role="group" aria-label="History">
          <ToolbarButton toolKey="clear" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
            <RemoveFormatting className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="h-3 w-3" />
          </ToolbarButton>
          <ToolbarButton toolKey="redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="h-3 w-3" />
          </ToolbarButton>
        </div>
      </div>

      <EditorContent editor={editor} className="tiptap-editor__body" />
    </div>
  );
}