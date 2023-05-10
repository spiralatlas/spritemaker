function saturation(p){
    //Returns the saturation as a number between 0 and 1, inclusive
    //p is an array of numbers between 0 and 255. 
    let M = Math.max(p[0],p[1],p[2]);
    let m = Math.min(p[0],p[1],p[2]);
    let d = (M - m)/255;
    let L = (M + m)/510; 
    if (L ==0){
        return 0;
    }    
    else{
        let X = 1 - Math.abs(2*L-1);
        if (X == 0){
            return 0;
        }
        return d/X; 
    }
}   

const rgbToLightness = (r,g,b) => 
    1/2 * (Math.max(r,g,b) + Math.min(r,g,b));

const rgbToSaturation = (r,g,b) => {
    const L = rgbToLightness(r,g,b);
    const max = Math.max(r,g,b);
    const min = Math.min(r,g,b);
    return (L === 0 || L === 1)
     ? 0
     : (max - min)/(1 - Math.abs(2 * L - 1));
  };

function luminance(p){
    //Returns the luminance as a number between 0 and 255
    //p is an array of numbers between 0 and 255. 
    return (0.299*p[0] + 0.587*p[1] + 0.114*p[2]);     
}       

function findHue(p){
    //returns an angle between 0 and 360
    //p is an array of numbers between 0 and 255. 
    let R = p[0]
    let G = p[1]
    let B = p[2]
    if (R==G && R==B){
        return 0;
    }
    if ((R>=G) && G >=B){
        return 60*(G-B)/(R-B);
    }
    if (G>R && R>= B){
        return 60*(2-(R-B)/(G-B));
    }
    if (G>=B && B> R){
        return 60*(2+(B-R)/(G-R));
    }
    if (B>G && G> R){
        return 60*(4-(G-R)/(B-R));
    }   
    if (B>R && R>= G){
        return 60*(4+(R-G)/(B-G));
    }   
    return 60*(6-(B-G)/(R-G)); 
}
function hexToNum(h){
    //takes 2 digit hex string h and returns a number between 0 and 255
    parseInt(h,16)

}

function hex_to_rgb(colour){
    // takes hex code, returns RGB array with integers between 0 and 255
    let R = parseInt(colour.slice(1,3),16);
    let G = parseInt(colour.slice(3,5),16);
    let B = parseInt(colour.slice(5,7),16);
    return [R,G,B];
}

function rgb_to_hex(colour){
//Return color as #rrggbb for the given color values.
    var s = '#';
    for (let i = 0; i < 3; i += 1){
        if (colour[i]< 16)
            s+="0"; //pad with a zero
        s+=(+colour[i]).toString(16).toUpperCase();
    }
    return s
}

function blushcolour(skincolour){
        //Given a colour string, returns the appropriate blush colour
        //Not very reliable
        if (skincolour=="#000000")
            skincolour="#525252";    
        new_colour = hex_to_rgb(skincolour);
        shadow = hex_to_rgb("#FF0462");
        colour = [0,0,0];
        r = 0.3 //opacity of shadow
        for (let i = 0; i < 3; i += 1) // #multiply
           colour[i] = parseInt((1-r)*new_colour[i] + r*new_colour[i]*shadow[i]/255);   
        return rgb_to_hex(colour) 
}

function frecklecolour(skincolour){
    //Given a colour string, returns the appropriate freckle colour
    //Not very reliable

    if (skincolour=="#000000")
        return "#646464" 
    new_colour = hex_to_rgb(skincolour)
    
    shadow = hex_to_rgb("#854C2C")
    colour = [0,0,0]
    r = 0.5 //opacity of shadow
    for (let i = 0; i < 3; i += 1) // #multiply
        colour[i] = parseInt((1-r)*new_colour[i] + r*new_colour[i]*shadow[i]/255);   
    return rgb_to_hex(colour) 

}

function colorContrast(colour){
    //given a hexcode, returns a nicely contrasting hexcode. No longer used. 
    let R = parseInt(colour.slice(1,3),16);
    let G = parseInt(colour.slice(3,5),16);
    let B = parseInt(colour.slice(5,7),16);
    let p = [R,G,B]
    let h = findHue(p);
    let s = saturation(p);
    let v = luminance(p);

    if (v<125)
        return "#FFFFFF"
    return "#000000"

}

