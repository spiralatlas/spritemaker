from __future__ import print_function
import sys
import math
import imagemodule
from PIL import Image, ImageDraw, ImageFilter
from PIL import ImageEnhance

# python3 generate_images.py
# Python scripts to create images for dollmaker from the images in ../spritemaker_bases
# Which I have not uploaded because it's a lot of files!    
  
def remove_dups(l):
        #removes duplicates from a list
        return list( dict.fromkeys(l) )
         
def simple_list_string(list):
    s = "["
    for l in list:
        s+="\""+l+"\","
    s+="]"
    return s

def list_string(listname, list):
    # Creates a string of javascript code which defines listname as containing the elements of list
    return "const "+listname + " = "+simple_list_string(list)+";\n"

def default_list(l):
    ## input for add_item
    ## format is [male list, female list, weird list, decs, masks, whether male items should be first]
    return [l,l, [],[],[],True]   

pattern_list = ["none",
        "crocodile","rose", "flowers", "snake","damask", "camoflage", "clouds", #repeated fractal
        "crosshatch","fabric","dirty","spots",  #repeated naturalistic
        "diamonds","small diamonds","tartan",  "polkadot","kimono", #repeated pattern
        "horizontal stripe","vertical stripe","pinstripe","horizontal pinstripe","net","diagonal",] #lines "verticalstripe", "horizontalstripe", "diagonal","net",

## format is [male list, female list, weird list, decs, masks, whether male items should be first]

basic_chest_list = ["none", "small","medium","big"]   
body_chest_list = basic_chest_list
body_chest_list_d = [body_chest_list,["none"], [],[],[],True]
top_chest_list_d = [basic_chest_list,["none"], [],[],[],True]  
overshirt_chest_list_d = [basic_chest_list,["none"], [],[],[],True]  
coat_chest_list_d = [basic_chest_list,["none"], [],[],[],True]  

chair_list = [ "none","invisible", "manual"]
chair_list_w = []
chair_list_d = [chair_list,chair_list,chair_list_w,["manual"],[],True]

head_list_u = ["small", "round","jowly", "medium", "pointed","gaunt", "rectangular",]
head_list_d = default_list(head_list_u)

skull_list = ["regular"]
skull_list_d = default_list(skull_list)

ear_list_u = ["none","regular","pointed","very pointed"]
ear_list_w = ["none","pointed","very pointed"]
ear_list_d = [ear_list_u,ear_list_u,ear_list_w,[],[],True]

body_list = ["regular"]
body_list_d = default_list(body_list)

leg_list_d = default_list(["none"]+body_list)

chair_leg_list_d = default_list(["none"]+body_list)

eyetype_list_u = ["medium eyelashes","down-turned","up-turned", "pointed", "animal"]
eyetype_list_m = ["short eyelashes"]+ eyetype_list_u
eyetype_list_f = eyetype_list_u+["long eyelashes"]
eyetype_list_w = ["animal"]
eyetype_list_d = [eyetype_list_f,eyetype_list_m,eyetype_list_w,[],[],True]
eyetype_irisless_list = eyetype_list_w #has no iris

eyeshape_list = ["neutral","side","crescents","flat", "narrowed","happy","wide","shock","angry","angry side","sleepy","wink","rolled"]
eyes_list_d = default_list(eyeshape_list)

eyebrows_list_u = ["flat","flat sad","flat grumpy","flat angry","sad","sadder", "semi sad", "regular","semi arch","arched","raised arch", "raised","raised flat", "raised semi flat","raised grumpy","raised semi","angry", "angry arch","half raised","half semi", "half sad","half sad raised","half flat","half arch raised"]
eyebrows_list_d = default_list(eyebrows_list_u)

mouth_list_u = ["lah", "small lah", "tiny lah", "big grin","pointy grin", "grin","side grin","side smile","big smile","big side smile","wide flat smile","tongue out","pointy smile", "wobbly smile", "flat smile","smile","small smile","tiny smile","slight smile","side eww","eww",  "oh","square oh","big oh", "small oh","shock","small flat","flat","small clenched", "wobbly frown","tiny frown","small frown","narrow frown","frown","low moue","moue","pout","side frown","big frown",]
mouth_list_d = default_list(mouth_list_u)

nose_list_u = ["none", "nostrils","button", "round","medium","flat", "broad", "pointed","hooked",] 
nose_list_d = [nose_list_u,nose_list_u,["none","nostrils"],[],[],True]

cheeks_list_underlay = ["sweat drop"]
cheeks_list_u = ["none","blush", "big blush"]+ cheeks_list_underlay
cheeks_list_d = default_list(cheeks_list_u)

complexion_list_u = ["none","slight lines", "freckles","wrinkles","gaunt", "eye mole","mouth mole","eye scar", "cheek scar", "burn"]
complexion_list_d = default_list(complexion_list_u)

eyewear_list_u = [ "eye patch","oblong wireframes","coloured wireframes", "oblong glasses","square glasses","round glasses","coloured spectacles","spectacles","sunglasses","coloured glasses","domino mask","face mask"] 
eyewear_list_f = ["none",]+eyewear_list_u+["bindi","huadian"]
eyewear_list_m = ["none","monocle"]+eyewear_list_u
eyewear_list_w = ["monocle","spectacles","coloured spectacles", "eye patch","domino mask","huadian"]
eyewear_list_decs = ["coloured spectacles","coloured glasses"]
eyewear_list_d =  [eyewear_list_f,eyewear_list_m, eyewear_list_w,eyewear_list_decs,[],True]

