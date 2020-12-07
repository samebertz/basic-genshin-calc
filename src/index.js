const ELEMENTS = [
  'anemo',
  'pyro',
  'cryo',
  'electro',
  'hydro',
  'geo'
]
const WEAPONS = [
  'bow','catalyst','claymore','polearm','sword'
]
const STRINGS = {
  'local': "Local Specialty",
  'common': "Common Material"
}
const ASSETS = {
  characterImg: "/assets/character/",
  elementImg: "/assets/element/",
  weaponImg: "/assets/weapon/",
  materialImg: {
    prefix: "/assets/material/",
    weapon: "domain/weapon/",
    teaching: "domain/talent/",
    boss: "weekly/",
    crystal: "elite/crystal/",
    core: "elite/core/",
    rare: "monster/rare/",
    common: "monster/common/",
    local: "local/",
    other: "other/",
    xp: "other/enhancement/"
  }
}
const MATERIALS = {
  "local": [
    "small lamp grass",
    "valberry",
    "windwheel aster",
    "wolfhook",
    "dandelion seed",
    "cecilia",
    "philanemo mushroom",
    "calla lilly",
    "cor lapis",
    "jueyun chili",
    "qingxin",
    "violetgrass",
    "noctilucous jade",
    "glaze lily",
    "starconch"
  ],
  "common": {
    "slime condensate": {
      "type": "slime",
      "tiers": [
        "_ condensate",
        "_ secretions",
        "_ concentrate"
      ]
    },
    "damaged mask": {
      "type": "mask",
      "tiers": [
        "damaged _",
        "stained _",
        "ominous _"
      ]
    },
    "firm arrowhead": {
      "type": "arrowhead",
      "tiers": [
        "firm _",
        "sharp _",
        "weathered _"
      ]
    },
    "divining scroll": {
      "type": "scroll",
      "tiers": [
        "divining _",
        "sealed _",
        "forbidden curse _"
      ]
    },
    "recruit's insignia": {
      "type": "insignia+F",
      "tiers": [
        "recruit's _",
        "sergeant's _",
        "lieutenant's _"
      ]
    },
    "treasure hoarder insignia": {
      "type": "insignia+TH",
      "tiers": [
        "treasure hoarder _",
        "silver raven _",
        "golden raven _"
      ]
    },
    "whopperflower nectar": {
      "type": "nectar",
      "tiers": [
        "whopperflower _",
        "shimmering _",
        "energy _"
      ]
    }
  },
  "element": {
    "anemo": {
      "crystal": "Vayuda Turquoise",
      "core": "Hurricane Seed"
    },
    "pyro": {
      "crystal": "Agnidus Agate",
      "core": "Everflame Seed"
    },
    "cryo": {
      "crystal": "Shivada Jade",
      "core": "Hoarfrost Core"
    },
    "electro": {
      "crystal": "Vajrada Amethyst",
      "core": "Lightning Prism"
    },
    "hydro": {
      "crystal": "Varunada Lazurite",
      "core": "Cleansing Heart"
    },
    "geo": {
      "crystal": "Prithiva Topaz",
      "core": "Basalt Pillar"
    },
    "dendro": {
      "crystal": "-",
      "core": "-"
    }
  },
  "crystaltiers": [
    " Sliver",
    " Fragment",
    " Chunk",
    " Gemstone"
  ],
  "teaching": [
    "freedom",
    "resistance",
    "ballad",
    "prosperity",
    "diligence",
    "gold"
  ],
  "teachingtiers": [
    "Teachings of \'_\'",
    "Guide to \'_\'",
    "Philosophies of \'_\'"
  ],
  "xpbooktiers": [
    "Wanderer's Advice",
    "Adventurer's Experience",
    "Hero's Wit"
  ]
}

let main = document.getElementById('main'),
    filter = main.getElementsByClassName('filter-button'),
    list = document.getElementById('list'),
    calc = document.getElementById('calc')

var inCalc = new Array()

// on filter update -> new model query -> on result -> list view update
/** filterUpdate: model.getValue(queryFromFilter())
 *  .then((response)=>updateListView(response))
 * 
 *  update filter view, construct query, perform query, wait for result, update list view
 */
