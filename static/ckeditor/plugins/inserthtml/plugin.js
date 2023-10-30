CKEDITOR.plugins.add('inserthtml', {
    icons: 'inserthtml',
    init: function(editor) {
        editor.addCommand('insertHtml', new CKEDITOR.dialogCommand('insertHtmlDialog'));
        editor.ui.addButton('InsertHtml', {
            label: 'Choose HTML File',
            command: 'insertHtml',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add('insertHtmlDialog', this.path + 'dialogs/inserthtml.js');
    }
});