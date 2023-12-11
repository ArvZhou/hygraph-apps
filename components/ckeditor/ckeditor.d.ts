interface EditorInterface {
    mode: string,
    destroy: () => void,
    on: (arg0: string, arg1: (event: any) => void) => void,
    container: {
        find: (arg: string) => {
            getItem: (number) => ({
                setAttribute: (arg0: string, arg1: string) => void
                on: (arg0: string, arg1: any) => void,
                hide: () => void,
                hasClass: (arg: string) => boolean,
                getAttribute: (arg: string) => string,
            })  | null,
            count: () => number
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
        getNative: () => any,
        getRanges: () => any[],
        selectRanges: (arg: any) => void
    },
    insertHtml: (arg: string, arg1?: string, arg2?: any) => void,
    setMode: (arg0: string, arg1?: any) => void,
    createRange: () => any,
    getCommand: (arg: string) => ({state: string}),
    isMaximize?: boolean,
    whiteDomains: string
}