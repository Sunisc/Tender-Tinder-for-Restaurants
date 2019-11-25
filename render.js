// const fetch = require('node-fetch')


$(function () {
    renderSite();
})

let userLatitude = null; //these variables function to store the location of the user
let userLongitude = null;

let foodCategoryToSearch="mexican,burgers" //food category should be listed as comma separated list of some of the categories listed in the categories.txt file

const clientID = `jxpavrW-66I3Obpstl8qYA`; //our yelp API client id
const apiKey=`pm8o9ejAV8iA0lnYN8fK4lEKdh6nVH3foW1CB76vo0kVN9IK6dqv6awLhlVSWpm81FeaXAgGyEOnycrvc6HdXlPtbcQv7vC1wvOjkJ4Ei7LLrhvH-K3xQHtxafbWXXYx`; //our yelp api key

export async function renderSite() {
    const $root = $('#root')
    
    navigator.geolocation.getCurrentPosition(setPosition); //the rendering of the page currently only happens after the location is found

    document.getElementById("retryButton").addEventListener("click", function(event) { //button currently does not function
        handleRetry()
    })
}

export async function renderOneRestaurant() { //no longer only renders one restaurant. should probably be renamed. too lazy to do that rn
    const $root = $('#root');
    $root.append(`<p>Longitude: ${userLongitude}, Latitude: ${userLatitude}</p>`) //proof of concept location finder
    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${userLatitude}&longitude=${userLongitude}&categories=${foodCategoryToSearch}`, {
        headers: {'Authorization': 'Bearer '+ apiKey},
    })
        .then(res => res.json().then(renderHelper));
    // above code fetches the information, then runs the renderHelper function.    
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

async function setPosition(position) { //this function kicks everything off after the location of the user is found. could probably be tidied up
    console.log(position.coords.longitude)
    userLongitude=position.coords.longitude
    userLatitude=position.coords.latitude
    renderOneRestaurant();
}
