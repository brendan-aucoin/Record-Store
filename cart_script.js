const ZERO = 48;
const NINE = 57;
const tax = 0.13;
const maxNumPurchase = 10000;
//lets you only type in characters from 0-9
function quantityFieldKeyPress(event){
    const keyPress = event || window.event;
    return (keyPress.keyCode >=ZERO && keyPress.keyCode <=NINE)
}

// if the textfield is empty or 0 make it default to 1
// also update the price when you change the text field and make sure the stock is correct
function quantityFieldChange(textField,priceID,originalPrice){
    if(textField.value.length === 0 || textField.value === "0" || parseFloat(textField.value) > maxNumPurchase ){
        textField.value = "1";
    }
}


//to make sure that the quantity you input is less than the stock allowed for that item
function validateStock(){
    const quantities = document.getElementsByClassName("quantity-input");
    const stocks = document.getElementsByClassName("stock");
    let canSubmit = true;
    for(let i =0;i < stocks.length;i++){
        if(parseInt(quantities[i].value) > parseInt(stocks[i].textContent)){
            canSubmit = false;
            quantities[i].classList.add("invalid-quantity-input");
            stocks[i].classList.add("invalid-quantity-stock");
        }
        else{
            quantities[i].classList.remove("invalid-quantity-input");
            stocks[i].classList.remove("invalid-quantity-stock");
        }
    }
    return canSubmit;
}

//makes sure that there is at least 1 row of items in your cart if not it will return false
function validateTable(){
    const table = document.getElementById("shopping-cart");
    const rows = table.getElementsByClassName("tr");
    let rowCount = 0;
    for(let i=0;i<rows.length;i++){
        if(rows[i].getElementsByClassName("td").length>0){
            rowCount++;
        }
    }
    return rowCount >0;
}
//returns true if there is at least 1 item in your cart and that all the quantities you listed were less than or equal to the stock for that item
function validateCart(){
    return (validateTable() && validateStock());
}

//makes the post request to remove an item from your cart
function removeRequest(){
    $(".remove-item-form").on("submit",function(){
        const formNumber = $(this).attr("rowNum");
        const albumName = $(`#album-name${formNumber}`).text();
        $.ajax({
            type:'POST',
            url:"/cart/remove",
            data:{albumName},
            success:function(data){
                location.reload();
            }
        });

        return false;
    });
}

//makes a post request to change the amount of quantity for a specific item
function updateQuantityRequest(){
    $(".quantity-input").on("change",function(){
        const rowNum = $(this).attr("rowNum");
        const updatedStock = $(this).val();
        const albumName = $(`#album-name${rowNum}`).text();
        $.ajax({
            type:'POST',
            url:"/cart/update_stock",
            data:{albumName,updatedStock},
            success:function(data){
                location.reload();
            }
        });

        return false;
    }); 
}

$(document).ready(function(){
    removeRequest();
    updateQuantityRequest();
});


