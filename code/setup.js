//player controlled

let testing = true;

let updated_frames = 0; //how long has it been since the data was updated 

let currently_editing = 0; //which element of editing list we are editing
let current_expression = 0;
let current_clothing = 0;
let current_accessory = 0;
let current_imageType = 2;

let size = 0;
const size_list = ['Very Short','Short', 'Medium','Tall','Very Tall',];
let showFullSprite = true;

let skinColour;
let eyeColour;
let hairColour;

let eye_type = 0;
let eye_expressions = listOf(0);


let full_width="314";
let full_height="1024";

let sprite_width =full_width; 
let sprite_height = full_height;

let isWeird =  false;

//internal

const canvas_width = 512;
const canvas_height = 800;

const imageType_list =["Body","Expression","Outfit"];

const editing_list =["Body","Outfit", "Accessory", "Expression","Randomise"];

const panel_list = ["Neutral", "Happy", "Sad", "Angry","Surprised","Embarassed","Scared",'Annoyed',"Wry"];

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
            return getImageItem(image_objects[i]);
        }
    }
    if (testing)
        console.log("Unknown value: findImageItem "+name); 
    return -1;
}

function getImageItem(obj){
    // return the current item given the object
    if (obj.item==0 && obj.item_list[0]=="none")
        obj.item=-1;
    if (obj.item==-1){
        return "none";
    } else{
            return obj.item_list[obj.item];
        }
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

function add_image_object(name, triple_list, location){
    let loc;
    loc=location+"/"+name.toLowerCase();
    if (name.slice(-4)=="_dec")//remove "_dec"
        loc = location+"/"+name.slice(0,-4);
    item_list = remove_dups(triple_list[0].concat(triple_list[1]).concat(triple_list[2]));
    image_objects.push({name: name,location: loc, item_list: item_list, item: 0, heightOffset: 0, widthOffset:0, scale: 1, crop : [0,0,full_width,full_height],parent: defining_objects.length, colour1: "#FF0000",colour2: "#00FF00", hasShading: true, underlay_image: new Image(), base_image: new Image(),shadow_image: new Image(),highlight_image: new Image(),overlay_image: new Image()});
}

//Setting up portrait data
const defining_objects =[];

//colour_children: indices of elements of image_objects with the same colours
function add_defining_object(name, triple_list){
    item_list = remove_dups(triple_list[0].concat(triple_list[1]).concat(triple_list[2]));
    item_list_f = [];
    item_list_m = [];
    item_list_w = [];
    for (i = 0; i < item_list.length; i += 1){
        if (triple_list[0].includes(item_list[i]))
            item_list_f.push(i);
        if (triple_list[1].includes(item_list[i]))
            item_list_m.push(i);    
        if (triple_list[1].includes(item_list[i]))
            item_list_w.push(i);        
    }
    defining_objects.push({name: name,item_list: item_list,item_list_f: item_list_f ,item_list_m: item_list_m,item_list_w: item_list_w, image_index: image_objects.length-1, colour_children:[image_objects.length-1],colour2_children:[],value_children:[image_objects.length-1],  value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"});
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
    let current_list = [];
    switch(gender){
        case 0:
            current_list = obj.item_list;
            break;
        case 1:
            current_list = obj.item_list_m;
            break;
        case 2:
            current_list = obj.item_list_f;
            break;           
        default:
            console.log("Unknown gender: "+gender);          
    }
    if (isWeird)
        current_list = current_list.concat(obj.item_list_w)

    return randomIndex(current_list,bias); 
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
        s+=" item: "+getImageItem(b)
        //s+=" render? "+checkRender(b)
        s+=" src: "+b.base_image.src;
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
