const replaceSpaces = path =>{return path.replace(/ /g,"_");}
const lowercase = str=>{return str.toLowerCase();}
const albumCoverPath = (name,genre,pathPrefix = "") => {return `${pathPrefix}/img/album-covers/${lowercase(genre)}/${replaceSpaces(lowercase(name))}.jpg`;}
const getDateText = date =>{ return new Date(date).toLocaleDateString("en-US",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });};
const capitalize = str => {return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});}
const compareByName = (a,b)=>{
    const nameA = a.name;
    const nameB = b.name;
    if(nameA > nameB){return 1;}
    else if(nameA < nameB){return -1;}
    else{return 0;}
}
module.exports = {
    replaceSpaces,
    lowercase,
    albumCoverPath,
    getDateText,
    capitalize,
    compareByName
}