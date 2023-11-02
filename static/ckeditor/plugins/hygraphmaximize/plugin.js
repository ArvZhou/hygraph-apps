CKEDITOR.plugins.add('hygraphmaximize', {
    icons: "hygraphmaximize",
    init: function(editor) {
        editor.addCommand('hygraphmaximize', {
            exec: function() {
                editor.fire('maximize');
            }
        });
        editor.ui.addButton('Hygraphmaximize', {
            label: 'maximize',
            command: 'hygraphmaximize',
            toolbar: 'tools',
            icon: `${this.path}icons/hygraph${editor?.isMaximize ? 'min' : 'max'}imize.png`
        });
    }
});