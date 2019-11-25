$(function () {
    renderSite();
})

export async function renderSite() {
    const $root = $('#root')

    renderOneRestaurant();

    document.getElementById("retryButton").addEventListener("click", function(event) {
        handleRetry()
    })
}

export async function renderOneRestaurant() {
    const $root = $('#root');
    const restaurant = await axios({
        
    })
}