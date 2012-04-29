    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value

    // Wait for PhoneGap to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);

    // PhoneGap is ready to be used!
    //
    function onDeviceReady() {
        console.log('ready')
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64 encoded image data
      console.log(imageData);
      console.log('base64 data recieved')
      console.log(imageData.toString());

      // Get image handle
      //
      var smallImage = $('#photo');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI
      console.log(imageURI.toString());
       console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('photo');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 10, destinationType: destinationType.FILE_URI });
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 10, allowEdit: true });
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 10,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    function pickPhoto(onSuccess, onFail) {
        // Retrieve image file location from specified source
        navigator.camera.getPicture(onSuccess, onFail, { quality: 10,
          destinationType: destinationType.FILE_URI,
          sourceType: pictureSource.PHOTOLIBRARY });
    }

    // Called if something bad happens.
    //
    function onFail(message) {
      alert('Failed because: ' + message);
    }