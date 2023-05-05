from __future__ import print_function
import sys
import math
from PIL import Image, ImageDraw, ImageFilter
from PIL import ImageEnhance

# python3 generate_images.py
# Python scripts to create images for dollmaker from the images in ../spritemaker_bases
# Which I have not uploaded because it's a lot of files!

def remove_dups(l):
        #removes duplicates from a list
        return list( dict.fromkeys(l) ) 

def default_list(l):
    return [l,l, []]   

def combineList(list1,list2):
    #list of strings combining lists of strings list1 and list2
    output = []
    for l1 in list1:
        for l2 in list2:
            output.append(l1+" "+l2)
    return output  

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

def addColours(list):
    #add extra colours halfway between each colour
    newlist = [list[0]]
    for i in range(len(list)-1):
        newcol = []
        for j in range(3):
            newcol += [int((hex_to_rgba(list[i])[j]+hex_to_rgba(list[i+1])[j])/2)]
        newlist += [rgb_to_hex(newcol[0],newcol[1],newcol[2])]     
        newlist += [list[i+1]]
    return newlist          


pattern_list = ["none",
        "crocodile","rose", "snake","damask", #repeated fractal
        "crosshatch","fabric",  #repeated naturalistic
        "diamonds","diamondssmall","tartan",  "polkadot",#repeated pattern
        "pinstripe","horizontalpinstripe",] #lines "verticalstripe", "horizontalstripe", "diagonal","net",

chest_list = ["none", "small","medium","big"]   
chest_list_d = [chest_list,["none"], ["none"]]
chest_image_list = ["none","small","medium","big","bigpants","smallwide","mediumwide", "bigwide"]

wheelchair_list = [ "none","manual","old fashioned"]
wheelchair_list_w = ["old fashioned"]
wheelchair_list_d = [wheelchair_list,wheelchair_list,wheelchair_list_w]

head_list_u = ["pointed","medium","rectangular","round"]
head_list_d = default_list(head_list_u)
skull_list = ["regular"]
skull_list_d = default_list(skull_list)
ear_list_u = ["none","regular","pointed","very pointed"]
ear_list_w = ["none","pointed","very pointed"]
ear_list_d = [ear_list_u,ear_list_u,ear_list_w]
body_list = ["regular"]
body_list_d = default_list(body_list)
leg_list_d = default_list(["none"]+body_list)
wheelchair_leg_list_d = default_list(["none"]+body_list)


no_iris_list = ["sleepy","closed"] #eyeshapes with no iris
eyeshape_list = ["neutral","side","crescents","flat", "narrowed","happy","wide","shock","angry","angry side","sleepy","wink"]
#["wide","extrawide", "widecatty","sad", "gentle", "regular","vivid", "cool","catty","coolside", "narrowcool","narrowcoolside","narrowcatty","narrowcattyside", "halfclosed"]
eyetype_list_u = ["medium eyelashes"]
eyetype_list_m = eyetype_list_u+["short eyelashes"]
eyetype_list_f = eyetype_list_u+["long eyelashes"]
eyetype_list_w = []
eyetype_list_d = [eyetype_list_f,eyetype_list_m,eyetype_list_w]
eyes_list_d = default_list(eyeshape_list)
eyebrows_list_u = ["flat","flat sad","flat grumpy","flat angry","sad","sadder", "semi sad", "regular","semi arch","arched","raised arch", "raised","raised flat", "raised semi flat","raised grumpy","raised semi","angry", "angry arch","half raised","half semi", "half sad","half sad raised","half flat","half arch raised"]
eyebrows_list_d = default_list(eyebrows_list_u)
mouth_list_u = ["lah", "small lah", "tiny lah", "big grin","grin","side grin","side smile","big smile","big side smile","wide flat smile","tongue out","wobbly smile", "flat smile","smile","small smile","tiny smile","slight smile","side eww","eww",  "oh","square oh","big oh", "small oh","shock","small flat","flat","small clenched", "wobbly frown","tiny frown","small frown","narrow frown","frown","low moue","moue","pout","side frown","big frown",]
mouth_list_d = default_list(mouth_list_u)
nose_list_u = ["button", "round","medium","broad", "pointed","hooked",] 
nose_list_d = default_list(nose_list_u)

cheeks_list_u = ["none","blush"]
cheeks_list_d = default_list(cheeks_list_u)

complexion_list_u = ["none","slight lines", "freckles"]
complexion_list_d = default_list(complexion_list_u)

