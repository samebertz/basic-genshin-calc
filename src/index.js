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
  'localSpecialty': "Local Specialty",
  'commonMaterial': "Common Material"
}
const ASSETS = {
  characterImg: "/assets/characters/",
  elementImg: "/assets/elements/",
  weaponImg: "/assets/weapons/",
  materialImg: "/assets/materials/"
}
const MATERIALS = {
  "localSpecialty": [
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
  "commonMaterial": {
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
  }
}

let main = document.getElementById('main'),
    filter = main.getElementsByClassName('filter-button'),
    list = document.getElementById('list')

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

  console.log(JSON.stringify(keys))
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

/**
 * updateListView: for item in response createListItem(fromTemplate(type))
 * list.push(newItem)
 */
function updateListView(docs) {
  listItems = []
  for(doc of docs) {
    listItems.push(listItemFromCharacterDoc(doc))
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
  img.src = ASSETS.materialImg + type + "/item_" + name.replace(" ","_") + ".png"
  nameSpan.classList.add('material-name')
  nameSpan.appendChild(nameText)

  div.classList.add('material-badge')
  div.replaceChildren(img, nameSpan)
  return div
}

function listItemFromCharacterDoc(doc) {
  let item = document.createElement('div'),
      characterInfo = document.createElement('div'),
      infoCol1 = document.createElement('div')

  infoCol1.classList.add('info-col-1')
  for(info of ['localSpecialty', 'commonMaterial']) {
    infoCol1.appendChild(buildMaterialBadge(info, doc[info]))
  }

  characterInfo.classList.add('character-info')
  characterInfo.replaceChildren(infoCol1)

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