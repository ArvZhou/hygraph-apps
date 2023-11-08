CKEDITOR.plugins.add('toggle', {
    icons: 'toggle',
    init: function(editor) {
        editor.addCommand('toggle', {
            exec: function(editor) {
                var command = editor.getCommand('toggle');
                if (command.state === CKEDITOR.TRISTATE_DISABLED || editor.isMaximize) {
                    return;
                }
                if (command.state === CKEDITOR.TRISTATE_OFF) {
                    editor.container.find('#cke_46')?.getItem(0)?.show();
                } else {
                    editor.container.find('#cke_46')?.getItem(0)?.hide();
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