function filterUpdate(event) {
  if(!event?.target.classList.contains('filter-button')) return

  if(event?.target.classList.contains('active-filter'))
    event.target.classList.remove('active-filter')
  else
    event?.target.classList.add('active-filter')

  // activeFilters = []
  // for(element of filter) {
  //   if(element.classList.contains('active-filter'))
  //     activeFilters.push(element.id)
  // }

  // triple: [element, rank, weapon]
  let activeElementFilters = [],
      activeRankFilters = [],
      activeWeaponFilters = []
  for(element of filter) {
    if(element.classList.contains('active-filter')) {
      if(element.classList.contains('element-filter'))
        activeElementFilters.push(element.id)
      if(element.classList.contains('rank-filter'))
        activeRankFilters.push(element.id)
      if(element.classList.contains('weapon-filter'))
        activeWeaponFilters.push(element.id)
    }
  }
  //construct filter keys
  let keys = []
  if(activeElementFilters.length > 0) {
    keys.push(...activeElementFilters.map(e => [e]))
  } else {
    keys.push(...ELEMENTS)
  }
  // if(activeRankFilters.length > 0) {
    keys = keys.flatMap(e => {
      let x = []
      for(rankFilter of [4,5]) {
        x.push([e, rankFilter].flat())
      }
      return x
    })
  // }
  if(activeWeaponFilters.length == 0)
    activeWeaponFilters.push(...WEAPONS)
  keys = keys.flatMap(e => {
    let x = []
    for(weaponFilter of activeWeaponFilters) {
      x.push([e, weaponFilter].flat())
    }
    return x
  })

  // console.log(JSON.stringify(keys))
  db.query('filter_index/by_triple', {
    keys: keys,
    include_docs: true
  }).then(docs => {
    updateListView(docs.rows.map(e => e.doc).sort((a,b)=>{return a.name>b.name}))
  }).catch(e => console.log(e))
}
/** TODO: split query out, so initial "all" query after view indexes are built/checked isn't called through filterUpdate so can avoid optional chaining on event
 * if(activeFilters.length == 0) {
 *   db.allDocs({include_docs: true}).then(logDocs).catch()
 * } else {
 *   db.query('filter_index/by_element', {
 *     keys: activeFilters,
 *     include_docs: true
 *   }).then(docs => {
 *     updateListView(docs.rows.map(e => e.doc).sort((a,b)=>{return a.name>b.name}))
 *   }).catch(e => console.log(e))
 * }
 */

function buildCalcResult(badge, count) {
  let div = document.createElement("div"),
      countSpan = document.createElement("div"),
      countText = document.createTextNode(count)
  countSpan.classList.add("calc-mat-output-amount")
  countSpan.appendChild(countText)
  div.replaceChildren(badge, countSpan)
  div.classList.add("calc-mat-output")
  return div
}