earrings_list_u = ["none","stud","small hoops","punk","earpiece"]
earrings_list_f = earrings_list_u+["hoops", "circle earrings", "drop earrings", "round earrings"]
earrings_list_m = earrings_list_u+[]
earrings_list_w = []
earrings_list_decs = ["round earrings"]
earrings_list_d =  [earrings_list_f,earrings_list_m, earrings_list_w,earrings_list_decs,[],True]

gloves_list_u = ["short gloves","wrist guards","wrist wraps"]
gloves_list_f = ["none", "medium gloves", "bracelets"]+gloves_list_u
gloves_list_m = ["none", "fingerless"]+gloves_list_u
gloves_list_w = ["wrist guards","wrist wraps"]
gloves_list_d = [gloves_list_f,gloves_list_m,gloves_list_w,[],[],True]

back_list_u = ["none","thin tail","fluffy tail", "sword","katanas"]
back_list_f = back_list_u+[]
back_list_m= back_list_u+[] 
back_list_w = ["fluffy tail","thin tail","sword","katanas"]
back_list_d = [back_list_f,back_list_m,back_list_w,[],[],True]

top_list_u = ["vest","tee", "chinese collar","turtleneck","kimono" ]
top_list_f = ["none","bikini","strapless", "crop top","square", "corset","sweetheart", "boatneck","gathered","low vee","sailor shirt"]+top_list_u
top_list_m= ["none",]+top_list_u+["open shirt","button up", "high collar shirt"] 
top_list_w = ["high collar shirt","corset",]
top_list_decs = ["square","gathered","low vee","corset",]
top_list_mask = []
top_list_d = [top_list_f,top_list_m,top_list_w,top_list_decs,top_list_mask,False]
top_nosleeves_list = ["none", "bikini", "vest","strapless",]

top_collar_list = ["open shirt","button up","high collar shirt","sailor shirt"] 
top_collar_list_decs = ["sailor shirt"]
top_collar_list_d = [top_collar_list,top_collar_list,[], top_collar_list_decs, [],True]

top_sleeve_list_u = ["sleeveless", "cap","short","three quarter", "long", "broad","ragged"]
top_sleeve_list_f = top_sleeve_list_u+["puffy","bell","leg of mutton","flounce"]
top_sleeve_list_m = top_sleeve_list_u+["puffy shirt", "long shirt","rolled"]
top_sleeve_list_w = ["puffy", "puffy shirt","bell","leg of mutton","ragged","flounce"]
top_sleeve_list_decs = []
top_sleeve_list_d = [top_sleeve_list_f,top_sleeve_list_m,top_sleeve_list_w,top_sleeve_list_decs,[],True]

overshirt_list_u = ["band","band with flap","button up vee", "open shirt", "vee","sweater"]
overshirt_list_f = ["none","obi"] +overshirt_list_u +["square"]
overshirt_list_m = overshirt_list_u + []
overshirt_list_w = ["obi", "band","band with flap"]
overshirt_list_decs = ["button up vee", "band","band with flap"]
overshirt_list_mask = []
overshirt_list_d = [overshirt_list_f, overshirt_list_m,overshirt_list_w,overshirt_list_decs,overshirt_list_mask,False]
overshirt_nosleeves_list = ["none","obi", "band","band with flap"]

overshirt_sleeve_list_u = ["sleeveless","cap","short","long"]
overshirt_sleeve_list_f = overshirt_sleeve_list_u+[]
overshirt_sleeve_list_m = overshirt_sleeve_list_u+[]
overshirt_sleeve_list_w = []
overshirt_sleeve_list_d = [overshirt_sleeve_list_f, overshirt_sleeve_list_m, overshirt_sleeve_list_w,[],[],True]

bottom_list_u = ["none","briefs",]
bottom_list_f = bottom_list_u+["short skirt","puffy full short skirt","medium skirt","puffy full medium skirt","long skirt","puffy full long skirt","puffy full long split skirt","empire skirt", "puffy short kilt","short kilt","kilt","long kilt", "tube skirt","ragged skirt"]
bottom_list_m = bottom_list_u+["shorts", "breeches","trousers","ragged trousers"]
bottom_list_w = ["breeches","tube skirt","briefs","long kilt","empire skirt","ragged trousers","ragged skirt"]
bottom_list_decs = ["puffy short kilt","puffy full long split skirt"]
bottom_list_d = [bottom_list_f, bottom_list_m, bottom_list_w,bottom_list_decs,[],False]

waistline_list_u=["invisible","gathered","button fly","double pointed"]
waistline_list_f = waistline_list_u+["low","high","empire","band","pointed"]
waistline_list_m = waistline_list_u+["suspenders","fall front","overalls","belt"]
waistline_list_w = ["fall front","empire","pointed"]
waistline_list_decs = ["suspenders","belt","pointed"]
waistline_list_d = [waistline_list_f,waistline_list_m,waistline_list_w,waistline_list_decs,[],True]

