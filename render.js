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


/**
* Searches Yelp API using our API key, returning a promise which upon success is resolved into an array of restaurants.
* 
* @param {number} latitude latitude of position about which to search (required) returns null when undefined
* @param {number} longitude longitude of position about which to search (required) returns null when undefined
* @param {string} categories comma delimited string of categories to include in search (optional)
* @param {number} radius maximum radius about position to search (optional)
* @param {string} searchTerm term with which to search Yelp, as if in yelp's search bar (optional)
* @param {number} offset term with which to retrieve results other than the top results. offset of 20 would return results 21-40. (optional)
* @param {number} limit term with which to increase number of search results, default to 20 (optional)
* @param {boolean} needsCorsAnywhere boolean governing the use of cors-anywhere, cors-anywhere is enabled when true (optional)
*
*
*/
export async function searchYelp(latitude, longitude, categories="", radius="", searchTerm="", offset="", limit="", needsCorsAnywhere) {
    
    let yelpKey=`pm8o9ejAV8iA0lnYN8fK4lEKdh6nVH3foW1CB76vo0kVN9IK6dqv6awLhlVSWpm81FeaXAgGyEOnycrvc6HdXlPtbcQv7vC1wvOjkJ4Ei7LLrhvH-K3xQHtxafbWXXYx`; //our yelp api key
    let finalResult

    if (latitude==undefined || longitude==undefined) {
        return null;
    }
    let searchURL="" //intially empty URL
    if (needsCorsAnywhere==undefined || needsCorsAnywhere==false || needsCorsAnywhere==null) { //decides on base URL, whether we need cors-anywhere or not. appends accordingly
        searchURL=searchURL+"https://api.yelp.com/v3/businesses/search?"
    } else {
        searchURL=searchURL+"https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?"
    }
    
    searchURL=searchURL+`latitude=${latitude}&longitude=${longitude}&categories=${categories}&radius=${radius}&term=${searchTerm}&offset=${offset}&limit=${limit}` //appends everything.

    await makeRequest() //makes function wait until end of request
    async function makeRequest() { //actually makes request
        await fetch(`${searchURL}`, {
            headers: {'Authorization': 'Bearer '+ yelpKey},
        })
            .then(res => res.json().then(setFin))
    }
    async function setFin(query) { //sets finalResult after the request returns
        finalResult = query['businesses']
    }
    return finalResult    
}




/**
* Searches Yelp API for autocomplete suggestions, returns an object containing suggestions for business titles, key words, and categories.
* 
* @param {string} text text to be completed by the autocomplete request, probably the contents of a search bar.
* @param {number} latitude latitude of position about which to search (required) returns null when undefined
* @param {number} longitude longitude of position about which to search (required) returns null when undefined
* @param {boolean} needsCorsAnywhere boolean governing the use of cors-anywhere, cors-anywhere is enabled when true (optional)
*
*
*/
export async function yelpAutocomplete(text, latitude, longitude, needsCorsAnywhere) {

    let yelpKey=`pm8o9ejAV8iA0lnYN8fK4lEKdh6nVH3foW1CB76vo0kVN9IK6dqv6awLhlVSWpm81FeaXAgGyEOnycrvc6HdXlPtbcQv7vC1wvOjkJ4Ei7LLrhvH-K3xQHtxafbWXXYx`; //our yelp api key
    let finalResult

    if (latitude==undefined || longitude==undefined) {
        return null;
    }
    let searchURL="" //intially empty URL
    if (needsCorsAnywhere==undefined || needsCorsAnywhere==false || needsCorsAnywhere==null) { //decides on base URL, whether we need cors-anywhere or not. appends accordingly
        searchURL=searchURL+"https://api.yelp.com/v3/autocomplete?"
    } else {
        searchURL=searchURL+"https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/autocomplete?"
    }
    
    searchURL=searchURL+`text=${text}&latitude=${latitude}&longitude=${longitude}` //appends everything.

    await makeRequest() //makes function wait until end of request
    async function makeRequest() { //actually makes request
        await fetch(`${searchURL}`, {
            headers: {'Authorization': 'Bearer '+ yelpKey},
        })
            .then(res => res.json().then(setFin))
    }
    async function setFin(query) { //sets finalResult after the request returns
        finalResult = query
    }
    return finalResult    
}

export async function renderHelper(result) {
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
}

export async function setPosition(position) { //this function kicks everything off after the location of the user is found. could probably be tidied up
    //console.log(position.coords.longitude)
    userLongitude=position.coords.longitude
    userLatitude=position.coords.latitude
    //console.log(userLatitude)
    let restaurants = await searchYelp(userLatitude, userLongitude, foodCategoryToSearch, "", "", "", "", true)
    console.log(restaurants)
    renderHelper(restaurants)
    let autocomplete = await yelpAutocomplete("top of",userLatitude, userLongitude, true)
    console.log(autocomplete)
    //renderOneRestaurant();
}