eyewear_list_u = ["none", "oblong glasses","square glasses","round glasses","spectacles","eye patch","sunglasses","coloured glasses"] 
eyewear_list_f = eyewear_list_u
eyewear_list_m = eyewear_list_u+["monocle"]
eyewear_list_w = ["monocle","spectacles","eye patch"]
eyewear_list_d =  [eyewear_list_f,eyewear_list_m, eyewear_list_w]

earrings_list_u = ["none","small hoops","punk"]
earrings_list_f = earrings_list_u+["stud","hoops", "drop earrings", "round earrings"]
earrings_list_m = earrings_list_u+[]
earrings_list_w = []
earrings_list_d =  [earrings_list_f,earrings_list_m, earrings_list_w]

gloves_list_f = ["none", "short gloves", "medium gloves", "bracelets"]
gloves_list_m = ["none", "short gloves"]
gloves_list_w = []
gloves_list_d = [gloves_list_f,gloves_list_m,gloves_list_w]

top_list_u = ["none","vest","tee", "chinese collar","turtleneck" ]
top_list_f = top_list_u+["bikini","square", "boatneck","gathered","low vee"]
top_list_m= top_list_u+["open shirt","button up", "high collar shirt"] 
top_list_w = ["high collar shirt"]
top_list_d = [top_list_f,top_list_m,top_list_w]
top_nosleeves_list = ["none", "bikini", "vest"]

top_collar_list = ["open shirt","button up","high collar shirt"] 
top_collar_list_d = [["none"],top_collar_list,["none"]]

top_sleeve_list_u = ["sleeveless", "short","long"]
top_sleeve_list_f = top_sleeve_list_u+["puffy"]
top_sleeve_list_m = top_sleeve_list_u+["puffy shirt", "long shirt"]
top_sleeve_list_w = ["puffy", "puffy shirt"]
top_sleeve_list_d = [top_sleeve_list_f,top_sleeve_list_m,top_sleeve_list_w]

overshirt_list_u = ["none","button up vee", "open shirt", "vee","sweater"]
overshirt_list_f = overshirt_list_u + []
overshirt_list_m = overshirt_list_u + []
overshirt_list_w = []
overshirt_list_d = [overshirt_list_f, overshirt_list_m,overshirt_list_w]
overshirt_nosleeves_list = ["none"]

overshirt_sleeve_list_u = ["sleeveless","short","long"]
overshirt_sleeve_list_f = overshirt_sleeve_list_u+[]
overshirt_sleeve_list_m = overshirt_sleeve_list_u+[]
overshirt_sleeve_list_w = []
overshirt_sleeve_list_d = [overshirt_sleeve_list_f, overshirt_sleeve_list_m, overshirt_sleeve_list_w]

bottom_list_u = ["none","briefs",]
bottom_list_f = bottom_list_u+["short skirt","medium skirt","long skirt","kilt","short kilt","tube skirt","briefs"]
bottom_list_m = bottom_list_u+["breeches","trousers","shorts"]
bottom_list_w = ["breeches","tube skirt","briefs"]
bottom_list_d = [bottom_list_f, bottom_list_m, bottom_list_w]

waistline_list_u=["none","gathered","button fly"]
waistline_list_f = waistline_list_u+["low","high","empire"]
waistline_list_m = waistline_list_u+["fall front","overalls"]
waistline_list_w = ["fall front","empire"]
waistline_list_d = [waistline_list_f,waistline_list_m,waistline_list_w]

neckwear_list_u = ["none", "bow", "bandanna", "scarf"]  
neckwear_list_f = neckwear_list_u+[ "beaded necklace","choker","pendant","jewelled necklace","beads",] 
neckwear_list_m = neckwear_list_u+["cravat","tie","bow tie"]
neckwear_list_w = ["bow","bandanna"]
neckwear_list_d = [neckwear_list_f, neckwear_list_m,neckwear_list_w]

coat_list_u = ["none","medium cloak", "short jacket"]
coat_list_f = coat_list_u+["dress jacket","wrap"]
coat_list_m = coat_list_u+["business jacket","buttoned jacket","cool jacket", "overcoat","jama"]  
coat_list_w = ["medium cloak","jama"]
coat_list_d = [coat_list_f, coat_list_m, coat_list_w]
coat_nosleeves_list = ["none", "wrap", "medium cloak"]

coat_sleeve_list_u = ["sleeveless","short","scrunched", "long", "long blocky"]
coat_sleeve_list_f = coat_sleeve_list_u+[]
coat_sleeve_list_m = coat_sleeve_list_u+[]
coat_sleeve_list_w = []
coat_sleeve_list_d = [coat_sleeve_list_f, coat_sleeve_list_m, coat_sleeve_list_w]

