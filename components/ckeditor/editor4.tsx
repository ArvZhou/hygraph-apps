import { useEffect, useState, useCallback } from "react";
import { CKEDITOR_STAMP, DEFAULT_CONFIG } from './constants';

export default function Editor(
    {
        name="ckeditor",
        placeholder="",
        value,
        config={},
        onChange,
        onMaximize=(data) => data,
        onFocus=() => void 0
    } : EditorPropsInterface
) {
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

    const initEditor = useCallback(() => {
        window.CKEDITOR.timestamp = CKEDITOR_STAMP;

        const editor = window.CKEDITOR.replace(name || '', {
            ...DEFAULT_CONFIG,
            enterMode: window.CKEDITOR.ENTER_BR,
            ...(config.simple ? { toolbar: [['Source', '-', 'Bold', 'Italic', 'Underline'], '/'] } : {})
        });

        if (editor)
            setCkeditor(editor);
    }, [config, name])

    const bindEditorEvents = useCallback((editor: EditorInterface) => {
        editor.on('maximize', () => onMaximize(editor.getData()));
        editor.on('change', () => onChange(editor.getData()));
        editor.on('key', (event: any) => {
            autoLink(editor, event);
            setTimeout(() => onChange(editor.getData()), 10);
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
                onChange(editor.getData());
                if (!editing) editor.setMode('source');
            });
        });
    }, [onChange, onMaximize, config, onFocus])

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
        if (ckeditor) {
            bindEditorEvents(ckeditor);
        }
    }, [ckeditor, bindEditorEvents])

    useEffect(() => {
        if (!value && ckeditor) {
            ckeditor.setData('');
        }
    }, [value, ckeditor])

    return (
        <div className="editor">
            <textarea id={name} className="input" placeholder={placeholder} defaultValue={value} />
        </div>
    );
}