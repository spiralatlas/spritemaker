function firstElement(listname){
    //first element of the array listname
    return listname[0];
}

function setVariable(variablelist, number){
    //for every string in 'variablelist', set the portrait element with that name to have value 'number'
    for (let i = 0; i < variablelist.length; i += 1) {
        let b = findNameMatch(image_objects, variablelist[i]); //the eleemnt of image_objects with the right vriablename
        b.value_list=listOf(number);
    }
}

function setValuelist(variable, list){
    //for every string in 'variablelist', set the portrait element with that name to have value list 'list'
    let b = findNameMatch(image_objects, variable); //the eleemnt of image_objects with the right vriablename
    b.value_list=list;
}

function setColour(variablelist, colour){
    //for every string in 'variablelist', set the portrait element with that name to have colour1 'colour'
    for (let i = 0; i < variablelist.length; i += 1) {
        let b = findNameMatch(image_objects, variablelist[i]); //the eleemnt of image_objects with the right vriablename
        b.colour1=colour;
    }
}

function findDefiningIndex(name){
    for (let i = 0; i < defining_objects.length; i += 1) {
        if (defining_objects[i].name ==name)
            return i;
    }
    return -1;        
}

// Dumbass functions to get sleeves to stop breaking

function sleeveIndex(){
    return Math.max(0,findDefiningIndex(clothing_names[Alpine.store('alpineData').current_clothing]+'_sleeves')) 
}

function getWidthOffset(name){
    //how much the portrait image with name 'name' is shifted up or down to match the head shape
    current_offset = 0;
    if (head_offset_list.includes(name))   
            current_offset +=1;
    return current_offset
}

function getHeightOffset(name){
    //how much the portrait image with name 'name' is shifted up or down to match the head shape
    current_offset = 0;

    switch(findImageItem("head")){
        case "round":
            if (head_offset_list.includes(name))   
                current_offset -=5;
            if (["nose","nose_front", "facial_hair"].includes(name))  
                current_offset -=0;
            if (["mouth"].includes(name))  
                current_offset +=0;     
            break;
        case "jowly": 
            if (head_offset_list.includes(name))   
            current_offset -=6;
            if (["nose","nose_front", "facial_hair"].includes(name))  
            current_offset +=1;
            if (["mouth"].includes(name))  
            current_offset +=0;     
            break;   
        case "oval":
            if (head_offset_list.includes(name))   
            current_offset -=3;
            if (["nose","nose_front", "facial_hair"].includes(name))  
            current_offset +=1;
            if (["mouth"].includes(name))  
            current_offset +=0;        
            break;
        case "medium":
            if (head_offset_list.includes(name))   
                current_offset +=2;
            if (["nose","nose_front", "facial_hair"].includes(name))  
                current_offset +=0;
            if (["mouth"].includes(name))  
                current_offset +=0;        
            break; 
        case "square":
            if (head_offset_list.includes(name))   
                current_offset +=2;
            if (["nose","nose_front", "facial_hair"].includes(name))  
                current_offset +=0;
            if (["mouth"].includes(name))  
                current_offset +=-2;       
            break;     
        case "rectangular":  
            if (head_offset_list.includes(name))   
                current_offset +=5;
            if (["nose","nose_front", "facial_hair"].includes(name))  
                current_offset -=1;    
            if (["mouth"].includes(name))  
                current_offset +=-2;    
            break;     
        case "pointed":  
            if (head_offset_list.includes(name))   
                current_offset +=5;
            if (["facial_hair"].includes(name))  
                current_offset -=1;
            if (["mouth"].includes(name))  
                current_offset +=-1;    
            break;               
    } 
    /*b = findNameMatch(image_objects, "Lips");
    switch (current_lips){
        case 0:
        case 1:
            current_offset += 2;
            break;
        case 2:
            current_offset += 3;
            break;
        case 3:
            current_offset += 5;
            break;
        case 4:
            current_offset += 7;
            break;        

    }  */ 
    return current_offset;    
}
const head_offset_list = expression_list.concat(["skull","head","nose","nose_front","hat_front","hat_middle","hat_front_dec","hat_back","hat_back_dec","ears","complexion", "hair_middle", "hair_front","hair_back","fringe","facial_hair", "eyewear","earrings","earrings_dec"]);

