CKEDITOR.plugins.add('youtube', {
    requires: 'widget',
    icons: 'youtube',
    init: function(editor) {
        editor.addCommand('youtube', new CKEDITOR.dialogCommand('youtubeDialog'));
        editor.ui.addButton('Youtube', {
            label: 'Video',
            command: 'youtube',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add('youtubeDialog', this.path + 'dialogs/youtube.js');

        editor.widgets.add('youtube', {
            button: 'Video',
            dialog: 'youtubeDialog',

            template: '<div class="embed-responsive embed-responsive-16by9"></div>',

            upcast: function(element) {
                return element.name === 'div' && element.hasClass('embed-responsive') && !element.hasClass('html5-video');
            },

            init: function() {
                var iframe = this.element.getFirst();
                if (!iframe) return;
                var src = iframe.getAttribute('src') || '';
                if (!src) return;
                this.setData('src', src);
            },

            data: function() {
                var src = this.data.src;
                if (src) {
                    var iframe = this.element.getFirst();
                    if (!iframe) {
                        var html = '<iframe allowfullscreen="true" class="embed-responsive-item" src="' + 
                            src + '" frameborder="0" width="100%"></iframe>'
                        this.element.setHtml(html);
                    } else {
                        iframe.setAttribute('src', src);
                    }
                }
            }
        });
    }
});