neckwear_list_u = ["none", "cravat bow", "bandanna", "scarf","kerchief","long scarf","chains","amulet"]  
neckwear_list_f = [ "none", "beaded necklace","choker","pendant","jewelled necklace","beads","bow","fur collar"] + neckwear_list_u
neckwear_list_m = neckwear_list_u+["cravat","tie","bow tie"]
neckwear_list_w = ["cravat bow","bandanna","chains","amulet"]
neckwear_list_decs = ["jewelled necklace","beaded necklace","amulet"]
neckwear_list_d = [neckwear_list_f, neckwear_list_m,neckwear_list_w,neckwear_list_decs,[],True]

coat_list_u = ["open sweater", "cape", "medium cloak", "short jacket", "open robe","closed robe", "long open jacket"]
coat_list_f = ["none","wrap"]+coat_list_u+["dress jacket","bolero"]
coat_list_m = ["none","hoodie", "cool jacket","business jacket",]+coat_list_u+["buttoned jacket","overcoat","jama",]  
coat_list_w = ["medium cloak","jama","open robe","closed robe","cape",]
coat_list_decs = ["dress jacket","jama",] 
coat_list_d = [coat_list_f, coat_list_m, coat_list_w,coat_list_decs,[],True]
coat_nosleeves_list = ["none", "wrap", "medium cloak","cape",]

coat_sleeve_list_u = ["sleeveless","cap", "short","scrunched", "long", "long blocky","broad","trailing"]
coat_sleeve_list_f = coat_sleeve_list_u+[]
coat_sleeve_list_m = coat_sleeve_list_u+[]
coat_sleeve_list_w = ["broad","trailing"]
coat_sleeve_list_d = [coat_sleeve_list_f, coat_sleeve_list_m, coat_sleeve_list_w,[],[],True]

hat_middle_list_u =["cat ears","curled horns","pointed horns",]
hat_middle_list_f = ["none","beads","head band","side bow","bow","tiara","scarf"]+hat_middle_list_u
hat_middle_list_m = ["none","sweat band"]+hat_middle_list_u
hat_middle_list_w = ["beads","cat ears","curled horns","pointed horns","tiara"]
hat_middle_list_d = [hat_middle_list_f, hat_middle_list_m, hat_middle_list_w,[],[],False]

hat_front_list_u =["crown","witch hat","broad hat","beanie","hood",]
hat_front_list_f = ["none", "flower","flower crown","bandanna","hijab",]+hat_front_list_u
hat_front_list_m = ["none","top hat","cap","bowler","fedora","turban"]+hat_front_list_u
hat_front_list_w = ["hood", "top hat","witch hat","bowler","flower crown","crown"]
hat_front_list_decs = ["bowler","broad hat","fedora","witch hat","top hat","crown"]
hat_front_list_d = [hat_front_list_f, hat_front_list_m, hat_front_list_w,hat_front_list_decs,[],False]

hat_list_d = [remove_dups(hat_middle_list_f+hat_front_list_f),remove_dups(hat_middle_list_m+hat_front_list_m),remove_dups(hat_middle_list_w+hat_front_list_w),[],[],True]

socks_list_u = ["none","ankle high","mid calf"]
socks_list_m = socks_list_u  
socks_list_f = socks_list_u +["knee high","thigh high","tights"] 
socks_list_w = []
socks_list_d = [socks_list_f, socks_list_m, socks_list_w,[],[],True]

shoes_list_u = ["none","sandals","slip ons","sneakers"]
shoes_list_m = shoes_list_u +["boots"]
shoes_list_f = shoes_list_u +["pumps","mary janes","high boots",] 
shoes_list_w = []
shoes_list_decs = ["boots","sneakers" ]
shoes_list_d = [shoes_list_f, shoes_list_m, shoes_list_w,shoes_list_decs,[],False]

hair_extra_list_u = ["none","topknot"]
hair_extra_list_f = hair_extra_list_u+ ["straight high pony","straight low pony", "curly pony", "small curly pony","low curly pony","bun","fancy bun","locs bun","little bun","little buns", "twin braids","twintails","long twintails","low twintails","twin puffs", "side straight pony","long side straight pony", "locs pony"]
hair_extra_list_m = hair_extra_list_u+["little braid"]
hair_extra_list_w = ["fancy bun","topknot"] 
hair_extra_list_d = [hair_extra_list_f, hair_extra_list_m, hair_extra_list_w,[],[],True]

hair_back_list = ["none","balding", "buzzcut","straight short","curly short","wavy short", "straight side", "fade", "shaggy short", "tight curls short","tight curls medium", "shaggy medium", "curly bob","wavy bob", "straight bob","locs bob", "half up medium wavy", "straight long","wavy long","shaggy long", "curly long", "tight curls long", "long locs",  "curly flowing", "straight flowing","straight up","curly up","locs up"]
hair_back_list_d = default_list(hair_back_list)

hair_middle_list = ["none", "shaved", "balding","cornrows","short","long","long shadowed"]
hair_middle_list_d = default_list(hair_middle_list)

hair_front_list = ["none", "balding", "neat side", "fade", "long locs","curly flowing","curly long","straight half up","bob half up", "straight flowing","locs bun", "locs bob","short locs","cornrows"]
hair_front_list_d = default_list(hair_front_list)