hat_middle_list_u =["none","cat ears",]
hat_middle_list_f = hat_middle_list_u+["scarf","beads","head band","side bow","bow","bandanna",]
hat_middle_list_m = hat_middle_list_u+[]
hat_middle_list_w = ["beads","cat ears",]
hat_middle_list_d = [hat_middle_list_f, hat_middle_list_m, hat_middle_list_w]

hat_front_list_u =["none","witch hat","broad hat","beanie"]
hat_front_list_f = hat_front_list_u+["bonnet","hijab","flower","flower crown"]
hat_front_list_m = hat_front_list_u+["top hat","cap","bowler","fedora","turban"]
hat_front_list_w = ["top hat","witch hat","bowler","flower crown"]
hat_front_list_d = [hat_front_list_f, hat_front_list_m, hat_front_list_w]

hat_list_d = [remove_dups(hat_middle_list_f+hat_front_list_f),remove_dups(hat_middle_list_m+hat_front_list_m),remove_dups(hat_middle_list_w+hat_front_list_w)]

socks_list_u = ["none","ankle high","mid calf"]
socks_list_m = socks_list_u  
socks_list_f = socks_list_u +["knee high","thigh high","tights"] 
socks_list_w = []
socks_list_d = [socks_list_f, socks_list_m, socks_list_w]

shoes_list_u = ["none","sandals","slip ons","sneakers"]
shoes_list_m = shoes_list_u +["boots"]
shoes_list_f = shoes_list_u +["high boots","pumps","mary janes"] 
shoes_list_w = []
shoes_list_d = [shoes_list_f, shoes_list_m, shoes_list_w]


hair_front_list = ["none", "balding", "neat side", "swept back", "long locs","curly flowing","curly long","straight flowing","locs bun", ]
hair_front_list_d = default_list(hair_front_list)

hair_back_list = ["none","balding", "buzzcut","straight short","curly short","wavy short", "straight side", "swept back", "shaggy short", "tight curls short","tight curls medium", "shaggy medium", "curly bob","wavy bob", "straight bob","locs bob", "half up medium wavy","straight high pony","straight low pony", "curly pony", "bun","curly bun","wavy bun","locs bun","twin braids","straight long","wavy long","curly long", "long locs",  "curly flowing", "straight flowing","straight up","curly up","locs up"]
hair_back_list_d = default_list(hair_back_list)

hair_middle_list = ["none", "shaved", "balding","short","long","long shadowed"]
hair_middle_list_d = default_list(hair_middle_list)

fringe_list_u = ["none", "straight short", "curly short","spiky","straight centre","straight swept","emo","long locs" ]
fringe_list_m = fringe_list_u+["side flop", "princely","wavy side"]
fringe_list_f = fringe_list_u+["wavy centre","curly wisps","curly long"]#"straight long","wavy long"
fringe_list_w =[]
fringe_list_d = [fringe_list_f, fringe_list_m, fringe_list_w]

facial_hair_list_f = ["none"]
facial_hair_list_m = ["none", "beard", "moustache", "goatee", "soul patch", "fluffy goatee", "stubble"]
facial_hair_list_w = []
facial_hair_list_d = [facial_hair_list_f,facial_hair_list_m,facial_hair_list_w]
facial_hair_list_render = [f for f in facial_hair_list_m if f!="stubble"]

# collections of parts that have the same colours and patterns
skin_list_defining = ["body","nose","mouth","eyebrows","complexion","ears"]#same colour as head
skin_list = skin_list_defining + ["skull","legs","wheelchair_legs","nose_front"]
expression_list = ["mouth","eyebrows","cheeks","eyes"]
accessory_list = ["eyewear","neckwear", "earrings", "gloves",]
outfit_list = [ "bottom","top", "overshirt", "coat", "socks","shoes"]#"wheelchair",
has_sleeves_list = ["top","overshirt","coat"]
sleeve_list = [x +"_sleeves" for x in has_sleeves_list]
defining_list = remove_dups(accessory_list+ outfit_list+sleeve_list+skin_list_defining+expression_list+["fringe","facial_hair", "head","chest","waistline","wheelchair"])

#extra info

no_chest_coat_list = [ "robe","robe hood",  "medium cloak", "medium cloak hood", "long cloak", "long cloak hood","wrap"] #clothes where the chest doesn't show
no_fill_list = ["mouth"] #lined items with no coloured fill

hat_back_list = ["none","bandanna","beanie","bonnet","bowler","broad hat","cap","fedora","top hat","witch hat","top hat","scarf","turban","hijab"]
hat_back_list_d = default_list(hat_back_list)
coat_back_list = ["none","medium cloak","wrap","overcoat","short jacket","dress jacket","business jacket","buttoned jacket","cool jacket"] 
coat_back_list_d = default_list(coat_back_list) 

