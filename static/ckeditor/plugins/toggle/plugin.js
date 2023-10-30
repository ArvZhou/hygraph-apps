CKEDITOR.plugins.add('toggle', {
    icons: 'toggle',
    init: function(editor) {
        editor.addCommand('toggle', {
            exec: function(editor) {
                var command = editor.getCommand('toggle');
                if (command.state === CKEDITOR.TRISTATE_DISABLED) {
                    return;
                }
                if (command.state === CKEDITOR.TRISTATE_OFF) {
                    editor.container.find('.cke_toolbar').getItem(1).addClass('toggle-on');
                } else {
                    editor.container.find('.cke_toolbar').getItem(1).removeClass('toggle-on');
                }
                command.toggleState();
            }
        });

        editor.ui.addButton('Toggle', {
            label: 'Show More',
            command: 'toggle',
            toolbar: 'tools'
        });
    }
});