from __future__ import print_function
import sys
import math
from PIL import Image
from PIL import ImageEnhance
import glob

# python generate_images.py
# Python scripts to create images for dollmaker from the images in images/bases

def remove_dups(l):
        #removes duplicates from a list
        return list( dict.fromkeys(l) ) 

def double_list(l):
    return [l,l]            

pattern_list = ["none",
        "crocodile","rose", "snake","damask", #repeated fractal
        "crosshatch","fabric",  #repeated naturalistic
        "diamonds","diamondssmall","tartan",  "polkadot",#repeated pattern
        "pinstripe","horizontalpinstripe",] #lines "verticalstripe", "horizontalstripe", "diagonal","net",

chest_list = ["none", "smooth","curvy"]   
chest_list_d = [chest_list,["none"]]
chest_image_list = ["none", "smooth", "curvy","curvypants","smoothwide", "curvywide"]

wheelchair_list = [ "none","regular"]
wheelchair_list_d = double_list(wheelchair_list)

head_list_u = ["pointed","medium","rectangular","round"]
head_list_d = double_list(head_list_u)
skull_list = ["regular"]
skull_list_d = double_list(skull_list)
ear_list = ["regular"]
ear_list_d = double_list(ear_list)
body_list = ["regular"]
body_list_d = double_list(body_list)
no_iris_list = ["sleepy","closed"] #eyeshapes with no iris
eyes_list_u = ["neutral","side","crescents","narrowed","happy","wide","shock","angry","angry side","sleepy","wink"]
#["wide","extrawide", "widecatty","sad", "gentle", "regular","vivid", "cool","catty","coolside", "narrowcool","narrowcoolside","narrowcatty","narrowcattyside", "halfclosed"]
eyetype_list = ["medium"]
eyes_list_d = double_list(eyes_list_u)
eyebrows_list_u = ["flat","flat sad","flat grumpy","flat angry","sad","sadder", "semi sad", "regular","semi arch","arched","raised arch", "raised","raised flat", "raised semi flat","raised grumpy","raised semi","angry", "angry arch","half raised","half semi", "half sad","half sad raised","half flat","half arch raised"]
eyebrows_list_d = double_list(eyebrows_list_u)
mouth_list_u = ["big grin","grin","side grin","side smile","big smile","big side smile","wide flat smile","tongue out","flat smile","smile","small smile","tiny smile","oh","square oh","small oh","shock","small flat","flat","wobbly frown","tiny frown","small frown","narrow frown","frown","pout","side frown","big frown",]
mouth_list_d = double_list(mouth_list_u)
nose_list_u = ["button", "round","medium","broad", "pointed","hooked",] 
nose_list_d = double_list(nose_list_u)

cheeks_list_u = ["none","blush"]
cheeks_list_d = double_list(cheeks_list_u)

complexion_list_u = ["none","slight lines", "freckles"]
complexion_list_d = double_list(complexion_list_u)

eyewear_list_u = ["none", "round glasses"] 
eyewear_list_f = eyewear_list_u
eyewear_list_m = eyewear_list_u
eyewear_list_d =  [eyewear_list_f,eyewear_list_m]

earrings_list_f = ["none","drop earrings", "stud","round earrings"]
earrings_list_m = ["none",]
earrings_list_d =  [earrings_list_f,earrings_list_m]

gloves_list_f = ["none", "short gloves", "medium gloves", "long gloves","bracelets"]
gloves_list_m = ["none", "short gloves"]
gloves_list_d = [gloves_list_f,gloves_list_m]

top_list_f = ["none","plain bodice", "long sleeve bodice","gathered bodice","v neck bodice"]
top_list_m= ["none", "open shirt","closed shirt","cravat shirt"] 
top_list_d = [top_list_f,top_list_m]
top_collar_list = top_list_m
top_collar_list_d = [["none"],top_collar_list]

overshirt_list_f = ["none", "short waistcoat"]
overshirt_list_m = ["none", "waistcoat"]
overshirt_list_d = [overshirt_list_f, overshirt_list_m]

bottom_list_f = ["none","solid skirt","split skirt","low skirt"]
bottom_list_m = ["none","breeches","trousers"]
bottom_list_d = [bottom_list_f, bottom_list_m]
    
neckwear_list_f = ["none", "beaded necklace","choker","jewelled necklace","beads"] 
neckwear_list_m = ["none"]
neckwear_list_d = [neckwear_list_f, neckwear_list_m]

