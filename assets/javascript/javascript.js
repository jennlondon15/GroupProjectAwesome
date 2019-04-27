$(function() {
  // check out google map API
  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
  }
//GOogle API URL
  var googleURL = "https://www.google.com/maps/embed/v1/place?key=AIzaSyC9WPR0Lch_bWed56_TKHgqgRRIiAdBD2E&q=";
  // connecting PetFinder API
  var pf = new petfinder.Client({
    apiKey: "HXhiJjRfDuYpnR3qEGLZ3A2J3wdv7Aj8oLtqTqbBm31lZjsmiU",
    secret: "KboKKC3HHujidOq6ODiMScif9apSRrUGGXQtR14c"
  });

  $("#Match").on("click", function() {
    event.preventDefault();
    
    var userZip = $("#zip").val().trim();
    var userAge = $("#age").val().trim();
    var userSpecies = $("#species").val().trim();
    var userGender = $("#gender").val().trim();
    
    console.log("this is user Zip" + userZip);
    console.log("this is Age " + userAge);
    console.log("this is Species " + userSpecies);
    console.log("this is Gender " + userGender);

    // if (use the answers from the user) ...than show this
    // if else (show this)
    // else (plant)

    pf.animal
      .search({
        location: userZip,
        age: userAge,
        type: userSpecies,
        gender: userGender
      })
      .then(response => {
        var animalsArray = response.data.animals.length;
        
        for (var i = 0; i < animalsArray; i++) {
          console.log(response);
          
          //if to check for picture, no picture, not included
          if (!response.data.animals[i].photos[0] && !response.data.animals[i].contact.address.address1) {
            continue }
          
          var animalPhoto = response.data.animals[i].photos[0].small;

          var animalAge = response.data.animals[i].age;
          var animalName = response.data.animals[i].name;
          var animalCity = response.data.animals[i].contact.address.city;
          var animalState = response.data.animals[i].contact.address.state;
          var animalAddress = response.data.animals[i].contact.address.address1;
          var animalDiscription = response.data.animals[i].description;

          var responsePhoto = $("<img>");
              responsePhoto.attr("src", animalPhoto);
              responsePhoto.addClass("animal-pic");
              responsePhoto.attr("val", animalAddress);
          var animalDiv = $("<div class='col-md-3'>");
              animalDiv.append(responsePhoto);
              animalDiv.addClass("for-pets");
              animalDiv.append(animalName);
              animalDiv.append(animalCity);
              animalDiv.append(animalState);
              animalDiv.append(animalAddress);
              animalDiv.append(animalDiscription);        

          // var responseName = $("<p>");
          // responseName.text(animalName);
          // var responseAge = $("<p>");
          // responseAge.text(animalAge);
          // var responseState = $("<p>");
          // responseState.text(animalState);
          // var responseAddress = $("<p>");
          // responseAddress.text(animalAddress);
          // var responseDiscription = $("<p>");
          // responseDiscription.text(animalDiscription);

          $("#responseAnimal").prepend(animalDiv);
         function mapMaker (){
            $("#map").empty();
           // console.log(animalAddress);
           // var petAddress = $(this).val();
            //Google Div placer!
            $("#map").html("<iframe width='600' height='450' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/place?key=AIzaSyC9WPR0Lch_bWed56_TKHgqgRRIiAdBD2E&q=" + animalAddress + "' allowfullscreen> </iframe>")
         }
          
        }
        
        $(document).on("click", ".animal-pic", function (event){
          
          mapMaker()
          $(".modal").show();
        })
       $(".delete").on("click", function(){
         $(".modal").hide();
         
       })
      })
      .catch(function(error) {
        console.log(error);
        // Handle the error
      });
      
      
  });
});
