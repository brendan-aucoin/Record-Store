let displayMenu = true;
$(document).ready(function(){
    $("#menu-burger").click(function(){
        height = displayMenu ? "50vh" : "0";
        displayMenu = !displayMenu;
        $(".menu").css("height",height);
    });
});