coat_list_f = ["none","medium cloak","dress jacket","wrap"]
coat_list_m = ["none","short jacket","long jacket closed","jama"]  
coat_list_d = [coat_list_f, coat_list_m]

hair_front_list_u = ["none","centre bun"]
hair_front_list_f = hair_front_list_u+ ["curly bun","wavy bun", "straight bun","curly long","straight long"]
hair_front_list_m = hair_front_list_u+ ["curly short","wavy short", "straight short","super short"]

hair_front_list_d = [hair_front_list_f, hair_front_list_m]
hair_back_list_f = hair_front_list_f
hair_back_list_m = hair_front_list_m
hair_back_list_d = hair_front_list_d

hat_list_f = ["none","beads","scarf"]
hat_list_m = ["none","top hat","turban"]
hat_list_d = [hat_list_f, hat_list_m]

# collections of parts that have the same colours and patterns
skin_list = ["body","nose","mouth","eyebrows","skull","complexion","ears"]#same colour as head
expression_list = ["mouth","eyebrows","cheeks","eyes"]
accessory_list = ["eyewear","neckwear", "earrings", "gloves", "hat",]
outfit_list = ["wheelchair", "bottom","top", "overshirt", "coat"]
defining_list = remove_dups(accessory_list+ outfit_list+skin_list+expression_list+["hair_front","head"])

#extra info

no_chest_coat_list = [ "robe","robe hood",  "medium cloak", "medium cloak hood", "long cloak", "long cloak hood","wrap"] #clothes where the chest doesn't show
no_fill_list = ["mouth"] #lined items with no coloured fill

hat_back_list = ["none","top hat","scarf","turban"]
hat_back_list_d = double_list(hat_back_list)
hair_back_list = remove_dups(hair_front_list_f+ hair_front_list_m)
hair_back_list_d = double_list(hair_back_list) 
coat_back_list = ["none","medium cloak","wrap"] 
coat_back_list_d = double_list(coat_back_list) 

wheelchair_bottom_list_d = bottom_list_d
wheelchair_coat_list = ["none", "medium cloak","long jacket closed","dress jacket","jama"] 
wheelchair_coat_list_d = double_list(wheelchair_coat_list)

wheelchair_bottom_dec_list = ["breeches","split skirt"]
wheelchair_bottom_dec_list_d = double_list(wheelchair_bottom_dec_list)
top_dec_list = ["plain bodice", "long sleeve bodice","gathered bodice","v neck bodice"]
top_dec_list_d = double_list(top_dec_list)
earrings_dec_list = ["round earrings"]
earrings_dec_list_d = double_list(earrings_dec_list)
overshirt_dec_list = ["waistcoat","short waistcoat"]
overshirt_dec_list_d = double_list(overshirt_dec_list)
neckwear_dec_list = ["jewelled necklace","beaded necklace"]
neckwear_dec_list_d = double_list(neckwear_dec_list)
bottom_dec_list = ["breeches","split skirt","solid skirt"]
bottom_dec_list_d = double_list(bottom_dec_list)
coat_dec_list = ["dress jacket","jama"]
coat_dec_list_d = double_list(coat_dec_list)
hat_dec_list = ["top hat"]
hat_dec_list_d = double_list(hat_dec_list)
hat_back_dec_list = ["scarf"]
hat_back_dec_list_d = double_list(hat_back_dec_list)

no_render_list = [["hat",["scarf"]],["hat_dec",["scarf"]]]

###################### More technical stuff from here on

closet = [] # list of lists of information about items of clothing etc

class ClothingItem:

    # name: string describing item type, eg "hat"
    # item_list: list of strings with names of items, eg hat_list as defined elsewhere
    # location: string describing where the image files are,
    #           eg "clothes" because hat images are stored in the folder clothes/hat

    def __init__(self,name,listname, double_list, location):
        self.name =  name
        self.listname = listname
        self.double_list = double_list
        self.item_list = remove_dups(double_list[0]+double_list[1])
        self.location = location

def add_item(name, listname, double_list,location):
    # Add an item to the closet
    global  closet

    closet.append(ClothingItem(name, listname,double_list, location))

## Adding all the data to closet

add_item("wheelchair_back", "wheelchair_list_d", wheelchair_list_d,"wheelchair")
add_item("wheelchair_back_dec", "wheelchair_list_d", wheelchair_list_d,"wheelchair")
add_item("coat_back", "coat_back_list_d",coat_back_list_d, "clothes/coat")
add_item("hat_back", "hat_back_list_d",hat_back_list_d, "clothes/hat")
add_item("hat_back_dec", "hat_back_dec_list_d",hat_back_dec_list_d, "clothes/hat")
add_item("hair_back", "hair_back_list_d",hair_back_list_d, "hair")
add_item("body", "body_list_d", body_list_d, "anatomy")

