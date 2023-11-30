interface EditorInterface {
    mode: string,
    destroy: () => void,
    on: (arg0: string, arg1: (event: any) => void) => void,
    container: {
        find: (arg: string) => {
            getItem: (number) => ({
                setAttribute: (arg0: string, arg1: string) => void
                on: (arg0: string, arg1: any) => void,
                hide: () => void
            })  | null,
        } | null
    },
    getData: () => string,
    setData: (arg: string) => object,
    resize: (arg0: string, arg1: string | number) => void,
    addMenuItems: (arg: any) => void,
    contextMenu: {
        addListener: (asg: () => any) => any
    },
    lang: any,
    getSelection: () => null | {
        getNative: () => any
    },
    insertHtml: (arg: string) => void,
    setMode: (arg0: string, arg1?: any) => void,
    isMaximize?: boolean
}