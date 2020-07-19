$(document).ready(function(){
    //when you want to view the band with a certain letter aka only bands that start with B
    $(".letter-link").click(function(){
        window.location = `#${$(this).text()}`;//set the location o the page to the section where that letter starts
        window.scrollBy(0,-100); //makes it so the letter you go to will be at the top not near the bottom of that division
    })
    //when you click on a specific band name
    $(".band-name").click(function(){

        window.location = `/band/${$(this).text()}`
    }); 
});