function compileCalc(result) {
  // console.log(result)
  let div = document.createElement("div"), moraDiv = document.createElement("div"),
      // mats = [],
      cores = { anemo: 0, pyro: 0, cryo: 0, electro: 0, hydro: 0, geo: 0 },
      crystals = { anemo: new Array(4).fill(0), pyro: new Array(4).fill(0), cryo: new Array(4).fill(0), electro: new Array(4).fill(0), hydro: new Array(4).fill(0), geo: new Array(4).fill(0) },
      locals = {}, commons = {}, teachings = {}, boss = {}, xpbooks = new Array(3).fill(0), mora = 0
  for({doc, materials} of result) {
    cores[doc.element.toLowerCase()] += materials.element.core
    for(let i=0; i<materials.element.crystal.length; i++) {
      crystals[doc.element.toLowerCase()][i] += materials.element.crystal[i]
    }
    locals[doc.local] = locals[doc.local] ? locals[doc.local] + materials.local : materials.local
    if(commons.hasOwnProperty(doc.common)) {
      for(let i=0; i<materials.common.length; i++) {
        commons[doc.common][i] += materials.common[i]
      }
    } else {
      commons[doc.common] = materials.common
    }
    if(teachings.hasOwnProperty(doc.teaching)) {
      for(let i=0; i<materials.teaching.length; i++) {
        teachings[doc.teaching][i] += materials.teaching[i]
      }
    } else {
      teachings[doc.teaching] = materials.teaching
    }
    boss[doc.boss] = boss[doc.boss] ? boss[doc.boss] + materials.boss : materials.boss
    // console.log(materials.xpbooks)
    for(let i=0; i<materials.xpbooks.length; i++) {
      xpbooks[i] += materials.xpbooks[i]
    }
    // console.log(xpbooks)
    mora += materials.mora
  }
  for(element of ELEMENTS) {
    if(cores[element] > 0)
      div.appendChild(buildCalcResult(buildMaterialBadge('core', nameLookupForElementMat('core', element)), cores[element]))
    for(let tier = 0; tier < 4; tier++) {
      if(crystals[element][tier] > 0)
        div.appendChild(buildCalcResult(buildMaterialBadge('crystal', nameLookupForElementMat('crystal', element) + MATERIALS["crystaltiers"][tier]), crystals[element][tier]))
    }
  }
  for(local in locals) {
    if(locals[local] > 0)
      div.appendChild(buildCalcResult(buildMaterialBadge('local', local), locals[local]))
  }
  for(common in commons) {
    for(let tier = 0; tier < 3; tier++) {
      if(commons[common][tier] > 0)
        div.appendChild(buildCalcResult(buildMaterialBadge('common', MATERIALS["common"][common.toLowerCase()]["tiers"][tier].replace("_", MATERIALS["common"][common.toLowerCase()]["type"].replace(/\+.*/, ""))), commons[common][tier]))
    }
  }
  // console.log(teachings)
  for(teaching in teachings) {
    for(let tier = 0; tier < 3; tier++) {
      if(teachings[teaching][tier] > 0){
        // console.log(teaching, teachings[teaching])
        div.appendChild(buildCalcResult(buildMaterialBadge('teaching', nameLookupForTalentBook(teaching, tier)), teachings[teaching][tier]))
      }
    }
  }
  for(b in boss) {
    if(boss[b] > 0) {
      // console.log(boss, boss[b])
      div.appendChild(buildCalcResult(buildMaterialBadge('boss', b), boss[b]))
    }
  }
  for(let tier = 0; tier < 3; tier++) {
    // console.log('xpbooks tier' + tier)
    if(xpbooks[tier] > 0) {
      // console.log(xpbooks[tier])
      div.appendChild(buildCalcResult(buildMaterialBadge('xp', MATERIALS["xpbooktiers"][tier]), xpbooks[tier]))
    }
  }
  moraDiv.classList.add('calc-result-mora')
  moraDiv.appendChild(buildCalcResult(buildMaterialBadge('other', 'mora'), mora))
  return [div, moraDiv]
}

function updateCalc() {
  let costs = [], elements = {}, local = {}, common = {}, mora = 0
  for(e of calc.children) {
    let currentLevel = parseInt(e.getElementsByClassName("level-input")[0].getElementsByTagName("input")[0].value),
        targetLevel = parseInt(e.getElementsByClassName("level-input")[0].getElementsByTagName("input")[1].value),
        currentAscension = parseInt(e.getElementsByClassName("ascension-input")[0].getElementsByTagName("input")[0].value),
        targetAscension = parseInt(e.getElementsByClassName("ascension-input")[0].getElementsByTagName("input")[1].value),
        currentTalent1 = parseInt(e.getElementsByClassName("talent1-input")[0].getElementsByTagName("input")[0].value),
        targetTalent1 = parseInt(e.getElementsByClassName("talent1-input")[0].getElementsByTagName("input")[1].value),
        currentTalent2 = parseInt(e.getElementsByClassName("talent2-input")[0].getElementsByTagName("input")[0].value),
        targetTalent2 = parseInt(e.getElementsByClassName("talent2-input")[0].getElementsByTagName("input")[1].value),
        currentTalent3 = parseInt(e.getElementsByClassName("talent3-input")[0].getElementsByTagName("input")[0].value),
        targetTalent3 = parseInt(e.getElementsByClassName("talent3-input")[0].getElementsByTagName("input")[1].value)
    costs.push(getCost(e.getElementsByClassName("character-name")[0].textContent, currentLevel, targetLevel, currentAscension, targetAscension, currentTalent1, targetTalent1, currentTalent2, targetTalent2, currentTalent3, targetTalent3))
  }
  Promise.all(costs).then(result => {
    let div = compileCalc(result),
        encodedString = JSON.stringify(Array.prototype.slice.call(calc.children).map(e => getCalcItemAsJSON(e)))
    document.getElementById("calc-result").replaceChildren(div[0], div[1])
    // calc.parentNode.lastChild.replaceWith(compileCalc(result))
  })
}

