CKEDITOR.dialog.add( 'html5video', function( editor ) {
    return {
        title: editor.lang.html5video.title,
        minWidth: 500,
        minHeight: 100,
        contents: [
            {
            id: 'info',
            label: editor.lang.html5video.infoLabel,
            elements: [
                {
                type: 'vbox',
                padding: 0,
                children: [
                    {
                    type: 'vbox',
                    widths: [ '200px', '200px' ],
                    align: 'right',
                    children: [ {
                        type: 'text',
                        id: 'url',
                        label: editor.lang.html5video.allowed,
                        required: true,
                        validate: CKEDITOR.dialog.validate.notEmpty( editor.lang.html5video.urlMissing ),
                        setup: function( widget ) {
                            this.setValue( widget.data.src );
                        },
                        commit: function( widget ) {
                            widget.setData( 'src', this.getValue() );
                        }
                    }, {
                        type: 'text',
                        id: 'url1',
                        label: editor.lang.html5video.allowed,
                        required: false,
                        setup: function( widget ) {
                            this.setValue( widget.data.src1 );
                        },
                        commit: function( widget ) {
                            widget.setData( 'src1', this.getValue() );
                        }
                    }, {
                            type: 'text',
                            id: 'id',
                            label: "id",
                            setup: function( widget ) {
                                this.setValue( widget.data.id );
                            },
                            commit: function( widget ) {
                                widget.setData( 'id', this.getValue() );
                            }
                        }]
                } ]
            },
                {
                    type: 'hbox',
                    id: 'video',
                    children: [ {
                        type: 'checkbox',
                        id: 'controls',
                        label: 'controls',
                        setup: function( widget ) {
                            this.setValue( widget.data.controls );
                        },
                        commit: function( widget ) {
                            widget.setData( 'controls', this.getValue()?'true':'' );
                        }
                    }, {
                        type: 'checkbox',
                        id: 'loop',
                        label: 'loop',
                        setup: function( widget ) {
                            this.setValue( widget.data.loop );
                        },
                        commit: function( widget ) {
                            widget.setData( 'loop', this.getValue()?'true':'' );
                        }
                    },{
                        type: 'checkbox',
                        id: 'autoplay',
                        label: 'autoplay',
                        setup: function( widget ) {
                            this.setValue( widget.data.autoplay );
                        },
                        commit: function( widget ) {
                            widget.setData( 'autoplay', this.getValue()?'true':'' );
                        }
                    }
                    ]
                }
            ]
        }
        ]
    };
} );
