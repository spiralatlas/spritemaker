from __future__ import print_function
import sys
import math
from PIL import Image, ImageDraw, ImageFilter
from PIL import ImageEnhance

### base functions 

def combineList(list1,list2):
    #list of strings combining lists of strings list1 and list2
    output = []
    for l1 in list1:
        for l2 in list2:
            output.append(l1+" "+l2)
    return output  

# colour functions

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

## Dollmaker colour functions

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

def red_shadow(pixel,shadow,edge):
    p = [pixel[0],pixel[1],pixel[2]]
    l = luminance(p)/255
    if l >0.9:
        return (0,0,0,0)
    elif l>0.7:
        r=1
    elif l>0.2:
        r = 2*l -0.4 #creates smooth transition between darker edge and lighter shadow
    elif l>0.1:
        return (edge[0],edge[1],edge[2],255)#r=0
    else: #pure black
        return (edge[0],edge[1],edge[2],255)#(0,0,0,pixel[3])

    for i in range(3):
        p[i] = int(r*shadow[i] + (1-r)*edge[i] )
        
    return (p[0],p[1],p[2], int(pixel[3]*(1-l)))

## Colour lists

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

outfit_colours = []
for s in scheme_list:
    outfit_colours+=s

## Image creators

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
    shadow = hex_to_rgba("#1B0C7E")
    line_colour = hex_to_rgba("#130A0B")

    if type != "eyes":#multiply images
        for colour in ["blue"]:#shadow_types:

            save_string_multiply = save_string+"_multiply_"+colour+".png"
            img_multiply = Image.new("RGBA", (img_original.size[0], img_original.size[1]))
            multiply_data = img_multiply.load()  

            for y in range(img_base.size[1]):
                for x in range(img_base.size[0]):

                    if original_data[x, y][3] !=0:            
                        pixel = original_data[x, y]
                        p = [pixel[0],pixel[1],pixel[2]]
                        multiply_data[x, y] =red_shadow(pixel,shadow,line_colour)
            img_multiply.save(save_string_multiply) 

    for y in range(img_base.size[1]):
        for x in range(img_base.size[0]):
            if original_data[x, y][3] !=0:
                pixel = original_data[x, y]
                p = [pixel[0],pixel[1],pixel[2]]
                base_data[x, y] = original_data[x, y] #(100,100,100,pixel[3])    
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