function removeFromCalc(event) {
  inCalc.splice(inCalc.indexOf(this.parentNode.getElementsByClassName('character-name')[0].textContent), 1)
  calc.removeChild(this.parentNode)
  updateCalc()
}

function addCharacterToCalc(event, options) {
  // console.log(options)
  if(!inCalc.includes(this.getElementsByClassName('character-name')[0].textContent)) {
    inCalc.push(this.getElementsByClassName('character-name')[0].textContent)
    let calcItem = this.cloneNode(true),
        level = document.createElement("div"),
        lCurrent = document.createElement("input"),
        lTarget = document.createElement("input"),
        ascension = document.createElement("div"),
        aCurrent = document.createElement("input"),
        aTarget = document.createElement("input"),
        talent1 = document.createElement("div"),
        t1Current = document.createElement("input"),
        t1Target = document.createElement("input"),
        talent2 = document.createElement("div"),
        t2Current = document.createElement("input"),
        t2Target = document.createElement("input"),
        talent3 = document.createElement("div"),
        t3Current = document.createElement("input"),
        t3Target = document.createElement("input"),
        aLabel = document.createElement("span"),
        lLabel = document.createElement("span"),
        t1Label = document.createElement("span"),
        t2Label = document.createElement("span"),
        t3Label = document.createElement("span"),
        submit = document.createElement("div"),
        submitSymbol = document.createTextNode("⭮"),
        remove = document.createElement("div"),
        removeSymbol = document.createTextNode("𝗫"),
        inputs = [lCurrent, lTarget, aCurrent, aTarget, t1Current, t1Target, t2Current, t2Target, t3Current, t3Target]
    remove.appendChild(removeSymbol)
    remove.classList.add("calc-element-ctrl", "calc-element-remove")
    // remove.setAttribute("style", "float: left; margin: 8px 8px 8px 16px; width: 16px; height: 16px; background-color: red; color: white; text-align: center;")
    remove.addEventListener("click", removeFromCalc, {capture: true})
    submit.appendChild(submitSymbol)
    submit.classList.add("calc-element-ctrl", "calc-element-update")
    // submit.setAttribute("style", "float: left; margin: 8px 8px 8px 16px; width: 16px; height: 16px; background-color: lightblue; color: black; text-align: center;")
    submit.addEventListener("click", updateCalc, {capture: true})
    lCurrent.setAttribute("type", "number")
    lCurrent.setAttribute("value", options ? options[0] : "1")
    lCurrent.setAttribute("min", "1")
    lCurrent.setAttribute("max", "90")
    lTarget.setAttribute("type", "number")
    lTarget.setAttribute("value", options ? options[1] : "1")
    lTarget.setAttribute("min", "1")
    lTarget.setAttribute("max", "90")
    aCurrent.setAttribute("type", "number")
    aCurrent.setAttribute("value", options ? options[2] : "0")
    aCurrent.setAttribute("min", "0")
    aCurrent.setAttribute("max", "6")
    aTarget.setAttribute("type", "number")
    aTarget.setAttribute("value", options ? options[3] : "0")
    aTarget.setAttribute("min", "0")
    aTarget.setAttribute("max", "6")
    t1Current.setAttribute("type", "number")
    t1Current.setAttribute("value", options ? options[4] : "1")
    t1Current.setAttribute("min", "1")
    t1Current.setAttribute("max", "10")
    t1Target.setAttribute("type", "number")
    t1Target.setAttribute("value", options ? options[5] : "1")
    t1Target.setAttribute("min", "1")
    t1Target.setAttribute("max", "10")
    t2Current.setAttribute("type", "number")
    t2Current.setAttribute("value", options ? options[6] : "1")
    t2Current.setAttribute("min", "1")
    t2Current.setAttribute("max", "10")
    t2Target.setAttribute("type", "number")
    t2Target.setAttribute("value", options ? options[7] : "1")
    t2Target.setAttribute("min", "1")
    t2Target.setAttribute("max", "10")
    t3Current.setAttribute("type", "number")
    t3Current.setAttribute("value", options ? options[8] : "1")
    t3Current.setAttribute("min", "1")
    t3Current.setAttribute("max", "10")
    t3Target.setAttribute("type", "number")
    t3Target.setAttribute("value", options ? options[9] : "1")
    t3Target.setAttribute("min", "1")
    t3Target.setAttribute("max", "10")
    lLabel.appendChild(document.createTextNode("Level"))
    aLabel.appendChild(document.createTextNode("Ascension"))
    t1Label.appendChild(document.createTextNode("Basic Attack"))
    t2Label.appendChild(document.createTextNode("Elemental Skill"))
    t3Label.appendChild(document.createTextNode("Elemental Burst"))
    level.replaceChildren(lLabel, lCurrent, lTarget)
    ascension.replaceChildren(aLabel, aCurrent, aTarget)
    talent1.replaceChildren(t1Label, t1Current, t1Target)
    talent2.replaceChildren(t2Label, t2Current, t2Target)
    talent3.replaceChildren(t3Label, t3Current, t3Target)
    level.classList.add("level-input", "calc-input")
    ascension.classList.add("ascension-input", "calc-input")
    talent1.classList.add("talent1-input", "calc-input")
    talent2.classList.add("talent2-input", "calc-input")
    talent3.classList.add("talent3-input", "calc-input")
    calcItem.classList.remove("list-element")
    calcItem.classList.add("calc-element")
    calcItem.replaceChildren(calcItem.children[0],
                            level,
                            ascension,
                            talent1,
                            talent2,
                            talent3,
                            submit,
                            remove)
    inputs.forEach(i => i.addEventListener('input', updateCalc))
    calc.appendChild(calcItem)
    // this.classList.add('in-calc')
    updateCalc()
  }
}

