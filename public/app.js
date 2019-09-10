// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Save the id from the p tag
  var currentArticle = $(this).attr("data-id");
  displayNotes(currentArticle);
});

function displayNotes(currentArticle) {
  // Empty the notes from the note section
  $("#notes").empty();

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + currentArticle
  })
    // With that done, add the note information to the page
    .then(function(data) {
      var notes = data.note;

      if (notes.length > 0) {
        for (var i = 0; i < notes.length; i++) {
          $("#notes").append(
            "<h4>" +
              notes[i].body +
              "  " +
              "<button id='delete-note' article-id='" +
              currentArticle +
              "'  data-id='" +
              notes[i]._id +
              "' >x</button></h4>"
          );
        }
      }

      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append(
        "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
      );
    });
}
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      displayNotes(thisId);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#bodyinput").val("");
});

//On Click for deleting a note
$(document).on("click", "#delete-note", function() {
  var currentArticle = $(this).attr("article-id");
  var currentNote = $(this).attr("data-id");

  $.ajax({
    url: "/delete/" + currentNote,
    method: "DELETE"
  }).then(function() {
    console.log("Note Deleted!");
    displayNotes(currentArticle);
  });
});