function colour_string(hex_colour){
    //Which colour of shadow to use
    h = findHue(hex_to_rgb(hex_colour));
    let colour = "purple";
    if (h <62) //reds and yellow
        colour ="red";
    else{ 
    if (h<120) //yellow-green
        colour ="yellow";
    else{
    if (h<180) //green-aqua
        colour ="green";
    else{
    if (h<240)
        colour ="aqua";
    else{ 
    if (h<300)
        colour ="blue";
    }}}}
    return colour
}

function colour_desc(colour){
        //returns a text description of a hex colour string. For screenreader/colourblind support.
        let R = parseInt(colour.slice(1,3),16);
        let G = parseInt(colour.slice(3,5),16);
        let B = parseInt(colour.slice(5,7),16);
        let p = [R,G,B]
        let h = findHue(p);
        let s = saturation(p);
        let v = luminance(p);

        //return colour +" H:"+h.toFixed(2)+" "+s.toFixed(3)+" "+v.toFixed(2)

        let hueString = "Unknown";

        //Algorithmic values 
        if (h < 14.4){
           if (s >0.5){
            hueString = "Red";
           }
           else{
            hueString = "Brown";
           }
        }    
        else{   
            if (h < 46.8){hueString = "Orange";}
        else{
            if (h < 64.8){hueString = "Yellow";}
        else{ 
            if (h < 172.8) {hueString = "Green";}
        else{
            if (h < 262.8){hueString = "Blue";}
        else{
        if (h < 320.4) {hueString = "Purple";}
        else {
            if (s >0.5) {hueString = "Red";}
        else{
            hueString = "Brown";}
        }}}}}}      

        if (skin_colours.includes(colour) && (h<50||h>325)&& v>0 ){
            let i = skin_colours.indexOf(colour);
            if (i%2 ==0){
                    hueString = "Peach";
            }
            else{
                hueString = "Olive";

            }
            if (i<4){
                return "Pale "+hueString;
            }else{
                if (i>7)
                    return "Dark "+hueString;
                else
                return hueString;
            }
        }    
        
        

        //Adding "dark"/"light" etc.       

        let c_string = "";
        if (v ==0){
            return "Black"}
        else{
            if (v == 255 && s==0){return "White";}
        else{
            if (v < 51){
                if (["Red","Orange"].includes(hueString)){
                    return "Rich Dark Brown"
                } else{
                    return hueString + "-Black";
                }
            }
        else{
            if (v < 100){
                if (hueString =="Orange" && s >0.5)
                    return "Brown"
                else    
                    c_string += "Dark ";
            }
        }}}

        if (s < 0.09){
            return c_string+ "Grey";}
        else{
            if (s >0.5){
            return c_string + hueString;}
        else{
            if (v>160){
                return "Light "+ hueString;}
        else{
            if (["Red","Orange"].includes(hueString)){
                return "Dark Brown"
            } else{
                return "Dark Grey-"+hueString;
            }
            }
        }}
} 

function fixSources(){
    // Fixes the "src" attribute for all images in sublist of image_objects
    for (let i = 0; i < image_objects.length; i += 1){
        let b = image_objects[i];

        b.underlay_image.src  ="";
        b.base_image.src  ="";
        b.shadow_image.src  ="";
        b.highlight_image.src  ="";
        b.pattern_image.src  ="";

        let current_loc = getImageItem(b);
        //stubble

        if (b.name =="facial_hair"){
            if (getImageItem(b)=="stubble") {
                b.hasShading = false;
                b.underlay_image.src  ="images/render/hair/facial_hair/stubble/" +findImageItem("head")+".png";
                return
            } else
            b.hasShading = true;
        }

        //setting images
        if (getImageItem(b)!="none"){
            if (no_fill_list.includes(b.name)){
                b.hasShading = false;
                b.underlay_image.src  = "images/render/"+b.location+"/"+current_loc +"_base.png";

            }else{
                if (b.name=="eyes"){ 
                    loc_string = "images/render/"+b.location+"/"+eyetype_list[current_eyetype] +"/"+current_loc 
                    b.overlay_image.src  = loc_string+"_overlay.png";
                }
                else{
                    loc_string = "images/render/"+b.location+"/"+current_loc 
                }    
                if (b.name.includes("_dec"))
                    loc_string +="2";

                b.base_image.src  = loc_string+"_base.png";
                if (b.name!="eyes")
                    b.shadow_image.src  = loc_string+"_multiply_blue.png";//+colour_string(b.colour1)+".png";
                if (highlight_list.includes(b.name))
                    b.highlight_image.src  = loc_string+"_highlight.png"; 
                if (underlay_list.includes(b.name))
                    if (current_loc!="eye patch")
                        b.underlay_image.src  = loc_string+"_underlay.png";   
                if (b.pattern>0){
                    b.pattern_image.src  = "images/pattern/"+pattern_list[b.pattern]+".png"; 
                }             
            }
        }
    }
}