/**
 * updateListView: for item in response createListItem(fromTemplate(type))
 * list.push(newItem)
 */
function updateListView(docs) {
  listItems = []
  for(doc of docs) {
    let item = listItemFromCharacterDoc(doc)
    item.addEventListener('click', addCharacterToCalc, {capture: true})
    listItems.push(item)
  }
  list.replaceChildren(...listItems)
}

function buildCharacterBadge(name, element, weapon) {
  let div = document.createElement('div'),
      img = document.createElement('img'),
      elementBadge = document.createElement('img'),
      weaponBadge = document.createElement('img'),
      nameSpan = document.createElement('span'),
      nameText = document.createTextNode(name)

  img.classList.add('character-img')
  img.src = ASSETS.characterImg + name + ".png"
  elementBadge.classList.add('badge-img', 'element-img')
  elementBadge.src = ASSETS.elementImg + element + ".png"
  weaponBadge.classList.add('badge-img', 'weapon-img')
  weaponBadge.src = ASSETS.weaponImg + weapon + ".png"
  nameSpan.classList.add('character-name')
  nameSpan.appendChild(nameText)

  div.classList.add('character-badge')
  div.replaceChildren(img, elementBadge, weaponBadge, nameSpan)
  return div
}

function buildInfoBlock(label, value) {
  let div = document.createElement('div'),
      labelSpan = document.createElement('span'),
      labelText = document.createTextNode(label+' : '),
      valueSpan = document.createElement('span'),
      valueText = document.createTextNode(value)

  labelSpan.classList.add('info-label')
  labelSpan.appendChild(labelText)
  valueSpan.classList.add('info-text')
  valueSpan.appendChild(valueText)

  div.classList.add('info-block')
  div.replaceChildren(labelSpan, valueSpan)
  return div
}