sidelocks_list_u = ["short straight", "short hime","short wavy", "short curls","short locs"]
sidelocks_list_f = ["none"]+sidelocks_list_u+["short hime", "medium hime",  "medium locs","medium wavy", "medium straight","medium straight tendril","medium wavy tendril","medium curly tendril","long straight", "long wavy","long shaggy", "long curly","long locs",]
sidelocks_list_m = ["none","tiny curls", "tiny straight", "tiny locs", "medium shaggy", ]+sidelocks_list_u
sidelocks_list_w =[]
sidelocks_list_d = [sidelocks_list_f, sidelocks_list_m, sidelocks_list_w,[],[],True]

fringe_list_u = ["none", "scattered wisps","wisps","straight short", "shaggy short", "curly short","straight blunt", "wavy blunt","curly blunt", "locs blunt", "soft curls", "straight side short", "wavy side short","straight tendrils", "wavy tendrils", "tight curls tendrils", "straight centre","straight clump", "curly clump", "straight curtains","wavy curtains","curly curtains","locs curtains", "straight uneven","wavy uneven","locs uneven"]
fringe_list_m = fringe_list_u+["spiked up", "straight flop", "princely","straight side short","wavy side short"]
fringe_list_f = fringe_list_u+["straight choppy", "straight medium", "wavy centre","curly tendrils","curly long", "long wavy side","long locs",]#"straight long","wavy long"
fringe_list_w =[]
fringe_list_d = [fringe_list_f, fringe_list_m, fringe_list_w,[],[],True]

facial_hair_list_f = ["none"]
facial_hair_list_m = ["none", "beard", "moustache", "goatee", "soul patch", "fluffy goatee", "stubble"]
facial_hair_list_w = []
facial_hair_list_d = [facial_hair_list_f,facial_hair_list_m,facial_hair_list_w,[],[],True]
facial_hair_list_render = [f for f in facial_hair_list_m if f!="stubble"]

# collections of parts that have the same colours and patterns
skin_list_defining = ["body","nose","mouth","eyebrows","complexion","ears","body_chest"]#same colour as head
skin_list = skin_list_defining + ["skull","chair_body","nose_front"]
expression_list = ["cheeks", "mouth","eyebrows","eyes"]
accessory_list = ["eyewear","neckwear", "earrings", "gloves","back"]
outfit_list = [ "bottom","top", "overshirt", "coat", "socks","shoes"]
chairOn = False
if chairOn:
    outfit_list = outfit_list +["chair"]
has_sleeves_list = ["top","overshirt","coat"]
sleeve_list = [x +"_sleeves" for x in has_sleeves_list]
defining_list = remove_dups(accessory_list+ outfit_list+sleeve_list+skin_list_defining+expression_list+["fringe","hair_extra", "sidelocks", "facial_hair", "head","waistline","chair"])

#extra info

no_chest_coat_list = [ "robe","robe hood",  "medium cloak", "medium cloak hood", "long cloak", "long cloak hood","wrap","cape",] #clothes where the chest doesn't show
no_chest_overshirt_list = overshirt_nosleeves_list
no_fill_list = ["mouth"] #lined items with no coloured fill

hat_back_list = ["none","bandanna","beanie","bowler","broad hat","cap","fedora","top hat","witch hat","top hat","scarf","turban","hood"]
hat_back_list_decs = ["scarf"]
hat_back_list_d = [hat_back_list,hat_back_list,[],hat_back_list_decs,[],True]
coat_back_list = ["none","medium cloak","wrap","cape", "bolero", "overcoat","short jacket","dress jacket","business jacket","buttoned jacket","cool jacket", "open robe","closed robe", "open sweater", "long open jacket", "hoodie"] 
coat_back_list_d = default_list(coat_back_list) 

neckwear_front_list = ["bow", "cravat bow","bow tie", "bandanna"]
neckwear_front_list_d = default_list(neckwear_front_list)

neckwear_front2_list = [ "scarf","long scarf","fur collar"]
neckwear_front2_list_d = default_list(neckwear_front2_list)

chair_socks_list_d = socks_list_d
chair_shoes_list_d = shoes_list_d
chair_bottom_list_d = bottom_list_d
chair_overshirt_list = ["band with flap"]
chair_overshirt_list_d = [chair_overshirt_list,chair_overshirt_list,[], chair_overshirt_list,[],True]
long_coat_list = ["overcoat", "closed robe", "open robe", "dress jacket","jama"] 
chair_coat_list = long_coat_list
chair_coat_list_d = default_list(chair_coat_list)
chair_coat_back_list =[c for c in long_coat_list if c in coat_back_list]
chair_coat_back_list_d = default_list(chair_coat_back_list)

highlight_list = ["fringe"]
underlay_list = ["eyewear"]
hourglass_list = ["top","overshirt","waistline","body"]
butt_list = ["shoes", "body","coat","bottom","socks","overshirt"]
no_render_list = [["hat_middle",["scarf"]],["hat_front_dec",["scarf"]],["chair",["invisible"]],["chair_back",["invisible"]],["chair_dec",["invisible"]],["chair_back_dec",["invisible"]]]

###################### More technical stuff from here on

