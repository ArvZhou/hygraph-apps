
interface CKEditorInterface {
    ENTER_BR: string,
    timestamp: number,
    replace: (name: string, config: object) => EditorInterface,
    TRISTATE_OFF: string,
    TRISTATE_ON: string,
    POSITION_BEFORE_END: string,
}

interface Window {
    CKEDITOR: CKEditorInterface,
}