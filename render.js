// const fetch = require('node-fetch')


$(function () {
    renderSite();
})

let userLatitude = null;
let userLongitude = null;
const clientID = `jxpavrW-66I3Obpstl8qYA`;
const apiKey=`pm8o9ejAV8iA0lnYN8fK4lEKdh6nVH3foW1CB76vo0kVN9IK6dqv6awLhlVSWpm81FeaXAgGyEOnycrvc6HdXlPtbcQv7vC1wvOjkJ4Ei7LLrhvH-K3xQHtxafbWXXYx`;

export async function renderSite() {
    const $root = $('#root')
    
    navigator.geolocation.getCurrentPosition(setPosition);

    document.getElementById("retryButton").addEventListener("click", function(event) {
        handleRetry()
    })
}

export async function renderOneRestaurant() {
    const $root = $('#root');
    const params = new URLSearchParams();
    params.append('latitude', userLatitude)
    params.append('longitude', userLongitude)
    $root.append(`<p>Longitude: ${userLongitude}, Latitude: ${userLatitude}</p>`)
    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${userLatitude}&longitude=${userLongitude}`, {
        headers: {'Authorization': 'Bearer '+ apiKey},
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
    });
  }

async function setPosition(position) {
    console.log(position.coords.longitude)
    userLongitude=position.coords.longitude
    userLatitude=position.coords.latitude
    renderOneRestaurant();
}
