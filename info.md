# Functions
## Character
### Ascension
|#|cry ☆|cry #|elt #|lcl #|cmn ☆|cmn #|lvl|mora|AR|max lvl|tlnt lvl|unlock|
|-|-|-|-|-|-|-|-|-|-|-|-|-|
|0|-|-|-|-|-|-|-|-|-|20|1|passive 3|
|1|1|1|-|3|1|3|20|20000|15|40|1|passive 1|
|2|2|3|2|10|1|15|40|40000|25|50|2|-|
|3|2|6|4|20|2|12|50|60000|30|60|4|-|
|4|3|3|8|30|2|18|60|80000|35|70|6|passive 2|
|5|3|6|12|45|3|16|70|100000|40|80|8|-|
|6|4|6|20|60|3|24|80|120000|45|90|10|-
### EXP
Mora = .2 * EXP value of materials
|Ascension|Level|Total EXP|
|-|-|-|
|0|20|120,175|
|1|40|698,500|
|2|50|1,277,600|
|3|60|2,131,725|
|4|70|3,327,650|
|5|80|4,939,525|
|6|90|?|
```
lookupXPByLevel(level):
  return db.lookup(level)
calculateXPMaterials(xp):
  book1 = xp % 20000
  book2 = (xp - book1 * 20000) % 5000
  book3 = ceil((xp - book1 * 20000 - book2 * 5000) / 1000)
  return [book1, book2, book3]
calculateMoraForXPMaterials(materials):
  return .2 * (book1*20000 + book2*5000 + book3*1000)
getLevelCost(fromLevel, toLevel):
  fromXP = lookupXPByLevel(from), toXP = lookupXPByLevel(to)
  materials = calculateXPMaterials(toXP - fromXP)
  mora = calculateMoraForXPMaterials(materials)
  return [materials, mora]
```

# Data Map
## Path Lookup
Table shows image paths for character data properties and associated
|property|path|example value|example path|
|--------|----|-------------|------------|
|name|/assets/character/`$`.png|Xingqiu|.../xingqiu.png
|rank|/assets/other/`$`_star.png<br>OR<br>`$` * /assets/other/rarity_star.png|4|.../4_star.png<br>OR<br>4 * .../rarity_star.png
|element|/assets/element/`$`.png<br>`->` /assets/material/elite/crystal/`$`_`⎕`.png<br>`->` /assets/material/elite/core/`$`.png|Hydro|.../hydro.png<br>.../varunada_lazurite_sliver.png<br>.../cleansing_heart.png
|weapon|/assets/weapon/`$`.png|Sword|.../sword.png
|local|/assets/material/local/`$`.png|Silk Flower|.../silk_flower.png
|common|/assets/material/common/`⎕`.png|Damaged Mask|.../damaged_mask.png
|talent|/assets/material/domain/talent/`⎕`.png|Teachings of "Gold"|.../teachings_of_gold.png
|boss|/assets/material/boss/`$`.png|Tail of Boreas|.../tail_of_boreas.png
+ `->` - based on element
+ `⎕` - based on rarity lookup

## Element Associations
by name
|name|crystal|core|
|----|-------|----|
|Anemo|Vayuda Turquoise|Hurricane Seed|
|Pyro|Agnidus Agate|Everflame Seed|
|Cryo|Shivada Jade|Hoarfrost Core|
|Electro|Vajrada Amethyst|Lightning Prism|
|Hydro|Varunada Lazurite|Cleansing Heart|
|Geo|Prithiva Topaz|Basalt Pillar|
|Dendro|-|-|

## Rarity Associations
by category, name, rarity
|category|min rarity|max rarity|
|--------|----------|----------|
|crystal|2 ☆|5 ☆|
|weapon|2 ☆|5 ☆|
|talent|2 ☆|4 ☆|
|rare|2 ☆|4 ☆|
|common|1 ☆|3 ☆|