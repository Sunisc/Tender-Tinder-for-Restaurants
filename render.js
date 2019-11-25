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
    // const params = new URLSearchParams();
    // params.append('latitude', userLatitude)
    // params.append('longitude', userLongitude)
    $root.append(`<p>Longitude: ${userLongitude}, Latitude: ${userLatitude}</p>`)
    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${userLatitude}&longitude=${userLongitude}&categories=burgers`, {
        headers: {'Authorization': 'Bearer '+ apiKey},
    })
        .then(res => res.json().then(renderHelper));
    
  }

  export async function renderHelper(queryResult) {
    let result = queryResult['businesses']
    console.log(result)
    console.log(result[0]['img_url'])
    const $root = $('#root');
    for (let each in result) {    
        let categories = result[each]['categories']
        let categoryString = ""
        for (let category in categories) {
            categoryString=categoryString+categories[category]['title']+", "
        }
        $root.append(`
            <h2 class="subtitle">${result[each]['name']}</h2>
            <img src=${result[each]['image_url']} style="height:200px">
            <p>Phone Number: ${result[each]['phone']}</p>
            <p>Food categories: ${categoryString}</p>
            <br>
        `)
    }
    // console.log(queryResult.then())
  }

async function setPosition(position) {
    console.log(position.coords.longitude)
    userLongitude=position.coords.longitude
    userLatitude=position.coords.latitude
    renderOneRestaurant();
}
