const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const storeController = require("./controllers/store_controller");

const PORT = process.env.PORT || 3000;

//create the app
const app = express();

//set the view engine
app.set("view engine","ejs");

//use all the middleware
app.use(express.static("./public"));
app.use(cookieParser());
app.use(session({secret: "Shopping cart",saveUninitialized:true,resave:true}));
//set up the connection to the database
const mongoosePath = "mongodb+srv://Brendan:test@recordstoredatabase-jpobe.mongodb.net/RecordStoreDatabase?retryWrites=true&w=majority";
mongoose.connect(mongoosePath,{ useNewUrlParser: true,useUnifiedTopology: true });

let Schema = mongoose.Schema;

let storeSchema = new Schema({
    name: String,
    artist: String,
    type : String,
    price:String,
    genre: String,
    stock:String,
    releaseDate:String,
    trackList: Array
});

let StoreModel = mongoose.model("Store",storeSchema);

//the middleware
const urlencodedParser = bodyParser.urlencoded({extended:false});

storeController(app,StoreModel,urlencodedParser);

console.log(`listening to port: ${PORT}`);
app.listen(PORT);