# In front of face
add_item("gloves", "gloves_list_d", gloves_list_d, "clothes")
add_item("top", "top_list_d", top_list_d, "clothes")
add_item("top_dec", "top_dec_list_d", top_dec_list_d, "clothes")
add_item("bottom", "bottom_list_d", bottom_list_d, "clothes")
add_item("bottom_dec", "bottom_dec_list_d", bottom_dec_list_d, "clothes")
add_item("overshirt", "overshirt_list_d", overshirt_list_d, "clothes")
add_item("overshirt_dec", "overshirt_dec_list_d", overshirt_dec_list_d, "clothes")
add_item("neckwear", "neckwear_list_d", neckwear_list_d, "clothes")
add_item("neckwear_dec", "neckwear_dec_list_d", neckwear_dec_list_d, "clothes")
add_item("coat", "coat_list_d", coat_list_d, "clothes")
add_item("coat_dec", "coat_dec_list_d", coat_dec_list_d, "clothes")
add_item("chest", "chest_list_d", chest_list_d, "anatomy")
add_item("top_collar", "top_collar_list_d", top_collar_list_d, "clothes")

add_item("skull", "skull_list_d", skull_list_d, "anatomy")
add_item("head", "head_list_d", head_list_d, "anatomy")
add_item("ears", "ear_list_d", ear_list_d, "anatomy")
add_item("earrings", "earrings_list_d", earrings_list_d, "clothes")
add_item("earrings_dec", "earrings_dec_list_d", earrings_dec_list_d, "clothes")
add_item("nose", "nose_list_d", nose_list_d, "face")
add_item("complexion", "complexion_list_d", complexion_list_d, "face")
add_item("cheeks", "cheeks_list_d", cheeks_list_d, "face")

add_item("mouth", "mouth_list_d", mouth_list_d, "face")
add_item("eyebrows", "eyebrows_list_d", eyebrows_list_d, "face")
add_item("eyes", "eyes_list_d", eyes_list_d, "face")
add_item("eyewear", "eyewear_list_d", eyewear_list_d, "clothes")
add_item("hair_front", "hair_front_list_d", hair_front_list_d, "hair")
add_item("hat", "hat_list_d", hat_list_d, "clothes")
add_item("hat_dec", "hat_dec_list_d", hat_dec_list_d, "clothes")

add_item("wheelchair", "wheelchair_list_d", wheelchair_list_d, "wheelchair")
add_item("wheelchair_dec", "wheelchair_list_d", wheelchair_list_d, "wheelchair")
add_item("wheelchair_bottom", "wheelchair_bottom_list_d", wheelchair_bottom_list_d, "wheelchair")
add_item("wheelchair_bottom_dec", "wheelchair_bottom_dec_list_d", wheelchair_bottom_dec_list_d, "wheelchair")
add_item("wheelchair_coat", "wheelchair_coat_list_d", wheelchair_coat_list_d, "wheelchair")

#colours
skin_colours =["#FFE5C9","#FFE5C9","#FFE5C9","#F8C38D","#F1A065","#F3AE74","#EA8C59","#C26638","#CA783C","#8D4428","#A85E29","#6F3226","#723C1B"]

outfit_yellow = ["#FAF6E9","#FAF1CF","#FAE181",]
outfit_green = ["#91C639","#43A92D","#1B7C34",]
outfit_blue = ["#5B8DDD", "#4C6BC2", "#9CD6F8"]
outfit_purple = ["#C089E4","#7543BD", "#28137C"]
outfit_red = ["#E3313C", "#901E3B", "#E1748A",]
outfit_brown = ["#F6AC4F","#DA711F","#C49052","#A76C42","#83402C","#462231"]

outfit_colours = outfit_yellow+outfit_green+outfit_blue+outfit_purple +outfit_red 

eye_colours = ["#000000","#8334D8","#AD4C1F","#FFB02B","#D48A0B","#954213","#7F8723","#38AE2A","#146C24","#1ABACB","#83DFDF","#1E8990","#4C9EE8","#274CA4","#878E9E","#663D49"]

