function checkRender(obj){
    //return false if object should not be rendered
    for (let i = 0; i < no_render_list.length; i += 1){
        if (obj.name == no_render_list[i][0]){
            if (no_render_list[i][1].includes(getImageItem(obj)))
                return false
        }
        if (obj.name.includes("wheelchair") && findNameMatch(defining_objects,"wheelchair").value_list[0] ==0)
            return false;
    }        
    return true  
}

function setVariables(data_object){
    //transfer data from webpage/load file to internal javascript

    transferObjectValues(ui_variables_object, data_object.ui_variables_object,Object.keys(ui_variables_object) )
    transferObjectValues(defining_variables_object, data_object.defining_variables_object,Object.keys(defining_variables_object) )    
      
    for (let i = 0; i < defining_objects.length; i += 1){
        transferObjectValues(defining_objects[i], data_object.current_defining_objects[i],defining_objects_defining_keys_list);}
    updateVariables();
}

function updateVariables(){
    for (let i = 0; i < defining_objects.length; i += 1){
        let json_obj = defining_objects[i];
        for (let i = 0; i < json_obj.value_children.length; i += 1){
            image_objects[json_obj.value_children[i]].item = json_obj.value_list[ui_variables_object.current_expression_type];
        }
        for (let i = 0; i < json_obj.colour_children.length; i += 1){
            image_objects[json_obj.colour_children[i]].colour1 = json_obj.colour1;
            image_objects[json_obj.colour_children[i]].patterncolour = json_obj.patterncolour;
            image_objects[json_obj.colour_children[i]].pattern = json_obj.pattern;
        }
        for (let i = 0; i < json_obj.colour2_children.length; i += 1){
            image_objects[json_obj.colour2_children[i]].colour1 = json_obj.colour2;
            image_objects[json_obj.colour2_children[i]].pattern = 0;
            image_objects[json_obj.colour2_children[i]].patterncolour = json_obj.colour2;
        }
    }

    let coat_obj = findNameMatch(image_objects,"coat");
    let chest_obj = findNameMatch(image_objects,"body_chest");
    let overshirt_obj = findNameMatch(image_objects,"overshirt");
    let top_obj = findNameMatch(image_objects,"top");
    let coat_sleeves_obj = findNameMatch(image_objects,"coat_sleeves");
    let overshirt_sleeves_obj = findNameMatch(image_objects,"overshirt_sleeves");
    let top_sleeves_obj = findNameMatch(image_objects,"top_sleeves");
    let top_collar_obj = findNameMatch(image_objects,"top_collar");
    let bottom_obj = findNameMatch(image_objects,"bottom");
    let hair_front_obj = findNameMatch(image_objects,"hair_front");
    let hair_back_obj = findNameMatch(image_objects,"hair_back");

    //waist
    if (bottom_obj.item ==0|| getImageItem(bottom_obj).includes("empire")){// hide waistline when it's not needed
        findNameMatch(image_objects,"waistline").item = -1;
        findNameMatch(image_objects,"waistline_dec").item = -1;
    }
    //remove sleeves ifclothing is sleeveless

    if (top_nosleeves_list.includes(getImageItem(top_obj)))
        top_sleeves_obj.item = -1;
    if (overshirt_nosleeves_list.includes(getImageItem(overshirt_obj)))
        overshirt_sleeves_obj.item = -1;
    if (coat_nosleeves_list.includes(getImageItem(coat_obj)))
        coat_sleeves_obj.item = -1;    

    //hair
    
    hair_front_obj.item = hair_front_numbers[defining_variables_object.current_hairstyle]
    findNameMatch(image_objects,"hair_middle").item = hair_middle_numbers[defining_variables_object.current_hairstyle]
    hair_back_obj.item = hair_back_numbers[defining_variables_object.current_hairstyle]
    
    //calculating chest
    if (chest_obj.item>0){
        if (coat_obj.item >0){
            if (no_chest_coat_list.includes(getImageItem(coat_obj)))
                findNameMatch(image_objects,"coat_chest").item = -1;
        }
        else{
            findNameMatch(image_objects,"coat_chest").item = -1;
            if (overshirt_obj.item >0){
                if (no_chest_overshirt_list.includes(getImageItem(overshirt_obj)))
                    findNameMatch(image_objects,"overshirt_chest").item = -1;
            }
        else{
            findNameMatch(image_objects,"overshirt_chest").item = -1;
            if (top_obj.item <=0){
                findNameMatch(image_objects,"top_chest").item = -1;
            }           
        }}    
    }

    //hide collars when wearing a jama coat
    if (getImageItem(coat_obj)=="jama")
        top_collar_obj.item=-1;   

    //update images and offsets
    for (let i = 0; i < image_objects.length; i += 1){
        image_objects[i].crop = [];
        image_objects[i].heightOffset = getHeightOffset(image_objects[i].name);
        image_objects[i].widthOffset = getWidthOffset(image_objects[i].name);
        if (!checkRender(image_objects[i]))
            image_objects[i].item = -1
        standard_scale =  0.8+ui_variables_object.current_size_type*0.05;   
        if (head_offset_list.includes(image_objects[i].name)) {   
            if (ui_variables_object.current_head_ratio_type==0){
                image_objects[i].scale = standard_scale; 
            } else{
                head_scale = 0.02*ui_variables_object.current_size_type+0.85
                image_objects[i].scale = head_scale; 
                image_objects[i].heightOffset += -parseInt((standard_scale-head_scale)*194)
                image_objects[i].widthOffset += parseInt((standard_scale-head_scale)*180)
            }
            
        }
        else     
            image_objects[i].scale = standard_scale;   
    }

    //sprite height
    sprite_width = full_width;
    sprite_height = full_height ;
    if (findNameMatch(defining_objects,"wheelchair").value_list[0] !=0){ //there's a wheelchair
        sprite_height = full_height*(0.8+ui_variables_object.current_size_type*0.05) -165-ui_variables_object.crop_height;
    } 
    sprite_height = sprite_height*(0.8+ui_variables_object.current_size_type*0.05) -ui_variables_object.crop_height;//-(5-ui_variables_object.current_size_type)*30

    //calculating crops

    findNameMatch(image_objects,"sidelocks_repeat").crop = [[195,125, 185,367]];


    if (coat_sleeves_obj.item>1||overshirt_sleeves_obj.item>1){//coat or overshirt have sleeves
        top_sleeves_obj.crop = [[0,0,full_width,462]]; //crop top off puffy sleeves
        if (coat_sleeves_obj.item>2||overshirt_sleeves_obj.item>2) //long sleeves
            top_sleeves_obj.crop = [[0,0,full_width,654]];
        if (coat_sleeves_obj.item>=0){ //crop top collar under sleeved coats
            crop_box = [[0,0,124,467],[264,312,50,200]];
            top_collar_obj.crop = crop_box
            findNameMatch(image_objects,"top_collar_dec").crop = crop_box;
        }   
    }

    //cropping hair to fit under hat
    let hat_string = findImageItem("hat_front");
    crop_box = [];
    if (hat_string=="hood")
        crop_box =[
            [0,0, full_width, 169+getHeightOffset(hair_front_obj.name)],
            [0,0, 140+getWidthOffset(hair_front_obj.name),full_height],
            [263+getWidthOffset(hair_front_obj.name),0,full_width,full_height],
    ]; 
    if (hat_string=="hijab")
        crop_box =[
            [0,0, full_width, 192+getHeightOffset(hair_front_obj.name)],
            [0,0, 149+getWidthOffset(hair_front_obj.name),full_height],
            [253+getWidthOffset(hair_front_obj.name),0,full_width,full_height],
    ]; 
    if (["top hat","bowler","fedora"].includes(hat_string))
        crop_box = [[0,0, full_width, 186+getHeightOffset(hair_front_obj.name)]];
    if (["broad hat","witch hat",].includes(hat_string))
        crop_box = [[0,0, full_width, 200+getHeightOffset(hair_front_obj.name)]];    
    if (hat_string=="turban")
        crop_box =[[0,0, full_width, 137+getHeightOffset(hair_front_obj.name)]]; 
    hair_front_obj.crop = crop_box;
    hair_back_obj.crop = crop_box;
    

    fixSources();

    updated_frames = 0;

    drawCanvas();
}

