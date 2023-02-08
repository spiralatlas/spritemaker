function firstElement(listname){
    //first element of the array listname
    return listname[0];
}

function setVariable(variablelist, number){
    //for every string in 'variablelist', set the portrait element with that name to have value 'number'
    for (let i = 0; i < variablelist.length; i += 1) {
        let b = findNameMatch(image_objects, variablelist[i]); //the eleemnt of image_objects with the right vriablename
        b.value_list=listOf(number);
        /*if (back_list.includes(b.name)){
            let b_back = findNameMatch(image_objects, b.name+"_back");//eg the object associated with "hat_back"
            let list = b_back.item_list;
            if (list.includes(b.item_list[number])){ //this is a valid type of back
                b_back.value_list=listOf(list.indexOf(b.item_list[number])); //set to the correct index, may not match the original object   
            } else{
                b_back.value_list=listOf(0); //set to none
            }
        }*/
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

function getWidthOffset(name){
    //how much the portrait image with name 'name' is shifted up or down to match the head shape
    current_offset = 0;
    if (head_offset_list.includes(name))   
            current_offset +=2;
    return current_offset
}

function getHeightOffset(name){
    //how much the portrait image with name 'name' is shifted up or down to match the head shape
    let obj = findNameMatch(image_objects, "head");
    let head = obj.item_list[obj.item];
    current_offset = 0;

    switch(head){
        case "round":
            if (head_offset_list.includes(name))   
                current_offset -=5;
            if (["nose","nose_front", "facial_hair"].includes(name))  
                current_offset -=0;
            if (["mouth"].includes(name))  
                current_offset +=2;     
            break;
        case "jowly": 
            if (head_offset_list.includes(name))   
            current_offset -=6;
            if (["nose","nose_front", "facial_hair"].includes(name))  
            current_offset +=1;
            if (["mouth"].includes(name))  
            current_offset +=2;     
            break;   
        case "oval":
            if (head_offset_list.includes(name))   
            current_offset -=3;
            if (["nose","nose_front", "facial_hair"].includes(name))  
            current_offset +=1;
            if (["mouth"].includes(name))  
            current_offset +=2;        
            break;
        case "medium":
            if (head_offset_list.includes(name))   
                current_offset +=2;
            if (["nose","nose_front", "facial_hair"].includes(name))  
                current_offset +=0;
            if (["mouth"].includes(name))  
                current_offset +=2;        
            break; 
        case "square":
            if (head_offset_list.includes(name))   
                current_offset +=2;
            if (["nose","nose_front", "facial_hair"].includes(name))  
                current_offset +=0;
            break;     
        case "rectangular":  
            if (head_offset_list.includes(name))   
                current_offset +=5;
            if (["nose","nose_front", "facial_hair"].includes(name))  
                current_offset -=1;    
            if (["mouth"].includes(name))  
                current_offset +=0;    
            break;     
        case "pointed":  
            if (head_offset_list.includes(name))   
                current_offset +=5;
            if (["facial_hair"].includes(name))  
                current_offset -=1;
            if (["mouth"].includes(name))  
                current_offset +=0;    
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

const clothes_names = [];
const two_tone_names = [];

for (i = 0; i < defining_objects.length; i += 1){
    if (outfit_list.includes(defining_objects[i].name))
        clothes_names.push(defining_objects[i].name);
}
for (i = 0; i < image_objects.length; i += 1)
    if (image_objects[i].name.slice(-4)=="_dec")
        two_tone_names.push(image_objects[i].name);    

console.log(two_tone_names.toString())

add_colour_children("head", skin_list);

add_value_children("wheelchair", ["wheelchair_back","wheelchair_back_dec","wheelchair_dec"]);
add_colour_children("wheelchair", ["wheelchair_back"]);
add_colour2_children("wheelchair", ["wheelchair_back_dec","wheelchair_dec"]);

add_value_children("hat", ["hat_back"]);
add_colour_children("hat", ["hat_back"]);
add_colour2_children("hat", ["hat_back_dec","hat_dec"]);

add_value_children("hair_front", ["hair_back"]);
add_colour_children("hair_front", ["hair_back"]);

add_value_children("coat", ["coat_back","wheelchair_coat"]);
add_colour_children("coat", ["coat_back","wheelchair_coat"]);

add_value_children("bottom", ["wheelchair_bottom"]);
add_colour_children("bottom", ["wheelchair_bottom"]);

add_colour_children("top", ["top_collar"]);

/* Would make things easier but is broken >:(
let current_name_dec;
let current_name;
for (i = 0; i < two_tone_names.length; i += 1){
    current_name_dec = two_tone_names[i];
    current_name = current_name_dec.slice(0,-4);
    console.log(current_name+":"+current_name_dec)
    if (clothes_names.includes(current_name)){
        //add_value_children(current_name, [current_name_dec]);
        console.log("adding "+current_name+":"+current_name_dec)
        add_colour2_children(current_name, [current_name_dec]);
    }
    else{
        console.log("NOT adding "+current_name+":"+current_name_dec)
        current_name = current_name.slice(0,-5);
        if (clothes_names.includes(current_name)){
            //add_value_children(current_name, [current_name_dec]);
            console.log("adding "+current_name+":"+current_name_dec)
            add_colour2_children(current_name, [current_name_dec]);
        }
    }  
}*/



