function setVariables(data_object){
    //transfer data from webpage/load file to internal javascript

    currently_editing = data_object.currently_editing; //which element of editing list we are editing
    current_expression = data_object.current_expression;
    current_clothing = data_object.current_clothing;

    height = data_object.height;

    for (let i = 0; i < defining_objects.length; i += 1){
        let json_obj = defining_objects[i];
        let alpine_obj = data_object.current_defining_objects[i];
        current_item = alpine_obj.name; 
        json_obj.value_list = alpine_obj.value_list
        json_obj.colour1 = alpine_obj.colour1
        json_obj.colour2 = alpine_obj.colour2
        for (let i = 0; i < json_obj.children.length; i += 1){
            image_objects[json_obj.children[i]].colour1 = json_obj.colour1;
        }
    }

    //calculated from other variables
    /*let b;
    
    b = findNameMatch(image_objects, "Lips");
    switch (current_lips){
        case 0:
        case 1:
            b.heightOffset = 2;
            break;
        case 2:
            b.heightOffset = 3;
            break;
        case 3:
            b.heightOffset = 5;
            break;
        case 4:
            b.heightOffset = 7;
            break;        

    }
    
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
    Alpine.data('dropdown', (titleInput = "",buttonNameInput = "",valueNameInput = "",listNameInput = "[]") => ({
      valueName: valueNameInput, //the value being set
      listName: listNameInput,//the list iut's being chosen from
      title: titleInput, //the name for this choice used in the webpage
      buttonName: buttonNameInput,//extra name info for the button

      dropbtn: {
        //Sets a variable in a list using a dropdown
          ['x-html']() {
            output = "";
            if (this.title!="")
                output += this.title+': ';   
            output +='<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" x-text="'+'\''+this.buttonName+'\'+niceString('+this.listName+"[$store.alpineData."+this.valueName+"])"+'"></button>';
            output +='<ul class="dropdown-menu"> <template x-for=" (preset, index) in '+ this.listName+'">'; 
            output +='<li><button class="dropdown-item" x-on:click="$store.alpineData.'+this.valueName+'=index;setVariables(Alpine.store(\'alpineData\'));" x-text="niceString(preset)"></a></li>'; 
            output +='</template></ul>'
            return output 
          },
      },
      colourbtn: {
        //Sets a colour using the colour picker
        ['x-html']() {
            output = this.title+': ';
            output += '<input type="color" :value ="$store.alpineData.'+this.valueName+'"  @input="$store.alpineData.'+this.valueName+'=$event.target.value;setVariables(Alpine.store(\'alpineData\'));" :aria-label="colour_desc($store.alpineData.'+this.valueName+')"/>'
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

    height : 0,

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
    ],
    
    initialiseAlpine(){
        this.current_defining_objects = [];
        for (let i = 0; i < defining_objects.length; i += 1){
            this.current_defining_objects.push({name:defining_objects[i].name, value_list: listOf(0), colour1: "#FF0000",colour2: "#00FF00"});
        }

    },

    fixAlpine() { //make the alpine components match the variables used by the javascript
    
        this.height= height;

        for (let i = 0; i < defining_objects.length; i += 1){
            let json_obj = defining_objects[i];
            current_item = json_obj.name; 
            this.current_defining_objects[i].value_list = json_obj.value_list;
            this.current_defining_objects[i].colour1 = json_obj.colour1;
            this.current_defining_objects[i].colour2 = json_obj.colour2;
        }        
    },

    randomiseBodyColouring(){
        //randomise the skin/eye/hair colour
        this.current_defining_objects[findDefiningIndex("head")].colour = randomElement(skin_colours);
        this.current_defining_objects[findDefiningIndex("hair_front")].colour = randomElement(hair_colours);
        this.current_defining_objects[findDefiningIndex("iris")].colour = randomElement(eye_colours);
    },
    randomiseFeatures(gender){
        //randomise the nose/head/hairstyle etc
        // gender: 0 =androgynous, 1 =masculine, 2=feminine
        possible_hair = gendered_lists[menu_objects.length-1][gender];
        this.current_hair =  randomElement(possible_hair);

        switch(gender){
            case 0: //androgynous
                this.current_Facialhair = randomIndex(facial_hair_list_menu,0.75);
                this.current_eyeType = randomElement([0,1,2]);
                this.current_head = randomIndex(head_list,0);
                break;
            case 1: //man
                this.current_head = randomElement([0,1,2,3,6]);
                this.current_Facialhair = randomIndex(facial_hair_list_menu,0.75);
                this.current_eyeType = randomElement([0,1]);
                break;
            case 2: //woman
                this.current_head = randomElement([3,4,5,6]);
                this.current_Facialhair = 0;
                this.current_eyeType = randomElement([0,2]);
                
        }

        if (Math.random()>0.9)//weirder eyes happen rarely
            this.current_eyeType = randomElement([3,4]);
            
        this.current_head = randomIndex(head_list,0);
        
        this.current_nose = Math.max(1,randomIndex(nose_list,0));
        this.current_lips = randomIndex(lip_list,0);
        if (Math.random()< 0.9)
            this.current_ears = 1;
        else
            this.current_ears = Math.max(1,randomIndex(ear_list,0));  
        
        this.current_complexion = randomIndex(complexion_list,0.3);
        this.height = randomIndex([0,1],0);
    },
    randomiseClothingColour(){
        //randomise all clothing colours
        for(let i = 0; i < menu_objects.length-1; i++){
            this.current_menu_objects[i].colour1 = randomElement(outfit_colours);
            this.current_menu_objects[i].colour2 = randomElement(outfit_colours);
        }

    },
    randomiseClothingValue(gender){
        //set all clothing values including sleeve length
        // gender: 0 =androgynous, 1 =masculine, 2=feminine
        for(let i = 0; i < menu_objects.length-1; i++){
            let obj = menu_objects[i]
            possible_values = gendered_lists[i][gender];

            if (["Shoes","Pants","Shirt"].includes(obj.name)) 
                bias = 0;
            else {
                if (["Wheelchair"].includes(obj.name)){
                    bias = 0.9
                } else{
                    bias = 0.6;
                } 
            }   
            this.current_menu_objects[i].item = possible_values[randomIndex(possible_values,bias)];   
            this.current_menu_objects[i].sleeves = randomIndex([0,1,2],0);
        }
        switch(gender){
            case 0: //androgynous
                this.current_wedding_clothes= randomIndex([0,1,2],0);
                if (this.current_wedding_clothes ==0)
                    this.current_dance_clothes= randomIndex([0,1],0);
                else    
                    this.current_dance_clothes= this.current_wedding_clothes -1;
                break;
            case 1: //man
                this.current_wedding_clothes= 2;
                this.current_dance_clothes= 1;
                break;
            case 2: //woman
                this.current_wedding_clothes= 1;
                this.current_dance_clothes= 0;
                
        }
        
    },
    randomiseAll(gender){
        for (let i = 0; i < defining_objects.length; i += 1){
            this.current_defining_objects[i].colour1 = randomElement(outfit_colours);
        }
        //randomiseBodyColouring();
        /*
        this.randomiseBodyColouring();
        this.randomiseFeatures(gender);
        this.randomiseClothingColour();
        this.randomiseClothingValue(gender);*/
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
    canvas_preview = document.getElementById("previewCanvas");
    canvas_preview.width = canvas_preview.width; //clears
    ctx_preview = canvas_preview.getContext("2d");

    //document.getElementById("closet").innerHTML = print_image_objects();
    //portrait preview

    preview_width="314";
    preview_height="712";

    ctx_preview.fillStyle = "#FF0000";
    //ctx_preview.fillRect(0, 0, 256, 268);
    //ctx_preview.drawImage(portrait_back, 0, 0);
    for (let i = 0; i < image_objects.length; i += 1){
        let b = image_objects[i];
        if (b.item_list[b.item] !="none"){ 
            //ctx_preview.fillStyle = "#000000";
            //ctx_preview.fillText(b.name, 10, 10*i); 
            //ctx_preview.drawImage(b.base_image_list[0],0,0);
            draw_object(b,current_expression,b.colour1,ctx_preview, 0,-getOffset(b.name)-b.heightOffset,0, 0,preview_width,preview_height);
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
                        draw_object(b,row*2+column,b.colour1,ctx, 0,-getOffset(b.name)-b.heightOffset, xpos, ypos);
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

    //fix variables
    setVariables(Alpine.store('alpineData'));
    Alpine.store('alpineData').fixAlpine();
    
    document.getElementById("closet").innerHTML = print_defining_objects()+print_image_objects();
    
    drawCanvas();
}
let portrait_back = new Image();
portrait_back.src = "images/bases/pattern/pix_pattern_argyle.png";
const off_canvas = new OffscreenCanvas(256, 268);
const off_ctx = off_canvas.getContext("2d");
window.onload = setup;
//var game = setInterval(drawCanvas, 500);//Update canvas every 100 miliseconds

//Some useful posts:
//https://github.com/ninique/Dollmaker-Script
//https://stackoverflow.com/questions/45187291/how-to-change-the-color-of-an-image-in-a-html5-canvas-without-changing-its-patte?rq=1
//https://stackoverflow.com/questions/24405245/html5-canvas-change-image-color
//https://stackoverflow.com/questions/9303757/how-to-change-color-of-an-image-using-jquery
//https://stackoverflow.com/questions/28301340/changing-image-colour-through-javascript
//https://stackoverflow.com/questions/32784387/javascript-canvas-not-redrawing
