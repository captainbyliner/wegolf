// Set Youtube API URL
var url = "http://gdata.youtube.com/feeds/api/playlists/PLdXfBd5r668drtQOcQ-2CN9E_ygQYZOKv?alt=json";

console.log("Loading data from " + url);

// Create an AJAX call using the GET method to the Youtube URL.
$.ajax({
    type: 'GET',
    url: url,
    // This is a function that will fire upon a successfull return
    // of the API URL
    success: function(results) {
        console.log("Data loaded");
        
        // Our payload is in results.feed.  Lets assign it
        // to a variable called data for easier use later on
        var data = results.feed;
        
        // Grab some of our meta data
        var title = data.title.$t;
        var updated = data.updated.$t;
        
        console.log("Playlist Title: " + title);
        console.log("Playlist Updated: " + updated);
        
        // Our videos are in an array in data.entry, assign it to 
        // a new variable called videos
        var videos = data.entry;
        
        // videos.length will give us the number of elements
        // in the our array
        output("Total Videos: " + videos.length);
        
        // Lets iterate (loop) through each of the
        // videos in the array.  The function takes
        // two arguments, index is they of the current
        // element in the loop and video gives us the
        // video object from the JSON
        $.each(videos, function(index, video) {
            // In order to get the Video ID we have to parse
            // the thumbnail URL.  So to get the URL we look
            // in video.media$group.media$thumbnail which is 
            // an array.  We only want to look at the first
            // thumbnail so we use [0] to give the first
            // element in the array.  And use the url property
            // to get the thumbnail URL.
            var thumb = video.media$group.media$thumbnail[0].url;
            
            // We then split up the URL string on the / which
            // will give us an array of the bits of the URL.
            // So http://i1.ytimg.com/vi/K6G_AWHAIbY/0.jpg
            // becomes:
            // ["http:","","i1.ytimg.com","vi","K6G_AWHAIbY","0.jpg"]
            // We store this in a new variable called bits
            var bits = thumb.split('/');
            
            // The URL string is consistent for each video, so
            // looking at the example above we know that the
            // video ID is in the 5th element of the array.  So
            // to get the 5th element we use the index 4
            // which will give us the video ID.
            var id = bits[4];
            
            // Let's create a link to the video
            output($("<a />", {
                target: "_blank",
                href: video.link[0].href,
                text: video.title.$t
            }));
            
            // Let's embed the video in an iframe
            output($("<iframe />", {
                width: 400,
                height: 250,
                src: 'http://www.youtube.com/embed/' + id
            }));
        });
    },
    dataType: 'json'
});

// Quick function to write to the #results div
function output(txt) {
    $("#results").append($("<div />", {
        html: txt 
    }));
}