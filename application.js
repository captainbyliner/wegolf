// Create our app object
var instagramApp = {};

// This is an anonymous function.  This keeps the from polluting the global
// namespace
(function() { 
  instagramApp.client_id = 'd92b924c211f42eeb32a04b809f5590a';


  instagramApp.target = $("#search-images");
  instagramApp.loading = $("#loading");
  instagramApp.searchButton = $("#searchButton");
  instagramApp.searchInput = $("#tags");
  instagramApp.searchGroup = $("#tags-form-group");

  // Bind click event to search button
  instagramApp.searchButton.on('click', function(e) {
    // Stop the browser from submitting the form
    e.preventDefault();

    // Reset the class of the search box
    instagramApp.searchGroup.removeClass('has-error');

    // Grab the contents of the search bar
    var tag = instagramApp.cleanTag(instagramApp.searchInput.val());

    // Check if the search box is empty
    if (tag === '') {
      // If it is, highlight the search box in a red color
      instagramApp.searchGroup.addClass('has-error');
    } else {
      // A tag was submitted, fire the search
      instagramApp.search(tag);
    }
  });

  /**
   * Tag search only takes a single word.  Strip out hash tag and spaces
   * @param  {String} tag Search tag
   * @return {String}     Cleaned Search Tag
   */
  instagramApp.cleanTag = function(tag) {

    // Clean up the tag, no spaces allowed
    tag = tag.replace(/\s/g, '');
    tag = tag.replace(/#/g, '');

    return tag;
  }

  /**
   * Display the images retrieved from the API
   * @param  {array} images An array of image objects
   */
  instagramApp.displayImages = function(images) {
    // Loop through each of the images
    $.each(images, function(idx, image) {
      // Create the image
      var img = $("<img />", {
        'src': image.images.thumbnail.url,
        'title': image.caption,
        'class': 'thumbnail'
      });

      // Create the wrapping div
      var div = $("<div />", {
        'class': 'col-md-2'
      });

      // Append the image to the div
      div.append(img);

      // Hide loading div
      instagramApp.toggleLoading('hide');

      // Append the div to the search-images div
      instagramApp.target.append(div);
    });
  };

  /**
   * Parse the incoming API data
   * @param  {JSON Object} data The JSON Object returned from the API
   */
  instagramApp.parseData = function(data) {
    // The images are stored in data.data
    var images = data.data;

    // There's all sorts of meta data in here from a caption, to the filter used,
    // to the time it was uploaded, different size images, etc, etc
    // console.log(images) to see everything
    
    // At this point, we have the images, lets pass it to a helper funtion to
    // populate our page
    instagramApp.displayImages(images);
  };

  /**
   * Perform an API call to Instagram
   * @param  {String} tag The tag to search for
   */
  instagramApp.search = function(tag) {
    // Set up the API URL
    var url = "https://api.instagram.com/v1/tags/" + instagramApp.cleanTag(tag) + 
              "/media/recent?client_id=" + instagramApp.client_id;

    // Empty any previous results
    instagramApp.target.empty();

    // Show a loading div
    instagramApp.toggleLoading('show');

    // Use the jQuery AJAX call to send a request to the API.  The dataType
    // must be JSONP in order to get around the Cross-Domain issues with
    // RESTful calls.  
    $.ajax({
      dataType: "JSONP", // Expected DataType, must be JSONP
      url: url,          // URL to call
      success: instagramApp.parseData // Function to execute on success
    });
  };

  /**
   * Toggles the visibility of the loading div
   */
  instagramApp.toggleLoading = function(action) {
    if (action === 'show') {
      instagramApp.loading.removeClass('hidden');
    } else {
      instagramApp.loading.addClass('hidden');
    }
  };
})();

    
    