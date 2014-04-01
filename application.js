//set YouTube API
var url ="http://gdata.youtube.com/feeds/api/playlists/PLdXfBd5r668drtQOcQ-2CN9E_ygQYZOKv?alt=json";

output("Loading Data From " + url);

//Create an AJAX call using the GET method for YouTube API

$.ajax({
  type: 'GET'
  url: url,
  //This is a function that will fire upon a successful return of the API URL
  success: function(results) {
    output("Your Data Is Loaded");

    //Our payload is in results.feed. Let's assign it to a variable called data for easy use.
    var data = results.feed;

    //Grab some of our meta data

    var title = data.title.$t;
    var author = data.author.$t;

    output("Playlist Title: " + title);
    output("Playlist Author: " + author);

    //Our videos are in an array in data.entry, assign it to a new variable called videos

    var videos = data.entry;

    //videos.length will give us the number of elements in our array

    output("Total Videos: " + videos.length);

    //Let's loop through each of the vidoes in the array. This function takes two arguments.
    //Index is the current eleemtn in the loop and video gives us the video object from the JSON

    $.each(videos, function(index, video){
      //In order to get video ID, we have to parse the thumbnail URL. 
      //So we look in video.media$group.media$thumbnail, which is an array. 
      //We only want the to look at first thumbnail in array so we use [0]. 
      //We use url property to get thumbnail url

      var thumb = video.media$group.media$thumbnail[0].url;

      //We then split up the URL string on the / which will give us array of bits URL.
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

      var id = bits [4];

      //Let's create a link to the video

      output($("<a />" , {
        target: "_blank",
        href: video.link[0].href,
        text: video.title.$t
      }));

      //Let's embed the video in an iframe
      output($("<iframe />" , {
        width: 400,
        height: 250,
        src: 'http://www.youtube.com/embed/' + id
      }));

    });

  },
  dataType:'json'
});

// Quick function to write to the #results div

function output(txt) {
  $("#results").append($("<div />", {
    html: txt
  }));
}