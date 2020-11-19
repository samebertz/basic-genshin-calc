const TOTALEXP = [0,1000,2325,4025,6175,8800,11950,15675,20025,25025,30725,37175,44400,52450,61375,71200,81950,93675,106400,120175,135050,151850,169850,189100,209650,231525,254775,279425,305525,333100,362200,392850,425100,458975,494525,531775,570750,611500,654075,698500,744800,795425,848125,902900,959800,1018875,1080150,1143675,1209475,1277600,1348075,1424575,1503625,1585275,1669550,1756500,1846150,1938550,2033725,2131725,2232600,2341550,2453600,2568775,2687100,2808625,2933400,3061475,3192875,3327650,3465825,3614525,3766900,3922975,4082800,4246400,4413825,4585125,4760350,4939525,5122700]


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
  return [materials, mora]
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
  return db.get(name).then(doc => {
    return {doc: doc, materials: materials}
  }).catch(e => console.log(e))
}