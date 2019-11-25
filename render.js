$(function () {
    renderSite();
})

let userLatitude = null;
let userLongitude = null;

export async function renderSite() {
    const $root = $('#root')
    
    navigator.geolocation.getCurrentPosition(setPosition);

    // renderOneRestaurant();

    document.getElementById("retryButton").addEventListener("click", function(event) {
        handleRetry()
    })
}

export async function renderOneRestaurant() {
    const $root = $('#root');
    root.append("Longitude: " + userLongitude + " Latitude: " + userLatitude)
}

async function setPosition(position) {
    console.log(position.coords.longitude)
    userLongitude=position.coords.longitude
    userLatitude=position.coords.latitude
    renderOneRestaurant();
}