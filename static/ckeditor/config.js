/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    config.toolbar = [
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
                // "Maximize",
                "Hygraphmaximize"
            ]
        },
        "/",
        {
            name: "extra",
            items: [
                "Undo",
                "Redo",
                "Styles",
                "Format",
                "Font",
                "Subscript",
                "Superscript",
                "Blockquote",
                "Cut",
                "Copy",
                "Paste",
                "PasteText",
                "PasteFromWord",
                "InsertHtml",
                "Anchor",
                "Smiley",
                "SpecialChar",
                "Find",
                "Replace",
                "BidiLtr",
                "BidiRtl",
                "Language",
                "Scayt"
            ]
        }
    ];
    config.extraPlugins = "html5video,youtube,toggle,inserthtml,swipe,hygraphmaximize";
    config.allowedContent = {
        $1: {
            // Use the ability to specify elements as an object.
            elements: CKEDITOR.dtd,
            attributes: true,
            styles: true,
            classes: true
        },
        script: {
            attributes: true
        }
    };
    config.disallowedContent = {
        script: {
            match: function (element) {
                var src = element.attributes.src;
                if (!src) return false;
                var match = /^https?:\/\/([^/]+)\//i.exec(src);
                if (
                    !match ||
                    !match[1] ||
                    !/(^|\.)(epicgames|unrealengine)\.com$/i.test(match[1])
                )
                    return true;
                return false;
            }
        }
    };
    config.dialog_noConfirmCancel = true;
    config.removePlugins = "iframe";
};

CKEDITOR.on("dialogDefinition", function (ev) {
    var dialogName = ev.data.name;
    var dialogDefinition = ev.data.definition;
    if (dialogName === "link") {
        var targetTab = dialogDefinition.getContents("target");
        var targetField = targetTab.get("linkTargetType");
        targetField["default"] = "_self";
    }
});