document.addEventListener('alpine:init', () => {
    Alpine.data('dropdown', (titleInput = "",valueNameInput = "", typeNameInput = "") => ({
        title: titleInput, //the name for this choice used in the webpage
        valueName: valueNameInput, //the value being set 
        typeName: typeNameInput, //extra info on the type of button

      dropbtn: {
        //Sets a variable in a list using a dropdown
          ['x-html']() {
            output = "";
            id = '"drop'+this.title+this.valueName+'"'
            if (this.title!="")
                output += '<label for='+id+'>'+this.title+'</label>: ';  
            extra_commands = "";
            switch(this.typeName){
                case 'body':
                    obj_index = findDefiningIndex(this.valueName);
                    objName = '$store.alpineData.current_defining_objects['+obj_index+'].value_list';
                    objList = 'defining_objects['+obj_index+'].item_list';
                    buttonName = objName+"[0]";
                    value = "listOf(index)";
                    break;
                case 'clothing':
                    obj_index = 'findDefiningIndex(clothingname_list[$store.alpineData.ui_variables_object.current_clothingname])';
                    objName = '$store.alpineData.current_defining_objects['+obj_index+'].value_list';
                    objList = 'defining_objects['+obj_index+'].item_list';
                    buttonName = objName+"[0]";
                    value = "listOf(index)";
                    break; 
                case 'pattern':
                    obj_index = '$store.alpineData.current_defining_objects[findDefiningIndex('+this.valueName+'name_list[$store.alpineData.ui_variables_object.current_'+this.valueName+'name])].pattern';
                    objName = obj_index;
                    objList = 'pattern_list';
                    buttonName = objName;
                    value = "index";
                    break;     
                case 'sleeves':
                    if (!has_sleeves_list.includes(clothingname_list[Alpine.store('alpineData').ui_variables_object.current_clothingname])){
                        return "";
                    } else{
                        obj_index = sleeveIndex(); 
                        objName = '$store.alpineData.current_defining_objects['+obj_index+'].value_list';
                        objList = 'defining_objects['+obj_index+'].item_list';
                        buttonName = objName+"[0]";
                        value = "listOf(index)";
                }
                    break;          
                case 'accessory':
                    obj_index = 'findDefiningIndex(accessoryname_list[$store.alpineData.ui_variables_object.current_accessoryname])';
                    objName = '$store.alpineData.current_defining_objects['+obj_index+'].value_list';
                    objList = 'defining_objects['+obj_index+'].item_list';
                    buttonName = objName+"[0]";
                    value = "listOf(index)";
                    break;        
                case 'expression':
                    obj_index = findDefiningIndex(this.valueName);
                    objName = '$store.alpineData.current_defining_objects['+obj_index+'].value_list[$store.alpineData.ui_variables_object.current_expression_type]';
                    objList = 'defining_objects['+obj_index+'].item_list';
                    buttonName = objName;
                    value = "index";
                    break;  
                case 'simple':
                    objName = '$store.alpineData.defining_variables_object.'+this.valueName;
                    buttonName = objName;
                    value = "index";
                    objList = varList(this.valueName);
                    break;

                case 'ui':
                    objName = '$store.alpineData.ui_variables_object.'+this.valueName;
                    value = "index";
                    buttonName = objName;
                    extra_commands = "";
                    objList = varList(this.valueName);
                    switch(this.valueName){
                        case 'current_character_preset': 
                            extra_commands = '$store.alpineData.transferDefiningListValues($store.alpineData.ui_variables_object.current_character_preset,character_indices, character_preset_defining_list,character_preset_list_values);'
                            extra_commands += '$store.alpineData.transferDefiningValues($store.alpineData.ui_variables_object.current_character_preset,character_preset_defining_list, character_preset_values);'
                            break;       
                        case 'current_expression_preset': 
                            extra_commands = '$store.alpineData.transferDefiningListValues($store.alpineData.ui_variables_object.current_expression_preset,expression_indices, expression_preset_defining_list,expression_preset_list_values);'
                            break;                               
                    }
                    break;     
            }    
            
            
            output +='<button id='+id+' class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" x-text="niceString('+objList+'['+buttonName+'])"></button>';
            output +='<ul class="dropdown-menu"> <template x-for=" (preset, index) in '+objList+'">'; 
            output +='<li><button class="dropdown-item" x-on:click="'+objName+'='+value+';';
            output+=extra_commands 
            output +='setVariables(Alpine.store(\'alpineData\'));" x-text="niceString(preset)"></a></li>'; 
            output +='</template></ul>' 
            
            return output;
          },
      },
      colourbtn: {
        //Sets a colour using the colour picker
        ['x-html']() {

            switch(this.typeName){ //objName is the variable being edited by this type of button
                case 'body':
                    objName = '$store.alpineData.current_defining_objects[findDefiningIndex(\''+this.valueName+'\')].colour1';
                    break;
                case 'clothing1':
                    objName = '$store.alpineData.current_defining_objects[findDefiningIndex('+this.valueName+'name_list[$store.alpineData.ui_variables_object.current_'+this.valueName+'name])].colour1';
                    break; 
                case 'clothing2':
                    objName = '$store.alpineData.current_defining_objects[findDefiningIndex('+this.valueName+'name_list[$store.alpineData.ui_variables_object.current_'+this.valueName+'name])].colour2';
                    break;  
                case 'pattern':
                    objName = '$store.alpineData.current_defining_objects[findDefiningIndex('+this.valueName+'name_list[$store.alpineData.ui_variables_object.current_'+this.valueName+'name])].patterncolour';
                    break;   
                case 'ui':  
                    objName = '$store.alpineData.ui_variables_object.'+this.valueName;
                    break;           
            }    
            id = '"drop'+this.title+this.valueName+'"';
            output = '<label for='+id+'>'+this.title+'</label>: ';   
            output += '<input id='+id+' type="color" :value ="'+objName+'"  @input="'+objName+'=$event.target.value;setVariables(Alpine.store(\'alpineData\'));" :aria-label="colour_desc('+objName+')"/>'
            return output 
            },
        },
        numberbtn: {
            //Sets a number using a number input
            ['x-html']() {
    
                switch(this.typeName){
                    case 'crop':
                        objName = '$store.alpineData.ui_variables_object.crop_height';
                        break;           
                }    
                id = '"drop'+this.title+this.valueName+'"';
                output = '<label for='+id+ 'class="form-label">'+this.title+'</label>: ';   
                output += '<input id='+id+' type="number" :value ="'+objName+'"  @input="'+objName+'=$event.target.value;setVariables(Alpine.store(\'alpineData\'));"/>'
                return output 
                },
            },
  }))
  //data used by the Alpine components on the webpage
  Alpine.store('alpineData', {
    dark_theme: true,

    ui_variables_object: ui_variables_object,
    defining_variables_object: defining_variables_object,

    current_defining_objects: createDefininglistSubset(defining_objects),

    fixAlpine() { //make the alpine components match the variables used by the javascript
    
        for (let i = 0; i < Object.keys(ui_variables_object).length; i += 1){
            this[Object.keys(ui_variables_object)[i]] = ui_variables_object[Object.keys(ui_variables_object)[i]]
        }
        transferObjectValues(this.ui_variables_object, ui_variables_object,Object.keys(ui_variables_object) )
        transferObjectValues(this.defining_variables_object, defining_variables_object,Object.keys(defining_variables_object) )
        
        for (let i = 0; i < defining_objects.length; i += 1){
            transferObjectValues(this.current_defining_objects[i], defining_objects[i],defining_objects_defining_keys_list )
        }        
    },
transferDefiningListValues(preset_index,relevant_defining_indices, preset_defining_list, property_list){
    //use the properties of property_list for the relevant_defining_indices of the preset_indexth element of preset_defining_list
    for (i = 0; i < relevant_defining_indices.length; i += 1){ 
        for (j = 0; j < property_list.length; j += 1){ 
            this.current_defining_objects[relevant_defining_indices[i]][property_list[j]] = preset_defining_list[preset_index].current_defining_objects[relevant_defining_indices[i]][property_list[j]];
        }
    }
},
transferDefiningValues(preset_index,preset_defining_list, property_list){
    //use the properties of property_list for the relevant_defining_indices of the preset_indexth element of preset_defining_list
        for (j = 0; j < property_list.length; j += 1){ 
            this.defining_variables_object[property_list[j]] = preset_defining_list[preset_index].defining_variables_object[property_list[j]];
        }
},

    randomiseBodyColouring(){
        //randomise the skin/eye/hair colour
        if (this.ui_variables_object.isWeirdBody){
            this.current_defining_objects[findDefiningIndex("head")].colour1 = randomElement(skin_colours.concat(skin_colours_weird),0);
            this.current_defining_objects[findDefiningIndex("fringe")].colour1 = randomElement(hair_colours.concat(hair_colours_weird),0);
            this.current_defining_objects[findDefiningIndex("eyes")].colour1 = randomElement(eye_colours.concat(eye_colours_weird),0);

        }else{
            this.current_defining_objects[findDefiningIndex("head")].colour1 = randomElement(skin_colours,0);
            this.current_defining_objects[findDefiningIndex("fringe")].colour1 = randomElement(hair_colours,0);
            this.current_defining_objects[findDefiningIndex("eyes")].colour1 = randomElement(eye_colours,0);
            
        }
    },
    randomiseFeatures(gender){
        //randomise the nose/head etc
        // gender: 0 =androgynous, 1 =masculine, 2=feminine
        for (let i = 0; i < defining_objects.length; i += 1){
            remove_list = []
            if (!this.ui_variables_object.isWeirdBody)
                remove_list = defining_objects[i].item_indices_w
            if (["nose","head","ears","body","complexion", ].includes(defining_objects[i].name)){
                this.current_defining_objects[i].value_list = filteredItems(range(defining_objects[i].item_list.length),remove_list,0);
            }
            if ("body_chest"==defining_objects[i].name){
                switch(gender){
                    case 0:
                        this.current_defining_objects[i].value_list = listOf(randomIndex(defining_objects[i].item_list,0.3));
                        break;
                    case 1:
                        this.current_defining_objects[i].value_list = listOf(0);
                        break;
                    case 2:
                        this.current_defining_objects[i].value_list = listOf(randomIndex(defining_objects[i].item_list,0));
                        break;    
                }
            }
        }
        this.transferDefiningListValues(randomIndex(expression_preset_defining_list,0),expression_indices, expression_preset_defining_list,["value_list"])
        //this.current_size_type = randomIndex(size_type_list,0);
        remove_list = [];
        
        if (!this.ui_variables_object.isWeirdBody)
            remove_list = eyetype_indices_w
        switch(gender){ // gender: 0 =androgynous, 1 =masculine, 2=feminine
            case 0:
                this.defining_variables_object.current_eyetype = filteredItems(range(eyetype_list.length),remove_list,0)[0];  
                break;
            case 1:
                this.defining_variables_object.current_eyetype = filteredItems(eyetype_indices_m,remove_list,0)[0];
                break;
            case 2:
                this.defining_variables_object.current_eyetype = filteredItems(eyetype_indices_f,remove_list,0)[0];
                break;          
        }  
    },
    randomiseClothingColour(){
        //randomise all clothing colours
        let temp_list;
        if (Math.random()>0.5)
            temp_list = outfit_colours;
        else{
            temp_list = randomElement(scheme_list,0);
        }
            
        for(let i = 0; i < defining_objects.length; i++){
            if (outfit_list.includes(defining_objects[i].name)||accessory_list.includes(defining_objects[i].name)) {
                this.current_defining_objects[i].colour1 = randomElement(temp_list,0);
                this.current_defining_objects[i].colour2 = randomElement(temp_list,0);
                if (this.current_defining_objects[i].name=="back"){
                    this.current_defining_objects[i].patterncolour = randomElement(temp_list,0);
                    this.current_defining_objects[i].pattern = 0;

                } else{
                    this.current_defining_objects[i].patterncolour = randomElement(temp_list,0);
                    this.current_defining_objects[i].pattern = randomIndex(pattern_list,0.8);
                }
            }
        }
    },
    randomiseClothingValue(gender){
        //set all clothing values including sleeve length
        // gender: 0 =androgynous, 1 =masculine, 2=feminine
        let remove_list = []
        if (!this.ui_variables_object.isWeirdOutfit)
            remove_list = hairstyle_indices_w
        switch(gender){
            case 0:
                this.defining_variables_object.current_hairstyle =filteredItems(range(hairstyle_list.length),remove_list,0)[0];  
                this.defining_variables_object.current_waist_type =randomElement(range(waist_type_list.length), 0.5)
                break;
            case 1:
                this.defining_variables_object.current_hairstyle =filteredItems(hairstyle_indices_m,remove_list,0)[0];
                this.defining_variables_object.current_waist_type =0;
                break;
            case 2:
                this.defining_variables_object.current_hairstyle =filteredItems(hairstyle_indices_f,remove_list,0)[0];
                this.defining_variables_object.current_waist_type =randomElement(range(waist_type_list.length), 0)
                break;          
        }  
        hair_remove_list= hairExcludeIndices(this.defining_variables_object.current_hairstyle);

        for (let i = 0; i < defining_objects.length; i += 1){
            this_list = outfit_list.concat(accessory_list).concat(sleeve_list).concat(["fringe","sidelocks","hair_extra", "facial_hair","waistline"])
            if (this_list.includes(defining_objects[i].name)) {
                var prob;
                if (accessory_list.includes(defining_objects[i].name)|| ["wheelchair","facial_hair","hair_extra"].includes(defining_objects[i].name)){//accessories less common
                    prob = 0.5;
                }
                else{
                    if (["top","bottom","fringe","sidelocks","waistline"].includes(defining_objects[i].name)){
                        prob = -1;
                    }
                    else
                        prob = 0;    
                }
                remove_list = []
                if (!this.ui_variables_object.isWeirdOutfit)
                    remove_list = defining_objects[i].item_indices_w

                if (["fringe", "sidelocks","hair_extra"].includes(defining_objects[i].name)&& this.defining_variables_object.current_hairstyle<3){// bald/balding/shaved
                        this.current_defining_objects[i].value_list = listOf(0);
                    }   
                else{
                    if (defining_objects[i].name=="fringe"){
                        if (this.defining_variables_object.current_hairstyle<4)// cornrows
                            this.current_defining_objects[i].value_list = listOf(0);
                        else    
                            remove_list = remove_list.concat(hair_remove_list[0]);
                    }
                    else{
                        if (defining_objects[i].name=="sidelocks"){
                            if (this.defining_variables_object.current_hairstyle<4)// cornrows
                                this.current_defining_objects[i].value_list = listOf(0);
                            else    
                                remove_list = remove_list.concat(hair_remove_list[1]);
                        }
                        else{
                            if (defining_objects[i].name=="hair_extra")
                            remove_list = remove_list.concat(hair_remove_list[2]);
                        }
                    }
    
                    switch(gender){
                        case 0:
                            this.current_defining_objects[i].value_list = filteredItems(range(defining_objects[i].item_list.length),remove_list,prob);  
                            break;
                        case 1:
                            this.current_defining_objects[i].value_list = filteredItems(defining_objects[i].item_indices_m,remove_list,prob);  
                            break;
                        case 2:
                            this.current_defining_objects[i].value_list = filteredItems(defining_objects[i].item_indices_f,remove_list,prob);  
                            break;          
                    }   
                }
                

                /*if (defining_objects[i].name=="neckwear"&& this.defining_variables_object.current_hairstyle<3){// bald/balding/shaved
                    this.current_defining_objects[i].value_list = listOf(0);
                } Want to remove ugly ties but it's troublesome */ 
                if (["wheelchair"].includes(defining_objects[i].name))//just while fixing clothes 
                    this.current_defining_objects[i].value_list = listOf(0);     
                }
        }
        
        b_index = findDefiningIndex("bottom")
        //remove coat if wearing a puffy skirt
        if (defining_objects[b_index].item_list[this.current_defining_objects[b_index].value_list[0]].includes("puffy"))
            this.current_defining_objects[findDefiningIndex("coat")].value_list = listOf(0);
        //remove overshirt if wearing a full skirt
        if (defining_objects[b_index].item_list[this.current_defining_objects[b_index].value_list[0]].includes("full")){
            this.current_defining_objects[findDefiningIndex("overshirt")].value_list = listOf(0);
            this.current_defining_objects[findDefiningIndex("coat")].value_list = listOf(0);
        }
    },
    randomiseAll(gender){
        // gender: 0 =androgynous, 1 =masculine, 2=feminine
        remove_list = [];
        
        for (i = 0; i < character_preset_defining_list.length; i += 1){
            //if isWeirdOutfit is false, add all the presets with weird outfits to the remove list
            if (character_preset_defining_list[i].ui_variables_object.isWeirdOutfit&&!this.ui_variables_object.isWeirdOutfit)
                remove_list.push(i);
            else{    
            //if this preset is gendered and gender is not androgynous, remove if the genders dont match
                if (character_preset_defining_list[i].ui_variables_object.current_gender_type+gender==3)
                    remove_list.push(i);
            }
        }     
        current_preset = randomElement(range(character_preset_defining_list.length).filter(value => !(remove_list.includes(value))),0)     
        //body colouring. If isWeirdBody is false and this preset has a weird body, randomise the colours  
        if ((!this.ui_variables_object.isWeirdBody&&character_preset_defining_list[current_preset]["isWeirdBody"])||Math.random()>0.1)
            this.randomiseBodyColouring();
        else
            this.transferDefiningListValues(current_preset,definingSubsetIndices(["head","fringe","eyes"]), character_preset_defining_list,["colour1","colour2"]);
        //clothing colour
        if (Math.random()>0.1)
            this.randomiseClothingColour();
        else
            this.transferDefiningListValues(current_preset,definingSubsetIndices(outfit_list.concat(accessory_list)), character_preset_defining_list,["colour1","colour2","pattern","patterncolour"]);
        //features
        if (Math.random()>0.1)
            this.randomiseFeatures(gender);
        else{
            this.transferDefiningListValues(current_preset,definingSubsetIndices(["nose","head","ears","body","complexion", "body_chest",]), character_preset_defining_list,["value_list"]);
            this.defining_variables_object.current_eyetype = character_preset_defining_list[current_preset].defining_variables_object.current_eyetype;
            this.transferDefiningListValues(randomIndex(expression_preset_defining_list,0),expression_indices, expression_preset_defining_list,["value_list"])
        }
        if (Math.random()>0.1){
            this.randomiseClothingValue(gender);
        }
        else{
            this.transferDefiningListValues(current_preset,definingSubsetIndices(full_outfit_list), character_preset_defining_list,["value_list"]);
            this.defining_variables_object.current_hairstyle = character_preset_defining_list[current_preset].defining_variables_object.current_hairstyle;
        }

    },
})
  })

