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

    currently_editing = data_object.currently_editing; //which element of editing list we are editing
    current_expression = data_object.current_expression;
    current_clothing = data_object.current_clothing;
    current_accessory = data_object.current_accessory;
    current_imageType = data_object.current_imageType;

    size = data_object.size;
    head_size = data_object.head_size;
    crop_height = data_object.crop_height;
    current_eyetype = data_object.current_eyetype;
    current_hairstyle = data_object.current_hairstyle;
    isWeirdOutfit = data_object.isWeirdOutfit;
    isWeirdBody = data_object.isWeirdBody;
    

    for (let i = 0; i < defining_objects.length; i += 1){
        let json_obj = defining_objects[i];
        let alpine_obj = data_object.current_defining_objects[i];
        current_item = alpine_obj.name; 
        json_obj.value_list = alpine_obj.value_list
        json_obj.colour1 = alpine_obj.colour1
        json_obj.colour2 = alpine_obj.colour2
        json_obj.patterncolour = alpine_obj.patterncolour
        json_obj.pattern = alpine_obj.pattern
        for (let i = 0; i < json_obj.value_children.length; i += 1){
            image_objects[json_obj.value_children[i]].item = json_obj.value_list[current_expression];
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
    if (bottom_obj.item ==0)
        findNameMatch(image_objects,"waistline").item = -1;
    //sleeves

    if (top_nosleeves_list.includes(getImageItem(top_obj)))
        top_sleeves_obj.item = -1;
    if (overshirt_nosleeves_list.includes(getImageItem(overshirt_obj)))
        overshirt_sleeves_obj.item = -1;
    if (coat_nosleeves_list.includes(getImageItem(coat_obj)))
        coat_sleeves_obj.item = -1;    

    //hair
    
    hair_front_obj.item = hair_front_numbers[current_hairstyle]
    findNameMatch(image_objects,"hair_middle").item = hair_middle_numbers[current_hairstyle]
    hair_back_obj.item = hair_back_numbers[current_hairstyle]
    
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
        image_objects[i].scale = 0.8+size*0.05;   
    }

    //sprite height
    sprite_width = full_width;
    sprite_height = full_height ;
    if (findNameMatch(defining_objects,"wheelchair").value_list[0] !=0){ //there's a wheelchair
        sprite_height = full_height*(0.8+size*0.05) -165-crop_height;
    } 
    sprite_height = sprite_height*(0.8+size*0.05) -crop_height;//-(5-size)*30

    //calculating crops

    findNameMatch(image_objects,"sidelocks_repeat").crop = [[195,125, 185,367]];


    if (coat_sleeves_obj.item>0||overshirt_sleeves_obj.item>0){//coat or overshirt have sleeves
        top_sleeves_obj.crop = [[0,0,full_width,462]]; //crop top off puffy sleeves
        if (coat_sleeves_obj.item>1||overshirt_sleeves_obj.item>1) //long sleeves
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
            
            switch(this.typeName){
                case 'body':
                    obj_index = findDefiningIndex(this.valueName);
                    objName = '$store.alpineData.current_defining_objects['+obj_index+'].value_list';
                    objList = 'defining_objects['+obj_index+'].item_list';
                    buttonName = objName+"[0]";
                    value = "listOf(index)";
                    break;
                case 'clothing':
                    obj_index = 'findDefiningIndex(clothing_names[$store.alpineData.current_clothing])';
                    objName = '$store.alpineData.current_defining_objects['+obj_index+'].value_list';
                    objList = 'defining_objects['+obj_index+'].item_list';
                    buttonName = objName+"[0]";
                    value = "listOf(index)";
                    break; 
                case 'pattern':
                    obj_index = '$store.alpineData.current_defining_objects[findDefiningIndex('+this.valueName+'_names[$store.alpineData.current_'+this.valueName+'])].pattern';
                    objName = obj_index;
                    objList = 'pattern_list';
                    buttonName = objName;
                    value = "index";
                    break;     
                case 'sleeves':
                    if (!has_sleeves_list.includes(clothing_names[Alpine.store('alpineData').current_clothing])){
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
                    obj_index = 'findDefiningIndex(accessory_names[$store.alpineData.current_accessory])';
                    objName = '$store.alpineData.current_defining_objects['+obj_index+'].value_list';
                    objList = 'defining_objects['+obj_index+'].item_list';
                    buttonName = objName+"[0]";
                    value = "listOf(index)";
                    break;        
                case 'expression':
                    obj_index = findDefiningIndex(this.valueName);
                    objName = '$store.alpineData.current_defining_objects['+obj_index+'].value_list[current_expression]';
                    objList = 'defining_objects['+obj_index+'].item_list';
                    buttonName = objName;
                    value = "index";
                    break;    
                case 'simple':
                    objName = '$store.alpineData.'+this.valueName;
                    value = "index";
                    buttonName = objName;
                    switch(this.valueName){
                        case 'current_clothing':
                            objList = 'clothing_names';
                            break;
                        case 'current_accessory':
                            objList = 'accessory_names';
                            break;    
                        case 'current_expression':
                            objList = 'panel_list';
                            break;
                        case 'size':
                            objList = 'size_list';
                            break;
                        case 'head_size':
                            objList = 'size_list';
                            break;    
                        case 'current_eyetype': 
                            objList = 'eyetype_list';
                            break;  
                        case 'current_hairstyle': 
                            objList = 'hairstyle_list';
                            break;       
                        case 'current_imageType': 
                            objList = 'imageType_list';
                            break;           

                    }
                    break;     
            }    
            
            
            output +='<button id='+id+' class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" x-text="niceString('+objList+'['+buttonName+'])"></button>';
            output +='<ul class="dropdown-menu"> <template x-for=" (preset, index) in '+objList+'">'; 
            output +='<li><button class="dropdown-item" x-on:click="'+objName+'='+value+';setVariables(Alpine.store(\'alpineData\'));" x-text="niceString(preset)"></a></li>'; 
            output +='</template></ul>' 
            
            return output;
          },
      },
      colourbtn: {
        //Sets a colour using the colour picker
        ['x-html']() {

            switch(this.typeName){
                case 'body':
                    objName = '$store.alpineData.current_defining_objects[findDefiningIndex(\''+this.valueName+'\')].colour1';
                    break;
                case 'clothing1':
                    objName = '$store.alpineData.current_defining_objects[findDefiningIndex('+this.valueName+'_names[$store.alpineData.current_'+this.valueName+'])].colour1';
                    break; 
                case 'clothing2':
                    objName = '$store.alpineData.current_defining_objects[findDefiningIndex('+this.valueName+'_names[$store.alpineData.current_'+this.valueName+'])].colour2';
                    break;  
                case 'pattern':
                    objName = '$store.alpineData.current_defining_objects[findDefiningIndex('+this.valueName+'_names[$store.alpineData.current_'+this.valueName+'])].patterncolour';
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
                        objName = '$store.alpineData.crop_height';
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
    currently_editing : 0,
    current_expression : 0,
    current_clothing : 0,
    current_accessory : 0,
    current_imageType : 0,

    size : 0,
    head_size: 0,
    crop_height : 300,
    current_eyetype: 0,
    current_hairstyle: 0,
    isWeirdOutfit: false,
    isWeirdBody: false, 

    current_defining_objects: [
        {"name":"hair_extra","value_list":[2,2,2,2,2,2,2,2,2,2],"colour1":"#712A0D","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"back","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#FF0000","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"body","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#FF0000","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"body_chest","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#FF0000","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"socks","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#E3313C","colour2":"#901E3B",patterncolour: "#0000FF", pattern: 0},
        {"name":"shoes","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#E3313C","colour2":"#901E3B",patterncolour: "#0000FF", pattern: 0},
        {"name":"gloves","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#E3313C","colour2":"#901E3B",patterncolour: "#0000FF", pattern: 0},
        {"name":"top_sleeves","value_list":[1,1,1,1,1,1,1,1,1,1],"colour1":"#901E3B","colour2":"#4C6BC2",patterncolour: "#0000FF", pattern: 0},
        {"name":"top","value_list":[1,1,1,1,1,1,1,1,1,1],"colour1":"#901E3B","colour2":"#4C6BC2",patterncolour: "#0000FF", pattern: 0},
        {"name":"bottom","value_list":[2,2,2,2,2,2,2,2,2,2],"colour1":"#FAE181","colour2":"#FAF1CF",patterncolour: "#0000FF", pattern: 0},
        {"name":"waistline","value_list":[2,2,2,2,2,2,2,2,2,2],"colour1":"#FAE181","colour2":"#FAF1CF",patterncolour: "#0000FF", pattern: 0},
        {"name":"overshirt_sleeves","value_list":[1,1,1,1,1,1,1,1,1,1],"colour1":"#901E3B","colour2":"#4C6BC2",patterncolour: "#0000FF", pattern: 0},
        {"name":"overshirt","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#4C6BC2","colour2":"#FAE181",patterncolour: "#0000FF", pattern: 0},
        {"name":"neckwear","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#43A92D","colour2":"#43A92D",patterncolour: "#0000FF", pattern: 0},
        {"name":"coat_sleeves","value_list":[1,1,1,1,1,1,1,1,1,1],"colour1":"#901E3B","colour2":"#4C6BC2",patterncolour: "#0000FF", pattern: 0},
        {"name":"coat","value_list":[4,4,4,4,4,4,4,4,4,4],"colour1":"#E3313C","colour2":"#7543BD",patterncolour: "#0000FF", pattern: 0},
        {"name":"sidelocks","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#712A0D","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"head","value_list":[2,2,2,2,2,2,2,2,2,2],"colour1":"#CA783C","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"ears","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#FF0000","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"earrings","value_list":[3,3,3,3,3,3,3,3,3,3],"colour1":"#901E3B","colour2":"#91C639",patterncolour: "#0000FF", pattern: 0},
        {"name":"nose","value_list":[1,1,1,1,1,1,1,1,1,1],"colour1":"#FF0000","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"complexion","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#FF0000","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"cheeks","value_list":[0,0,0,0,0,1,0,0,0,0],"colour1":"#FF0000","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"mouth","value_list":[15,12,28,30,18,14,22,28,6,8],"colour1":"#FF0000","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"eyebrows","value_list":[7,11,4,16,11,1,4,2,18,0],"colour1":"#FF0000","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"eyes","value_list":[0,2,5,7,5,4,6,8,3,0],"colour1":"#8334D8","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"eyewear","value_list":[1,1,1,1,1,1,1,1,1,1],"colour1":"#FAF6E9","colour2":"#FAF1CF",patterncolour: "#0000FF", pattern: 0},
        {"name":"facial_hair","value_list":[2,2,2,2,2,2,2,2,2,2],"colour1":"#712A0D","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"fringe","value_list":[2,2,2,2,2,2,2,2,2,2],"colour1":"#712A0D","colour2":"#00FF00",patterncolour: "#0000FF", pattern: 0},
        {"name":"hat","value_list":[0,0,0,0,0,0,0,0,0,0],"colour1":"#E1748A","colour2":"#FAF1CF",patterncolour: "#0000FF", pattern: 0},
        {"name":"wheelchair","value_list":[1,1,1,1,1,1,1,1,1,1],"colour1":"#4C6BC2","colour2":"#7543BD"}],

    fixAlpine() { //make the alpine components match the variables used by the javascript
    
        this.size= size;
        this.head_size= head_size;
        this.crop_height= crop_height;
        this.current_eyetype = current_eyetype;
        this.current_hairstyle = current_hairstyle;
        this.isWeirdOutfit = isWeirdOutfit;
        this.isWeirdBody = isWeirdBody;
        
        for (let i = 0; i < defining_objects.length; i += 1){
            let json_obj = defining_objects[i];
            current_item = json_obj.name; 
            this.current_defining_objects[i].value_list = json_obj.value_list;
            this.current_defining_objects[i].colour1 = json_obj.colour1;
            this.current_defining_objects[i].colour2 = json_obj.colour2;
            this.current_defining_objects[i].patterncolour = json_obj.patterncolour;
            this.current_defining_objects[i].pattern = json_obj.pattern;
        }        
    },

    randomiseBodyColouring(){
        //randomise the skin/eye/hair colour
        if (this.isWeirdBody){
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
        //randomise the nose/head/hairstyle etc
        // gender: 0 =androgynous, 1 =masculine, 2=feminine
        for (let i = 0; i < defining_objects.length; i += 1){
            remove_list = []
            if (!isWeirdBody)
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
        this.size = randomIndex(size_list,0);
        remove_list = [];
        if (!isWeirdBody)
            remove_list = eyetype_indices_w
        switch(gender){
            case 0:
                this.current_eyetype =filteredItems(range(eyetype_list.length),remove_list,0)[0];  
                break;
            case 1:
                this.current_eyetype = filteredItems(eyetype_indices_m,remove_list,0)[0];
                break;
            case 2:
                this.current_eyetype = filteredItems(eyetype_indices_f,remove_list,0)[0];
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
        if (!isWeirdOutfit)
            remove_list = hairstyle_indices_w
        switch(gender){
            case 0:
                this.current_hairstyle =filteredItems(range(hairstyle_list.length),remove_list,0)[0];  
                break;
            case 1:
                this.current_hairstyle = filteredItems(hairstyle_indices_m,remove_list,0)[0];
                break;
            case 2:
                this.current_hairstyle = filteredItems(hairstyle_indices_f,remove_list,0)[0];
                break;          
        }  
        hair_remove_list= hairExcludeIndices(this.current_hairstyle);

        for (let i = 0; i < defining_objects.length; i += 1){
            this_list = outfit_list.concat(accessory_list).concat(sleeve_list).concat(["fringe","sidelocks","hair_extra", "facial_hair","waistline"])
            if (this_list.includes(defining_objects[i].name)) {
                var prob;
                if (accessory_list.includes(defining_objects[i].name)|| defining_objects[i].name=="wheelchair"|| defining_objects[i].name=="facial_hair"){//accessories less common
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
                if (!isWeirdOutfit)
                    remove_list = defining_objects[i].item_indices_w

                if (["fringe", "sidelocks","hair_extra"].includes(defining_objects[i].name)&& this.current_hairstyle<3){// bald/balding/shaved
                        this.current_defining_objects[i].value_list = listOf(0);
                    }   
                else{
                    if (defining_objects[i].name=="fringe"){
                        if (this.current_hairstyle<4)// cornrows
                            this.current_defining_objects[i].value_list = listOf(0);
                        else    
                            remove_list = remove_list.concat(hair_remove_list[0]);
                    }
                    else{
                        if (defining_objects[i].name=="sidelocks"){
                            if (this.current_hairstyle<4)// cornrows
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
                

                /*if (defining_objects[i].name=="neckwear"&& this.current_hairstyle<3){// bald/balding/shaved
                    this.current_defining_objects[i].value_list = listOf(0);
                } Want to remove ugly ties but it's troublesome */ 
                if (["wheelchair"].includes(defining_objects[i].name))//just while fixing clothes 
                    this.current_defining_objects[i].value_list = listOf(0);  
            }
        }
            
    },
    randomiseAll(gender){
        this.randomiseBodyColouring();
        this.randomiseClothingColour();
        this.randomiseFeatures(gender);
        this.randomiseClothingValue(gender);
    },
})
  })

function niceString(input){
    //the text to put in a button
    let output = input.toString();
    output = output.replace("_", " ");
    return output.charAt(0).toUpperCase()+output.slice(1)

}

function drawCanvas() {
    //draw the canvases
    
    //preview canvas
    if (testing)
        document.getElementById("closet").innerHTML = print_defining_objects()+print_image_objects();

    if (updated_frames>50) 
        return; //it's been long enough since the last data update to stop refreshing the images
    else
        updated_frames+=1;    

    canvas_preview = document.getElementById("previewCanvas");
    canvas_sample = document.getElementById("sampleCanvas");

    ctx_preview = canvas_preview.getContext("2d");
    ctx_sample = canvas_sample.getContext("2d");

    canvas_preview.height = sprite_height; //clears
    canvas_sample.height = canvas_sample.height;

    //document.getElementById("closet").innerHTML = print_image_objects();
    //portrait preview

    preview_width=full_width;
    preview_height=sprite_height;

    ctx_sample.clearRect(0,0,canvas_sample.width,canvas_sample.height)
    if (currently_editing==0){
        ctx_sample.drawImage(skin_image,0,0)
        ctx_sample.drawImage(eyes_image,250,0)
        ctx_sample.drawImage(hair_image,500,0)
    } else{
        if ([2,3].includes(currently_editing)){
            ctx_sample.drawImage(schemes_image,125,0)
        }
    }
        
    //main canvas
    let current_list = [];
    switch (current_imageType){
        case 1: 
            current_list =  body_list;
            break;
        case 2: 
            current_list =  expression_list;
            break; 
        case 3: 
            current_list =  all_clothes_list;
            break;        
    }
    
    for (let i = 0; i < image_objects.length; i += 1){
        let b = image_objects[i];
        if (getImageItem(b) !="none"){ 
            if (current_imageType==0 || current_list.includes(b.name)) 
                if (current_imageType ==2 && body_list.includes(b.name)){
                
                    undraw_object(b,current_expression,b.colour1,ctx_preview, 0,0,b.widthOffset, -b.heightOffset,sprite_width,sprite_height);}
                else{
                    draw_object(b,current_expression,b.colour1,ctx_preview, 0,0,b.widthOffset, -b.heightOffset,parseInt(sprite_width/b.scale),parseInt(sprite_height/b.scale));
                }

        }
    }
    
}

function setup(){
    //canvas = document.getElementById("exportCanvas");
    //ctx_export = canvas.getContext("2d");
    canvas_preview = document.getElementById("previewCanvas");
    ctx_preview = canvas_preview.getContext("2d");

    document.getElementById('download').addEventListener('click', function(e) {
        // from https://fjolt.com/article/html-canvas-save-as-image

        let filename = "dollmaker_";
        switch(current_imageType){
            case 0:
                filename += "body";
                break;
            case 01:
                filename += "expression_"+panel_list[current_expression];
                break;
            case 2:
                filename += "outfit";
                break;   
        }   
        console.log("saving "+filename);              
        // Convert our canvas to a data URL
        let canvasUrl = canvas.toDataURL();
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
window.onload = setup;
var game = setInterval(drawCanvas, 100);//Update canvas every 100 miliseconds

//Some useful posts:
//https://github.com/ninique/Dollmaker-Script
//https://stackoverflow.com/questions/45187291/how-to-change-the-color-of-an-image-in-a-html5-canvas-without-changing-its-patte?rq=1
//https://stackoverflow.com/questions/24405245/html5-canvas-change-image-color
//https://stackoverflow.com/questions/9303757/how-to-change-color-of-an-image-using-jquery
//https://stackoverflow.com/questions/28301340/changing-image-colour-through-javascript
//https://stackoverflow.com/questions/32784387/javascript-canvas-not-redrawing
