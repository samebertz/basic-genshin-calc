const TOTALEXP = [0,0,1000,2325,4025,6175,8800,11950,15675,20025,25025,30725,37175,44400,52450,61375,71200,81950,93675,106400,120175,135050,151850,169850,189100,209650,231525,254775,279425,305525,333100,362200,392850,425100,458975,494525,531775,570750,611500,654075,698500,744800,795425,848125,902900,959800,1018875,1080150,1143675,1209475,1277600,1348075,1424575,1503625,1585275,1669550,1756500,1846150,1938550,2033725,2131725,2232600,2341550,2453600,2568775,2687100,2808625,2933400,3061475,3192875,3327650,3465825,3614525,3766900,3922975,4082800,4246400,4413825,4585125,4760350,4939525,5122700,5338925,5581950,5855050,6161850,6506450,6893400,7327825,7815450,8362650]


/**
 * Character level up calculations
 */
function calculateXPMaterials(xp) {
  let book3 = Math.floor(xp / 20000)
  let book2 = Math.floor((xp - book3 * 20000) / 5000)
  let book1 = Math.ceil((xp - book3 * 20000 - book2 * 5000) / 1000)
  return [book1, book2, book3]
}
function calculateMoraForXPMaterials(materials) {
  return .2 * (materials[2]*20000 + materials[1]*5000 + materials[0]*1000)
}
function getLevelCost(from, to) {
  fromXP = TOTALEXP[from], toXP = TOTALEXP[to]
  materials = calculateXPMaterials(toXP - fromXP)
  mora = calculateMoraForXPMaterials(materials)
  // console.log("getlvlcost "+materials)
  return {xpbooks: materials, mora: mora}
}


const ASCENSIONMATS = {
  0: {
    "crystal rarity": 0,
    "crystal amount": 0,
    "core amount": 0,
    "local amount": 0,
    "common rarity": 0,
    "common amount": 0,
    "level": 0,
    "mora": 0,
    "ar": 0,
    "max level": 20,
    "max talent": 1,
    "unlock": "None"
  },
  1: {
    "crystal rarity": 1,
    "crystal amount": 1,
    "core amount": 0,
    "local amount": 3,
    "common rarity": 1,
    "common amount": 3,
    "level": 20,
    "mora": 20000,
    "ar": 15,
    "max level": 40,
    "max talent": 1,
    "unlock": "Passive Talent 1"
  },
  2: {
    "crystal rarity": 2,
    "crystal amount": 3,
    "core amount": 2,
    "local amount": 10,
    "common rarity": 1,
    "common amount": 15,
    "level": 40,
    "mora": 40000,
    "ar": 25,
    "max level": 50,
    "max talent": 2,
    "unlock": "None"
  },
  3: {
    "crystal rarity": 2,
    "crystal amount": 6,
    "core amount": 4,
    "local amount": 20,
    "common rarity": 2,
    "common amount": 12,
    "level": 50,
    "mora": 60000,
    "ar": 30,
    "max level": 60,
    "max talent": 4,
    "unlock": "None"
  },
  4: {
    "crystal rarity": 3,
    "crystal amount": 3,
    "core amount": 8,
    "local amount": 30,
    "common rarity": 2,
    "common amount": 18,
    "level": 60,
    "mora": 80000,
    "ar": 35,
    "max level": 70,
    "max talent": 6,
    "unlock": "Passive Talent 2"
  },
  5: {
    "crystal rarity": 3,
    "crystal amount": 6,
    "core amount": 12,
    "local amount": 45,
    "common rarity": 3,
    "common amount": 16,
    "level": 70,
    "mora": 100000,
    "ar": 40,
    "max level": 80,
    "max talent": 8,
    "unlock": "None"
  },
  6: {
    "crystal rarity": 4,
    "crystal amount": 6,
    "core amount": 20,
    "local amount": 60,
    "common rarity": 3,
    "common amount": 24,
    "level": 80,
    "mora": 120000,
    "ar": 45,
    "max level": 90,
    "max talent": 10,
    "unlock": "None"
  }
}

