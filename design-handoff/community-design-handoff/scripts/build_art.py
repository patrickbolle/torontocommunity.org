from PIL import Image, ImageDraw
from pathlib import Path
import random
ROOT=Path(__file__).resolve().parents[1]
T={'ink':'#15202A','brick':'#C44939','brick2':'#92382F','accent':'#C83D32','sky':'#B6D2E6','blue':'#587F9C','blue2':'#365F79','leaf':'#49745C','leaf2':'#2D5949','leaf3':'#81A56C','glass':'#E4F0F5','cream':'#E6BD88','road':'#CBD4D9','gray':'#8596A3'}
V={'ink':'#15202A','brick':'#A8A99A','brick2':'#6B8174','accent':'#247453','sky':'#B7CFDC','blue':'#58869A','blue2':'#345E70','leaf':'#326E58','leaf2':'#1E5147','leaf3':'#7FA58C','glass':'#DBEAE9','cream':'#C5B895','road':'#C8D2D5','gray':'#78909B'}
def paint(city='toronto',scene='hero',variant=0):
 C=T if city=='toronto' else V; W,H=(176,86) if scene=='hero' else (100,50) if scene=='neighborhood' else (176,27)
 im=Image.new('RGBA',(W,H));d=ImageDraw.Draw(im); rng=random.Random(101+variant*73+(1 if city=='vancouver' else 0))
 def rect(x,y,w,h,c): d.rectangle((x,y,x+w-1,y+h-1), fill=C.get(c,c))
 def line(x1,y1,x2,y2,c,width=1):d.line((x1,y1,x2,y2),fill=C.get(c,c),width=width)
 ground=H-9 if scene=='hero' else H-6 if scene=='neighborhood' else H-3
 if scene=='neighborhood':
  # Each neighbourhood is an intentionally DISTINCT pixel-built motif, never a repeated tinted thumbnail.
  def tree(x,y=ground):
   rect(x,y-14,2,14,'brick2');rect(x-6,y-23,14,11,'leaf2');rect(x-3,y-27,9,7,'leaf3');rect(x-9,y-17,19,5,'leaf')
  if variant==1: # market / kits retail strip
   for bx,bw,bh in [(3,30,22),(36,29,28),(68,29,20)]:
    rect(bx,ground-bh,bw,bh,'brick' if bx!=36 else 'cream');rect(bx,ground-bh,bw,2,'brick2')
    for wx in range(bx+5,bx+bw-2,9):rect(wx,ground-bh+5,5,7,'ink');rect(wx+1,ground-bh+6,3,4,'glass')
    rect(bx+2,ground-10,bw-4,3,'accent');rect(bx+4,ground-7,bw-8,7,'ink')
   rect(0,ground,100,2,'ink')
  elif variant==2: # junction overpass / Mount Pleasant industrial silhouette
   for x in range(7,92,14):rect(x,ground-16,11,16,'brick2' if x%3 else 'blue')
   rect(0,ground-24,100,5,'ink');rect(0,ground-20,100,2,'road')
   for x in range(6,100,19):rect(x,ground-19,3,19,'blue2')
   rect(14,ground-31,5,7,'accent');rect(80,ground-30,2,6,'ink');rect(0,ground,100,2,'ink')
  elif variant==3: # low brick warehouse / Commercial Drive cafe + overhead wires
   rect(8,ground-26,69,26,'brick');rect(8,ground-29,54,3,'brick2');rect(64,ground-38,5,12,'brick2')
   for x in (16,29,42,55):rect(x,ground-21,8,9,'ink');rect(x+1,ground-20,6,6,'glass')
   rect(10,ground-11,65,3,'accent');rect(13,ground-8,59,8,'blue2')
   rect(82,ground-34,2,34,'ink');line(49,ground-35,99,ground-28,'ink');rect(0,ground,100,2,'ink')
  else: # park / waterfront. No repeated storefront.
   rect(0,ground-3,100,4,'leaf');rect(0,ground-1,100,2,'ink')
   for tx in [12,37,76]:tree(tx,ground-3)
   rect(0,ground-8,100,2,'road');rect(51,ground-6,3,3,'cream');rect(59,ground-6,3,3,'cream')
   if city=='vancouver':rect(0,ground+2,100,4,'blue')
  return im
 if city=='vancouver':
  # Hard-edged North Shore mountain profiles; no shading gradients
  ridge=[(8,ground-15),(21,ground-30),(28,ground-21),(42,ground-43),(56,ground-25),(68,ground-34),(85,ground-17),(103,ground-37),(123,ground-21),(146,ground-40),(W,ground-14)]
  if scene=='neighborhood':ridge=[(0,ground-10),(14,ground-20),(23,ground-11),(38,ground-29),(53,ground-14),(69,ground-22),(W,ground-12)]
  if scene=='strip':ridge=[(0,ground-5),(24,ground-12),(44,ground-8),(63,ground-18),(84,ground-7),(113,ground-12),(146,ground-18),(W,ground-6)]
  d.polygon([(0,ground)]+ridge+[(W,ground)],fill=C['blue'])
  # snow caps pixellated
  if scene!='strip':
   for x,y in ([ (42,ground-43),(103,ground-37),(146,ground-40)] if scene=='hero' else [(38,ground-29)]):
    rect(x-4,y+4,9,3,'glass');rect(x-2,y+2,5,2,'glass')
 else:
  # Minimal Toronto skyline silhouettes (not full postcard)
  for i,x in enumerate(range(62 if scene=='hero' else 0,W,10)):
   bh=12+((i*7+variant*3)%17)
   if scene=='neighborhood':bh=5+(i*3)%9
   if scene=='strip':bh=4+(i*3)%10
   rect(x,ground-bh,9,bh,'blue' if i%3 else 'blue2')
   for wy in range(ground-bh+4,ground-3,5):
    rect(x+3,wy,1,2,'glass');rect(x+6,wy,1,2,'glass')
  if scene in ('hero','strip'):
   tx=(W-26 if scene=='hero' else W//2); th=(47 if scene=='hero' else 23); top=ground-th
   rect(tx,top+6,2,th-6,'ink');rect(tx-2,top+18,6,3,'brick');rect(tx-4,top+20,10,2,'brick2');rect(tx,top,1,7,'ink');rect(tx+1,top+9,1,9,'ink')
 if scene!='strip':
  # small Toronto street grid / Vancouver building assembly
  if city=='toronto':
   bx,by,bw,bh=(15,ground-35,58,35) if scene=='hero' else (8,ground-24,44,24)
  else: bx,by,bw,bh=(22,ground-30,52,30) if scene=='hero' else (8,ground-20,46,20)
  if variant%3==1: bx+=4;bw-=5
  rect(bx,by,bw,bh,'brick');rect(bx,by,bw,3,'brick2');rect(bx+4,by-2,bw-8,2,'brick2')
  for wx in range(bx+6,bx+bw-5,11):
   for wy in range(by+6,ground-5,11):
    rect(wx,wy,6,7,'ink');rect(wx+1,wy+1,4,4,'glass');rect(wx+3,wy+1,1,4,'blue')
  # storefront ground-floor
  rect(bx+2,ground-13,bw-4,13,'ink');rect(bx+5,ground-11,bw-10,7,'blue2')
  for x in range(bx+6,bx+bw-8,8):rect(x,ground-10,1,6,'glass')
  rect(bx+2,ground-15,bw-4,3,'brick2')
  # bold block-shape tree
  tx=bx+bw+9 if scene=='hero' else bx+bw+3
  rect(tx,ground-23,3,23,'brick2')
  for x,y,w,h,c in [(tx-9,ground-32,21,10,'leaf2'),(tx-14,ground-25,30,8,'leaf'),(tx-6,ground-38,15,8,'leaf3'),(tx-11,ground-19,9,6,'leaf2')]:rect(x,y,w,h,c)
  if scene=='hero':
   if city=='toronto':
    # TTC streetcar as recognizable minimal pixel-built silhouette
    sx,sy=93,ground-17
    rect(sx,sy,38,14,'brick');rect(sx+2,sy+2,34,6,'glass');rect(sx+7,sy+2,2,6,'ink');rect(sx+17,sy+2,2,6,'ink');rect(sx+27,sy+2,2,6,'ink');rect(sx,sy+9,38,3,'glass');rect(sx+3,ground-3,4,2,'ink');rect(sx+30,ground-3,4,2,'ink');line(sx+17,sy-1,sx+22,sy-7,'ink')
   else:
    # seawall / bike / ferry shapes
    rect(94,ground-4,68,2,'blue2');rect(112,ground-15,20,5,'cream');rect(108,ground-10,28,4,'blue2');rect(118,ground-17,2,2,'ink')
    for x in (102,144):rect(x,ground-8,2,6,'leaf2')
    line(82,ground-6,98,ground-6,'ink');d.ellipse((85,ground-8,91,ground-2),outline=C['ink'],width=1);d.ellipse((94,ground-8,100,ground-2),outline=C['ink'],width=1)
  rect(0,ground,W,2,'ink')
 else:rect(0,ground,W,1,'ink')
 return im

def save(im,out,scale):
 out.parent.mkdir(parents=True,exist_ok=True); im.resize((im.width*scale,im.height*scale),Image.Resampling.NEAREST).save(out.with_suffix('.png'))
 # svg pixel art: literal pixel run rectangles, no blur/filter/gradients. one rect per contiguous pixel run
 pix=im.load(); rects=[]
 for y in range(im.height):
  x=0
  while x<im.width:
   c=pix[x,y]; e=x+1
   while e<im.width and pix[e,y]==c:e+=1
   if c[3]:rects.append(f'<rect x="{x}" y="{y}" width="{e-x}" height="1" fill="#{c[0]:02x}{c[1]:02x}{c[2]:02x}"/>')
   x=e
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {im.width} {im.height}" shape-rendering="crispEdges" role="img">'+''.join(rects)+'</svg>'
 out.with_suffix('.svg').write_text(svg)
for city in ['toronto','vancouver']:
 base=ROOT/'assets'/city
 save(paint(city,'hero'),base/'hero-street',5)
 save(paint(city,'strip'),base/'skyline-strip',4)
 names=['kensington','junction','leslieville','high-park'] if city=='toronto' else ['kitsilano','mount-pleasant','commercial-drive','stanley-park']
 for i,name in enumerate(names):save(paint(city,'neighborhood',i+1),base/'neighbourhoods'/name,5)
 # tiny city mark: streetcar red / mountain green, not maple leaf
 m=Image.new('RGBA',(16,16));d=ImageDraw.Draw(m)
 if city=='toronto':
  d.rectangle((2,5,13,11),fill=T['brick']);d.rectangle((4,6,11,8),fill=T['glass']);d.rectangle((4,12,5,13),fill=T['ink']);d.rectangle((10,12,11,13),fill=T['ink']);d.line((7,2,7,4),fill=T['ink'])
 else:
  d.polygon([(1,12),(6,3),(9,8),(12,4),(15,12)],fill=V['leaf2']);d.rectangle((0,13,15,14),fill=V['leaf'])
 save(m,base/'city-mark',4)
print('Generated strict pixel art assets.')
