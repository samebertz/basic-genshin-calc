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
    talent: "domain/talent/",
    weekly: "weekly/",
    crystal: "elite/crystal/",
    core: "elite/core/",
    rare: "monster/rare/",
    common: "monster/common/",
    local: "local/",
    other: "other/"
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
        "historic _"
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
  ]
}

let main = document.getElementById('main'),
    filter = main.getElementsByClassName('filter-button'),
    list = document.getElementById('list'),
    calc = document.getElementById('calc')

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
  countSpan.appendChild(countText)
  div.replaceChildren(badge, countSpan)
  div.classList.add("calc-mat-output")
  return div
}

function compileCalc(result) {
  let div = document.createElement("div"),
      mats = [],
      cores = { anemo: 0, pyro: 0, cryo: 0, electro: 0, hydro: 0, geo: 0 },
      crystals = { anemo: new Array(4).fill(0), pyro: new Array(4).fill(0), cryo: new Array(4).fill(0), electro: new Array(4).fill(0), hydro: new Array(4).fill(0), geo: new Array(4).fill(0) },
      locals = {}, commons = {}
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
        div.appendChild(buildCalcResult(buildMaterialBadge('common', MATERIALS["common"][common.toLowerCase()]["tiers"][tier].replace("_", MATERIALS["common"][common.toLowerCase()]["type"])), commons[common][tier]))
    }
  }
  return div
}

function updateCalc() {
  let costs = [], elements = {}, local = {}, common = {}, mora = 0
  for(e of calc.children) {
    let currentAscension = parseInt(e.getElementsByClassName("ascension-input")[0].getElementsByTagName("input")[0].value),
        targetAscension = parseInt(e.getElementsByClassName("ascension-input")[0].getElementsByTagName("input")[1].value)
    costs.push(getAscensionCost(e.getElementsByClassName("character-name")[0].textContent, currentAscension, targetAscension))
  }
  Promise.all(costs).then(result => {
    document.getElementById("calc-result").replaceChildren(compileCalc(result))
    // calc.parentNode.lastChild.replaceWith(compileCalc(result))
  })
}

function removeFromCalc(event) {
  calc.removeChild(this.parentNode)
  updateCalc()
}

function addCharacterToCalc(event) {
  let calcItem = this.cloneNode(true),
      ascension = document.createElement("div"),
      aCurrent = document.createElement("input"),
      aTarget = document.createElement("input"),
      talentBasic = document.createElement("input"),
      talentSkill = document.createElement("input"),
      talentBurst = document.createElement("input"),
      submit = document.createElement("div"),
      remove = document.createElement("div")
  remove.setAttribute("style", "float: left; margin: 8px; width: 16px; height: 16px; background-color: red;")
  remove.addEventListener("click", removeFromCalc, {capture: true})
  submit.setAttribute("style", "float: left; margin: 8px; width: 16px; height: 16px; background-color: white;")
  submit.addEventListener("click", updateCalc, {capture: true})
  aCurrent.setAttribute("type", "number")
  aCurrent.setAttribute("value", "0")
  aCurrent.setAttribute("min", "0")
  aCurrent.setAttribute("max", "6")
  aTarget.setAttribute("type", "number")
  aTarget.setAttribute("value", "1")
  aTarget.setAttribute("min", "0")
  aTarget.setAttribute("max", "6")
  ascension.replaceChildren(aCurrent, aTarget)
  ascension.classList.add("ascension-input")
  calcItem.replaceChildren(calcItem.children[0],
                           ascension,
                          //  talentBasic,
                          //  talentSkill,
                          //  talentBurst,
                           submit,
                           remove)
  calc.appendChild(calcItem)
  // this.classList.add('in-calc')
  updateCalc()
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
  for(mat of ['talent', 'weekly']) {
    infoCol2.appendChild(buildMaterialBadge(mat, doc[mat]))
  }
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