const TALENTMATS = {
  1: {
    "ascension": 0,
    "teaching amount": 0,
    "teaching rarity": 0,
    "common amount": 0,
    "common rarity": 0,
    "mora": 0,
    "boss amount": 0
  },
  2: {
    "ascension": 2,
    "teaching amount": 3,
    "teaching rarity": 2,
    "common amount": 6,
    "common rarity": 1,
    "mora": 12500,
    "boss amount": 0
  },
  3: {
    "ascension": 3,
    "teaching amount": 2,
    "teaching rarity": 3,
    "common amount": 3,
    "common rarity": 2,
    "mora": 17500,
    "boss amount": 0
  },
  4: {
    "ascension": 3,
    "teaching amount": 4,
    "teaching rarity": 3,
    "common amount": 4,
    "common rarity": 2,
    "mora": 25000,
    "boss amount": 0
  },
  5: {
    "ascension": 4,
    "teaching amount": 6,
    "teaching rarity": 3,
    "common amount": 6,
    "common rarity": 2,
    "mora": 30000,
    "boss amount": 0
  },
  6: {
    "ascension": 4,
    "teaching amount": 9,
    "teaching rarity": 3,
    "common amount": 9,
    "common rarity": 2,
    "mora": 37500,
    "boss amount": 0
  },
  7: {
    "ascension": 5,
    "teaching amount": 4,
    "teaching rarity": 4,
    "common amount": 4,
    "common rarity": 3,
    "mora": 120000,
    "boss amount": 1
  },
  8: {
    "ascension": 5,
    "teaching amount": 6,
    "teaching rarity": 4,
    "common amount": 6,
    "common rarity": 3,
    "mora": 260000,
    "boss amount": 1
  },
  9: {
    "ascension": 6,
    "teaching amount": 12,
    "teaching rarity": 4,
    "common amount": 9,
    "common rarity": 3,
    "mora": 450000,
    "boss amount": 2
  },
  10: {
    "ascension": 6,
    "teaching amount": 16,
    "teaching rarity": 4,
    "common amount": 12,
    "common rarity": 3,
    "mora": 700000,
    "boss amount": 2
  }
}

/**
 * Character ascension calculations
 */
function getAscensionCost(name, from, to) {
  let materials = {
    element: {
      crystal: [0,0,0,0],
      core: 0
    },
    local: 0,
    common: [0,0,0],
    mora: 0
  }
  for(let i=from+1; i<=to; i++) {
    materials.element.crystal[ASCENSIONMATS[i]['crystal rarity']-1] += ASCENSIONMATS[i]['crystal amount']
    materials.element.core += ASCENSIONMATS[i]['core amount']
    materials.local += ASCENSIONMATS[i]['local amount']
    materials.common[ASCENSIONMATS[i]['common rarity']-1] += ASCENSIONMATS[i]['common amount']
    materials.mora += ASCENSIONMATS[i]['mora']
  }
  // return db.get(name).then(doc => {
  //   return {doc: doc, materials: materials}
  // }).catch(e => console.log(e))
  return materials
}

/**
 * Character talent level up calculations
 */
function getTalentCost(name, from, to) {
  let materials = {
    teaching: [0,0,0],
    common: [0,0,0],
    boss: 0,
    mora: 0
  }
  for(let i=from+1; i<=to; i++) {
    materials.teaching[TALENTMATS[i]['teaching rarity']-2] += TALENTMATS[i]['teaching amount']
    materials.common[TALENTMATS[i]['common rarity']-1] += TALENTMATS[i]['common amount']
    materials.mora += TALENTMATS[i]['mora']
    materials.boss += TALENTMATS[i]['boss amount']
  }
  // return db.get(name).then(doc => {
  //   return {doc: doc, materials: materials}
  // }).catch(e => console.log(e))
  return materials
}

function getCost(name, lFrom, lTo, aFrom, aTo, t1From, t1To, t2From, t2To, t3From, t3To) {
  // console.log("getCost("+[].slice.call(arguments)+")")
  let costs = [
    getAscensionCost(name, aFrom, aTo),
    getTalentCost(name, t1From, t1To),
    getTalentCost(name, t2From, t2To),
    getTalentCost(name, t3From, t3To)
  ], levelCost = getLevelCost(lFrom, lTo)
  costs.unshift(levelCost)
  let tCosts = costs.slice(2,5)
  // console.log(costs, tCosts)
  let materials = {
    xpbooks: costs[0].xpbooks,
    element: costs[1].element,
    local: costs[1].local,
    common: costs.slice(1,5).reduce((a, c) => a.map((_c, i) => _c + c.common[i]), [0,0,0]),
    teaching: tCosts.reduce((a, c) => a.map((_c, i) => _c + c.teaching[i]), [0,0,0]),
    boss: tCosts.reduce((a, c) => a + c.boss, 0),
    mora: costs.reduce((a, c) => a + c.mora, 0)
  }
  // console.log(materials.teaching)

  return db.get(name).then(doc => {
    return {doc: doc, materials: materials}
  }).catch(e => console.log(e))
}