hair_grey = ["#9E8F7E", "#C6C2BE",]
hair_blonde = ["#D88F3F", "#F5D06D","#D19546"]
hair_brown = ["#712A0D","#A44C17", "#8A3C25",]
hair_black = ["#471E27", "#612230","#9C7256"]
hair_red = ["#D14728","#D15E23"]

hair_colours = hair_blonde + hair_red+ hair_brown+ hair_grey+ hair_black

# colour functions

shadow_types = ["red", "yellow","green","aqua","blue","purple"]

def hex_to_rgba(value):
    #### Return (red, green, blue, 255) for the color given as #rrggbb or #rgb.
    value = value.lstrip('#')
    lv = len(value)
    if lv ==6:
        return tuple([int(value[i:i + 2], 16) for i in range(0, 6, 2)]+ [255])
    else:    
        return tuple([(int(value[i], 16)*17) for i in range(0, 3)] + [255])

def rgb_to_hex(red, green, blue):
    # Return color as #rrggbb for the given color values.
    return '#%02x%02x%02x' % (red, green, blue)   

def luminance(p):
    return (0.299*p[0] + 0.587*p[1] + 0.114*p[2])   

def saturation(p):
    M = max(p)
    m = min(p)
    d = (M - m)/255
    L = (M + m)/510 
    if L ==0:
        return 0
    else:    
        X = 1 - abs(2*L-1)
        if X == 0:
            return 0
        return d/X     

def hue(p):
    #returns an angle between 0 and 360
    R = p[0]
    G = p[1]
    B = p[2]
    if R==G and R==B:
        return 0
    elif (R>=G) and G >=B:
        return 60*(G-B)/float(R-B)
    elif G>R and R>= B:
        return 60*(2-(R-B)/float(G-B))
    elif G>=B and B> R:
        return 60*(2+(B-R)/float(G-R))
    elif B>G and G> R:
        return 60*(4-(G-R)/float(B-R))   
    elif B>R and R>= G:
        return 60*(4+(R-G)/float(B-G))   
    else:
        return 60*(6-(B-G)/float(R-G))  
    

def shading(colour, shadow, r ):
    return (1-r)*colour + r*colour*shadow/255

def HSL_to_RGB(h,s,l):

    C = (255-abs(2*l-255)*s)
    m = l-0.5*C
    if h <60:
        X = C*h/60.0
        R = C
        G = X
        B = 0
    elif h<120:
        X = C*(120-h)/60.0
        R = X
        G = C
        B = 0
    elif h<180:
        X = C*(h-120)/60.0
        R = 0
        G = C
        B = X
    elif h<240:
        X = C*(240-h)/60.0
        R = 0
        G = X
        B = C  
    elif h<300:
        X = C*(h-240)/60.0
        R = X
        G = 0
        B = C
    else:
        X = C*(360-h)/60.0
        R = C
        G = 0
        B = X
    return [int(R+m), int(G+m), int(B+m)]

def hair_highlight(pixel, highlight):
    p = [pixel[0],pixel[1],pixel[2]]
    l = luminance(p)/255
    if l <0.7:
        r=0
    else:
        r = l-0.7 
        
    return (highlight[0],highlight[1],highlight[2], int(pixel[3]*r))

def hair_shadow(pixel,shadow1,edge):
    p = [pixel[0],pixel[1],pixel[2]]
    l = luminance(p)/255
    if l >0.7:
        return (0,0,0,0)
    elif l>0.6:
        r=1
    elif l>0.2:
        r = 2.5*l -0.5 #creates smooth transition between darker edge and lighter shadow1
    elif l>0.1:
        r=0
    else: #pure black
        return (0,0,0,pixel[3])

    for i in range(3):
        p[i] = int(r*shadow1[i] + (1-r)*edge[i] )
        
    return (p[0],p[1],p[2], int(pixel[3]*(1-l/0.7)))

def eye_shadow(pixel,edge):
    p = [pixel[0],pixel[1],pixel[2]]
    h = hue(p)
    sat = saturation(p)
    lum = luminance(p)
    if (h <220): 
        return pixel
    elif (lum>50):
        return (0,0,0,0) 
    else:   
        r=min(max(0,1-lum/125),1)
        
        return (edge[0]/2,edge[1]/2,edge[2]/2, int(pixel[3]*r))

