// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  console.log("Data from /articles ", data.length)
  for (var i = 0; i < data.length; i++) {
    var date = new Date(data[i].date)
    // Display the apropos information on the page
    $("#articles").append("<div class='card' data-id='" + data[i]._id + "'><div class='card-body'>" + 
      "<h5 class='card-title'>" + data[i].title + "</h5><div class='card-text'>" + 
      "<h6 class='card-subtitle mb-2 text-muted'>" + data[i].author + "</h6>" +
      "<h6 class='card-subtitle mb-2 text-muted'>" + (date.getMonth() + 1) + "/" + (date.getDate()) + "</h6>" +
      "<a href='" + data[i].link + "' class='card-link' target='_blank' style='float: right'>Visit Story</a><div class='addNote' data-id='" 
      + data[i]._id + "' data-toggle='modal' data-target='#exampleModal' data-whatever='" + data[i].title + "' class='addNote'>Add Note</div></div></div>"
      );
  };
});



// Whenever someone clicks a p tag
$(document).on("click", ".card", function() {
  console.log("====================> Here");


  // Empty the notes from the note section
  $("#notes").empty();
  
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#commentTitle").val(data.comment.title);
        // Place the body of the note in the body textarea
        $("#commentBody").val(data.comment.body);

        $("#notes").append("<h2>" + data.title + "</h2>");

      }


    });
});


$('#exampleModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var title = button.data('whatever') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text(title)
})

// When you click the savenote button
$(document).on("click", "#submitComment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  var title = $("#commentorName").val()
  var comment = $("#comment").val()

  console.log("ID: " + thisId);
  console.log("commentorName: " + title);
  console.log("comment: " + comment);

  // Run a POST request to create the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/comments/",
    data: {
      // Value taken from name input
      commentorName: title,
      // Value taken from commment textarea
      comment: comment,
      id: thisId
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
      $('#exampleModal').modal('toggle');
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#commentorName").val("");
  $("#comment").val("");
});
