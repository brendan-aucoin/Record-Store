$(document).ready(function(){
    // the back to top button
    window.onscroll = function(){
        scroll();
    }
    //clicking the back to top button
    $("#back-to-top-button").click(function(){
        document.body.scrollTop = 0;
        document.documentElement.scollTop = 0;
    });
    // making the search box/submit button fade in and out
    $("#search-bar").focus(function(){
        $(this).fadeTo("fast",1);
        $("#search-submit-button").fadeTo("fast",1);
    });
    $("#search-bar").focusout(function(){
        $(this).fadeTo("fast",0.7);
        $("#search-submit-button").fadeTo("fast",0.5);
    });

    $("#search-submit-button").click(function(){
        alert("This feature is currently unnavailable");
    })
    

});
// when you scroll you want to display the back to top button
function scroll(){
    const display = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? "block" : "none";
    $("#back-to-top-button").css("display",display);
}