def red_shadow(pixel,shadow1,edge):
    p = [pixel[0],pixel[1],pixel[2]]
    l = luminance(p)/255
    if l >0.9:
        return (0,0,0,0)
    elif l>0.7:
        r=1
    elif l>0.2:
        r = 2*l -0.4 #creates smooth transition between darker edge and lighter shadow1
    elif l>0.1:
        r=0
    else: #pure black
        return (0,0,0,pixel[3])

    for i in range(3):
        p[i] = int(r*shadow1[i] + (1-r)*edge[i] )
        
    return (p[0],p[1],p[2], int(pixel[3]*(1-l)))

def shadow_colours(colour_name):
    if colour_name=="red": 
        return [hex_to_rgba("#830016"),hex_to_rgba("#560055")]
    elif colour_name=="yellow": #yellow
        return [hex_to_rgba("#008100"),hex_to_rgba("#00561F")]
    elif colour_name=="green": #yellow-green
        return [hex_to_rgba("#024B64"),hex_to_rgba("#0C2C7E")]
    elif colour_name=="aqua": #aqua
        return [hex_to_rgba("#024B64"),hex_to_rgba("#0C2C7E")]
    elif colour_name=="blue": #blue
        return [hex_to_rgba("#270096"),hex_to_rgba("#270096")]
    else: #purple
        return [hex_to_rgba("#1B0C7E"),hex_to_rgba("#1B0C7E")]


def process_image(name, location,type):
    load_string = "../images/bases/"+location+"/"+name
    if type=="nofill":
        image_string = load_string+".png"
    elif type =="twotone":
        image_string = load_string+"_fill2.png"    
    else:    
        image_string = load_string+"_fill.png"
        
    if type == "noshadow":
        save_string = "../images/render/"+location+"/"+name+"_noshadow"  
    elif type =="twotone":
        save_string = "../images/render/"+location+"/"+name+"2" 
    else:    
        save_string = "../images/render/"+location+"/"+name

    img_original = Image.open(image_string) 
    original_data = img_original.load() 
    
    save_string_base = save_string +"_base.png"
    img_base = Image.new("RGBA", (img_original.size[0], img_original.size[1]))
    base_data = img_base.load() 

    save_string_highlight = save_string+"_highlight.png"
    img_highlight = Image.new("RGBA", (img_original.size[0], img_original.size[1]))
    highlight_data = img_highlight.load() 

    highlight = hex_to_rgba("#FFF7CA")
    line_colour = hex_to_rgba("#5B3D47")

    black_luminance = 100#13 #luminance level that's treated as black
    shadow_luminance = 190 

    if type != "eyes":#multiply images
        for colour in shadow_types:
            [shadow1,edge] = shadow_colours(colour)

            save_string_multiply = save_string+"_multiply_"+colour+".png"
            img_multiply = Image.new("RGBA", (img_original.size[0], img_original.size[1]))
            multiply_data = img_multiply.load()  

            for y in range(img_base.size[1]):
                for x in range(img_base.size[0]):

                    if original_data[x, y][3] !=0:            
                        pixel = original_data[x, y]
                        p = [pixel[0],pixel[1],pixel[2]]
                        if type!="noshadow":  #shadow
                            multiply_data[x, y] =red_shadow(pixel,shadow1,line_colour)
            img_multiply.save(save_string_multiply) 

    for y in range(img_base.size[1]):
        for x in range(img_base.size[0]):
            if original_data[x, y][3] !=0:
                pixel = original_data[x, y]
                p = [pixel[0],pixel[1],pixel[2]]
                lum = luminance(p)
                if lum>250 or type!="noshadow":  #shadow
                        base_data[x, y] = (100,100,100,pixel[3])    
                if type =="eyes":
                    highlight_data[x, y] =eye_shadow(pixel,line_colour)                
    img_base.save(save_string_base)   
    img_highlight.save(save_string_highlight)
                         
def simple_list_string(list):
    s = "["
    for l in list:
        s+="\""+l+"\","
    s+="]"
    return s

def list_string(listname, list):
    # Creates a string to define a list for generated.js
    return "const "+listname + " = "+simple_list_string(list)+";\n"

def name_string(obj):
    s = "const "+obj.listname + " = ["
    for i in [0,1]:
        s+=simple_list_string(obj.double_list[i])
        s+=","    
    s+="];\n"
    return s    

colourlist_list_string = "const colourlist_list = ["

def colour_list_add(list_name, sublists):
    global colourlist_list_string
    sublist_names = sublists.split("+")
    for l in sublist_names:
        colourlist_list_string+="[\""+l.split("_")[1]+"\","+l+"],"
    s = "const "+list_name+" = " + sublist_names[0]+".concat("
    for l in sublist_names[1:]:
        s+=l+","
    return s+ ");\n"  


