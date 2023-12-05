CKEDITOR.plugins.add('toggle', {
    icons: 'toggle',
    init: function(editor) {
        editor.addCommand('toggle', {
            exec: function(editor) {
                var command = editor.getCommand('toggle');
                if (command.state === CKEDITOR.TRISTATE_DISABLED || editor.isMaximize) {
                    return;
                }
                const toolbars = editor.container.find('.cke_toolbar_last');
                const lasttoolbar = toolbars?.getItem(toolbars.count() - 1);

                if (command.state === CKEDITOR.TRISTATE_OFF) {
                    lasttoolbar?.show();
                } else {
                    lasttoolbar?.hide();
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