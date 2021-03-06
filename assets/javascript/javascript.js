// ! wrap console log in if(debug) console.log("example")
const debug = false;

const animalArray = [];
let options;
let pages = {next: null, prev: null};

$("#see-more-button").hide();

const pf = new petfinder.Client({
  apiKey: 'HXhiJjRfDuYpnR3qEGLZ3A2J3wdv7Aj8oLtqTqbBm31lZjsmiU',
  secret: 'KboKKC3HHujidOq6ODiMScif9apSRrUGGXQtR14c',
});

// * Generates card from API response
function createCard(animal) {
  // Create img HTML element
  const responsePhoto = `
    <img
      class="animal-pic"
      src="${animal.photo}"
      alt="${animal.name}
      value="${animal.address}"
    />
  `;

  // Create HTML tile with image and name
  // TODO - Fix Tag CSS
  const photoCard = `
    <div class="column is-one-quarter-desktop is-half-tablet">
      <div class="card">
        <div class="card-image">
          <figure class="image">${responsePhoto}</figure>
          <div class="card-content is-overlay is-clipped">
            <span class="tag is-info">
              ${animal.name}
            </span>
          </div>
        </div>
      <footer class="card-footer">
        <a class="card-footer-item animal-pic"data-id="${animal.id}">
          Get More Info
        </a>
      </footer>
    </div>
    </div>
  `;

  // Append tile with image and name to photo grid
  $('#photo-grid').append(photoCard);
}

// * Generates iframe map with selected animals address
function mapMaker(address) {
  const mapKey = `AIzaSyAHT_UHK6gwGk73hjnJWdWSaG3r6IfuQgg`;
  const query = `https://www.google.com/maps/embed/v1/place?key=${mapKey}&q=${address}`;

  const map = `
    <div class="map">
      <iframe
        src=${query}
        allowfullscreen
        frameborder='0'
      />
    </div>
  `;

  return map;
}

// * Generates modal HTML from selected animal
function makeModal(selection) {
  const animal = animalArray.filter(item => item.id === selection.id)[0];
  
  const statRow = `
  <div id="stats" class="tile is-ancestor">
    <div class="tile is-parent">
      <article class="tile is-child box">
        <p>Age</p>
        <p>${animal.age}</p>
      </article>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child box">
        <p>City/State</p>
        <p>${animal.city}, ${animal.state}</p>
      </article>
    </div>
    <div class="tile is-parent is-6">
      <article class="tile is-child box">
        <p>Address</p>
        <p>${animal.address}</p>
        <p>Call me</p>
        <p>${animal.phone}</p>  
      </article>
    </div>
  </div>
`;

  const descriptionRow = `
  <div id="desc" class="tile is-ancestor">
    <div class="tile is-parent">
      <article class="tile is-child box">
        <p>Description</p>
        <p>${animal.description}</p>
      </article>
    </div>
  </div>
`;

  const modalContent = `${statRow}${descriptionRow}`;

  const modalHeader = `
  <header class="modal-card-head">
    <p class="modal-card-title">${animal.name}</p>
    <button class="delete" aria-label="close"></button>
  </header>
  `;

  const modalBody = `
  <section class="modal-card-body">
    ${mapMaker(animal.address)}
    ${modalContent}
  </section>
  `;

  const modalFooter = `
  <footer class="modal-card-foot">
    <button class="button is-fullwidth is-link" aria-label="close">
      Close
    </button>
  </footer>
  `;

  const modalCard = `
    ${modalHeader}
    ${modalBody}
    ${modalFooter}
  `;

  $('.modal-card').append(modalCard);

  
}

// * Extracts and Transforms data from API response
function onSuccess(response) {
  if (debug) console.log('response:', response);
  const { animals } = response.data;
  const { pagination } = response.data;
  pages.next = pagination._links.next.href;
  // pages.prev = pagination._links.prev.href;


  for (let i = 0; i < animals.length; i += 1) {
    // De-structure photos object from response
    const { photos } = response.data.animals[i];

    // Assign Animal info from data set + handle null
    const animal = {
      photo: '',
      id: animals[i].id,
      age: animals[i].age,
      name: animals[i].name,
      city: animals[i].contact.address.city || "Not available",
      state: animals[i].contact.address.state || "Not available",
      address: animals[i].contact.address.address1 || "Not available",
      description: animals[i].description || "Not available",
      phone: animals[i].contact.phone || "Not available",
    };

    // Handle missing photo - assign blank dog and cat depending on user selection
    if (options.type === 'Dog') {
      animal.photo = photos.length > 0
          ? photos.map(item => item.large)[0].toString()
          : './assets/images/blank-dog.png';
    } else if (options.type === 'Cat') {
      animal.photo =
        photos.length > 0
          ? photos.map(item => item.large)[0].toString()
          : './assets/images/blank-cat.jpg';
    }

    // Store animals into local array for future data filtering/selecting
    animalArray.push(animal);

    // Make response card
    createCard(animal);
   
  }
  
  
}

// get the button seeMore pets
// function seeMoreButton () {
//   let seeMoreButton = '<button class="button is-fullwidth is-link" aria-label="see-more">See more</button>'
//   $("#for-button").append(seeMoreButton);
// }

// * Calls petfinder API then passes data to onSuccess function
function getData(query) {
  pf.animal
    .search(query)
    .then(response => onSuccess(response))
    .catch(err => console.log(err));
}

// Document functions - handles click and keyboard event triggers

$(document).on('click', '.animal-pic', function() {
  makeModal($(this).data());
  $('.modal').show();
});

// TODO - Add in escape key event listener so you can press escape to close the modal
$(document).on('click', 'button[aria-label="close"]', function() {
  $('.modal').hide();
  $('.modal-card').empty();
});

// TODO - Add in enter key event listener so you can press enter to submit form
$(document).on('click', '#Match', function(e) {
  e.preventDefault();
  
    
  options = {
    location: $.trim($('#zip').val()),
    age: $.trim($('#age').val()),
    type: $.trim($('#species').val()),
    gender: $.trim($('#gender').val()),
    
  };

  if (debug) console.log('Form Inputs', options);
    
  if (options.age !== 0 && options.type !== 0 && options.gender !== 0 && options.location !== "") {
    
    setTimeout(function(){$("#see-more-button").show();}, 3000);
  
  }

  // Hit API
  getData(options);

  
});

// we getting a response as a object, so we need it as a
function qsToObj(qs) {
  const obj = {};
  qs.split("?")[1].split("&").forEach(item => {
    const v = item.split("=")
    obj[v[0]] = v[1];
  });

  return obj;
}


$(document).on('click', 'button[aria-label="see-more"]', function() {
  if (pages.next) {
    getData(qsToObj(pages.next))
  }
});
