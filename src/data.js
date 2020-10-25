let characterData = [
    {
        name: "Amber",
        rank: 4,
        element: "Pyro",
        weapon: "Bow",
        localSpecialty: "Small Lamp Grass",
        commonMaterial: "Firm Arrowhead"
    },
    {
        name: "Barbara",
        rank: 4,
        element: "Hydro",
        weapon: "Catalyst",
        localSpecialty: "Philanemo Mushroom",
        commonMaterial: "Divining Scroll"
    },
    {
        name: "Beidou",
        rank: 4,
        element: "Electro",
        weapon: "Claymore",
        localSpecialty: "Noctilucous Jade",
        commonMaterial: "Treasure Hoarder Insignia"
    },
    {
        name: "Bennett",
        rank: 4,
        element: "Pyro",
        weapon: "Sword",
        localSpecialty: "Windwheel Aster",
        commonMaterial: "Treasure Hoarder Insignia"
    },
    {
        name: "Chongyun",
        rank: 4,
        element: "Cryo",
        weapon: "Claymore",
        localSpecialty: "Cor Lapis",
        commonMaterial: "Damaged Mask"
    },
    {
        name: "Diluc",
        rank: 5,
        element: "Pyro",
        weapon: "Claymore",
        localSpecialty: "Small Lamp Grass",
        commonMaterial: "Recruit's Insignia"
    },
    {
        name: "Fischl",
        rank: 4,
        element: "Electro",
        weapon: "Bow",
        localSpecialty: "Small Lamp Grass",
        commonMaterial: "Firm Arrowhead"
    },
    {
        name: "Jean",
        rank: 5,
        element: "Anemo",
        weapon: "Sword",
        localSpecialty: "Dandelion Seed",
        commonMaterial: "Damaged Mask"
    },
    {
        name: "Kaeya",
        rank: 4,
        element: "Cryo",
        weapon: "Sword",
        localSpecialty: "Calla Lily",
        commonMaterial: "Treasure Hoarder Insignia"
    },
    {
        name: "Keqing",
        rank: 5,
        element: "Electro",
        weapon: "Sword",
        localSpecialty: "Cor Lapis",
        commonMaterial: "Whopperflower Nectar"
    },
    {
        name: "Lisa",
        rank: 4,
        element: "Electro",
        weapon: "Catalyst",
        localSpecialty: "Valberry",
        commonMaterial: "Slime Condensate"
    },
    {
        name: "Mona",
        rank: 5,
        element: "Hydro",
        weapon: "Catalyst",
        localSpecialty: "Philanemo Mushroom",
        commonMaterial: "Whopperflower Nectar"
    },
    {
        name: "Ningguang",
        rank: 4,
        element: "Geo",
        weapon: "Catalyst",
        localSpecialty: "Glaze Lily",
        commonMaterial: "Recruit's Insignia"
    },
    {
        name: "Noelle",
        rank: 4,
        element: "Geo",
        weapon: "Claymore",
        localSpecialty: "Valberry",
        commonMaterial: "Damaged Mask"
    },
    {
        name: "Qiqi",
        rank: 5,
        element: "Cryo",
        weapon: "Sword",
        localSpecialty: "Violetgrass",
        commonMaterial: "Divining Scroll"
    },
    {
        name: "Razor",
        rank: 4,
        element: "Electro",
        weapon: "Claymore",
        localSpecialty: "Wolfhook",
        commonMaterial: "Damaged Mask"
    },
    {
        name: "Sucrose",
        rank: 4,
        element: "Anemo",
        weapon: "Catalyst",
        localSpecialty: "Windwheel Aster",
        commonMaterial: "Whopperflower Nectar"
    },
    {
        name: "Traveler",
        rank: 5,
        element: "Adaptive",
        weapon: "Sword",
        localSpecialty: "Windwheel Aster",
        commonMaterial: "Damaged Mask"
    },
    {
        name: "Venti",
        rank: 5,
        element: "Anemo",
        weapon: "Bow",
        localSpecialty: "Cecilia",
        commonMaterial: "Slime Condensate"
    },
    {
        name: "Xiangling",
        rank: 4,
        element: "Pyro",
        weapon: "Polearm",
        localSpecialty: "Jueyun Chili",
        commonMaterial: "Slime Condensate"
    },
    {
        name: "Xingqiu",
        rank: 4,
        element: "Hydro",
        weapon: "Sword",
        localSpecialty: "Silk Flower",
        commonMaterial: "Damaged Mask"
    }
]

function transformCharacterDataForImport(entry) {

}

function idFromName(o) {
  o._id = o.name
  return o
}

var db = new PouchDB('characters')
// db.bulkDocs(characterData).then(buildIndexes).catch(e => {throw e})

// db.info().then(info => {
//   if(info["doc_count"] == 0)
db.bulkDocs(characterData.map(idFromName)).then(result => {
  buildIndexes()
}).catch(e => {throw e}).finally(() => filterUpdate())
// }).catch(e => {throw e}).finally(() => {
//   filterUpdate()
// })

/**
 * could build second view for each index for grid layout
 * grid: emit(name, element, weapon)
 * considering grid won't show the rest of the info in the doc
 */
function buildIndexes() {
  // create design document for index with a view for each filter type [element, rank, weapon]
  let ddoc = {
    _id: '_design/filter_index',
    views: {
      by_element: {
        map: (doc => emit(doc.element.toLowerCase())).toString()
      },
      by_rank: {
        map: (doc => emit(doc.rank)).toString()
      },
      by_weapon: {
        map: (doc => emit(doc.weapon.toLowerCase())).toString()
      }
    }
  }

  db.put(ddoc).catch(e => {
    if(e.name!=='conflict') throw(e)
  }).then(() => {
    return db.query('filter_index/by_element', {limit: 0})
  }).catch(e => {throw e}).then(() => {
    return db.query('filter_index/by_rank', {limit: 0})
  }).catch(e => {throw e}).then(() => {
    return db.query('filter_index/by_weapon', {limit: 0})
  }).catch(e => {throw e}).then()
}

function cleanup() {
  db.destroy().then().catch(e => {throw e})
}

function logDocs(docs) {
  console.log(JSON.stringify(docs))
}