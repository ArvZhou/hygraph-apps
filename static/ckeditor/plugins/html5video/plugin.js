CKEDITOR.plugins.add('html5video', {
    requires: 'widget',
    lang: 'de,en,eu,es,ru,uk,fr',
    icons: 'html5video',
    init(editor) {
        editor.widgets.add('html5video', {
            button: editor.lang.html5video.button,
            template: '<div class="embed-responsive embed-responsive-16by9 html5-video"></div>',
            /*
             * Allowed content rules (http://docs.ckeditor.com/#!/guide/dev_allowed_content_rules):
             *  - div-s with text-align,float,margin-left,margin-right inline style rules and required ckeditor-html5-video class.
             *  - video tags with src, controls, width and height attributes.
             */
            allowedContent: 'div[*]{*}(*); video [*]{*}(*);',
            requiredContent: 'div(html5-video); video[src,controls];',
            upcast(element) {
                return element.name === 'div' && element.hasClass('html5-video');
            },
            dialog: 'html5video',
            init() {
                let src = '';
                let src1 = '';
                let autoplay = '';
                let id = '';
                let controls = 'controls';
                let loop = '';
                var align = this.element.getStyle('text-align');

                // If there's a child (the video element)
                var videoElement = this.element.getChild(0);
                if (videoElement) {
                    // get it's attributes.
                    src = videoElement.getAttribute('src');
                    if (!src) {
                        src = videoElement.getChild(0).getAttribute('src');
                    }

                    if (videoElement.getChild(1)) {
                        src1 = videoElement.getChild(1).getAttribute('src')
                    }
                    autoplay = videoElement.getAttribute('autoplay');
                    id = videoElement.getAttribute('id');
                    controls = videoElement.getAttribute('controls');
                    loop = videoElement.getAttribute('loop');
                    videoElement.$.addEventListener('dblclick', function (event) {
                        event.stopPropagation();
                    });
                }
                
                if (src) {
                    this.setData('src', src);
                }
                if (src1) {
                    this.setData('src1', src1);
                }
                if (id) {
                    this.setData('id', id);
                }
                if (autoplay) {
                    this.setData('autoplay', 'yes');
                }
                if (controls) {
                    this.setData('controls', 'yes');
                }
                if (loop) {
                    this.setData('loop', 'yes');
                }
            },
            data() {
                // If there is an video source
                if (!this.data.src) {
                    return;
                }
                
                var videoElement = this.element.getChild(0);
                // and there isn't a child (the video element)
                if (!videoElement) {
                    // Create a new <video> element.
                    videoElement = new CKEDITOR.dom.element('video');
                    // Set the controls attribute.
                    videoElement.setAttribute('preload', 'metadata');
                    // Append it to the container of the plugin.
                    this.element.append(videoElement);
                    videoElement.$.addEventListener('dblclick', function (event) {
                        event.stopPropagation();
                    });
                }

                if (!videoElement.getChild(0)) {
                    soruce = new CKEDITOR.dom.element('source');
                    soruce.setAttribute('src', this.data.src);
                    videoElement.append(soruce);
                } else {
                    soruce = videoElement.getChild(0);
                    soruce.setAttribute('src', this.data.src);
                }

                if (this.data.src1 ) {
                    if (videoElement.getChild(1)) {
                        soruce1 = videoElement.getChild(1);
                        soruce1.setAttribute('src', this.data.src1);
                    } else {
                        soruce1 = new CKEDITOR.dom.element('source');
                        soruce1.setAttribute('src', this.data.src1);
                        videoElement.append(soruce1);
                    }
                }

                videoElement.setAttribute('width', '100%');
                videoElement.setAttribute('height', 'auto');

                if (this.data.autoplay) {
                    videoElement.setAttribute('autoplay', 'autoplay');
                } else {
                    videoElement.removeAttribute('autoplay');
                }
                if (this.data.controls) {
                    videoElement.setAttribute('controls', 'controls');
                } else {
                    videoElement.removeAttribute('controls');
                }
                if (this.data.loop) {
                    videoElement.setAttribute('loop', 'loop');
                } else {
                    videoElement.removeAttribute('loop');
                }
                if (this.data.id) {
                    videoElement.setAttribute('id', this.data.id);
                } else {
                    videoElement.removeAttribute('id');
                }
            }
        });

        if (editor.contextMenu) {
            editor.addMenuGroup('html5videoGroup');
            editor.addMenuItem('html5videoPropertiesItem', {
                label: editor.lang.html5video.videoProperties,
                icon: 'html5video',
                command: 'html5video',
                group: 'html5videoGroup'
            });

            editor.contextMenu.addListener((element) => {
                if (element &&
                     element.getChild(0) &&
                     element.getChild(0).hasClass &&
                     element.getChild(0).hasClass('html5-video')) {
                    return {html5videoPropertiesItem: CKEDITOR.TRISTATE_OFF};
                }
            });
        }

        CKEDITOR.dialog.add('html5video', `${this.path}dialogs/html5video.js`);
    }
});