neckwear_front_list = ["bow","bow tie", "bandanna"]
neckwear_front_list_d = default_list(neckwear_front_list)

neckwear_front2_list = [ "scarf"]
neckwear_front2_list_d = default_list(neckwear_front2_list)

wheelchair_bottom_list_d = bottom_list_d
wheelchair_coat_list = ["none", "medium cloak","long jacket closed","dress jacket","jama"] 
wheelchair_coat_list_d = default_list(wheelchair_coat_list)

wheelchair_bottom_dec_list = []#["split empire skirt"]
wheelchair_bottom_dec_list_d = default_list(wheelchair_bottom_dec_list)
top_dec_list = ["square","gathered","low vee"]
top_dec_list_d = default_list(top_dec_list)
earrings_dec_list = ["round earrings"]
earrings_dec_list_d = default_list(earrings_dec_list)
overshirt_dec_list = ["button up vee"]
overshirt_dec_list_d = default_list(overshirt_dec_list)
neckwear_dec_list = ["jewelled necklace","beaded necklace"]
neckwear_dec_list_d = default_list(neckwear_dec_list)
bottom_dec_list = ["split empire skirt","empire skirt"]
bottom_dec_list_d = default_list(bottom_dec_list)
coat_dec_list = ["dress jacket","jama"]
coat_dec_list_d = default_list(coat_dec_list)
hat_front_dec_list = ["bowler","broad hat","fedora","witch hat","top hat"]
hat_front_dec_list_d = default_list(hat_front_dec_list)
hat_back_dec_list = ["scarf"]
hat_back_dec_list_d = default_list(hat_back_dec_list)

highlight_list = ["fringe"]
underlay_list = ["eyewear"]
no_render_list = [["hat_middle",["scarf"]],["hat_front_dec",["scarf"]],]

default_box = "[0,0,314,1024]"
###################### More technical stuff from here on

closet = [] # list of lists of information about items of clothing etc

class ClothingItem:

    # name: string describing item type, eg "hat"
    # item_list: list of strings with names of items, eg hat_list as defined elsewhere
    # location: string describing where the image files are,
    #           eg "clothes" because hat images are stored in the folder clothes/hat

    def __init__(self,name,listname, list_list, location, box):
        self.name =  name
        self.listname = listname
        self.list_list = list_list
        self.item_list = remove_dups(list_list[0]+list_list[1]+list_list[2])
        self.location = location
        self.box = box

def add_item(name, listname, list_list,location, box):
    # Add an item to the closet
    global  closet

    closet.append(ClothingItem(name, listname,list_list, location, box))

## Adding all the data to closet

add_item("wheelchair_back", "wheelchair_list_d", wheelchair_list_d,"wheelchair", default_box)
add_item("wheelchair_back_dec", "wheelchair_list_d", wheelchair_list_d,"wheelchair", default_box)
add_item("hat_back", "hat_back_list_d",hat_back_list_d, "clothes/hat", default_box)
add_item("hat_back_dec", "hat_back_dec_list_d",hat_back_dec_list_d, "clothes/hat", default_box)
add_item("hair_back", "hair_back_list_d",hair_back_list_d, "hair", default_box)
add_item("coat_back", "coat_back_list_d",coat_back_list_d, "clothes/coat", default_box)
add_item("body", "body_list_d", body_list_d, "anatomy", default_box)
add_item("legs", "leg_list_d", leg_list_d, "anatomy", default_box)

add_item("socks", "socks_list_d", socks_list_d, "clothes", default_box)
add_item("shoes", "shoes_list_d", shoes_list_d, "clothes", default_box)
add_item("gloves", "gloves_list_d", gloves_list_d, "clothes", default_box)
add_item("top_sleeves", "top_sleeve_list_d", top_sleeve_list_d, "clothes/top", default_box)
add_item("top", "top_list_d", top_list_d, "clothes", default_box)
add_item("top_dec", "top_dec_list_d", top_dec_list_d, "clothes", default_box)

add_item("overshirt_sleeves", "overshirt_sleeve_list_d", overshirt_sleeve_list_d, "clothes/overshirt", default_box)
add_item("coat_sleeves", "coat_sleeve_list_d", coat_sleeve_list_d, "clothes/coat", default_box)

add_item("bottom", "bottom_list_d", bottom_list_d, "clothes", default_box)
add_item("bottom_dec", "bottom_dec_list_d", bottom_dec_list_d, "clothes", default_box)
add_item("waistline", "waistline_list_d", waistline_list_d, "clothes", default_box)
add_item("neckwear", "neckwear_list_d", neckwear_list_d, "clothes", default_box)
add_item("neckwear_dec", "neckwear_dec_list_d", neckwear_dec_list_d, "clothes", default_box)

