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

wheelchair_list = [ "none","regular"]
wheelchair_list_d = double_list(wheelchair_list)

head_list_u = ["pointy","regular","chin","round"]
head_list_d = double_list(head_list_u)
body_list = ["regular","regular"]
body_list_d = double_list(body_list)
no_iris_list = ["sleepy","closed"] #eyeshapes with no iris
iris_list_u = ["wide","extrawide", "widecatty","sad", "gentle", "regular","vivid", "cool","catty","coolside", "narrowcool","narrowcoolside","narrowcatty","narrowcattyside", "halfclosed"]
eye_shape_list_u = iris_list_u + no_iris_list
eye_shape_list_d = double_list(eye_shape_list_u)
iris_list_d = double_list(iris_list_u)
eyebrows_list_u = ["flat","flatsad","flatgrumpy","flatangry","sad","sadder", "sadsemi", "regular","archsemi","arched","archraised", "raised","raisedflat", "raisedsemiflat","raisedgrumpy","raisedsemi","angry", "angryarch","halfraised","halfsemi", "halfsad","halfsadraised","halfflat","halfarchraised"]
eyebrows_list_d = double_list(eyebrows_list_u)
mouth_list_u = ["grintall","grin","grinside","grinsmall","lah","lahsmall","lahtiny","smileside","smilebig","smilebigside","smilewideflat","p","sleaze","smileflat","smile","smilesmall","smiletiny","obig","o","osquare","osmall","dbig","d","dsmall","eww","ewwobble","nng","flatsmall","flat","t","tlow","wibble","frowntiny","frownsmall","frownnarrow","frown","pout","frownside","frownbig","frownopen",]
mouth_list_d = double_list(mouth_list_u)
nose_list_u = ["button", "round","medium","broad", "pointy","pointy2",] 
nose_list_d = double_list(nose_list_u)

cheeks_list_u = ["none","blush"]
cheeks_list_d = double_list(cheeks_list_u)

face_dec_list_u = ["none", "roundglasses"] #,"freckles",
face_dec_list_f = face_dec_list_u + ["dropearrings", "stud","roundearrings"]
face_dec_list_m = face_dec_list_u + ["beard"]
face_dec_list_d =  [face_dec_list_f,face_dec_list_m]

gloves_list_f = ["none", "shortgloves", "mediumgloves", "longgloves","bracelets"]
gloves_list_m = ["none", "shortgloves"]
gloves_list_d = [gloves_list_f,gloves_list_m]

top_list_f = ["bodiceplain", "bodicelong","bodicefancy","bodicepointy"]
top_list_m= [ "shirtopen","shirtclosed","shirtcravat"] 
top_list_d = [top_list_f,top_list_m]
top_collar_list = top_list_m
top_collar_list_d = [["none"],top_collar_list]

bottom_list_f = ["plainskirt","fancyskirt","lowskirt"]
bottom_list_m = ["breeches","trousers"]
bottom_list_d = [bottom_list_f, bottom_list_m]
    
accessory_list_f = ["none", "pendant","choker","fancychoker","beads"] 
accessory_list_m = ["none","waistcoat"]
accessory_list_d = [accessory_list_f, accessory_list_m]

coat_list_f = ["none","mediumcloak","dressjacket","wrap"]
coat_list_m = ["none","shortjacket","longjacketclosed","jama"]  
coat_list_d = [coat_list_f, coat_list_m]

hair_front_list_u = ["centrebun"]
hair_front_list_f = hair_front_list_u+ ["curlybun","wavybun", "straightbun","curlylong","flowing"]
hair_front_list_m = hair_front_list_u+ ["curlyshort","wavyshort", "straightshort","supershort"]

hair_front_list_d = [hair_front_list_f, hair_front_list_m]
hair_back_list_f = hair_front_list_f
hair_back_list_m = hair_front_list_m
hair_back_list_d = hair_front_list_d

hat_list_f = ["none","beads"]#,"scarf"
hat_list_m = ["none","tophat","turban"]
hat_list_d = [hat_list_f, hat_list_m]

