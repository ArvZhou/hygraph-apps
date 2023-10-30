import { useEffect, useState } from "react";

export default function Editor(
    {name, placeholder, value} : {name: string, placeholder: string, value: string}
) {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    function initEditor() {
        // window.CKEDITOR
    }

    useEffect(() => {
        const createScript = () => {
            const script = document.createElement('script');

            script.src = '/static/ckeditor/ckeditor.js';
            script.type = 'text/javascript';
            script.onload = () => {
                setScriptLoaded(true);
                initEditor();
            };
        }

        createScript();
    }, []);

    if (!scriptLoaded) {
        return <p>Script is loading ...</p>
    }

    return (
        <div className="editor">
            <textarea id={name} className="input" placeholder={placeholder} defaultValue={value} />
        </div>
    );
}