add_item("overshirt", "overshirt_list_d", overshirt_list_d, "clothes", default_box)
add_item("overshirt_dec", "overshirt_dec_list_d", overshirt_dec_list_d, "clothes", default_box)
add_item("top_collar", "top_collar_list_d", top_collar_list_d, "clothes/top", default_box)
add_item("neckwear_front", "neckwear_front_list_d", neckwear_front_list_d, "clothes/neckwear", default_box)

add_item("coat", "coat_list_d", coat_list_d, "clothes", default_box)
add_item("coat_dec", "coat_dec_list_d", coat_dec_list_d, "clothes", default_box)
add_item("chest", "chest_list_d", chest_list_d, "anatomy", default_box)
add_item("neckwear_front2", "neckwear_front2_list_d", neckwear_front2_list_d, "clothes/neckwear", default_box)


add_item("skull", "skull_list_d", skull_list_d, "anatomy", default_box)
add_item("head", "head_list_d", head_list_d, "anatomy", default_box)
add_item("hair_middle", "hair_middle_list_d", hair_middle_list_d, "hair", default_box)
add_item("ears", "ear_list_d", ear_list_d, "anatomy", default_box)
add_item("earrings", "earrings_list_d", earrings_list_d, "clothes", default_box)
add_item("earrings_dec", "earrings_dec_list_d", earrings_dec_list_d, "clothes", default_box)
add_item("nose", "nose_list_d", nose_list_d, "face", default_box)
add_item("complexion", "complexion_list_d", complexion_list_d, "face", default_box)
add_item("cheeks", "cheeks_list_d", cheeks_list_d, "face", default_box)

add_item("mouth", "mouth_list_d", mouth_list_d, "face", default_box)
add_item("eyebrows", "eyebrows_list_d", eyebrows_list_d, "face", default_box)
add_item("eyes", "eyes_list_d", eyes_list_d, "face", default_box)

add_item("facial_hair", "facial_hair_list_d", facial_hair_list_d, "hair", default_box)
add_item("nose_front", "nose_front_list_d", nose_list_d, "face/nose", default_box)
add_item("hair_front", "hair_front_list_d", hair_front_list_d, "hair", default_box)
add_item("eyewear", "eyewear_list_d", eyewear_list_d, "clothes", default_box)
add_item("hat_middle", "hat_middle_list_d", hat_middle_list_d, "clothes/hat", default_box)
add_item("fringe", "fringe_list_d", fringe_list_d, "hair", default_box)
add_item("hat_front", "hat_front_list_d", hat_front_list_d, "clothes/hat", default_box)
add_item("hat_front_dec", "hat_front_dec_list_d", hat_front_dec_list_d, "clothes/hat", default_box)

add_item("wheelchair", "wheelchair_list_d", wheelchair_list_d, "wheelchair", default_box)
add_item("wheelchair_dec", "wheelchair_list_d", wheelchair_list_d, "wheelchair", default_box)
add_item("wheelchair_legs", "wheelchair_leg_list_d", wheelchair_leg_list_d, "wheelchair", default_box)
add_item("wheelchair_bottom", "wheelchair_bottom_list_d", wheelchair_bottom_list_d, "wheelchair", default_box)
add_item("wheelchair_bottom_dec", "wheelchair_bottom_dec_list_d", wheelchair_bottom_dec_list_d, "wheelchair", default_box)
add_item("wheelchair_coat", "wheelchair_coat_list_d", wheelchair_coat_list_d, "wheelchair", default_box)

#colours


skin_colours =addColours(["#FFF1E2","#FDDAB0","#FECFA4","#F8C38D","#F1A065","#F3AE74","#EA8C59","#C26638","#CA783C","#A85E29","#8D4428","#6D3716","#632418"])
skin_colours_weird = ["#FFFFFF","#BDADAF","#D1EFF8","#B7DAA3","#DF626A","#9C68BF","#4B4AA0"]

outfit_yellow = ["#FAF6E9","#FAF1CF","#FAE181",]
outfit_green = ["#91C639","#43A92D","#1B7C34",]
outfit_blue = ["#5B8DDD", "#4C6BC2", "#9CD6F8"]
outfit_purple = ["#C089E4","#7543BD", "#28137C"]
outfit_red = ["#E3313C", "#901E3B", "#E1748A",]
outfit_brown = ["#F6AC4F","#DA711F","#C49052","#A76C42","#83402C","#462231"]