def write_variables():
    # Write all the shared variables into generated.js

    content = open("generated.js","w")
    content.write("//generated by generate_images.py\n\n")
    content.write(list_string("eye_colours", eye_colours))
    content.write(list_string("outfit_colours", outfit_colours))
    content.write(list_string("outfit_brown", outfit_brown))
    content.write(list_string("skin_colours", skin_colours))
    content.write(list_string("hair_colours",hair_colours))
    content.write("\n")
    content.write("const no_render_list = [")
    for i in range(len(no_render_list)):
        content.write("[\""+no_render_list[i][0]+"\",")
        content.write(simple_list_string(no_render_list[i][1]))
        content.write("],")    
    content.write("];\n")
    content.write(list_string("no_fill_list", no_fill_list, )) 
    content.write(list_string("eyetype_list", eyetype_list ))   
    content.write(list_string("pattern_list",pattern_list))    
    content.write(list_string("skin_list", skin_list))   
    content.write(list_string("chest_image_list", chest_image_list)) 
    content.write(list_string("no_chest_coat_list", no_chest_coat_list)) 
    content.write(list_string("expression_list", expression_list))   
    content.write(list_string("outfit_list", outfit_list)) 
    content.write(list_string("accessory_list", accessory_list)) 
    content.write(list_string("defining_list", defining_list)) 
    content.write("\n")   
    for c in closet:
        if not (c.name in ["wheelchair_back","wheelchair_back_dec","wheelchair_dec",]):
            content.write(name_string(c))
    content.write("\n")
    for c in closet:
        content.write("add_image_object(\""+c.name+"\","+ c.listname+",\""+c.location+"\")\n")
        if c.name in defining_list:
            content.write("add_defining_object(\""+c.name+"\","+ c.listname+")\n")

    content.write("\n")    
    content.close()

def checkRender(name, item):
    for i in range(len(no_render_list)):
        if name == no_render_list[i][0]:
            if item in no_render_list[i][1]:
                return False
    return True            

def process_portrait_part(obj):
    if obj.name == "Nose_front":
        loc = obj.location + "/nose" 
    elif obj.name.endswith("_dec"): 
        loc = obj.location + "/"+obj.name[0:-4]        
    else: 
        loc = obj.location + "/"+obj.name  

    if obj.name == "chest":
        render_list = chest_image_list
    else:
        render_list = obj.item_list
    for item in render_list:
        if checkRender(obj.name, item) and not (obj.name in no_fill_list):     
            if item!="none":
                print(obj.name+" "+item)
                if obj.name == "Nose_front":
                    process_image(item, loc,"noshadow")          
                elif obj.name.endswith("_dec"):
                    process_image(item, loc,"twotone")
                elif (obj.name=="eyes"):
                    for shape in eyetype_list:
                        if item!="wink":
                            process_image(item, loc+"/"+shape,"eyes")           
                else:    
                    process_image(item, loc,"portrait")

def makeWinks():
    layer_list = ["base","highlight"]
    for eye_type in eyetype_list:
        for layer in layer_list:
            loc = "../images/render/face/eyes/"+eye_type+"/"
            save_string = loc+"wink_"+layer+".png"
            im_happy = Image.open(loc+"happy_"+layer+".png") 
            im_wink = Image.new("RGBA", (256, 268))
            region = im_happy.crop((0,0,159,205))
            im_wink.paste(region,(0,0,159,205))
            im_happy = Image.open(loc+"crescents_"+layer+".png") 
            region = im_happy.crop((159,0,314,800))
            im_wink.paste(region,(159,0,314,800))
            im_wink.save(save_string)

def makeStubble():
    loc = "../images/bases/portraits/body/"
    for head in head_list:
        save_string = loc+"stubble/"+head+"_base.png"
        img_mask = Image.open(loc+"head/"+head+"_base.png")
        img_stubble = Image.open(loc+"hair/facial_hair/stubble_base.png")
        img_stubble =Image.composite(img_stubble, img_mask, img_mask) 
        img_stubble.save(save_string)

def process_all_portraits():
    for c in closet:
        process_portrait_part(c)
    #makeWinks() 
    #makeStubble()    

write_variables()

# "skull", "head","body","ears","nose"
# "wheelchair_back","wheelchair_back_dec", "wheelchair", "wheelchair_dec"
for c in closet:
    if c.name in []:
        process_portrait_part(c)
makeWinks()
#makeStubble() 
       
#process_all_portraits()
#make_coat()