# collections of parts that have the same colours and patterns
skin_list = ["body","head","nose","mouth","eyebrows","eye_shape"]
outfit_list = ["wheelchair_front", "bottom","top", "accessory", "face_dec","gloves", "hat", "coat"]
defining_list = outfit_list+skin_list+["hair_front","iris","cheeks"]

#extra info

no_chest_list = [ "robe","robehood",  "mediumcloak", "mediumcloakhood", "longcloak", "longcloakhood","wrap"] #clothes where the chest doesn't show
no_fill_list = ["mouth","eye_shape"] #lined items with no coloured fill
no_lines_list = ["iris","cheeks"] #coloured items with no lines

hat_back_list = ["none","tophat","scarf","turban"]
hat_back_list_d = double_list(hat_back_list)
hair_back_list = remove_dups(hair_front_list_f+ hair_front_list_m)
hair_back_list_d = double_list(hair_back_list) 
coat_back_list = ["none","mediumcloak","wrap"] 
coat_back_list_d = double_list(coat_back_list) 

wheelchair_bottom_list = ["none", "fancyskirt", "plainskirt","lowskirt","breeches","trousers"] 
wheelchair_bottom_list_d = double_list(wheelchair_bottom_list)
wheelchair_coat_list = ["none", "mediumcloak","longjacketclosed","dressjacket","jama"] 
wheelchair_coat_list_d = double_list(wheelchair_coat_list)

backs_list = [["hat_back","hat",hat_back_list], ["hair_back","hair",hair_back_list],["coat_back","coat",coat_back_list],
["wheelchair_bottom","bottom",wheelchair_bottom_list],["wheelchair_coat","coat",wheelchair_bottom_list],["wheelchair_back","wheelchair",wheelchair_list],]

two_tone_list = [["none",[]],
["wheelchair_bottom",["breeches","fancyskirt"]], ["wheelchair_back",["regular"]],  ["wheelchair_front",["regular"]], 
["top",["bodiceplain", "bodicelong","bodicefancy","bodicepointy"]],
["face_dec",["roundearrings"]],
["accessory",["waistcoat","pendant","fancychoker"]],
["bottom",["breeches","fancyskirt","plainskirt"]],
["coat",["dressjacket","jama"]],
["hat",["tophat","scarf"]],
["hat_back",["scarf"]],
]

no_render_list = []

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

clothes_list = ["wheelchair_back","coat_back","hat_back","hair_back","body",
"gloves","top","bottom","accessory","coat","chest","top_collar"
"head", "eyebrows", "eye_shape", "nose","mouth","face_dec","hair_front",
"hat", "wheelchair_front","wheelchair_bottom","wheelchair_coat"]

# Behind face
shown_start = len(closet) # where the visible items start

add_item("wheelchair_back", "wheelchair_list_d", wheelchair_list_d,"wheelchair")
add_item("coat_back", "coat_back_list_d",coat_back_list_d, "clothes/coat")
add_item("hat_back", "hat_back_list_d",hat_back_list_d, "clothes/hat")
add_item("hair_back", "hair_back_list_d",hair_back_list_d, "hair")
add_item("body", "body_list_d", body_list_d, "anatomy")

#cheeks go here in the final image
add_item("cheeks", "cheeks_list_d", cheeks_list_d, "face")

# In front of face
add_item("gloves", "gloves_list_d", gloves_list_d, "clothes")
add_item("top", "top_list_d", top_list_d, "clothes")
add_item("bottom", "bottom_list_d", bottom_list_d, "clothes")
add_item("accessory", "accessory_list_d", accessory_list_d, "clothes")
add_item("coat", "coat_list_d", coat_list_d, "clothes")
add_item("chest", "chest_list_d", chest_list_d, "anatomy")
add_item("top_collar", "top_collar_list_d", top_collar_list_d, "clothes")

