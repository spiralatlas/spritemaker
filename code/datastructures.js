function checkRender(obj){
    //return false if object should not be rendered
    for (let i = 0; i < no_render_list.length; i += 1){
        if (obj.name == no_render_list[i][0]){
            if (no_render_list[i][1].includes(obj.item_list[obj.item]))
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

    size = data_object.size;
    current_eyetype = data_object.current_eyetype;

    for (let i = 0; i < defining_objects.length; i += 1){
        let json_obj = defining_objects[i];
        let alpine_obj = data_object.current_defining_objects[i];
        current_item = alpine_obj.name; 
        json_obj.value_list = alpine_obj.value_list
        json_obj.colour1 = alpine_obj.colour1
        json_obj.colour2 = alpine_obj.colour2
        for (let i = 0; i < json_obj.value_children.length; i += 1){
            image_objects[json_obj.value_children[i]].item = json_obj.value_list[current_expression];
        }
        for (let i = 0; i < json_obj.colour_children.length; i += 1){
            image_objects[json_obj.colour_children[i]].colour1 = json_obj.colour1;
        }
        for (let i = 0; i < json_obj.colour2_children.length; i += 1){
            image_objects[json_obj.colour2_children[i]].colour1 = json_obj.colour2;
        }
    }

    let chest_obj = findNameMatch(image_objects,"chest");
    let coat_obj = findNameMatch(image_objects,"coat");
    let overshirt_obj = findNameMatch(image_objects,"overshirt");
    let top_obj = findNameMatch(image_objects,"top");
    let bottom_obj = findNameMatch(image_objects,"bottom");
    let hair_front_obj = findNameMatch(image_objects,"hair_front");
    let hair_back_obj = findNameMatch(image_objects,"hair_back");

    //calculating chest
    if (chest_obj.item!=0){
        if (coat_obj.item !=0){
            if (no_chest_coat_list.includes(coat_obj.item_list[coat_obj.item]))
                chest_obj.item =0
            else{    
                chest_obj.colour1 = coat_obj.colour1
                chest_obj.item += 3
            }
        }
        else{
        if (overshirt_obj.item !=0){
            chest_obj.colour1 = overshirt_obj.colour1
        }
        else{
        if (top_obj.item !=0){
                chest_obj.colour1 = top_obj.colour1
                if (chest_obj.item ==2 && ["breeches","trousers", "low skirt"].includes(findImageItem("bottom")))
                    chest_obj.item=3
        }
        else
            chest_obj.colour1 = findNameMatch(image_objects,"head").colour1               
        }}    
    }

    //update images and offsets
    for (let i = 0; i < image_objects.length; i += 1){
        image_objects[i].crop = [0,0,full_width,full_height];
        image_objects[i].heightOffset = getHeightOffset(image_objects[i].name);
        image_objects[i].widthOffset = getWidthOffset(image_objects[i].name);
        if (!checkRender(image_objects[i]))
            image_objects[i].item = 0
    }

    //sprite height
    if (findNameMatch(defining_objects,"wheelchair").value_list[0] !=0){ //there's a wheelchair
        sprite_height = full_height - (5-size)*25 -165;
    } else{ //no wheelchair
        sprite_height = full_height - (5-size)*30;
    }

    //calculating crops

    if (!["none","wrap"].includes(findImageItem("coat")))
        top_obj.crop = [100,0,120,800];
    if (["dress jacket", "long jacket closed","jama"].includes(findImageItem("coat")))
        bottom_obj.crop = [100,0,100,800];
   
    let hat_string = findImageItem("hat");
    console.log(hat_string)
    if (hat_string=="top hat"){
        hair_front_obj.crop = [0,138,300,700];
        hair_back_obj.crop = [0,138,300,700];
    }
    if (hat_string=="turban"){
        hair_front_obj.crop = [0,134,300,700];
        hair_back_obj.crop = [0,134,300,700]; 
    }   
    
    //calculated from other variables
    /*let b;
    
    if (current_Facialhair<facial_hair_list_port.length){
        setVariable(["Facial_hair"], current_Facialhair);
        setVariable(["Stubble"], 0);
        } 
    else{ //stubble
        setVariable(["Facial_hair"], 0);
        setVariable(["Stubble"],1);
    }

    b = findNameMatch(image_objects, "Eyes");
    for (let i = 0; i < 10; i += 1) {
        b.value_list[i] = eye_type*eye_expression_list_port.length + eye_expressions[i];
    }*/

    fixSources();

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
            if (this.title!="")
                output += this.title+': ';  
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
                        case 'current_eyetype': 
                            objList = 'eyetype_list';
                            break;       

                    }
                    break;     
            }    
            
            
            output +='<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" x-text="niceString('+objList+'['+buttonName+'])"></button>';
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
            }    
            
            output = this.title+': ';
            output += '<input type="color" :value ="'+objName+'"  @input="'+objName+'=$event.target.value;setVariables(Alpine.store(\'alpineData\'));" :aria-label="colour_desc('+objName+')"/>'
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

    size : 0,
    current_eyetype: 0,

    current_defining_objects: [
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
        {name:"", value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"},
    ],
    
    initialiseAlpine(){
        this.current_defining_objects = [];
        for (let i = 0; i < defining_objects.length; i += 1){
            this.current_defining_objects.push({name:defining_objects[i].name, value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"});
        }

    },

    fixAlpine() { //make the alpine components match the variables used by the javascript
    
        this.size= size;
        this.current_eyetype = current_eyetype;
        
        for (let i = 0; i < defining_objects.length; i += 1){
            let json_obj = defining_objects[i];
            current_item = json_obj.name; 
            this.current_defining_objects[i].value_list = json_obj.value_list;
            this.current_defining_objects[i].colour1 = json_obj.colour1;
            this.current_defining_objects[i].colour2 = json_obj.colour2;
        }        
    },
    setExpressions(){
        this.current_defining_objects[findDefiningIndex("mouth")].value_list=listOf(8);

    },

    randomiseBodyColouring(){
        //randomise the skin/eye/hair colour
        this.current_defining_objects[findDefiningIndex("head")].colour1 = randomElement(skin_colours,0);
        this.current_defining_objects[findDefiningIndex("hair_front")].colour1 = randomElement(hair_colours,0);
        this.current_defining_objects[findDefiningIndex("eyes")].colour1 = randomElement(eye_colours,0);
    },
    randomiseFeatures(gender){
        //randomise the nose/head/hairstyle etc
        // gender: 0 =androgynous, 1 =masculine, 2=feminine
        for (let i = 0; i < defining_objects.length; i += 1){
            if (["nose","head"].includes(defining_objects[i].name)){
                this.current_defining_objects[i].value_list = listOf(randomIndex(defining_objects[i].item_list,0));
            }
            if ("chest"==defining_objects[i].name){
                switch(gender){
                    case 0:
                        this.current_defining_objects[i].value_list = listOf(randomIndex(defining_objects[i].item_list,0.5));
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
    },
    randomiseClothingColour(){
        //randomise all clothing colours
        for(let i = 0; i < defining_objects.length; i++){
            if (outfit_list.includes(defining_objects[i].name)||accessory_list.includes(defining_objects[i].name)) {
                this.current_defining_objects[i].colour1 = randomElement(outfit_colours,0);
                this.current_defining_objects[i].colour2 = randomElement(outfit_colours,0);
            }
        }

    },
    randomiseClothingValue(gender){
        //set all clothing values including sleeve length
        // gender: 0 =androgynous, 1 =masculine, 2=feminine
        for (let i = 0; i < defining_objects.length; i += 1){
            if (outfit_list.includes(defining_objects[i].name)||accessory_list.includes(defining_objects[i].name)|| ["hair_front"].includes(defining_objects[i].name)) {
                var prob;
                if (accessory_list.includes(defining_objects[i].name)|| defining_objects[i].name=="wheelchair")//accessories less common
                    prob = 0.5;
                else{
                    if (["top","bottom"].includes(defining_objects[i].name))
                        prob = -1;
                    else
                        prob = 0;    
                }
                switch(gender){
                    case 0:
                        this.current_defining_objects[i].value_list = listOf(randomIndex(defining_objects[i].item_list,prob));  
                        break;
                    case 1:
                        this.current_defining_objects[i].value_list = listOf(randomElement(defining_objects[i].item_list_m,prob));  
                        break;
                    case 2:
                        this.current_defining_objects[i].value_list = listOf(randomElement(defining_objects[i].item_list_f,prob));  
                        break;    
                }   
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
    //draw the preview and export canvases
    
    //preview canvas
    document.getElementById("closet").innerHTML = print_defining_objects()+print_image_objects();

    canvas_preview = document.getElementById("previewCanvas");
    canvas_preview.width = canvas_preview.width; //clears
    ctx_preview = canvas_preview.getContext("2d");

    //document.getElementById("closet").innerHTML = print_image_objects();
    //portrait preview

    preview_width=full_width;
    preview_height=sprite_height;

    ctx_preview.fillStyle = "#FF0000";
    //ctx_preview.fillRect(0, 0, preview_width, preview_height);
    //ctx_preview.drawImage(portrait_back, 0, 0);
    for (let i = 0; i < image_objects.length; i += 1){
        let b = image_objects[i];
        if (b.item_list[b.item] !="none"){ 
            //ctx_preview.fillStyle = "#000000";
            //ctx_preview.fillText(b.name, 10, 10*i); 
            //ctx_preview.drawImage(b.base_image_list[0],0,0);
            draw_object(b,current_expression,b.colour1,ctx_preview, 0,0,b.widthOffset, -b.heightOffset,preview_width,preview_height);
        }
    }
    
    //main canvas
    /*
    let numrows;
    let numcols;
    if (panelNum ==1){
        numcols = 1;
    }else{
        numcols = 2;
    }
    if (panelNum%2 == 1){
        numrows = (panelNum+1)/2;
    }else{
        numrows = panelNum/2;
    }
    canvas.height = panel_width*numrows;
    canvas.width =  panel_width*numcols;
    let ctx = canvas.getContext("2d");
    
    for (let row = 0; row < numrows; row += 1) {
        for (let column = 0; column < numcols; column += 1) {
            if (row*2+column < panelNum){
                let xpos = panel_width*column;
                let ypos = panel_width*row;
                for (let i = 0; i < image_objects.length; i += 1){
                    let b = image_objects[i];
                    if (b.item_list[b.value_list[row*2+column]] !="None"){ 
                        draw_object(b,row*2+column,b.colour1,ctx, 0,-getHeightOffset(b.name)-b.heightOffset, xpos, ypos);
                    }
                }
            }
        }
    }*/
}

function setup(){
    canvas = document.getElementById("exportCanvas");
    ctx = canvas.getContext("2d");
    canvas_preview = document.getElementById("previewCanvas");
    ctx_preview = canvas_preview.getContext("2d");

    document.getElementById('download').addEventListener('click', function(e) {
        // from https://fjolt.com/article/html-canvas-save-as-image

        // Convert our canvas to a data URL
        let canvasUrl = canvas.toDataURL();
        // Create an anchor, and set the href value to our data URL
        const createEl = document.createElement('a');
        createEl.href = canvasUrl;
    
        // This is the name of our downloaded file
        createEl.download = "dollmaker image";
    
        // Click the download button, causing a download, and then remove it
        createEl.click();
        createEl.remove();
    })
    
    checkFileAPI();
    Alpine.store('alpineData').randomiseAll(0);
    Alpine.store('alpineData').setExpressions();

    //fix variables
    setVariables(Alpine.store('alpineData'));
    Alpine.store('alpineData').fixAlpine();
    
    drawCanvas();
}
let portrait_back = new Image();
portrait_back.src = "images/bases/pattern/pix_pattern_argyle.png";
const off_canvas = new OffscreenCanvas(full_width, full_height);
const off_ctx = off_canvas.getContext("2d");
window.onload = setup;
var game = setInterval(drawCanvas, 500);//Update canvas every 100 miliseconds

//Some useful posts:
//https://github.com/ninique/Dollmaker-Script
//https://stackoverflow.com/questions/45187291/how-to-change-the-color-of-an-image-in-a-html5-canvas-without-changing-its-patte?rq=1
//https://stackoverflow.com/questions/24405245/html5-canvas-change-image-color
//https://stackoverflow.com/questions/9303757/how-to-change-color-of-an-image-using-jquery
//https://stackoverflow.com/questions/28301340/changing-image-colour-through-javascript
//https://stackoverflow.com/questions/32784387/javascript-canvas-not-redrawing