function niceString(input){
    //the text to put in a button
    let output = input.toString();
    output = output.replace("_", " ");
    return output.charAt(0).toUpperCase()+output.slice(1)

}

function setup(){
    canvas_main = document.getElementById("mainCanvas");
    ctx_main = canvas_main.getContext("2d");

    document.getElementById('download').addEventListener('click', function(e) {
        // from https://fjolt.com/article/html-canvas-save-as-image

        let filename = "dollmaker_";
        switch(ui_variables_object.current_export_image_type){
            case 0:
                filename += "body";
                break;
            case 1:
                filename += "expression_"+expression_type_list[ui_variables_object.current_expression_type];
                break;
            case 2:
                filename += "outfit";
                break;   
        }   
        console.log("saving "+filename);              
        // Convert our canvas to a data URL
        let canvasUrl = canvas_main.toDataURL();
        // Create an anchor, and set the href value to our data URL
        const createEl = document.createElement('a');
        createEl.href = canvasUrl;
    
        // This is the name of our downloaded file
        createEl.download = filename;
    
        // Click the download button, causing a download, and then remove it
        createEl.click();
        createEl.remove();
    })
    
    checkFileAPI();
    Alpine.store('alpineData').randomiseAll(0);

    //fix variables
    setVariables(Alpine.store('alpineData'));
    Alpine.store('alpineData').fixAlpine();
    
    drawCanvas();
}
let portrait_back = new Image();
portrait_back.src = "";

