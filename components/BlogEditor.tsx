"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useEffect, useCallback } from "react";

interface BlogEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[400px] px-6 py-4 focus:outline-none",
      },
    },
  });

  // Sync external content changes (e.g. from AI generation)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== content && content !== undefined) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL", editor.getAttributes("link").href ?? "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2 py-1 rounded text-sm font-medium transition-colors ${
      active
        ? "bg-[#4a6741] text-white"
        : "text-[#2c1810] hover:bg-[#f5ede0]"
    }`;

  return (
    <div className="border border-[#e8dcc8] rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-[#e8dcc8] bg-[#faf7f2]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btn(editor.isActive("underline"))}
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btn(editor.isActive("strike"))}
        >
          <s>S</s>
        </button>

        <span className="w-px h-6 bg-[#e8dcc8] mx-1 self-center" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btn(editor.isActive("heading", { level: 2 }))}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={btn(editor.isActive("heading", { level: 3 }))}
        >
          H3
        </button>

        <span className="w-px h-6 bg-[#e8dcc8] mx-1 self-center" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive("bulletList"))}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive("orderedList"))}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btn(editor.isActive("blockquote"))}
        >
          ❝
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className={btn(false)}
          title="Hard line break (Shift+Enter)"
        >
          ↵
        </button>

        <span className="w-px h-6 bg-[#e8dcc8] mx-1 self-center" />

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          className={btn(editor.isActive("table"))}
          title="Insert table"
        >
          ⊞ Table
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!editor.can().addColumnAfter()}
          className="px-2 py-1 rounded text-xs text-[#6b5c4e] hover:bg-[#f5ede0] disabled:opacity-30"
          title="Add column"
        >
          +Col
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!editor.can().addRowAfter()}
          className="px-2 py-1 rounded text-xs text-[#6b5c4e] hover:bg-[#f5ede0] disabled:opacity-30"
          title="Add row"
        >
          +Row
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.can().deleteTable()}
          className="px-2 py-1 rounded text-xs text-red-500 hover:bg-red-50 disabled:opacity-30"
          title="Delete table"
        >
          ✕Table
        </button>

        <span className="w-px h-6 bg-[#e8dcc8] mx-1 self-center" />

        <button
          type="button"
          onClick={setLink}
          className={btn(editor.isActive("link"))}
        >
          Link
        </button>

        <span className="w-px h-6 bg-[#e8dcc8] mx-1 self-center" />

        <label className="flex items-center gap-1 text-xs text-[#6b5c4e] cursor-pointer px-2 py-1">
          Color
          <input
            type="color"
            className="w-5 h-5 rounded cursor-pointer border-0"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
          />
        </label>

        <span className="w-px h-6 bg-[#e8dcc8] mx-1 self-center" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-2 py-1 rounded text-sm text-[#2c1810] hover:bg-[#f5ede0] disabled:opacity-30"
        >
          ↩
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-2 py-1 rounded text-sm text-[#2c1810] hover:bg-[#f5ede0] disabled:opacity-30"
        >
          ↪
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
