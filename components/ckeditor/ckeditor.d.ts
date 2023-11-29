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

interface EditorPropsInterface {
    name?: string,
    placeholder?: string,
    value: string,
    config?: EditorConfigInterface,
    onChange:(data: string) => void,
    onMaximize?: (event: { stop: () => void}, data: string) => void,
    onFocus?: () => void,
    isMaximize?: boolean,
    chooseImage?: () => Promise<{
        src: string,
        alt: string,
        title: string,
        width: number,
        height: number
    }>
}

interface EditorConfigInterface {
    language?: string,
    entities?: boolean,
    baseFloatZIndex?: number,
    enterMode?: string,
    coreStyles_bold?: object,
    toolbar?: Array<Array<string> | string>,
    simple?: boolean,
    full?: boolean,
    height?: string | number,
    focusEnlarge?: boolean
}