closet = [] # list of lists of information about items of clothing etc

class ClothingItem:

    # name: string describing item type, eg "hat"
    # item_list: list of strings with names of items, eg hat_list as defined elsewhere
    # location: string describing where the image files are,
    #           eg "clothes" because hat images are stored in the folder clothes/hat

    def __init__(self,name,listname, list_list, location):
        self.name =  name
        self.listname = listname
        self.list_list = list_list
        self.item_list = remove_dups(list_list[0]+list_list[1])
        self.dec_list = list_list[3]
        self.location = location

def add_item(name, listname, list_list,location):
    # Add an item to the closet
    global  closet

    closet.append(ClothingItem(name, listname,list_list, location))

## Adding all the data to closet

add_item("chair_back", "chair_back_list_d", chair_list_d,"chair")
add_item("back", "back_list_d",back_list_d, "clothes")
add_item("hat_back", "hat_back_list_d",hat_back_list_d, "clothes/hat")
add_item("hair_extra", "hair_extra_list_d",hair_extra_list_d, "hair")
add_item("hair_back", "hair_back_list_d",hair_back_list_d, "hair")
add_item("coat_back", "coat_back_list_d",coat_back_list_d, "clothes/coat")
add_item("body", "body_list_d", body_list_d, "anatomy")
add_item("body_chest", "body_chest_list_d", body_chest_list_d, "anatomy/chest")

add_item("socks", "socks_list_d", socks_list_d, "clothes")
add_item("shoes", "shoes_list_d", shoes_list_d, "clothes")
add_item("gloves", "gloves_list_d", gloves_list_d, "clothes")
add_item("top_sleeves", "top_sleeve_list_d", top_sleeve_list_d, "clothes/top")
add_item("top", "top_list_d", top_list_d, "clothes")
add_item("top_chest", "top_chest_list_d", top_chest_list_d, "anatomy/chest")

add_item("overshirt_sleeves", "overshirt_sleeve_list_d", overshirt_sleeve_list_d, "clothes/overshirt")
add_item("coat_sleeves", "coat_sleeve_list_d", coat_sleeve_list_d, "clothes/coat")

add_item("bottom", "bottom_list_d", bottom_list_d, "clothes")
add_item("waistline", "waistline_list_d", waistline_list_d, "clothes")
add_item("neckwear", "neckwear_list_d", neckwear_list_d, "clothes")

add_item("overshirt", "overshirt_list_d", overshirt_list_d, "clothes")
add_item("overshirt_chest", "overshirt_chest_list_d", overshirt_chest_list_d, "anatomy/chest")
add_item("top_collar", "top_collar_list_d", top_collar_list_d, "clothes/top")
add_item("neckwear_front", "neckwear_front_list_d", neckwear_front_list_d, "clothes/neckwear")

add_item("coat", "coat_list_d", coat_list_d, "clothes")
add_item("coat_chest", "coat_chest_list_d", coat_chest_list_d, "anatomy/chest")
add_item("neckwear_front2", "neckwear_front2_list_d", neckwear_front2_list_d, "clothes/neckwear")

add_item("sidelocks", "sidelocks_list_d", sidelocks_list_d, "hair")
add_item("hijab_front", "hijab_front_list_d", default_list(["none","hijab"]), "clothes/hat")

add_item("skull", "skull_list_d", skull_list_d, "anatomy")
add_item("head", "head_list_d", head_list_d, "anatomy")
add_item("hair_middle", "hair_middle_list_d", hair_middle_list_d, "hair")
add_item("ears", "ear_list_d", ear_list_d, "anatomy")
add_item("earrings", "earrings_list_d", earrings_list_d, "clothes")
add_item("nose", "nose_list_d", nose_list_d, "face")
add_item("complexion", "complexion_list_d", complexion_list_d, "face")
add_item("cheeks", "cheeks_list_d", cheeks_list_d, "face")

add_item("mouth", "mouth_list_d", mouth_list_d, "face")
add_item("eyebrows", "eyebrows_list_d", eyebrows_list_d, "face")
add_item("eyes", "eyes_list_d", eyes_list_d, "face")

add_item("facial_hair", "facial_hair_list_d", facial_hair_list_d, "hair")
add_item("nose_front", "nose_front_list_d", nose_list_d, "face/nose")
add_item("hair_front", "hair_front_list_d", hair_front_list_d, "hair")
add_item("eyewear", "eyewear_list_d", eyewear_list_d, "clothes")
add_item("hat_middle", "hat_middle_list_d", hat_middle_list_d, "clothes/hat")
add_item("sidelocks_repeat", "sidelocks_repeat_list_d", sidelocks_list_d, "hair")
add_item("fringe", "fringe_list_d", fringe_list_d, "hair")
add_item("hat_front", "hat_front_list_d", hat_front_list_d, "clothes/hat")

add_item("chair", "chair_list_d", chair_list_d, "chair")
add_item("chair_coat_back", "chair_coat_back_list_d", chair_coat_back_list_d, "chair")
add_item("chair_body", "chair_leg_list_d", chair_leg_list_d, "chair")
add_item("chair_socks", "chair_socks_list_d", chair_socks_list_d, "chair")
add_item("chair_shoes", "chair_shoes_list_d", chair_shoes_list_d, "chair")
add_item("chair_bottom", "chair_bottom_list_d", chair_bottom_list_d, "chair")
add_item("chair_overshirt", "chair_overshirt_list_d", chair_overshirt_list_d, "chair")
add_item("chair_coat", "chair_coat_list_d", chair_coat_list_d, "chair")