outfit_colours = outfit_yellow+outfit_green+outfit_blue+outfit_purple +outfit_red 

eye_colours = ["#8DD1E8","#4383D2","#295BA9","#1E3776","#607B9C","#8C929B","#B9C2CD","#6E8785",]+["#6CB76E","#459953","#30854B","#2B6D4A","#95A27A","#99925F",]+["#E1A12E","#BF8A52","#7E4223","#975B35",]+["#733C2D","#4D1917","#190403"]
eye_colours_weird = ["#DF3421","#F55783","#e62ded","#932ded","#c78be5","#FFFFFF","#fcec3a"]

hair_grey = ["#9A8D8E","#FAEAD9"]
hair_blonde = ["#E6D1B1","#D8B994","#F5D06D", "#DB9A4C","#C67A40"]
hair_brown = ["#9C7256","#9D4916","#8A3C25", "#712A0D",]
hair_black = ["#612230","#461E42",]
hair_red = ["#D13828","#D15E23","#8B1B20"]

hair_colours = addColours(hair_blonde + hair_red+ hair_brown+ hair_black+ hair_grey)
hair_colours_weird =["#32B05C","#79D15E","#89E2E6","#FF8DB6","#BE6CDA","#6758A9"]

scheme_list = [ #Various pretty colour schemes

    ["#774F38","#E08E79","#F1D4AF","#ECE5CE","#C5E0DC"],
    ["#1693A5","#45B5C4","#7ECECA","#A0DED6","#C7EDE8"],
    ["#D24858","#EA8676","#EAB05E","#FDEECD","#493831"],
    ["#165C8E","#28506D","#405961","#504C3D","#403D27"],
    ["#30261C","#403831","#36544F","#1F5F61","#0B8185"],
    ["#1C0113","#6B0103","#A30006","#C21A01","#F03C02"],
    ["#EFE2C0","#93D7DB","#A26156","#ADD9D5","#FCECCA"],
    ["#F8B195","#F67280","#C06C84","#6C5B7B","#355C7D"],
    ["#2A044A","#0B2E59","#0D6759","#7AB317","#A0C55F"],
    ["#300030","#480048","#601848","#C04848","#F07241"],
    ["#ECD078","#D95B43","#C02942","#542437","#53777A"],
    ["#A8E6CE","#DCEDC2","#FFD3B5","#FFAAA6","#FF8C94"],
    ["#69D2E7","#A7DBD8","#E0E4CC","#F38630","#FA6900"],
    ["#111625","#341931","#571B3C","#7A1E48","#9D2053"],
    
    ["#413E4A","#73626E","#B38184","#F0B49E","#F7E4BE"],
    ["#E6EBA9","#ABBB9F","#6F8B94","#706482","#703D6F"],
    ]

colourings = [
    ["#ffead2","#f06769","#fffaf8"], #albino
    ["#83e07d", "#e14848","#c73d42"], #orc
]

outfit_colours = []
for s in scheme_list:
    outfit_colours+=s

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
        
        return (int(edge[0]/2),int(edge[1]/2),int(edge[2]/2), int(pixel[3]*r))

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

def makeSwatch(list, name, width):
    save_string = "../images/render/swatches/"+name +".png"
    sq_width = 50
    gutter_width = 1
    narrow_width = sq_width-gutter_width
    height = int(len(list)/width) + 1
    img = Image.new("RGBA", (sq_width*width, sq_width*height))
    draw = ImageDraw.Draw(img)
    for i in range(width):
        for j in range(height):
            current = j*width+i
            if current > len(list) - 1:
                break
            if width ==10:
                x = narrow_width*i
                y = sq_width*j
                if i<5:
                    draw.rectangle((x,y,x+narrow_width,y+sq_width-gutter_width*5),fill=hex_to_rgba(list[current])) 
                else:
                    draw.rectangle((gutter_width*5+x,y,gutter_width*5+x+narrow_width,y+sq_width-gutter_width*5),fill=hex_to_rgba(list[current])) 

            else:  
                x = gutter_width*width+narrow_width*i
                y = sq_width*j  
                draw.rectangle((x,y,x+sq_width,y+sq_width),fill=hex_to_rgba(list[current])) 
    img.save(save_string)   

def makeSwatches():
    makeSwatch(skin_colours+skin_colours_weird,"skin",5,)
    makeSwatch(eye_colours+eye_colours_weird,"eyes",5)
    makeSwatch(hair_colours+hair_colours_weird,"hair",5)
    
    makeSwatch(outfit_colours,"schemes",10)