/**
 * buildMaterialBadge accepts a material category, name, and tier and constructs a div containing an image of the material with a label/caption of the material category
 * 
 * @param {string} type - category of the material
 * @param {string} name - name of the material
 * @param {int} tier - tier of the material
 */
function buildMaterialBadge(type, name, tier) {
  // console.log(name)
  let div = document.createElement('div'),
      img = document.createElement('img'),
      nameSpan = document.createElement('span'),
      nameText = document.createTextNode(name)

  img.classList.add('material-img')
  img.src = ASSETS.materialImg.prefix + ASSETS.materialImg[type] + name.replace(/\s/g,"_") + ".png"
  img.title = name
  nameSpan.classList.add('material-name')
  nameSpan.appendChild(nameText)

  div.classList.add('material-badge')
  div.replaceChildren(img/*, nameSpan*/)
  return div
}

function nameLookupForElementMat(mat, element) {
  return MATERIALS.element[element.toLowerCase()][mat]
}

function nameLookupForTalentBook(mat, rarity) {
  return MATERIALS["teachingtiers"][rarity].replace("_", mat)
}

function listItemFromCharacterDoc(doc) {
  let item = document.createElement('div'),
      characterInfo = document.createElement('div'),
      infoCol1 = document.createElement('div'),
      infoCol2 = document.createElement('div')

  function buildInfoColTitle(title) {
    let div = document.createElement('div')
    div.classList.add('info-col-title')
    div.appendChild(document.createTextNode(title))
    return div
  }

  infoCol1.classList.add('info-col-1')
  for(mat of ['core']) {
    infoCol1.appendChild(buildMaterialBadge(mat, nameLookupForElementMat(mat, doc.element)))
  }
  infoCol1.appendChild(buildMaterialBadge('crystal', nameLookupForElementMat('crystal', doc.element) + " Sliver"))
  for(mat of ['local', 'common']) {
    infoCol1.appendChild(buildMaterialBadge(mat, doc[mat]))
  }
  infoCol1.appendChild(buildInfoColTitle("Ascension Materials"))

  infoCol2.classList.add('info-col-2')
  for(mat of ['boss']) {
    infoCol2.appendChild(buildMaterialBadge(mat, doc[mat]))
  }
  infoCol2.appendChild(buildMaterialBadge('teaching', nameLookupForTalentBook(doc["teaching"], 0)))
  infoCol2.appendChild(buildInfoColTitle("Talent Materials"))

  characterInfo.classList.add('character-info')
  characterInfo.replaceChildren(infoCol1, infoCol2)

  item.classList.add('list-element')
  item.replaceChildren(
    buildCharacterBadge(doc.name, doc.element, doc.weapon),
    characterInfo
  )

  return item
}

for(element of filter) {
  element.addEventListener('click', filterUpdate, {capture: true})
}

function validateLoadString(str) {
  return true
}

document.getElementById("calc-load").addEventListener("click", function(event) {
  // let json = JSON.parse(document.getElementById("calc-load-input").value)
  let json = JSON.parse(localStorage.getItem('encCalc'))
  // console.log(json)
  if(validateLoadString(json)) {
    Promise.all(json.map(e => db.get(e.name))).then(r => {
      // console.log(r)
      for(let i=0; i<r.length; i++) {
        let item = listItemFromCharacterDoc(r[i])
        addCharacterToCalc.bind(item)(undefined, json[i].params)
      }
    })
  } else {
    console.log("Invalid string")
  }
})

function getCalcItemAsJSON(item) {
  return {
    "name": item.getElementsByClassName("character-name")[0].textContent,
    "params": Array.prototype.slice.call(item.getElementsByTagName("input")).map(e => e.value)
  }
}

document.getElementById("calc-save").addEventListener("click", function(event) {
  let encodedString = JSON.stringify(Array.prototype.slice.call(document.getElementById("calc").children).map(e => getCalcItemAsJSON(e)))
  document.getElementById("calc-save-output").value = encodedString
  localStorage.setItem('encCalc', encodedString)
})