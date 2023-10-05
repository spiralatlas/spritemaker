

// Dumbass function to get sleeves to stop breaking

function sleeveIndex(){
    return Math.max(0,findDefiningIndex(clothingname_list[Alpine.store('alpineData').ui_variables_object.current_clothingname]+'_sleeves')) 
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
        case "round","small":
            if (head_offset_list.includes(name))   
                current_offset -=5;
            if (["nose","nose_front", "facial_hair"].includes(name))  
                current_offset -=0;
            if (["mouth"].includes(name))  
                current_offset +=0;     
            break;
        case "jowly": 
            if (head_offset_list.includes(name))   
            current_offset -=5;
            if (["nose","nose_front", "facial_hair"].includes(name))  
            current_offset +=0;
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
        case "pointed","gaunt":  
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
const head_offset_list = expression_list.concat(["skull","head","nose","nose_front","hat_front","hat_middle","hat_front_dec","hat_back","hat_back_dec","ears","complexion", "hair_middle", "hair_front","hair_back","hair_extra", "sidelocks","sidelocks_repeat", "fringe","facial_hair", "eyewear","eyewear_dec","earrings","earrings_dec"]);
const full_outfit_list = outfit_list.concat(accessory_list).concat(sleeve_list).concat(["fringe","sidelocks","hair_extra", "facial_hair","waistline"])

const clothingname_list = [];
const accessoryname_list = [];

for (i = 0; i < defining_objects.length; i += 1){
    if (outfit_list.includes(defining_objects[i].name))
        clothingname_list.push(defining_objects[i].name);
    if (accessory_list.includes(defining_objects[i].name))
        accessoryname_list.push(defining_objects[i].name);
}

//anatomy        
add_colour_children("head", skin_list);

add_value_children("body", ["chair_body"]);
add_value_children("nose", ["nose_front"]);

add_colour_children("fringe", ["hair_middle", "hair_front","hair_back","hair_extra", "facial_hair","sidelocks","sidelocks_repeat"]);
add_value_children("sidelocks", ["sidelocks_repeat"]);

add_value_children("body_chest", ["coat_chest","overshirt_chest","top_chest"]);
//accessories
let children_list =[];

const suffix_list = ["_middle", "_back","_front","_front2", "_collar"] 

function addIfExists(list, n){
    // if there exists an object in image_objects with the name name, add it to list
    for (let i = 0; i < image_objects.length; i += 1) {
        if (image_objects[i].name==n){
            if (!list.includes(n))
                list.push(n)
        }
    }
}
for (let i = 0; i < defining_objects.length; i += 1){
    this_name = defining_objects[i].name;
    if ((this_name!="back")&&(clothingname_list.includes(this_name)||accessoryname_list.includes(this_name))){
        
        value_list = [];
        colour_list = [];
        colour2_list =[];
        extras = [];
        switch(this_name){
            case "hat":
                value_list = ["hijab_front"];
                colour_list = ["hijab_front"];
                break;
            case "bottom":
                colour_list = ["waistline"];
                colour2_list = ["waistline_dec"];
                break;               
        }

        for (j = 0; j < suffix_list.length; j += 1){
            addIfExists(value_list, this_name+suffix_list[j]);
            addIfExists(value_list, this_name+suffix_list[j]+"_dec");
            addIfExists(value_list, "chair_"+this_name+suffix_list[j]);
            addIfExists(value_list, "chair_"+this_name+suffix_list[j]+"_dec");
        }
        addIfExists(value_list, "chair_"+this_name);
        addIfExists(value_list, this_name+"_dec");
        addIfExists(value_list, "chair_"+this_name+"_dec");
        for (j = 0; j < suffix_list.length; j += 1){
            addIfExists(colour_list, this_name+suffix_list[j])
            addIfExists(colour_list, "chair_"+this_name+suffix_list[j])
        }
        addIfExists(colour_list, "chair_"+this_name)
        addIfExists(colour_list, this_name+"_sleeves");
        addIfExists(colour_list, this_name+"_sleeves_dec");
        addIfExists(colour_list, this_name+"_chest");
        for (j = 0; j < suffix_list.length; j += 1){
            addIfExists(colour2_list, this_name+suffix_list[j]+"_dec")
            addIfExists(colour2_list, "chair_"+this_name+suffix_list[j]+"_dec")
        }
        addIfExists(colour2_list, this_name+"_dec")
        addIfExists(colour2_list, "chair_"+this_name+"_dec");

        children_list.push([this_name, value_list, colour_list, colour2_list]);
    }
}
for (let i = 0; i < children_list.length; i += 1){
    if (children_list[i][1]!=[]){
        add_value_children(children_list[i][0], children_list[i][1]);
    }
    if (children_list[i][2]!=[])
        //console.log(children_list[i][0] + " colour "+children_list[i][2])
        add_colour_children(children_list[i][0], children_list[i][2]);
    if (children_list[i][3]!=[])
        add_colour2_children(children_list[i][0], children_list[i][3]);
}

add_value_children("waistline",["waistline_dec"])

const export_head_list =["head","skull","ears","nose","nose_front","complexion"];
const export_outfit_list = (image_objects.map(value => value.name)).filter(value => !(expression_list.includes(value)));

const hair_front_numbers = hairstyle_defining_list.map(value => hair_front_im.item_list.indexOf(value[1]))
const hair_middle_numbers = hairstyle_defining_list.map(value => hair_middle_im.item_list.indexOf(value[2]))
const hair_back_numbers = hairstyle_defining_list.map(value => hair_back_im.item_list.indexOf(value[3]))

const fringe_list = fringe_im.item_list
const sidelocks_list = sidelocks_im.item_list
const hair_extra_list = hair_extra_im.item_list
const fringe_not_straight = stringIndices(fringe_list, ["curly", "locs"])
const sidelocks_not_straight = stringIndices(sidelocks_list, ["curly", "locs"])
const hair_extra_not_straight = stringIndices(hair_extra_list, ["curly", "locs","puff"])
const fringe_not_wavy = stringIndices(fringe_list, ["locs","hime"])
const sidelocks_not_wavy = stringIndices(sidelocks_list, ["locs","hime"])
const hair_extra_not_wavy = stringIndices(hair_extra_list, ["locs","hime","puff"])
const fringe_not_curly = stringIndices(fringe_list, ["straight","locs","hime","spik"])
const sidelocks_not_curly = stringIndices(sidelocks_list, ["straight","locs","hime"])
const hair_extra_not_curly = stringIndices(hair_extra_list, ["straight","locs","twintails"])
const fringe_not_locs = (fringe_list.filter(value => !value.includes("locs"))).map(value=>fringe_list.indexOf(value))
const sidelocks_not_locs = (sidelocks_list.filter(value => !value.includes("locs"))).map(value=>sidelocks_list.indexOf(value))
const hair_extra_not_locs = (hair_extra_list.filter(value => !value.includes("locs"))).map(value=>hair_extra_list.indexOf(value))

const eyetype_list = remove_dups(eyetype_list_f.concat(eyetype_list_m))
const eyetype_indices_m = eyetype_list_m.map(value => eyetype_list.indexOf(value))
const eyetype_indices_f = eyetype_list_f.map(value => eyetype_list.indexOf(value))
const eyetype_indices_w = eyetype_list_w.map(value => eyetype_list.indexOf(value))

function definingSubsetIndices(sublist){
    // a list of the indices of those elements of defining_objects whose names are contained in sublist
    output = [];
    for (i = 0; i < sublist.length; i += 1){
        output.push(defining_objects.indexOf(findNameMatch(defining_objects,sublist[i])))
    }
    return output;
}
const expression_indices = definingSubsetIndices(expression_list);
const character_indices = definingSubsetIndices(defining_list.concat(["hat"]));

function presetExcludeIndices(value){
    //return what indices of character_preset_defining_list have value be true
    output = []
    for (i = 1; i < character_preset_defining_list.length; i += 1){
        if (character_preset_defining_list[i][value])
            output.push(i)
    }
}

function hairExcludeIndices(index){
    //given the index of the curent hairstyle, return what indices of hairstyle_list to exclude for fringe and sidelocks indices
    //if (index<3) //bald
    //    return 0//exclude everything

    hair_string = hairstyle_list[index]
    type = -1; 
    
    if (includesAny(hair_string, ["straight","side part"])) //straight
        type = 0;
    else{
        if (includesAny(hair_string, ["wavy", "shaggy"])) //wavy
            type = 1;
    else{
        if (includesAny(hair_string, ["curl"])) //curly
            type = 2;
    else{
        if (includesAny(hair_string, ["locs","cornrows"])) //locs
            type = 3;
        else{
            type = randomElement([0,1,2,3],0);
        }
    }    
        }    
    }     
    switch(type){
        case 0://straight
            //console.log("hair_string: "+hair_string+ "straight")
            return[fringe_not_straight, sidelocks_not_straight, hair_extra_not_straight]
        case 1://wavy
            //console.log("hair_string: "+hair_string+ "wavy")
            return[fringe_not_wavy, sidelocks_not_wavy, hair_extra_not_wavy]  
        case 2://curly
            //console.log("hair_string: "+hair_string+ "curly")
            return[fringe_not_curly, sidelocks_not_curly,hair_extra_not_curly] 
        case 3://locs
            //console.log("hair_string: "+hair_string+ "locs")
            return[fringe_not_locs, sidelocks_not_locs,hair_extra_not_locs]                 
    } 
    console.log("Warning: Unknown hair type")
    return [[],[],[]]
}