def process_image(name, location,type):
    load_string = "../../spritemaker_bases/"+location+"/"+name

    if type =="no_fill":
        image_string = load_string+".png"
    elif type =="twotone":
        image_string = load_string+"_fill2.png"    
    else:    
        image_string = load_string+"_fill.png"
        
    if type =="twotone":
        save_string = "../images/render/"+location+"/"+name+"2" 
    else:    
        save_string = "../images/render/"+location+"/"+name

    img_original = Image.open(image_string) 
    original_data = img_original.load() 
    
    save_string_base = save_string +"_base.png"
    img_base = Image.new("RGBA", (img_original.size[0], img_original.size[1]))
    base_data = img_base.load()  

    if type =="no_fill":
        img_original.save(save_string_base)
        return
    
    if type =="highlight":  
        save_string_highlight = save_string+"_highlight.png"
        h_string = load_string+"_highlight.png"
        img_highlight = Image.open(h_string)
        highlight_data = img_highlight.load() 

    if type =="eyes":
        save_string_overlay = save_string+"_overlay.png"
        img_overlay = Image.new("RGBA", (img_original.size[0], img_original.size[1]))
        overlay_data = img_overlay.load()  
    if type =="underlay":  
        save_string_underlay = save_string+"_underlay.png"
        img_underlay = Image.open(load_string+"_underlay.png")      

    highlight = hex_to_rgba("#FFF7CA")
    line_colour = hex_to_rgba("#5B3D47")

    if type != "eyes":#multiply images
        for colour in ["blue"]:#shadow_types:
            [shadow1,edge] = shadow_colours(colour)

            save_string_multiply = save_string+"_multiply_"+colour+".png"
            img_multiply = Image.new("RGBA", (img_original.size[0], img_original.size[1]))
            multiply_data = img_multiply.load()  

            for y in range(img_base.size[1]):
                for x in range(img_base.size[0]):

                    if original_data[x, y][3] !=0:            
                        pixel = original_data[x, y]
                        p = [pixel[0],pixel[1],pixel[2]]
                        multiply_data[x, y] =red_shadow(pixel,shadow1,line_colour)
            img_multiply.save(save_string_multiply) 

    for y in range(img_base.size[1]):
        for x in range(img_base.size[0]):
            if original_data[x, y][3] !=0:
                pixel = original_data[x, y]
                p = [pixel[0],pixel[1],pixel[2]]
                base_data[x, y] = (100,100,100,pixel[3])    
                if type =="eyes":
                    overlay_data[x, y] =eye_shadow(pixel,line_colour) 
            
    img_base.save(save_string_base) 
    if type =="eyes":    
        img_overlay.save(save_string_overlay)
    if type =="underlay":    
        img_underlay.save(save_string_underlay)    

    if type =="highlight":  
        for y in range(img_highlight.size[1]):
            for x in range(img_highlight.size[0]): 
                highlight_data[x, y] = (highlight[0],highlight[1],highlight[2],int(0.3*highlight_data[x, y][len(highlight_data[x, y])-1]))                
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

def name_string(name, list_list):
    #create a line of javascript code defining this list of lists
    s = "const "+name + " = ["
    for i in range(len(list_list)):
        s+=simple_list_string(list_list[i])
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
    content.write(list_string("eye_colours_weird", eye_colours_weird))
    content.write(list_string("outfit_colours", outfit_colours))
    content.write(list_string("outfit_brown", outfit_brown))
    content.write(list_string("skin_colours", skin_colours))
    content.write(list_string("skin_colours_weird", skin_colours_weird))
    content.write(list_string("hair_colours",hair_colours))
    content.write(list_string("hair_colours_weird",hair_colours_weird))
    content.write("\n")
    content.write(list_string("highlight_list",highlight_list))
    content.write(list_string("underlay_list",underlay_list))
    content.write("const no_render_list = [")
    for i in range(len(no_render_list)):
        content.write("[\""+no_render_list[i][0]+"\",")
        content.write(simple_list_string(no_render_list[i][1]))
        content.write("],")    
    content.write("];\n")
    content.write(name_string("scheme_list",scheme_list))
    content.write(list_string("no_fill_list", no_fill_list, ))  
    content.write(list_string("pattern_list",pattern_list))    
    content.write(list_string("skin_list", skin_list))  
    content.write(list_string("eyetype_list_f", eyetype_list_f))   
    content.write(list_string("eyetype_list_m", eyetype_list_m))  
    content.write(list_string("eyetype_list_w", eyetype_list_w))   
    content.write(list_string("chest_image_list", chest_image_list)) 
    content.write(list_string("top_nosleeves_list", top_nosleeves_list))
    content.write(list_string("overshirt_nosleeves_list", overshirt_nosleeves_list)) 
    content.write(list_string("coat_nosleeves_list", coat_nosleeves_list)) 
    content.write(list_string("no_chest_coat_list", no_chest_coat_list)) 
    content.write(name_string("hat_list",hat_list_d))
    content.write(list_string("expression_list", expression_list))   
    content.write(list_string("outfit_list", outfit_list)) 
    content.write(list_string("has_sleeves_list", has_sleeves_list)) 
    content.write(list_string("sleeve_list", sleeve_list)) 
    content.write(list_string("accessory_list", accessory_list+["hat"])) 
    content.write(list_string("defining_list", defining_list)) 
    content.write("\n")   
    for c in closet:
        if not (c.name in ["wheelchair_back","wheelchair_back_dec","wheelchair_dec",]):
            content.write(name_string(c.listname, c.list_list))
    content.write("\n")
    for c in closet:
        content.write("add_image_object(\""+c.name+"\","+ c.listname+",\""+c.location+"\","+c.box+")\n")
        if c.name in defining_list:
            content.write("add_defining_object(\""+c.name+"\","+ c.listname+")\n")
    content.write("add_defining_object(\"hat\",hat_list)\n")
    content.write("\n")    
    content.close()