def name_string(name, list_list):
    #create a line of javascript code defining this list of lists
    s = "const "+name + " = ["
    for i in range(len(list_list)-1):
        s+=simple_list_string(list_list[i])
        s+=","   
    if name !="scheme_list":  #I forget what this Boolean is for >.>   
        if list_list[len(list_list)-1]:
            s+="true" 
        else:
            s+="false"     
    s+="];\n"
    return s 

def presetString(location, namelist):
    path = "../../spritemaker_bases/save files/"+location+"/"
    keys = ["dark_theme","current_tab_type","current_expression_type","current_clothingname","current_accessoryname","current_export_image_type","current_gender_type","current_size_type","current_head_ratio_type","crop_height","current_character_preset","current_expression_preset","isWeirdOutfit","isWeirdBody"]
    keys += ["current_hairstyle", "current_waist_type", "current_eyetype", "current_defining_objects", "name", "value_list","colour1","colour2","patterncolour","pattern","item_list","item_indices_f","item_indices_m","item_indices_w","image_index","colour_children","colour2_children","value_children"]
    output = "const "+location+"_preset_defining_list=[ [],"
    for name in namelist:
        if name!="None":
            with open(path+name+".json") as f:
                lines = f.readlines()
            fixed_lines =""
            for l in lines:    
                if l[0]!="/" and l[0]!="\n":
                    fixed_lines += l.replace("{","\n{")  
            #for k in keys:
            #    fixed_lines = fixed_lines.replace("\""+k+"\"",k)
    
            output += fixed_lines+",\n\n"#"{preset_name:\""+name+"\","+fixed_lines[1:]+",\n\n"   
    output +="];\n\n"
    return output


def write_variables():
    # Write all the shared variables into generated.js

    content = open("generated.js","w")
    content.write("//generated by generate_images.py\n\n")
    if chairOn:
        content.write("const chairOn = true;\n")
    else:    
        content.write("const chairOn = false;\ntesting = false;")
    content.write(list_string("eye_colours", imagemodule.eye_colours))
    content.write(list_string("eye_colours_weird", imagemodule.eye_colours_weird))
    content.write(list_string("outfit_colours", imagemodule.outfit_colours))
    content.write(list_string("outfit_brown", imagemodule.outfit_brown))
    content.write(list_string("skin_colours", imagemodule.skin_colours))
    content.write(list_string("skin_colours_weird", imagemodule.skin_colours_weird))
    content.write(list_string("hair_colours",imagemodule.hair_colours))
    content.write(list_string("hair_colours_weird",imagemodule.hair_colours_weird))
    content.write("\n")
    content.write(list_string("highlight_list",highlight_list))
    content.write(list_string("underlay_list",underlay_list))
    content.write("const no_render_list = [")
    for i in range(len(no_render_list)):
        content.write("[\""+no_render_list[i][0]+"\",")
        content.write(simple_list_string(no_render_list[i][1]))
        content.write("],")    
    content.write("];\n")
    content.write(name_string("scheme_list",imagemodule.scheme_list))
    content.write(list_string("no_fill_list", no_fill_list, ))  
    content.write(list_string("pattern_list",pattern_list))    
    content.write(list_string("skin_list", skin_list))  
    content.write(list_string("skin_list_defining", skin_list_defining))  
    content.write(list_string("eyetype_list_f", eyetype_list_f))   
    content.write(list_string("eyetype_list_m", eyetype_list_m))  
    content.write(list_string("eyetype_list_w", eyetype_list_w))  
    content.write(list_string("eyetype_irisless_list", eyetype_irisless_list ))
    content.write(list_string("cheeks_list_underlay", cheeks_list_underlay ))  
    content.write(list_string("top_nosleeves_list", top_nosleeves_list))
    content.write(list_string("overshirt_nosleeves_list", overshirt_nosleeves_list)) 
    content.write(list_string("coat_nosleeves_list", coat_nosleeves_list)) 
    content.write(list_string("no_chest_coat_list", no_chest_coat_list)) 
    content.write(list_string("no_chest_overshirt_list", no_chest_overshirt_list)) 
    content.write(name_string("hat_list",hat_list_d))
    content.write(list_string("expression_list", expression_list))   
    content.write(list_string("outfit_list", outfit_list)) 
    content.write(list_string("has_sleeves_list", has_sleeves_list)) 
    content.write(list_string("hourglass_list", hourglass_list)) 
    content.write(list_string("butt_list", butt_list)) 
    content.write(list_string("sleeve_list", sleeve_list)) 
    content.write(list_string("accessory_list", accessory_list+["hat"])) 
    content.write(list_string("defining_list", defining_list)) 
    content.write("\n")   
    for c in closet:
        content.write(name_string(c.listname, c.list_list))
        if c.dec_list !=[]:      
            content.write(name_string(c.listname+"_dec", [c.list_list[3],c.list_list[3],[],[],[],True]))  
    content.write("\n")
    for c in closet:
        content.write("add_image_object(\""+c.name+"\","+ c.listname+",\""+c.location+"\")\n")
        if c.name in defining_list:
            content.write("add_defining_object(\""+c.name+"\","+ c.listname+")\n")
        if c.dec_list !=[]:    
            content.write("add_image_object(\""+c.name+"_dec\","+ c.listname+"_dec,\""+c.location+"\")\n")    
    content.write("add_defining_object(\"hat\",hat_list)\n")
    content.write("\n") 
    for c in closet:
        content.write("const "+c.name+"_im = findNameMatch(image_objects,\""+c.name+"\");")
        if c.name in defining_list:
            content.write("const "+c.name+"_def = findNameMatch(defining_objects,\""+c.name+"\");")
        if c.dec_list !=[]:   
            content.write("const "+c.name+"_dec_im = findNameMatch(image_objects,\""+c.name+"_dec\");")   
    
    expression_preset_list =  ["None", "Default", "Understated", "Energetic","Arch"] 
    content.write(list_string("expression_preset_list", expression_preset_list))  
    content.write(presetString("expression", expression_preset_list))
    character_preset_list =  ["None", "Beach Babe", "Scientist", "student", "Jock","Ninja", "Demon", "Detective","Dad", "Wizard", "Righteous Cultivator", "Lord", "Starlet","Middle School Girl","Festival Girl","Grandma", "Mum", "Lady"] 
    content.write(list_string("character_preset_list", character_preset_list))  
    content.write(presetString("character", character_preset_list))    
    content.close()

