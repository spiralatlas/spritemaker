//player controlled

let testing = true;

let currently_editing = 0; //which element of editing list we are editing
let current_expression = 0;
let current_clothing = 0;
let current_accessory = 0;

let size = 0;
const size_list = ['Very Short','Short', 'Medium','Tall','Very Tall',];

let skinColour;
let eyeColour;
let hairColour;

let eye_type = 0;
let eye_expressions = listOf(0);


let full_width="314";
let full_height="800";

let sprite_height = full_height;

//internal

const canvas_width = 512;
const canvas_height = 768;
let panel_width = 256; //width and height of panels in pixels

const imageType_list =["Portrait","Sprite"];

const editing_list =["Body","Outfit", "Accessory", "Expression","Randomise"];

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

function randomElement(items,bias){
    //random element of list items
    return items[randomIndex(items,bias)];
}

function randomIndex(items,bias){
    //random integer between 0 and items.length-1
    //has a bias towards returning zero
    // if bias <0, function can never return 0
    if (Math.random()< bias)
        return 0;
    else{  
        if (bias <0)
            return 1+ Math.floor(Math.random()*(items.length-1));
        else
            return Math.floor(Math.random()*items.length);
    }
}

function findNameMatch(list, name){
    //returns the first element of list whose name equals "name"
    for (let i = 0; i < list.length; i += 1) {
        if (list[i].name==name){
            //document.getElementById("test").innerHTML = "value: "+name;
            return list[i];
            
        }
    }
    if (testing)
        console.log("Unknown value: findNameMatch "+name); 
    return -1;
}

function findImageItem(name){
    //returns the string describing current value of first element of list whose name equals "name"
    for (let i = 0; i < image_objects.length; i += 1) {
        if (image_objects[i].name==name){
            //document.getElementById("test").innerHTML = "value: "+name;
            return image_objects[i].item_list[image_objects[i].item];
        }
    }
    if (testing)
        console.log("Unknown value: findImageItem "+name); 
    return -1;
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
    if (name.slice(-4)=="_dec")//remove "_dec"
        loc = location+"/"+name.slice(0,-4);
    item_list = remove_dups(double_list[0].concat(double_list[1]));
    image_objects.push({name: name,location: loc, item_list: item_list, item: 0, heightOffset: 0, widthOffset:0, crop : [0,0,full_width,full_height],parent: defining_objects.length, colour1: "#FF0000",colour2: "#00FF00", base_image_list: newImageList(),shadow_image_list: newImageList(),highlight_image_list: newImageList()});
}

//Setting up portrait data
const defining_objects =[];

//colour_children: indices of elements of image_objects with the same colours
function add_defining_object(name, double_list){
    item_list = remove_dups(double_list[0].concat(double_list[1]));
    item_list_f = [];
    item_list_m = [];
    for (i = 0; i < item_list.length; i += 1){
        if (double_list[0].includes(item_list[i]))
            item_list_f.push(i);
        if (double_list[1].includes(item_list[i]))
            item_list_m.push(i);    
    }
    defining_objects.push({name: name,item_list: item_list,item_list_f: item_list_f ,item_list_m: item_list_m, image_index: image_objects.length-1, colour_children:[image_objects.length-1],colour2_children:[],value_children:[image_objects.length-1],  value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"});
}

function add_colour_children(name, colour_children){
    d_obj = findNameMatch(defining_objects,name);
    if (d_obj==-1)
        console.log("Unknown value: add_colour_children "+name); 
    else{
        for (i = 0; i < image_objects.length; i += 1){
            for (j = 0; j < colour_children.length; j += 1){
                for (k = 0; k < defining_objects.length; k += 1){
                    if (defining_objects[k].name ==colour_children[j])
                        defining_objects[k].colour_children = [];
                    if (image_objects[i].name ==colour_children[j] && !d_obj.colour_children.includes(i))
                        d_obj.colour_children.push(i);
                }
            }
        }   
    }     
}

function add_colour2_children(name, colour_children){
    d_obj = findNameMatch(defining_objects,name);
    if (d_obj==-1)
        console.log("Unknown value: add_colour2_children "+name); 
    else{
        for (i = 0; i < image_objects.length; i += 1){
            for (j = 0; j < colour_children.length; j += 1){
                for (k = 0; k < defining_objects.length; k += 1){
                    if (defining_objects[k].name ==colour_children[j])
                        defining_objects[k].colour2_children = [];
                    if (image_objects[i].name ==colour_children[j] && !d_obj.colour2_children.includes(i))
                        d_obj.colour2_children.push(i);
                }
            }
        }   
    }     
}

function add_value_children(name, children){
    d_obj = findNameMatch(defining_objects,name);
    if (d_obj==-1)
        console.log("Unknown value: add_value_children "+name); 
    else{
        for (i = 0; i < image_objects.length; i += 1){
            for (j = 0; j < children.length; j += 1){
                for (k = 0; k < defining_objects.length; k += 1){ //d_obj's children have no children
                    if (defining_objects[k].name ==children[j])
                        defining_objects[k].value_children = [];
                }
                if (image_objects[i].name ==children[j] && !d_obj.value_children.includes(i)){
                    d_obj.value_children.push(i);
                    temp_list = [];
                    for (l = 0; l < d_obj.item_list.length; l += 1){//pad child's item_list with "none"s to have the same length as parent's
                        if (image_objects[i].item_list.includes(d_obj.item_list[l]))
                        temp_list.push(d_obj.item_list[l]);
                        else
                        temp_list.push("none");
                    }
                    image_objects[i].item_list = temp_list;    

                }
            }
        }   
    }     

}

function randomGenderedItem(obj, gender, bias){
    //obj is a member of defining_
    switch(gender){
        case 0:
            return randomIndex(obj.item_list,bias);
            break;
        case 1:
            return randomIndex(obj.item_list_m,bias);
            break;
        case 2:
            return randomIndex(obj.item_list_f,bias);
            break;     
        default:
            console.log("Unknown gender: "+gender);        
    }
}

function print_image_objects(){
    //String summarising image_objects. For bug fixing. 
    s = "";
    for (i = 0; i < image_objects.length; i += 1){
        b = image_objects[i];
        s+=i+" "+b.name;
        s+=" location: "+b.location;
        s+=" item_list: "+b.item_list.toString();
        s+="  item: "+b.item;
        s+=" colour: "+b.colour1;
        s+=" item: "+b.item_list[b.item]
        s+=" render? "+checkRender(b)
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
            s+=i+" "+b.name;
            s+=" item_list: "+b.item_list.toString();
            s+="  value_list: "+b.value_list.toString();
            s+=" colour1: "+b.colour1;
            s+=" colour2: "+b.colour2;
            s+=" item: "+b.item_list[b.value_list[0]]
            s+=" value_children ";
            for (j = 0; j < b.value_children.length; j += 1){
                s+=image_objects[b.value_children[j]].name+" "
            }
            s+=" colour_children ";
            for (j = 0; j < b.colour_children.length; j += 1){
                s+=image_objects[b.colour_children[j]].name+" "
            }
            s+=" colour2_children ";
            for (j = 0; j < b.colour2_children.length; j += 1){
                s+=image_objects[b.colour2_children[j]].name+" "
            }
            s+="<br>";
        }
        s+="--<br><br>"
        return s
}