let hair_image = new Image();
hair_image.src = "images/render/swatches/hair.png"
let eyes_image = new Image();
eyes_image.src = "images/render/swatches/eyes.png"
let skin_image = new Image();
skin_image.src = "images/render/swatches/skin.png"
let outfit_image = new Image();
outfit_image.src = "images/render/swatches/outfit.png"
let schemes_image = new Image();
schemes_image.src = "images/render/swatches/schemes.png"

const pattern_canvas = new OffscreenCanvas(full_width, full_height);
const pattern_ctx = pattern_canvas.getContext("2d");
const off_canvas = new OffscreenCanvas(full_width, full_height);
const off_ctx = off_canvas.getContext("2d");
const effect_image = new Image();
window.onload = setup;
var game = setInterval(drawCanvas, 100);//Update canvas every 100 miliseconds

//Some useful posts:
//https://github.com/ninique/Dollmaker-Script
//https://stackoverflow.com/questions/45187291/how-to-change-the-color-of-an-image-in-a-html5-canvas-without-changing-its-patte?rq=1
//https://stackoverflow.com/questions/24405245/html5-canvas-change-image-color
//https://stackoverflow.com/questions/9303757/how-to-change-color-of-an-image-using-jquery
//https://stackoverflow.com/questions/28301340/changing-image-colour-through-javascript
//https://stackoverflow.com/questions/32784387/javascript-canvas-not-redrawing
