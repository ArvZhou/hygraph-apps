CKEDITOR.plugins.add('swipe', {
    icons: 'swipe',
    init: function(editor) {
        editor.addCommand('swipe', new CKEDITOR.dialogCommand('swipeDialog'));
        editor.ui.addButton('Swipe', {
            label: 'Insert swipe shots',
            command: 'swipe',
            toolbar: 'tools'
        });
    }
});