def checkRender(name, item):
    for i in range(len(no_render_list)):
        if name == no_render_list[i][0]:
            if item in no_render_list[i][1]:
                return False
    return True            

def process_portrait_part(obj):
    if obj.name.endswith("_dec"): 
        loc = obj.location + "/"+obj.name[0:-4]        
    else: 
        loc = obj.location + "/"+obj.name  

    if obj.name == "chest":
        render_list = chest_image_list  
    elif obj.name == "facial_hair":
        render_list = facial_hair_list_render    
    else:
        render_list = obj.item_list
    for item in render_list:
        if checkRender(obj.name, item):     
            if item!="none":
                print(obj.name+" "+item)
                if obj.name.endswith("_dec"):
                    process_image(item, loc,"twotone")
                elif obj.name in no_fill_list:
                    process_image(item, loc,"no_fill")  
                elif (obj.name=="eyes"):
                        for type in remove_dups(eyetype_list_f+eyetype_list_m):
                            if item!="wink":
                                print(type)
                                process_image(item, loc+"/"+type,"eyes") 
                elif obj.name in highlight_list:     
                    process_image(item, loc,"highlight")     
                elif obj.name in underlay_list:     
                    process_image(item, loc,"underlay")                     
                else:    
                    process_image(item, loc,"portrait")
                


def makeWinks():
    layer_list = ["base","overlay"]
    print("Making winks")
    for eye_type in remove_dups(eyetype_list_f+eyetype_list_m):
        for layer in layer_list:
            loc = "../images/render/face/eyes/"+eye_type+"/"
            save_string = loc+"wink_"+layer+".png"
            im_happy = Image.open(loc+"happy_"+layer+".png") 
            im_crescents = Image.open(loc+"crescents_"+layer+".png") 
            box = (206,200,300,300)
            region = im_crescents.crop(box)
            im_happy.paste(region,box)
            im_happy.save(save_string)

def makeStubble():
    loc = "../../spritemaker_bases/"
    for head in head_list_u:
        save_string = "../images/render/hair/facial_hair/stubble/"+head+".png"
        print(save_string)
        img_mask = Image.open(loc+"anatomy/skull/regular_fill.png")
        img_mask.paste(Image.open(loc+"anatomy/head/"+head+"_fill.png"))
        img_blank = Image.new("RGBA", (img_mask.width, img_mask.height))
        img_stubble = Image.open(loc+"hair/facial_hair/stubble_fill.png")
        img_stubble =Image.composite(img_stubble, img_blank,img_mask) 
        img_stubble.save(save_string)

def process_all_portraits():
    for c in closet:
        process_portrait_part(c)
    #makeWinks() 
    #makeStubble()    

def runStuff():
    write_variables()

    # "skull", "head","body","legs", "ears","nose", "chest"
    # "wheelchair_back","wheelchair_back_dec", "wheelchair", "wheelchair_dec"
    # "fringe", "hair_front","hair_middle", "hair_back", "facial_hair"
    #"overshirt","overshirt_sleeves","overshirt_dec"
    # "coat","coat_sleeves","coat_dec","coat_back"
    #"top","top_sleeves","top_dec","top_collar"
    for c in closet:
        if c.name in ["shoes"]:
            process_portrait_part(c)
    makeWinks()
    #makeStubble() 

    #makeSwatches()
        
    #process_all_portraits()
    #make_coat()

runStuff()