add_item("head", "head_list_d", head_list_d, "anatomy")
add_item("nose", "nose_list_d", nose_list_d, "face")
add_item("mouth", "mouth_list_d", mouth_list_d, "face")
add_item("eyebrows", "eyebrows_list_d", eyebrows_list_d, "face")
add_item("iris", "iris_list_d", iris_list_d, "face/eyes")
add_item("eye_shape", "eye_shape_list_d", eye_shape_list_d, "face/eyes")
add_item("face_dec", "face_dec_list_d", face_dec_list_d, "clothes")
add_item("hair_front", "hair_front_list_d", hair_front_list_d, "hair")
add_item("hat", "hat_list_d", hat_list_d, "clothes")

add_item("wheelchair_front", "wheelchair_list_d", wheelchair_list_d, "wheelchair")
#add_item("wheelchair_bottom", "wheelchair_bottom_list_d", wheelchair_bottom_list, "wheelchair")
add_item("wheelchair_coat", "wheelchair_coat_list_d", wheelchair_coat_list_d, "wheelchair")

#colours
skin_regular =["#FFE7D6","#FFECD6","#FFD3A6","#FFDFA5","#F1A065","#F1B265","#DA773F","#DA874A","#B05934","#B96A2E","#853F27","#783F1A"]
skin_weird = ["#C3FFFA","#9BB681","#41AD60","#000000"]
skin_colours =skin_regular 

outfit_yellow = ["#F8EABC","#FFE201","#FFCC98","#F7BE4F","#FF9F02"]
outfit_green = ["#73D080","#8CC54E","#56AA04","#277032","#4F8B20","#7CA838","#8C8A2D"]
outfit_blue = ["#A6E7CD", "#008186", "#477BC8","#3C92ED","#1FDBFF","#2E4D91"]
outfit_purple = ["#A46FE2","#9431C6", "#BF2C92","#D361A7","#A01B54"]
outfit_red = ["#FF8B91", "#E55773", "#F0303C","#B71B00",]
outfit_brown = ["#B24836","#8E4A17","#912D20","#820000","#630F0F"]
outfit_grey = ["#FFFFFF","#A8ADAE", "#777471","#4C4C56","#482B57","#000000"]

outfit_colours = outfit_yellow+outfit_green+outfit_blue+outfit_purple +outfit_red +outfit_brown +outfit_grey
eye_colours = ["#000000","#AEB655","#14AC34","#20514C","#29B4C4","#008891","#2E9FF7","#3D2C64","#B200F1","#F39EFF","#FE023A","#D24525","#FF8F2B","#DB8200","#8E3300","#999999","#ffffff"]
hair_weird = ["#7034ED","#B25DF6","#1B8EF6", "#53C7FB","#469951"]
hair_grey = ["#A59A9D", "#E9E9E9",]
hair_blonde = ["#FCE374", "#F0B50A",]
hair_brown = ["#641D00","#923D1F", "#8B4910", "#BB742E",]
hair_black = ["#391E47", "#48356E","#4B261E", "#5B483C","#5A5A7F", "#602372","#000000"]
hair_red = ["#FE7423","#FF5565", "#DF433C","#D16132"]

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
        line_string = load_string+".png"
    else:    
        image_string = load_string+"_fill.png"
        line_string = load_string+"_lines.png"
        
    if type == "noshadow":
        save_string = "../images/render/"+location+"/"+name+"_noshadow"
    else:    
        save_string = "../images/render/"+location+"/"+name

    img_original = Image.open(image_string) 
    original_data = img_original.load() 

    if type!="nolines":
        img_line = Image.open(line_string) 
        line_data = img_line.load() 
    
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

    

    for colour in shadow_types:
        [shadow1,edge] = shadow_colours(colour)

        save_string_multiply = save_string+"_multiply_"+colour+".png"
        img_multiply = Image.new("RGBA", (img_original.size[0], img_original.size[1]))
        multiply_data = img_multiply.load()  

        for y in range(img_base.size[1]):
            for x in range(img_base.size[0]):
                uselines = False
                if type!="nolines":
                    if line_data[x, y][3] !=0:
                        uselines = True; 
                if  uselines:
                        multiply_data[x, y] = (line_colour[0],line_colour[1],line_colour[2],line_data[x, y][3])
                elif original_data[x, y][3] !=0:            
                    pixel = original_data[x, y]
                    p = [pixel[0],pixel[1],pixel[2]]
                    h = hue(p)
                    if (255>h> 60) and type!="noshadow":  #shadow
                        multiply_data[x, y] =red_shadow(pixel,shadow1,edge)
        img_multiply.save(save_string_multiply) 

    for y in range(img_base.size[1]):
        for x in range(img_base.size[0]):
            if original_data[x, y][3] !=0:
                pixel = original_data[x, y]
                p = [pixel[0],pixel[1],pixel[2]]
                lum = luminance(p)
                h = hue(p)

                if h >230: #blue, so shadows
                    if type!="noshadow":  #shadow
                        base_data[x, y] = (100,100,100,pixel[3])           
                elif h> 60:  #highlight
                    base_data[x, y] = (100,100,100,pixel[3])       
                    highlight_data[x, y] = (highlight[0],highlight[1],highlight[2],int(pixel[3]*0.5))     
                else: #just base colour
                    base_data[x, y] = (100,100,100,pixel[3])     

    img_base.save(save_string_base)   
    img_highlight.save(save_string_highlight)
                         

