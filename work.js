$(function(){
    const images = [
        "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
        "https://www.princeton.edu/sites/default/files/styles/1x_full_2x_half_crop/public/images/2022/02/KOA_Nassau_2697x1517.jpg?itok=Bg2K7j7J",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvssaSOvzMoStZaY8YL5boN6Cz3pPz_sbF5w&s",
    ];

    const revolvingImage = $("#revolving-image");
    
    if (!revolvingImage) {
        console.error("Could not find the #revolving-image element.");
        return; // Exit if element isn't found
    }

    let currentImageIndex = 0;

    function changeImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        console.log(`Changing image to: ${images[currentImageIndex]}`); // Debugging
        revolvingImage.attr("src", images[currentImageIndex]);
    }

    setInterval(changeImage, 5000);
});



