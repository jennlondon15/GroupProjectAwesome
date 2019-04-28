$(function() {
  // check out google map API
  let map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }
  // GOogle API URL
  const googleURL =
    'https://www.google.com/maps/embed/v1/place?key=AIzaSyC9WPR0Lch_bWed56_TKHgqgRRIiAdBD2E&q=';
  // connecting PetFinder API
  const pf = new petfinder.Client({
    apiKey: 'HXhiJjRfDuYpnR3qEGLZ3A2J3wdv7Aj8oLtqTqbBm31lZjsmiU',
    secret: 'KboKKC3HHujidOq6ODiMScif9apSRrUGGXQtR14c',
  });

  $('#Match').on('click', function() {
    event.preventDefault();

    const userZip = $('#zip')
      .val()
      .trim();
    const userAge = $('#age')
      .val()
      .trim();
    const userSpecies = $('#species')
      .val()
      .trim();
    const userGender = $('#gender')
      .val()
      .trim();

    console.log(`this is user Zip${userZip}`);
    console.log(`this is Age ${userAge}`);
    console.log(`this is Species ${userSpecies}`);
    console.log(`this is Gender ${userGender}`);

    // if (use the answers from the user) ...than show this
    // if else (show this)
    // else (plant)

    pf.animal
      .search({
        location: userZip,
        age: userAge,
        type: userSpecies,
        gender: userGender,
      })
      .then(response => {
        const animalsArray = response.data.animals.length;

        for (let i = 0; i < animalsArray; i++) {
          console.log(response);

          // if to check for picture, no picture, not included
          if (
            !response.data.animals[i].photos[0] &&
            !response.data.animals[i].contact.address.address1
          ) {
            continue;
          }

          const animalPhoto = response.data.animals[i].photos[0].small;

          const animalAge = response.data.animals[i].age;
          const animalName = response.data.animals[i].name;
          const animalCity = response.data.animals[i].contact.address.city;
          const animalState = response.data.animals[i].contact.address.state;
          var animalAddress = response.data.animals[i].contact.address.address1;
          const animalDiscription = response.data.animals[i].description;

          const responsePhoto = $('<img>');
          responsePhoto.attr('src', animalPhoto);
          responsePhoto.addClass('animal-pic');
          responsePhoto.attr('val', animalAddress);

          const animalDiv = $("<div class='col-md-3'>");
          animalDiv.append(responsePhoto);
          animalDiv.addClass('for-pets');
          animalDiv.append(animalName);

          const modalPhoto = $('<img>');
          modalPhoto.attr('src', animalPhoto);
          modalPhoto.addClass('animal-pic');
          modalPhoto.attr('val', animalAddress);

          var modalDiv = $('<p>');
          modalDiv.addClass('modal-pets');
          modalDiv.append(modalPhoto);
          modalDiv.append(animalAge);
          modalDiv.append(animalName);
          modalDiv.append(animalCity);
          modalDiv.append(animalState);
          modalDiv.append(animalAddress);
          modalDiv.append(animalDiscription);

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

          $('#responseAnimal').prepend(animalDiv);
          function mapMaker() {
            $('#map').empty();
            // console.log(animalAddress);
            // var petAddress = $(this).val();
            // Google Div placer!
            $('#map').html(
              `<iframe width='600' height='450' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/place?key=AIzaSyC9WPR0Lch_bWed56_TKHgqgRRIiAdBD2E&q=${animalAddress}' allowfullscreen> </iframe>`,
            );
          }
        }

        $(document).on('click', '.animal-pic', function(event) {
          mapMaker();
          $('.modal').show();
          $('#modalAnimal').append(modalDiv);
        });
        $('.delete').on('click', function() {
          $('.modal').hide();
        });
      })
      .catch(function(error) {
        console.log(error);
        // Handle the error
      });
  });
});