function draw_object(obj, index, colour, ctx, sourceX, sourceY, xpos, ypos,width, height){
    //draw image for portrait object
    //obj: the object
    //index: what panel we're drawing
    //colour: current colour 
    //ctx: 2Dcontext of relevant canvas
    //sourceX: X value of top left corner of section we're cutting from source image 
    //sourceY: Y value of top left corner of section we're cutting from source image 
    //xpos: X value of top left corner of pasted image 
    //ypos: Y value of top left corner of pasted image 
    
    /*if (!(obj.name =="Lips" && (current_lips==0))){
    */ 

    let new_height = parseInt(obj.scale*height);    
    let new_width = parseInt(obj.scale*width);   
    let new_xpos = xpos //parseInt(obj.scale*xpos);
    let new_ypos = ypos //parseInt(obj.scale*ypos);   

    off_ctx.clearRect(0, 0, new_width, new_height);
    off_ctx.globalCompositeOperation = "source-over";

    if (obj.underlay_image.src!=""){//not coloured or anything just displayed straight
        ctx.drawImage(obj.underlay_image,sourceX,sourceY,width,height, xpos, ypos,new_width,new_height);
    }
    if (obj.hasShading){
        if (obj.name =="cheeks")
            off_ctx.fillStyle = blushcolour(colour);
        else{
            if (obj.name =="complexion")// && getImageItem(obj)=="freckles")
                off_ctx.fillStyle = frecklecolour(colour);
            else    
                off_ctx.fillStyle = colour;
        }
        if (obj.base_image.src!=""){
            off_ctx.fillRect(0, 0, new_width, new_height);
            if (obj.pattern>0){
                pattern_ctx.globalCompositeOperation = "source-over";
                pattern_ctx.clearRect(0, 0, new_width, new_height);    
        
                pattern_ctx.fillStyle = obj.patterncolour;
                pattern_ctx.fillRect(0, 0, new_width, new_height);
                pattern_ctx.globalCompositeOperation = "destination-in";
                pattern_ctx.drawImage(obj.pattern_image,0,0,width,height, 0, 0,new_width,new_height);
                off_ctx.drawImage(pattern_canvas,sourceX,sourceY,new_width,new_height, new_xpos, new_ypos,new_width,new_height);
            }

            off_ctx.globalCompositeOperation = "destination-in";
            off_ctx.drawImage(obj.base_image,0,0,width,height, 0, 0,new_width,new_height);
        }
        if (obj.shadow_image.src!=""){
            off_ctx.globalCompositeOperation = "multiply";
            off_ctx.drawImage(obj.shadow_image,0,0,width,height, 0, 0,new_width,new_height);
        }
        if (obj.highlight_image.src!=""){
            off_ctx.globalCompositeOperation = "screen";
            off_ctx.drawImage(obj.highlight_image,0,0,width,height, 0, 0,new_width,new_height);
        }
        off_ctx.globalCompositeOperation = "source-over";

        //cropping
        for (i = 0; i < obj.crop.length; i += 1){
            box = obj.crop[i].map(value => parseInt(value*obj.scale))
            off_ctx.clearRect(box[0], box[1], box[2], box[3]);
        }
              
        //removing masks
        
        ctx.drawImage(off_canvas,sourceX,sourceY,new_width,new_height, new_xpos, new_ypos,new_width,new_height);
    }
    if (obj.overlay_image.src!=""){//not coloured or anything just displayed straight
        ctx.drawImage(obj.overlay_image,sourceX,sourceY,width,height, xpos, ypos,new_width,new_height);
    }
}

function undraw_object(obj, index, colour, ctx, sourceX, sourceY, xpos, ypos,width, height){
    //draw image for portrait object
    //obj: the object
    //index: what panel we're drawing
    //colour: current colour 
    //ctx: 2Dcontext of relevant canvas
    //sourceX: X value of top left corner of section we're cutting from source image 
    //sourceY: Y value of top left corner of section we're cutting from source image 
    //xpos: X value of top left corner of pasted image 
    //ypos: Y value of top left corner of pasted image 
    
    /*if (!(obj.name =="Lips" && (current_lips==0))){
    */ 

    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(obj.base_image,sourceX,sourceY,width,height, xpos, ypos,parseInt(obj.scale*width),parseInt(obj.scale*height));
    ctx.globalCompositeOperation = "source-over";   
    }
