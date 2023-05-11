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
const head_offset_list = expression_list.concat(["skull","head","nose","nose_front","hat_front","hat_middle","hat_front_dec","hat_back","hat_back_dec","ears","complexion", "hair_middle", "hair_front","hair_back","sidelocks","sidelocks_repeat", "fringe","facial_hair", "eyewear","earrings","earrings_dec"]);

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

add_colour_children("fringe", ["hair_middle", "hair_front","hair_back","facial_hair","sidelocks","sidelocks_repeat"]);
add_value_children("sidelocks", ["sidelocks_repeat"]);
//accessories

add_value_children("hat", ["hat_back","hat_back_dec","hat_front_dec", "hat_front","hat_middle"]);
add_colour_children("hat", ["hat_back","hat_middle","hat_front"]);
add_colour2_children("hat", ["hat_back_dec","hat_front_dec"]);

add_value_children("earrings", ["earrings_dec"]);
add_colour2_children("earrings", ["earrings_dec"]);

add_value_children("neckwear", ["neckwear_dec"]);
add_colour2_children("neckwear", ["neckwear_dec"]);

//outfit
add_value_children("body_chest", ["coat_chest","overshirt_chest","top_chest"]);

add_value_children("coat", ["coat_dec","coat_back","wheelchair_coat"]);
add_colour_children("coat", ["coat_back","wheelchair_coat","coat_sleeves", "coat_chest"]);
add_colour2_children("coat", ["coat_dec"]);

add_value_children("waistline",["waistline_dec"])
add_value_children("bottom", ["wheelchair_bottom","wheelchair_bottom_dec","bottom_dec",]);
add_colour_children("bottom", ["wheelchair_bottom","waistline"]);
add_colour2_children("bottom", ["bottom_dec","wheelchair_bottom_dec","waistline_dec"]);

add_value_children("top", ["top_collar","top_dec","top_collar_dec"]);
add_colour_children("top", ["top_collar","top_sleeves","top_chest"]);
add_colour2_children("top", ["top_dec","top_collar_dec"]);

add_value_children("overshirt", ["overshirt_dec"]);
add_colour_children("overshirt", ["overshirt_sleeves","overshirt_chest"]);
add_colour2_children("overshirt", ["overshirt_dec", ]);


add_value_children("neckwear",["neckwear_front","neckwear_front2"])
add_colour_children("neckwear",["neckwear_front","neckwear_front2"])
//wheelchair
add_value_children("wheelchair", ["wheelchair_back","wheelchair_back_dec","wheelchair_dec"]);
add_colour_children("wheelchair", ["wheelchair_back"]);
add_colour2_children("wheelchair", ["wheelchair_back_dec","wheelchair_dec"]);

const body_list =["head","skull","ears","nose","nose_front"];
const all_clothes_list = (image_objects.map(nameOf)).filter(value => !(expression_list.includes(value)));

const hair_front_numbers = hairstyle_defining_list.map(value => findNameMatch(image_objects, "hair_front").item_list.indexOf(value[1]))
const hair_middle_numbers = hairstyle_defining_list.map(value => findNameMatch(image_objects, "hair_middle").item_list.indexOf(value[2]))
const hair_back_numbers = hairstyle_defining_list.map(value => findNameMatch(image_objects, "hair_back").item_list.indexOf(value[3]))

const fringe_list = findNameMatch(image_objects, "fringe").item_list
const sidelocks_list = findNameMatch(image_objects, "sidelocks").item_list
const fringe_not_straight = stringIndices(fringe_list, ["curly", "locs"])
const sidelocks_not_straight = stringIndices(sidelocks_list, ["curly", "locs"])
const fringe_not_wavy = stringIndices(fringe_list, ["locs","hime"])
const sidelocks_not_wavy = stringIndices(sidelocks_list, ["locs","hime"])
const fringe_not_curly = stringIndices(fringe_list, ["straight","locs","hime"])
const sidelocks_not_curly = stringIndices(sidelocks_list, ["straight","locs","hime"])
const fringe_not_locs = (fringe_list.filter(value => !value.includes("locs"))).map(value=>fringe_list.indexOf(value))
const sidelocks_not_locs = (sidelocks_list.filter(value => !value.includes("locs"))).map(value=>sidelocks_list.indexOf(value))

const eyetype_list = remove_dups(eyetype_list_f.concat(eyetype_list_m))
const eyetype_indices_m = eyetype_list_m.map(value => eyetype_list.indexOf(value))
const eyetype_indices_f = eyetype_list_f.map(value => eyetype_list.indexOf(value))
const eyetype_indices_w = eyetype_list_w.map(value => eyetype_list.indexOf(value))

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

function hairExcludeIndices(index){
    //given the index of the curent hairstyle, return what indices of hairstyle_list to exclude for fringe and sidelocks indices
    //if (index<3) //bald
    //    return 0//exclude everything

    hair_string = hairstyle_list[index]
    type = -1; 
    
    if (includesAny(hair_string, ["straight","side part","swept back"])) //straight
        type = 0;
    else{
        if (includesAny(hair_string, ["wavy", "shaggy"])) //wavy
            type = 1;
    else{
        if (includesAny(hair_string, ["curl"])) //curly
            type = 2;
    else{
        if (includesAny(hair_string, ["locs"])) //locs
            type = 3;
        else{
            type = randomElement([0,1,2,3],0);
        }
    }    
        }    
    }     
    switch(type){
        case 0://straight
            console.log("straight")
            return[fringe_not_straight, sidelocks_not_straight]
        case 1://wavy
            console.log("wavy")
            return[fringe_not_wavy, sidelocks_not_wavy]  
        case 2://curly
            console.log("curly")
            return[fringe_not_curly, sidelocks_not_curly] 
        case 3://locs
            console.log("locs")
            return[fringe_not_locs, sidelocks_not_locs]                 
    } 
    console.log("oops")
    return [[],[]]
}

