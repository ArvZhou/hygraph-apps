CKEDITOR.dialog.add('insertHtmlDialog', function(editor) {
    var html = null;
    var isHtmlFile = true;

    function handleFileSelect(files) {
        // No file has been chosen
        if (!files || files.length !== 1) {
            html = null;
            return;
        }

        var file = files[0];
        // Not html file
        if (file.type.indexOf('html') === -1) {
            isHtmlFile = false;
            return;
        }
        var fileReader = new FileReader();
        fileReader.onload = function(event) {
            var fileContents = event.target.result;
            fileContents = fileContents.replace(/\s?class=".*?"/g, ''); // Remove body classes
            fileContents = fileContents.replace(/\s?href="https:\/\/www\.google\.com\/url\?q=(.*?)&amp;.*?"/g, ' href="$1" target="_blank"'); // Remove google links
            fileContents = fileContents.replace(/<p><span><\/span><\/p>/g, ''); // Remove empty tags
            var regex = new RegExp( '(<body)', 'gi' );
            var bodyContents = fileContents.split(regex);//no >, body could have a property
            html = bodyContents[2].replace('</body>','').replace('</html>','').replace(/^[^\>]*\>/,'');
        };
        fileReader.readAsText(file);
    }

    return {
        title: 'Choose HTML File',
        minWidth: 270,
        minHeight: 150,
        contents: [{
            id: 'upload',
            label: 'Upload',
            elements: [{
                type: 'file',
                id: 'fileChooser',
                label: 'Export the google doc as HTML and upload here.',
                size: 38,
                onChange : function(api) {
                    var files = this.getInputElement().$.files;
                    handleFileSelect(files);
                }
            }]
        }],
        onShow() {
            var dialog = this.getElement();
            var iframe = dialog.find('iframe.cke_dialog_ui_input_file').getItem(0).getFrameDocument();
            iframe.find('input').getItem(0).setStyle('outline', '0');
        },
        onOk() {
            if (html) {
                editor.setData(html);
                html = null;
            } else {
                var message = isHtmlFile ? "Please make sure the content of the HTML is correct." : "Please choose a HTML file.";
                alert(message);
            }
        },
        onCancel: function() {
            if (html) {
                html = null;
            }
        }
    };
});
