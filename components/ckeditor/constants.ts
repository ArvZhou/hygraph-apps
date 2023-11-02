export const CKEDITOR_STAMP: number = 123456789;

export const DEFAULT_CONFIG: EditorConfigInterface = {
    language: 'en',
    height: 250,
    entities: false,
    baseFloatZIndex: 1000,
    enterMode: '',
    coreStyles_bold: {
        element: 'strong',
        overrides: 'b'
    }
}

export const DEFAULT_TOOLBAR = [
    {
        name: "basic",
        items: [
            "Toggle",
            "Source",
            "Image",
            "Youtube",
            "Html5video",
            // "Swipe",
            "FontSize",
            "Bold",
            "Italic",
            "Strike",
            "Underline",
            "JustifyLeft",
            "JustifyCenter",
            "JustifyRight",
            "JustifyBlock",
            "NumberedList",
            "BulletedList",
            "Outdent",
            "Indent",
            "TextColor",
            "BGColor",
            "CopyFormatting",
            "RemoveFormat",
            "Link",
            "Unlink",
            "Table",
            "HorizontalRule",
            "CodeSnippet",
            "Hygraphmaximize"
        ]
    },
    "/",
]