def checkRender(name, item):
    for i in range(len(no_render_list)):
        if name == no_render_list[i][0]:
            if item in no_render_list[i][1]:
                return False
    return True                        

def makeWinks():
    print("Making winks")
    for eye_type in remove_dups(eyetype_list_f+eyetype_list_m):
        if eye_type in eyetype_irisless_list:
            layer_list = ["base","multiply_blue"]
        else:
            layer_list = ["base","overlay"]
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

def makeHourglass():
    print("Making hourglasses")
    for h in hourglass_list:
        process_image(h, "anatomy/hourglass","regular")
        process_image(h+"_mask", "anatomy/hourglass","no_fill")
    process_image("waistline", "anatomy/hourglass/full","regular")
    process_image("waistline_mask", "anatomy/hourglass/full","no_fill")    

def makeButts():
    print("Making butts")
    for b in butt_list:
        process_image(b, "anatomy/butt","regular")
        process_image(b+"_mask", "anatomy/butt","no_fill")
    process_image("bottom", "anatomy/butt/full","regular")
    process_image("bottom_mask", "anatomy/butt/full","no_fill")     
    process_image("coat_wide", "anatomy/butt","regular")
    process_image("coat_wide_mask", "anatomy/butt","no_fill")        

def makeChairParts():
    # (save, thighs, base, mask, lines, type)
    for obj in closet:
        if obj.name == "body":
            print("Making legs!")  
            imagemodule.makeChairPart("chair_body/regular", "body","anatomy/body/regular", "anatomy/body/regular", "anatomy/body/regular","base")
        else:
            makeLegs = True
            for item in obj.item_list:
                if item!="none":
                    save = "chair_"+obj.name+"/"+item
                    thighs = "body"
                    base = obj.location + "/"+obj.name +"/"+item
                    mask = "none"
                    lines = "none"
                    if obj.name=="shoes": 
                        thighs = "none"
                        mask = "none"
                        lines = "none"
                    elif obj.name == "socks":
                        mask = "anatomy/body/regular" 
                        lines = "anatomy/body/regular"  
                        if item =="tights":
                            thighs = "body"
                        elif item =="thigh high":
                            thighs = "socks"    
                        else:
                            thighs = "none"  
                        if item =="knee high":
                            mask ="none"
                            lines = "none"
                    
                    elif obj.name == "bottom":
                        mask = "clothes/bottom/regular" 
                        lines = "clothes/bottom/regular"     
                        if item in ["trousers","breeches"]:
                            mask = "clothes/bottom/"+item 
                            lines = "clothes/bottom/pants" 
                            thighs = "pants" 
                        elif item in ["shorts","ragged trousers","ragged skirt","briefs"]:
                            thighs = item   
                            mask = "all" 
                        elif (item.find("short kilt")>-1) or item =="kilt":
                            thighs ="short kilt" 
                            mask = "all"      
                        elif item.find("short")>-1 or item.find("medium")>-1:
                            if item.find("full")>-1:
                                thighs ="short full skirt"
                            else:    
                                thighs ="short skirt" 
                            mask = "all"       
                        else:
                            if item.find("full")>-1:
                                thighs ="full skirt"
                            else:
                                thighs ="skirt" 
                            if item =="long kilt":
                                mask ="clothes/bottom/long kilt"
                                lines ="clothes/bottom/long kilt"
                            if item in ["tube skirt"]:
                                mask ="clothes/bottom/narrow"
                                lines ="clothes/bottom/narrow"    
                            elif item.find("split")>-1:
                                mask ="clothes/bottom/dec" 
                                lines ="clothes/bottom/dec" 
                    elif obj.name == "overshirt":
                        if item in chair_overshirt_list:
                            thighs = "none" 
                            mask = "clothes/overshirt/regular" 
                            lines = "clothes/overshirt/regular"       
                        else:
                            thighs = "none"
                            mask = "all" 
                            lines = "none" 
                    elif obj.name == "coat":
                        if item in long_coat_list:
                            thighs = "coat" 
                            mask = "clothes/coat/regular" 
                            lines = "clothes/coat/regular"       
                        else:
                            thighs = "none"
                            mask = "all" 
                            lines = "none" 
                    elif obj.name == "coat_back":
                        if item in long_coat_list:
                            thighs = "coat" 
                            mask = "clothes/coat/regular" 
                            lines = "clothes/coat/regular"       
                        else:
                            thighs = "none"
                            mask = "all" 
                            lines = "none"            
                    else:
                        makeLegs = False
                    if makeLegs:      
                        print(obj.name+": "+item)  
                        imagemodule.makeChairPart(save, thighs, base, mask, lines,"base")
            makeLegs = True
            for item in obj.dec_list:
                if item!="none":   
                    save = "chair_"+obj.name+"/"+item
                    thighs = "none"
                    base = obj.location + "/"+obj.name +"/"+item
                    mask = "none"
                    lines = "none" 
                    if obj.name=="shoes": 
                        mask = "none"
                        lines = "none"        
                    elif obj.name == "bottom":
                        if item.find("short")>-1 or item.find("medium")>-1:
                            mask = "all"   
                        else:    
                            mask = "clothes/bottom/dec" 
                            lines ="clothes/bottom/dec" 
                    elif obj.name == "overshirt":# and item in chair_overshirt_list:
                        mask = "clothes/overshirt/regular" 
                        lines ="clothes/overshirt/regular"    
                    elif obj.name == "coat" and item in chair_coat_list:
                        mask = "clothes/coat/regular" 
                        lines ="clothes/coat/regular"             
                    else:
                        makeLegs = False
                    if makeLegs:      
                        print(obj.name+"_dec: "+item)  
                        imagemodule.makeChairPart(save, thighs, base, mask, lines, "dec")
        
