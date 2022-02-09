const input = document.getElementById("idOfInputImage");
    if (input != null) {
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        const MIME_TYPE = "image/jpeg";
        const QUALITY = 0.8;

        input.onchange = function (ev) {
            const file = ev.target.files[0]; // get the file
            const blobURL = URL.createObjectURL(file);
            const img = new Image();
            img.src = blobURL;
            img.onerror = function () {
                URL.revokeObjectURL(this.src);
                // Handle the failure properly
                console.log("Cannot load image");
            };
            img.onload = function () {
                URL.revokeObjectURL(this.src);
                const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
                const canvas = document.createElement("canvas");
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                canvas.toBlob(
                    blob => {
                        // Show ne img and size in front for test
                        displayInfo('Original file', file);
                        displayInfo('Compressed file', blob);
                        
                        // Replace input file by new compressed one
                        let newfile = new File([blob], "filename.ext", { type: MIME_TYPE, lastModified: new Date().getTime() });
                        let container = new DataTransfer();
                        container.items.add(newfile);
                        input.files = container.files;
                    },
                    MIME_TYPE,
                    QUALITY);
		// Id of DIV element to show result (only for development tests)
                document.getElementById("pruebas-tam").append(canvas);
            };
        };
	
	// Utility functions for demo purpose
        function calculateSize(img, maxWidth, maxHeight) {
            let width = img.width;
            let height = img.height;

            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }
            return [width, height];
        }

        // Utility functions for demo purpose
        function displayInfo(label, file) {
            const p = document.createElement('p');
            p.innerText = `${label} - ${readableBytes(file.size)}`;
            document.getElementById('pruebas-tam').append(p);
        }

        function readableBytes(bytes) {
            const i = Math.floor(Math.log(bytes) / Math.log(1024)),
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
        }
    }
