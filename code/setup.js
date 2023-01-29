//player controlled

let currently_editing = 0; //which element of editing list we are editing
let current_expression = 0;
let current_clothing = 0;

let height = 0;

let skinColour;
let eyeColour;
let hairColour;

let eye_type = 0;
let eye_expressions = listOf(0);

//internal

const canvas_width = 512;
const canvas_height = 768;
let panel_width = 256; //width and height of panels in pixels

const imageType_list =["Portrait","Sprite"];

const editing_list =["Body","Outfit", "Expressions","Occasions","Randomise"];

const torso_offset_list = ["Torso","Shirt","Shirt_collar","Shirt_dec","Shirt_collar_dec","Shirt_sleeves","Shirt_sleeves_dec","Coat","Coat_sleeves","Coat_dec","Coat_sleeves_dec","Coat_back","Pants_top","Overshirt","Overshirt_dec","Overshirt_sleeves","Overshirt_sleeves_dec","Neckwear","Neckwear2","Neckwear3","Wheelchair"];

const panel_list = ["0: Neutral", "1: Happy", "2: Sad", "3: Unique", "4: Blushing", "5: Angry","6","7","8","9","10"];

const back_list = ["Hat","Coat"]; //have a back

let canvas;
let canvas_preview;
let ctx_preview;
let ctx;

// Basic functions

function nameOf(obj){
    return obj.name;
}

function randomElement(items){
    //random element of list items
    return items[Math.floor(Math.random()*items.length)];
}

function randomIndex(items,bias){
    //random integer between 0 and items.length-1
    //has a bias towards returning zero
    if (Math.random()< bias)
        return 0;
    else  
        return Math.floor(Math.random()*items.length);
}

function findNameMatch(list, name){
    //returns the first element of list whose name equals "name"
    for (let i = 0; i < list.length; i += 1) {
        if (list[i].name==name){
            //document.getElementById("test").innerHTML = "value: "+name;
            return list[i];
            
        }
    }
    document.getElementById("test").innerHTML = "Unknown value: "+name;
}

function range(n){
    // return [0...n-1]
    let x = [];
    for (let i=0;i<n;i++) {
        x[i]=i;
    }
    return x;
}

function listOf(n){
    // return [n,n,n,n,n,n]
    let x = [];
    for (let i=0;i<10;i++) {
        x[i]=n;
    }
    return x;

}

function newImageList(){
    //list of ten images
    let x = [];
    for (let i=0;i<10;i++) {
        x[i]=new Image();
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
    

//Setting up portrait data
const image_objects =[];

function add_image_object(name, double_list, location){
    let loc;
    loc=location+"/"+name.toLowerCase();
    if (name == "Nose_front")
        loc = "body/nose"; 
    item_list = remove_dups(double_list[0].concat(double_list[1]));
    image_objects.push({name: name,location: loc, item_list: item_list, item: 0, heightOffset: 0, parent: defining_objects.length, colour1: "#FF0000",colour2: "#00FF00", base_image_list: newImageList(),shadow_image_list: newImageList(),highlight_image_list: newImageList()});
}

//Setting up portrait data
const defining_objects =[];

//children: indices of elements of image_objects with the same colours
function add_defining_object(name, double_list){
    item_list = remove_dups(double_list[0].concat(double_list[1]));
    item_list_f = double_list[0];
    item_list_m = double_list[1];
    defining_objects.push({name: name,item_list: item_list,item_list_f: item_list_f ,item_list_m: item_list_m, children:[image_objects.length-1], value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"});
}

function add_children(name, children){
    d_obj = findNameMatch(defining_objects,name);
    for (i = 0; i < image_objects.length; i += 1){
        for (j = 0; j < children.length; j += 1){
            child_obj = findNameMatch(defining_objects,children[j]);
            child_obj.children = [];
            if (image_objects[i].name ==children[j] && !d_obj.children.includes(i))
                d_obj.children.push(i);
        }
    }        

}

function print_image_objects(){
    //String summarising image_objects. For bug fixing. 
    s = "";
    for (i = 0; i < image_objects.length; i += 1){
        b = image_objects[i];
        s+="name: "+b.name;
        s+=" location: "+b.location;
        s+=" item_list: "+b.item_list.toString();
        s+="  item: "+b.item;
        s+=" colour: "+b.colour1;
        s+=" item: "+b.item_list[b.item]
        s+=" src: "+b.base_image_list[0].src;
        s+="<br>";
    }
    return s
}

function print_defining_objects(){
    //String summarising image_objects. For bug fixing. 
    s = "";
    for (i = 0; i < defining_objects.length; i += 1){
        b = defining_objects[i];
        s+="name: "+b.name;
        s+=" item_list: "+b.item_list.toString();
        s+="  value_list: "+b.value_list.toString();
        s+=" colour: "+b.colour1;
        s+=" item: "+b.item_list[b.value_list[0]]
        s+="Children ";
        for (j = 0; j < b.children.length; j += 1){
            s+=image_objects[b.children[j]].name+" "
        }
        s+="<br>";
    }
    return s
}
