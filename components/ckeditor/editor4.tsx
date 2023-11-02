import { useEffect, useState, useCallback, useRef } from "react";
import { CKEDITOR_STAMP, DEFAULT_CONFIG, DEFAULT_TOOLBAR } from './constants';

export default function Editor(
    {
        name="ckeditorField",
        placeholder="",
        value,
        config={},
        onChange,
        onMaximize=(data) => data,
        onFocus=() => void 0,
        isMaximize=false
    } : EditorPropsInterface
) {
    const editorRef: { current: EditorInterface | null } = useRef(null);
    const [ckeditor, setCkeditor] = useState<EditorInterface | null>(null);

    const autoLink = (editor: EditorInterface, event: any) => {
        if (event.data?.keyCode !== 32) {
            return;
        }

        const selection = editor.getSelection()?.getNative();

        if (!selection || selection.baseNode.parentNode.nodeName === 'A') {
            return;
        }

        const focusNodeData = selection.focusNode.data || '';
        let focusNodeText = focusNodeData.substring(0, selection.focusOffset);
        const unchangedText = focusNodeData.substring(selection.focusOffset, focusNodeData.length) || '';
        const lastWord = focusNodeText.lastIndexOf(' ') !== -1 ? focusNodeText.trim() : focusNodeText;
        let hasLink = false;

        if (lastWord.indexOf('@') + 1) {
            hasLink = true;
            focusNodeText = focusNodeText.replace(/[@]+[A-Za-z0-9-_]+/g, (name: string) => {
                const username = name.replace('@', '');
                return `<a href="https://twitter.com/${username}">${name}</a>`;
            });
        }
        if (lastWord.indexOf('#') + 1) {
            hasLink = true;
            focusNodeText = focusNodeText.replace(/[#]+[A-Za-z0-9-_]+/g, (text: string) => {
                const tag = text.replace('#', '%23');
                return `<a href="https://twitter.com/search?q=${tag}">${text}</a>`;
            });
        }
        if (hasLink) {
            selection.baseNode.data = unchangedText;
            editor.insertHtml(focusNodeText);
            event.cancel();
        }
    }

    const bindEditorEvents = useCallback(() => {
        const editor = editorRef.current;

        if (!editor) return;

        editor.on('maximize', (event) => onMaximize(event, editor.getData() || ' '));
        editor.on('change', () => {
            onChange(editorRef.current?.getData() || ' ')
        });
        editor.on('key', (event: any) => {
            autoLink(editor, event);
            setTimeout(() => {
                onChange(editor.getData() || ' ')
            }, 10);
        });
        editor.on('focus', () => {
            if (config.focusEnlarge) {
                editor.resize('100%', window.innerHeight - 180);
            }
    
            onFocus();
        });
        editor.on('blur', () => {
            if (editor.mode === 'wysiwyg') return;
            const editing = window.localStorage.getItem('editing');
            editor.setMode('wysiwyg', () => {
                onChange(editor.getData() || ' ');
                if (!editing) editor.setMode('source');
            });
        });
    }, [onChange, onMaximize, config, onFocus])

    const initEditor = useCallback(() => {
        window.CKEDITOR.timestamp = CKEDITOR_STAMP;

        let toolbar:Array<Array<string> | string | {name: string, items: Array<string>}> | null = DEFAULT_TOOLBAR;

        if (config.simple) {
            toolbar = [['Source', '-', 'Bold', 'Italic', 'Underline'], '/'];
        }

        if (config.full) {
            toolbar = null;
        }

        const editor = window.CKEDITOR.replace(name || '', {
            ...DEFAULT_CONFIG,
            enterMode: window.CKEDITOR.ENTER_BR,
            ...(toolbar ? {toolbar} : {}),
            ...config
        });

        if (isMaximize && editor) {
            editor.isMaximize = true;
        }

        if (editor) {
            setCkeditor(editor);
            editorRef.current = editor;
            bindEditorEvents();
        }
    }, [config, name, bindEditorEvents, isMaximize])

    useEffect(() => {
        const script = document.createElement('script');
        let editor:any = null;

        script.src = process.env.NEXT_PUBLIC_CKEDITOR_PATH as string;
        script.type = 'text/javascript';
        script.onload = () => {
            editor = initEditor();
        }
        document.body.appendChild(script);

        return () => editor?.destroy()
    }, [initEditor]);

    useEffect(() => {
        if (!value && ckeditor) {
            ckeditor.setData('');
        }

        if (value && ckeditor && value !== ckeditor.getData()) {
            ckeditor.setData(value);
        }
    }, [value, ckeditor, onChange])

    return (
        <textarea id={name} placeholder={placeholder} defaultValue={value} />
    );
}