def process_image(name, location,type):
    return imagemodule.process_image(name, location,type)

def process_portrait_part(obj):   
    if obj.name.endswith("_repeat"): 
        loc = obj.location + "/"+obj.name[0:-6]          
    else: 
        loc = obj.location + "/"+obj.name  

    #if obj.name == "facial_hair":
    #    render_list = facial_hair_list_render 
    if obj.name in ["waistline"]:
        render_list = obj.item_list+["split"]       
    else:
        render_list = obj.item_list
    for item in obj.dec_list:
        print(obj.name+" "+item+" dec")
        process_image(item, loc,"dec")
        if obj.name =="waistline":
            process_image(item, loc+"/full","dec")
    if obj.name =="waistline":         
        process_image("split", loc+"/full","dec")              
    for item in render_list:
        if checkRender(obj.name, item):     
            if item!="none":
                print(obj.name+" "+item)
                if obj.name in no_fill_list:
                    process_image(item, loc,"no_fill")  
                elif (obj.name=="eyes"):
                        for type in remove_dups(eyetype_list_f+eyetype_list_m):
                            if item!="wink":
                                print(type)
                                if type in eyetype_irisless_list:
                                    process_image(item, loc+"/"+type,"regular") 
                                else:  
                                    process_image(item, loc+"/"+type,"eyes") 
                elif obj.name in highlight_list:     
                    process_image(item, loc,"highlight")     
                elif obj.name in underlay_list:     
                    process_image(item, loc,"underlay")                     
                else:    
                    if obj.name=="cheeks" and item in cheeks_list_underlay:
                        process_image(item, loc,"underlay")      
                    else:    
                        process_image(item, loc,"regular")
                    if obj.name =="waistline":
                        process_image(item, loc+"/full","regular")    
    
def process_all_portraits():
    for c in closet:
        process_portrait_part(c)
    #makeWinks() 
    #makeStubble()    

def runStuff():
    write_variables()

    # "skull", "head","body"
    #"nose","nose_front", "cheeks", "ears"
    # "eyes","eyebrows", "mouth"
    # "body_chest","top_chest","overshirt_chest","coat_chest"
    
    # "chair_back","chair_back_dec", "chair", "chair_dec"
    
    # "sidelocks", "fringe", "hair_front","hair_middle", "hair_back","hair_extra", "facial_hair"
    
    #"overshirt","overshirt_sleeves","overshirt_dec"
    # "coat","coat_sleeves","coat_dec","coat_back"
    #"top","top_sleeves","top_dec","top_collar"
    #"bottom","waistline","waistline_dec"

    # "neckwear_front","neckwear_front2", "neckwear","neckwear_dec"
    #"earrings", "earrings_dec"
    # "eyewear",
    # "hat_back","hat_dec", "hat_middle","hat_front", "hat_front_dec", "hijab_front"
    #"back","socks","shoes","gloves"
    
    for c in closet:
        if c.name in [""]:
            process_portrait_part(c)
    #makeChairParts()
    #makeButts() 
    #makeHourglass()        
    #makeWinks()
    #makeStubble() 

    #makeSwatches()
        
    #process_all_portraits()
    #make_coat()

runStuff()
