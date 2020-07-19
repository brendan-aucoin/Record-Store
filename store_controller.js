const utils = require("../Utils.js");
//export a function that handles all the requests for the store page

const alpha = "abcdefghijklmnopqrstuvwxyz".split('');
module.exports = function(app,StoreModel,urlencodedParser){
    // the main page 
    app.get("/",(req,res)=>{
        //get the data from the database and send it to the client
        StoreModel.find({},(err,data)=>{
            if(err){throw err;}
            const numLatest = 5;
            // sort the data set by release date and return an array of the first 5
            const recentAlbums = data.sort(function(a, b) {return new Date(b.releaseDate) - new Date(a.releaseDate);}).slice(0,numLatest);
            res.render("store",{data:recentAlbums,functions:{albumCoverPath:utils.albumCoverPath}})
        })
    });

    // the individual product page 
    app.get("/album/:artist/:item",(req,res)=>{
        const artistEntry = utils.capitalize(req.params.artist);
        StoreModel.find({artist:artistEntry},(err,data)=>{
            if(err){throw err;}
            // find the product that has the same name as what was requested
            const product = data.filter(entry=>{return entry.name.toLowerCase() === req.params.item.toLowerCase();});
            // find all the products that have the same artist as what was requested
            const relatedItems = data.filter(entry=>{return entry.name.toLowerCase() !== req.params.item.toLowerCase();})
            
            res.render("product",{product:product[0],relatedItems,
                functions:{albumCoverPath:utils.albumCoverPath,getDateText:utils.getDateText}
            });
        })
    });

    // when you add an item to your cart
    app.post("/album/:artist/:item",urlencodedParser,(req,res)=>{
        StoreModel.find({name:req.body.name},(err,data)=>{
            if(err){throw err;}
            // if the session doesnt exist then create it
            createSession(req);

            // add the price of the item to the current total price for your cart
            req.session.cart.totalPrice = (parseFloat(data[0].price) + parseFloat(req.session.cart.totalPrice)).toFixed(2);
            
            const item = req.session.cart.items.find(item=>item.content.name===req.body.name);
            // if there is that item in the cart already increase the quantity instead of adding an entire new object
            if(item){
                for(let i =0; i < req.session.cart.items.length;i++){
                    if(req.session.cart.items[i].content.name === item.content.name){
                        req.session.cart.items[i].quantity = parseFloat(req.session.cart.items[i].quantity)+1;
                    }
                }
            }
            // if the item doesnt exist in the cart then just add the data with a quantity of 1
            else{
                req.session.cart.items.push({content:data[0], quantity:1});
            }
            req.session.save();
        })
    });

    // the cart page
    app.get("/cart",(req,res)=>{
        StoreModel.find({},(err,data)=>{
            if(err){throw err;}
            createSession(req);
             res.render("cart",{cart:req.session.cart.items,totalPrice:req.session.cart.totalPrice,functions:{albumCoverPath:utils.albumCoverPath}});

        });
    })

    // when you want to remove an item from your cart
    app.post("/cart/remove",urlencodedParser,(req,res)=>{
        if(req.session.cart){
            // find the item that you requested to delete
            req.session.cart.items = req.session.cart.items.filter(item=>item.content.name !== req.body.albumName);
            // update the total price by adding every price up in the cart 
           req.session.cart.totalPrice =  getUpdatedTotalPrice(req.session.cart.items);
            req.session.save();
            res.redirect("/cart");
        }
    });

    //when you change the amount of stock of an item you want
    app.post("/cart/update_stock",urlencodedParser,(req,res)=>{
        // find the item you are trying to update the stock of
        let item = req.session.cart.items.filter(item=>item.content.name === req.body.albumName);
        // change the stock in the cart
        item[0].quantity = req.body.updatedStock;
        req.session.cart.totalPrice = getUpdatedTotalPrice(req.session.cart.items);
        req.session.save();
        res.redirect("/cart");
    })


    // the bands page
    app.get("/bands",(req,res)=>{
        StoreModel.find({},(err,data)=>{
            if(err){throw err;}
            // a list of band names with no duplicates
            const bandNames = [ ...new Set(data.map(item=>item.artist))].filter(item=>item !== "");
            res.render("bands",{alpha,bandNames});
        })
    })

    //a specific band page
    app.get("/band/:bandName",(req,res)=>{
        StoreModel.find({},(err,data)=>{
            if(err){throw err;}
            const bandsProducts = data.filter(item=>item.artist === req.params.bandName);
            res.render("band_page",{data:bandsProducts,artistName:req.params.bandName,functions:{albumCoverPath:utils.albumCoverPath}});
        })
        
    });

    app.get("/albums",(req,res)=>{
        StoreModel.find({},(err,data)=>{
            if(err){throw err;}
            res.render("albums",{data,functions:{albumCoverPath:utils.albumCoverPath}})
        });
    })

    // the under construction page
    app.get("/under_construction",(req,res)=>{
        res.render("under_construction");
    })
    
    /*this would be part of the code for the search feature that could come later*/
    app.get("/search",(req,res)=>{
        StoreModel.find({},(err,data)=>{
            if(err){throw err;}
             const filt = data.filter(entry=>{
                return (
                    entry.name.toLowerCase().includes("led") ||
                    entry.artist.toLowerCase().includes("led")
                );
            });
            console.log(filt);
            res.render("search");
        })
        
    });


}

function createSession(req){
    if(!req.session.cart){
        req.session.cart = {};
        req.session.cart.totalPrice = 0;
        req.session.cart.items = [];
    }
}

//gets the updated price of all the items in the shopping cart
function getUpdatedTotalPrice(items){
    const totalPrice = items.reduce((total,item)=>{return total + item.content.price * item.quantity;},0).toFixed(2);
    return parseFloat(totalPrice).toFixed(2);
}
