let characterData = [
    {
        name: "Amber",
        rank: 4,
        element: "Pyro",
        weapon: "Bow",
        local: "Small Lamp Grass",
        common: "Firm Arrowhead",
        weekly: "Small Lamp Grass",
        talent: "Small Lamp Grass"
    },
    {
        name: "Barbara",
        rank: 4,
        element: "Hydro",
        weapon: "Catalyst",
        local: "Philanemo Mushroom",
        common: "Divining Scroll"
    },
    {
        name: "Beidou",
        rank: 4,
        element: "Electro",
        weapon: "Claymore",
        local: "Noctilucous Jade",
        common: "Treasure Hoarder Insignia"
    },
    {
        name: "Bennett",
        rank: 4,
        element: "Pyro",
        weapon: "Sword",
        local: "Windwheel Aster",
        common: "Treasure Hoarder Insignia"
    },
    {
        name: "Chongyun",
        rank: 4,
        element: "Cryo",
        weapon: "Claymore",
        local: "Cor Lapis",
        common: "Damaged Mask"
    },
    {
        name: "Diluc",
        rank: 5,
        element: "Pyro",
        weapon: "Claymore",
        local: "Small Lamp Grass",
        common: "Recruit's Insignia"
    },
    {
        name: "Fischl",
        rank: 4,
        element: "Electro",
        weapon: "Bow",
        local: "Small Lamp Grass",
        common: "Firm Arrowhead"
    },
    {
        name: "Jean",
        rank: 5,
        element: "Anemo",
        weapon: "Sword",
        local: "Dandelion Seed",
        common: "Damaged Mask"
    },
    {
        name: "Kaeya",
        rank: 4,
        element: "Cryo",
        weapon: "Sword",
        local: "Calla Lily",
        common: "Treasure Hoarder Insignia"
    },
    {
        name: "Keqing",
        rank: 5,
        element: "Electro",
        weapon: "Sword",
        local: "Cor Lapis",
        common: "Whopperflower Nectar"
    },
    {
        name: "Lisa",
        rank: 4,
        element: "Electro",
        weapon: "Catalyst",
        local: "Valberry",
        common: "Slime Condensate"
    },
    {
        name: "Mona",
        rank: 5,
        element: "Hydro",
        weapon: "Catalyst",
        local: "Philanemo Mushroom",
        common: "Whopperflower Nectar"
    },
    {
        name: "Ningguang",
        rank: 4,
        element: "Geo",
        weapon: "Catalyst",
        local: "Glaze Lily",
        common: "Recruit's Insignia"
    },
    {
        name: "Noelle",
        rank: 4,
        element: "Geo",
        weapon: "Claymore",
        local: "Valberry",
        common: "Damaged Mask"
    },
    {
        name: "Qiqi",
        rank: 5,
        element: "Cryo",
        weapon: "Sword",
        local: "Violetgrass",
        common: "Divining Scroll"
    },
    {
        name: "Razor",
        rank: 4,
        element: "Electro",
        weapon: "Claymore",
        local: "Wolfhook",
        common: "Damaged Mask"
    },
    {
        name: "Sucrose",
        rank: 4,
        element: "Anemo",
        weapon: "Catalyst",
        local: "Windwheel Aster",
        common: "Whopperflower Nectar"
    },
    {
        name: "Traveler",
        rank: 5,
        element: "Adaptive",
        weapon: "Sword",
        local: "Windwheel Aster",
        common: "Damaged Mask"
    },
    {
        name: "Venti",
        rank: 5,
        element: "Anemo",
        weapon: "Bow",
        local: "Cecilia",
        common: "Slime Condensate"
    },
    {
        name: "Xiangling",
        rank: 4,
        element: "Pyro",
        weapon: "Polearm",
        local: "Jueyun Chili",
        common: "Slime Condensate"
    },
    {
        name: "Xingqiu",
        rank: 4,
        element: "Hydro",
        weapon: "Sword",
        local: "Silk Flower",
        common: "Damaged Mask"
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
      },
      by_triple: {
        map: (doc => emit([doc.element.toLowerCase(), doc.rank, doc.weapon.toLowerCase()])).toString()
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
  }).catch(e => {throw e}).then(() => {
    return db.query('filter_index/by_triple', {limit: 0})
  }).catch(e => {throw e}).then()
}

function cleanup() {
  db.destroy().then().catch(e => {throw e})
}

function logDocs(docs, clean=false) {
  if(clean)
    console.log(JSON.stringify(docs.rows.map(e => e.doc)))
  else
    console.log(JSON.stringify(docs))
}