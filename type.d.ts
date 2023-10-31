
interface CKEditorInterface {
    ENTER_BR: string,
    timestamp: number,
    replace: (name: string, config: object) => EditorInterface,
    TRISTATE_OFF: string,
}

interface Window {
    CKEDITOR: CKEditorInterface,
}