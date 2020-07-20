// constant colours used in this file
const green = "#009900";
const red = "#DC143C";
const blue = "#00CED1";
$(document).ready(function(){
    $(".input").focus(function(){
        $(this).css("outline-color",blue);
        $(this).css("box-shadow","0 0 10px #719ECE");
        $(this).css("transition",".25s ease-in-out");
    });

    // for any text field when you click off of it
    $(".input").on("focusout",function(){focusout($(this));});
    //when you click off a certain text firl you want to call the focus out method
    $("#postal-code").on("focusout",function(){focusout($(this),!validatePostalCode($(this)));}); 
    //when you type in a certain text field you want to validate it to make sure the user is typing in the correct thing
    $("#postal-code").on("propertychange paste input",function(){validatePostalCode($(this));});

    // all of these are the same as the postal code one
    $("#phone-number").on("focusout",function(){focusout($(this),!validatePhoneNumber($(this)));}); 

    $("#phone-number").on("propertychange paste input",function(){validatePhoneNumber($(this));})

    $("#credit-card-number").on("focusout",function(){focusout($(this),!validateCreditCardNumber($(this)));});

    $("#credit-card-number").on("propertychange paste input",function(){validateCreditCardNumber($(this));});

    $("#expiration-date").on("focusout",function(){focusout($(this),!validateExpirationDate($(this)));}); 

    $("#expiration-date").on("propertychange paste input",function(){validateExpirationDate($(this));});

    $("#security-code").on("focusout",function(){focusout($(this),!validateSecurityCode($(this)));}); 

    $("#security-code").on("propertychange paste input",function(){validateSecurityCode($(this));});

    //if you click on the back button it goes back to the cart
    $("#back-button").click(function(){
        window.location.href = "/cart";
    });

    
    
})

// validates every text field on the form
function validate(){
    // do all the validations
    const allValidations = [
        validateTextField($("#name")),
        validateTextField($("#address")),
        validateTextField($("#city")),
        validateTextField($("#province")),
        validateTextField($("#cardholders-name")),
        validatePostalCode( $("#postal-code")),
        validatePhoneNumber($("#phone-number")),
        validateCreditCardNumber($("#credit-card-number")),
        validateCreditCardNumber($("#credit-card-number")),
        validateExpirationDate($("#expiration-date")) ,
        validateSecurityCode($("#security-code"))
    ]
    // return true if all the validation tests are true.
    return allValidations.every(validation => validation);
}

// makes sure your postal code is in the form A1A 1A1
function validatePostalCode(elem){
    const regexSpace = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
    const regexNoSpace = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
    const value = elem.val();
    return validateTextField(elem,
        [(value.match(regexSpace) || value.match(regexNoSpace))],
        [(value.trim().length>6)]
    );
}

//makes sure your phone number is in the form 111-111-1111 with a few differnt variations
function validatePhoneNumber(elem){
    const regex1 = /^\d{10}$/;
    const regex2 = /^\d{3} \d{3}-\d{4}$/;
    const regex3 = /^\d{3}-\d{3}-\d{4}$/;
    const value = elem.val();
    return validateTextField(elem,
        [(value.match(regex1) || value.match(regex2) || value.match(regex3))],
        [((value.match(/\d/g) || []).length > 10 || !value.match(/^\d+$/))]
    )
}

// makes sure your credit card number is 15 or 16 digits long
function validateCreditCardNumber(elem){
    const value = elem.val();
    return validateTextField(elem, 
        [(value.length === 15 || value.length === 16),(value.match(/^\d+$/))],
        [(!value.match(/^\d+$/) || value.trim().length>16)]
    );
}

// makes sure your expiration date is in the form 01/2000
function validateExpirationDate(elem){
    const value = elem.val();
    const regex = /^\d{2}\/\d{4}$/;
    return validateTextField(elem,
        [(value.match(regex))],
        [(!value.match(regex) && value.length >7)]
    );
}

// makes sure your security code is 3 or 4 digits long
function validateSecurityCode(elem){
    const value = elem.val();
    return validateTextField(elem,
        [(value.length === 3 || value.length === 4) && (value.match(/^\d+$/))],
        [value.length >4 || !(value.match(/^\d+$/))]
    );
}  

// validates a generic text and if the pass conditions are met it will put a green border around the text field and return true
//if the fail conditions activate it will put a red border around the text field and return false
function validateTextField(elem,passConditions = [],failConditions = []){
    const value = elem.val();
    let matched = false;
    if(passConditions.every(val=>val) && value.length !== 0){
        elem.css("outline-color",green);
        matched = true;
    }
    else if(failConditions.includes(true) || value.length===0 ){
        addRedBorder(elem)
        elem.css("outline-color",red);
        matched = false;
    }
    else{
        elem.css("outline-color",blue);
    }
    return matched;
}

// when you click off a text field it will add a red or green border depending on the condition you give it
function focusout(elem,failCondtion =false){
    elem.css("transition",".25s ease-in-out"); 
    elem.css("box-shadow","none");
    // if the text is empty or the condition failed then show a red border;
    if(elem.val().trim().length === 0 || failCondtion){
        addRedBorder(elem);
    }
    else{
       addGreenBorder(elem);
    }
}
// adds a red border to the elements css
function addRedBorder(elem){
    elem.css("border",`2px ridge ${red}`);
}
// adds a red border to the elements css
function addGreenBorder(elem){
    elem.css("border",`2px ridge ${green}`); 
}