def list_string(listname, list):
    # Creates a string to define a list for generated.js
    s = "const "+listname + " = ["
    for l in list:
        s+="\""+l+"\","
    s+="];\n"
    return s

def name_string(obj):
    s = "const "+obj.listname + " = ["
    for i in [0,1]:
        s+="["
        for l in obj.double_list[i]:
            s+="\""+l+"\","
        s+="],"    
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
    content.write(list_string("skin_colours", skin_colours))
    content.write(list_string("hair_colours",hair_colours))
    content.write("\n")
    content.write(list_string("no_lines_list",no_lines_list))   
    content.write(list_string("no_fill_list", no_fill_list, )) 
    content.write(list_string("no_iris_list", no_iris_list ))   
    content.write(list_string("pattern_list",pattern_list))    
    content.write(list_string("skin_list", skin_list))   
    content.write(list_string("outfit_list", outfit_list)) 
    content.write(list_string("defining_list", defining_list)) 
    content.write("\n")   
    for c in closet:
        if not (c.name in ["wheelchair_back"]):
            content.write(name_string(c))
    content.write("\n")
    for c in closet:
        content.write("add_image_object(\""+c.name+"\","+ c.listname+",\""+c.location+"\")\n")
        if c.name in defining_list:
            content.write("add_defining_object(\""+c.name+"\","+ c.listname+")\n")

    content.write("\n")    
    
    
    
    content.close()

def process_portrait_part(obj):
    if obj.name == "Nose_front":
        loc = obj.location + "/nose"    
    else:       
        loc = obj.location + "/"+obj.name  
    for item in obj.item_list:
        if not (obj.name in no_fill_list):     
            if item!="none":
                print(obj.name+" "+item)
                if obj.name == "Nose_front":
                    process_image(item, loc,"noshadow")
                elif (obj.name in no_fill_list):  
                    process_image(item, loc,"nofill")            
                elif obj.name in no_lines_list:  
                    process_image(item, loc,"nolines")     
                else:    
                    process_image(item, loc,"portrait")

def makeWinks():
    layer_list = ["base","highlight"]
    for colour in shadow_types:
        layer_list.append("multiply_"+colour)
    for eye_type in eye_type_list_port:
        for layer in layer_list:
            loc = "../images/portraits/expression/eyes/"+eye_type+" "
            save_string = loc+"wink_"+layer+".png"
            im_happy = Image.open(loc+"happy_"+layer+".png") 
            im_wink = Image.new("RGBA", (256, 268))
            region = im_happy.crop((0,0,125,268))
            im_wink.paste(region,(0,0,125,268))
            im_happy = Image.open(loc+"crescents_"+layer+".png") 
            region = im_happy.crop((126,0,256,268))
            im_wink.paste(region,(126,0,256,268))
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
        if not (c.name in no_render_list):
            process_portrait_part(c)
    #makeWinks() 
    #makeStubble()    

write_variables()

for c in closet:
    if c.name in []:
        process_portrait_part(c)
#makeWinks()
#makeStubble() 
       
#process_all_portraits()
#make_coat()