const clothing_names = [];
const accessory_names = [];
const two_tone_names = [];

for (i = 0; i < defining_objects.length; i += 1){
    if (outfit_list.includes(defining_objects[i].name))
        clothing_names.push(defining_objects[i].name);
    if (accessory_list.includes(defining_objects[i].name))
        accessory_names.push(defining_objects[i].name);
}
for (i = 0; i < image_objects.length; i += 1)
    if (image_objects[i].name.slice(-4)=="_dec")
        two_tone_names.push(image_objects[i].name);    

//anatomy        
add_colour_children("head", skin_list);

add_value_children("body", ["legs"]);
add_value_children("nose", ["nose_front"]);

add_colour_children("fringe", ["hair_middle", "hair_front","hair_back","facial_hair"]);

//accessories

add_value_children("hat", ["hat_back","hat_back_dec","hat_front_dec", "hat_front","hat_middle"]);
add_colour_children("hat", ["hat_back","hat_middle","hat_front"]);
add_colour2_children("hat", ["hat_back_dec","hat_front_dec"]);

add_value_children("earrings", ["earrings_dec"]);
add_colour2_children("earrings", ["earrings_dec"]);

add_value_children("neckwear", ["neckwear_dec"]);
add_colour2_children("neckwear", ["neckwear_dec"]);

//outfit

add_value_children("coat", ["coat_dec","coat_back","wheelchair_coat"]);
add_colour_children("coat", ["coat_back","wheelchair_coat","coat_sleeves"]);
add_colour2_children("coat", ["coat_dec"]);

add_value_children("bottom", ["wheelchair_bottom","wheelchair_bottom_dec","bottom_dec",]);
add_colour_children("bottom", ["wheelchair_bottom","waistline"]);
add_colour2_children("bottom", ["bottom_dec","wheelchair_bottom_dec"]);

add_value_children("top", ["top_collar","top_dec"]);
add_colour_children("top", ["top_collar","top_sleeves"]);
add_colour2_children("top", ["top_dec"]);

add_value_children("overshirt", ["overshirt_dec"]);
add_colour2_children("overshirt", ["overshirt_dec"]);
add_colour_children("overshirt", ["overshirt_sleeves"]);

add_value_children("neckwear",["neckwear_front","neckwear_front2"])
add_colour_children("neckwear",["neckwear_front","neckwear_front2"])
//wheelchair
add_value_children("wheelchair", ["wheelchair_back","wheelchair_back_dec","wheelchair_dec"]);
add_colour_children("wheelchair", ["wheelchair_back"]);
add_colour2_children("wheelchair", ["wheelchair_back_dec","wheelchair_dec"]);


findNameMatch(image_objects,"chest").item_list = chest_image_list

const body_list =["head","skull","ears","nose","nose_front"];
const all_clothes_list = (image_objects.map(nameOf)).filter(value => !(expression_list.includes(value)));

const hair_front_numbers = hairstyle_defining_list.map(value => findNameMatch(image_objects, "hair_front").item_list.indexOf(value[1]))
const hair_middle_numbers = hairstyle_defining_list.map(value => findNameMatch(image_objects, "hair_middle").item_list.indexOf(value[2]))
const hair_back_numbers = hairstyle_defining_list.map(value => findNameMatch(image_objects, "hair_back").item_list.indexOf(value[3]))

const eyetype_list = remove_dups(eyetype_list_f.concat(eyetype_list_m))
const eyetype_indices_m = eyetype_list_m.map(value => eyetype_list.indexOf(value))
const eyetype_indices_f = eyetype_list_f.map(value => eyetype_list.indexOf(value))
const eyetype_indices_w = eyetype_list_w.map(value => eyetype_list.indexOf(value))