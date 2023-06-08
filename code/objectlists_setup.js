//Simple functions

function findNameMatch(list, name){
    //returns the first element of list whose name equals "name"
    //list: a list of objects with a "name" field
    //name: a string
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

function filteredItems(base_list,removed_list, prob){
    // list of a random element of base_list that is not in removed_list
    temp_list = base_list.filter(value => !(removed_list.includes(value)))
    if (temp_list.length==0 || !Array.isArray(temp_list)){
        console.log("Error: filteredItems empty list")
        return listOf(0)
    }
    return listOf(randomElement(temp_list,prob))
}

function newImageList(){
    //list of ten images
    let x = [];
    for (let i=0;i<10;i++) {
        x[i]=new Image();
    }
    return x;

}

function findDefiningIndex(name){
    for (let i = 0; i < defining_objects.length; i += 1) {
        if (defining_objects[i].name ==name)
            return i;
    }
    return -1;        
}

function transferObjectValues(obj1, obj2, keys_list){
    //transfer all values within keys_list from obj2 to obj1 
    for (let i = 0; i < keys_list.length; i += 1){
        if (Object.keys(obj2).includes(keys_list[i]))
            obj1[keys_list[i]]= obj2[keys_list[i]];
        else
            console.log("Missing key: "+keys_list[i].toString())
    }
}

function createDefininglistSubset(d_list){
    //create a new list of the objects within d_list but with only the keys in defining_objects_defining_keys_list
    //d_list: either defining_list (javascript side) or current_defining_list (alpine side)
    output = [];
    for (let i = 0; i < d_list.length; i += 1){
        temp_obj = {};
        transferObjectValues(temp_obj, d_list[i],defining_objects_defining_keys_list );
        output.push(temp_obj);
    }  
    return output;
}

//Setting up lists of objects
const defining_objects_defining_keys_list = ["name","value_list","colour1","colour2","patterncolour","pattern",]

const defining_variables_object = {current_eyetype: 0,current_hairstyle: 0 };

function setUIVariables(obj){
    obj.dark_theme = false;
    obj.current_tab_type= 0;
    obj.current_expression_type=0;
    obj.current_clothing=0;
    obj.current_accessory=0;
    obj.current_export_image_type=0;
    obj.current_gender_type=0;
    obj.current_size_type=0;
    obj.current_head_ratio_type=0;
    obj.crop_height=300;
    obj.current_character_preset=0;
    obj.current_expression_preset=0;
    obj.isWeirdOutfit=false;
    obj.isWeirdBody=false;
}

const ui_variables_object= {}
setUIVariables(ui_variables_object);

const image_objects =[];



function add_image_object(name, list_list, location,box){
    let loc;
    loc=location+"/"+name.toLowerCase();
    if (name.slice(-4)=="_dec")//remove "_dec"
        loc = location+"/"+name.slice(0,-4);
    else{
        if (name=="sidelocks_repeat")//remove "_dec"
        loc = location+"/sidelocks";  
    }  
    if (list_list[5]) //male items first
        item_list = remove_dups(list_list[1].concat(list_list[0]));
    else
        item_list = remove_dups(list_list[0].concat(list_list[1]));
    image_objects.push({name: name,location: loc, box: box, item_list: item_list, item: 0, heightOffset: 0, widthOffset:0, scale: 1, crop : [],parent: defining_objects.length, colour1: "#FF0000",colour2: "#00FF00", patterncolour: "#0000FF", pattern: 0,hasShading: true, underlay_image: new Image(), base_image: new Image(),shadow_image: new Image(),highlight_image: new Image(),overlay_image: new Image(),pattern_image: new Image(), mask_image: new Image()});
}

const defining_objects =[];

//colour_children: indices of elements of image_objects with the same colours
function add_defining_object(name, list_list){
    if (list_list[5]) //male items first
        item_list = remove_dups(list_list[1].concat(list_list[0]).concat(list_list[2]));
    else
        item_list = remove_dups(list_list[0].concat(list_list[1]).concat(list_list[2]));
    item_indices_f = [];
    item_indices_m = [];
    item_indices_w = [];
    for (i = 0; i < item_list.length; i += 1){
        if (list_list[0].includes(item_list[i]))
            item_indices_f.push(i);
        if (list_list[1].includes(item_list[i]))
            item_indices_m.push(i);    
        if (list_list[2].includes(item_list[i]))
            item_indices_w.push(i);        
    }
    if (list_list[3].length >0) //there is a dec layer
        value_children =[image_objects.length-1]//,image_objects.length]
    else
        value_children =[image_objects.length-1,]
    defining_objects.push({name: name,item_list: item_list,item_indices_f: item_indices_f ,item_indices_m: item_indices_m,item_indices_w: item_indices_w, image_index: image_objects.length-1, colour_children:[image_objects.length-1],colour2_children:[],value_children:value_children,  value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00", patterncolour: "#0000FF", pattern: 0});
    

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
    // those members of image_objects which have the same item as name
    // eg add_value_children("hat", ["hat_back"]) means the image_object with the name "hat_back" has the same item as the defining_object with the name "hat")
    //sets the item_list of each member of children to line up with  that of name, padding with "none"s 
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

function object_toString(obj){
    s = "";
    for (i = 0; i < Object.keys(obj).length; i += 1){
        b = Object.keys(obj)[i];
        s+=b+" "+obj[b]+" ";
    }
    return s+"<br><br>";
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
        s+=" pattern: "+b.pattern_image.src;
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
            s+=" value_children: ";
            for (j = 0; j < b.value_children.length; j += 1){
                s+=image_objects[b.value_children[j]].name+" "
            }
            s+=" colour_children: ";
            for (j = 0; j < b.colour_children.length; j += 1){
                s+=image_objects[b.colour_children[j]].name+" "
            }
            s+=" colour2_children: ";
            for (j = 0; j < b.colour2_children.length; j += 1){
                s+=image_objects[b.colour2_children[j]].name+" "
            }
            s+="<br>";
        }
        s+="--<br><br>"
        return s
}


const hairstyle_defining_list = [ //name, hair_front, hair_middle, hair_back
    ["none","none","none","none"], ["balding","balding","none","balding"],["shaved","none","shaved","none"], ["cornrows", "cornrows", "cornrows", "none"],
    ["buzzcut","none","short","buzzcut"],
    ["straight short","none","long","straight short"],["curly short","none","short","curly short"],["wavy short","none","long","wavy short"],["side part","neat side","long shadowed","straight side"],["locs short","short locs","long shadowed","none"],
    ["fade","fade","long","fade"],["shaggy short","none","long","shaggy short"],["small tight curls","none","short","tight curls short"],
    ["tight curls","none","short","tight curls medium"],["shaggy medium","none","long","shaggy medium"], ["wavy bob","none","long shadowed","wavy bob"],["curly bob","none","long","curly bob"],["straight bob","none","long","straight bob"],
    ["locs half up", "locs bun", "long shadowed", "locs bob"],["locs bob", "locs bob", "long shadowed", "locs bob"],
    ["curly flowing", "curly flowing", "long shadowed", "curly flowing"],["straight flowing", "straight flowing", "long", "straight flowing"],
    ["straight long", "none", "long", "straight long"],["wavy long", "none", "long", "wavy long"],["curly long", "none", "long", "curly long"],["locs long", "long locs", "long shadowed", "long locs"],
    ["curly up","none","long","curly up"],["locs up","locs bun","long shadowed","locs up"],["straight up","none","long","straight up"]
]
    
const hairstyle_list = hairstyle_defining_list.map(value => value[0])  
const hairstyle_list_u = ["cornrows","buzzcut", "straight short","curly short","wavy short","shaggy short","tight curls","shaggy medium","wavy bob","straight bob","straight high pony","straight low pony","curly pony","straight long","wavy long","curly long","locs long", "locs half up"]
const hairstyle_indices_m = (hairstyle_list_u.concat(["none", "balding", "shaved","fade", "side part","small tight curls"])).map(value => hairstyle_list.indexOf(value))
const hairstyle_indices_f = (hairstyle_list_u.concat(["curly bob","twin braids", "curly bun","wavy bun","straight bun","locs bun", "locs up", "straight up", "curly up", "curly flowing","straight flowing"])).map(value => hairstyle_list.indexOf(value))
const hairstyle_indices_w = ["fancy bun"].map(value => hairstyle_list.indexOf(value))
