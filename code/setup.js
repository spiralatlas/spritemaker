let testing = true;

//connected to lists in generated.js
let current_clothing = 0;
let current_accessory = 0;

let skinColour;
let eyeColour;
let hairColour;

let eye_type = 0;

//other player choices

let isWeirdOutfit =  false;
let isWeirdBody = false;
 
//canvas related

let crop_height = 300 ;

let full_width="393";
let full_height="1280";

let sprite_width =full_width; 
let sprite_height = full_height;

// canvas related

let updated_frames = 0; //how long has it been since the data was updated 
let canvas_main;
let ctx_main;

//lists offered to the user for making choices from

let current_tab_type = 0;
const tab_type_list =["Colouring","Body/Hair","Clothes", "Accessory", "Expression","Randomise","Display"];

let current_export_image_type = 0;
const export_image_type_list =["Preview", "Head","Expression","Outfit"];

let current_gender_type = 0;
const gender_type_list = ["Androgynous","Masculine","Feminine"]

let current_expression_type = 0;
const expression_type_list = ["Neutral", "Happy", "Sad", "Angry","Surprised","Embarassed","Scared",'Annoyed',"Other"];

let current_size_type = 2;
const size_type_list = ['80%','85%', '90%','95%','100%',];

let current_head_ratio_type = 0;
let head_ratio = 1;
const head_ratio_type_list = ["100%","Proportional to Height","Custom"]

let current_expression_preset = 0;
const expression_preset_list_values = ["value_list"]
let current_character_preset = 0;
const character_preset_list_values = ["value_list","colour1","colour2","pattern","patterncolour"]
const character_preset_values = ["current_hairstyle", "current_eyetype"]

// Basic functions

function randomElement(items,bias){
    //random element of items. Has a bias towards returning zero
    // if bias <0, function can never return 0
    //items: a list of any sort of item
    //bias: real number in the interval [0,1]
    return items[randomIndex(items,bias)];
}

function randomIndex(items,bias){
    //random integer between 0 and items.length-1
    //has a bias towards returning zero
    // if bias <0, function can never return 0
    //items: a list of any sort of item
    //bias: real number in the interval [0,1]
    if (Math.random()< bias)
        return 0;
    else{  
        if (bias <0)
            return 1+ Math.floor(Math.random()*(items.length-1));
        else
            return Math.floor(Math.random()*items.length);
    }
}

function range(n){
    // return [0...n-1]
    //n: non negative integer
    let x = [];
    for (let i=0;i<n;i++) {
        x[i]=i;
    }
    return x;
}

function listOf(n){
    // return [n,...,n] of length 10
    // n is theoretically anything but only a non negative integer in practice
    let x = [];
    for (let i=0;i<10;i++) {
        x[i]=n;
    }
    return x;

}

function xor(list1,list2){
    //return everything in list1 not in list2
    let output = [];
    for (let i=0;i<list1.length;i++) {
        if(!list2.includes(list1[i]))
            output.push(list1[i]);
    }
    return output;
}
  
function remove_dups(arr){
    //removes duplicates from an array
    //from https://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
    var hash = {}, result = [];
    for ( var i = 0, l = arr.length; i < l; ++i ) {
        if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
            hash[ arr[i] ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

function includesAny(test_string, string_list){
    //returns true if the string test_string includes any of the elements of string_list
    for (i = 0; i < string_list.length; i += 1){
        if (test_string.includes(string_list[i]))
            return true
    }
    return false
}

function stringIndices(base_list, defining_list){
    // baselist, defining_list both lists of strings
    //all indices of elements of base_list that do not contain any elements of defining_list
    let output = [];
    for (i = 0; i < base_list.length; i += 1){
        for (j = 0; j < defining_list.length; j += 1){
            if (base_list[i].includes(defining_list[j]))
                output.push(i); 
        }
    }
    return output
}
