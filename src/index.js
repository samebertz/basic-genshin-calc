const STRINGS = {
  'localSpecialty': "Local Specialty",
  'commonMaterial': "Common Material"
}

const ASSETS = {
  characterImg: "/assets/characters/",
  elementImg: "/assets/elements/",
  weaponImg: "/assets/weapons/"
}

let main = document.getElementById('main'),
    filter = main.getElementsByClassName('filter-button'),
    list = document.getElementById('list')

// on filter update -> new model query -> on result -> list view update
/** filterUpdate: model.getValue(queryFromFilter())
 *  .then((response)=>updateListView(response))
 */
function filterUpdate(event) {
  if(!event?.target.classList.contains('filter-button')) return
  /**
   * update filter view, construct query, perform query, wait for result, update list view
   */
  list.replaceChildren()
  // fetch current filter options from view OR keep filter state ???

  /**
   * toggle filter active state class
   */
  if(event?.target.classList.contains('active-filter'))
    event.target.classList.remove('active-filter')
  else
    event?.target.classList.add('active-filter')

  /**
   * fetch filter options from view
   */
  activeFilters = []
  for(element of filter) {
    if(element.classList.contains('active-filter'))
      activeFilters.push(element.id)
  }

  // TODO: split query out, so initial "all" query after view indexes are built/checked isn't called through filterUpdate so can avoid optional chaining on event
  if(activeFilters.length == 0)
    db.allDocs({include_docs: true}).then(/*logDocs*/).catch()
  else
    // for(element of activeFilters) {
    //   db.query('filter_index/by_element', {
    //     key: element,
    //     include_docs: true
    //   }).then(docs => {
    //     logDocs(docs)
    //     updateListView(docs.rows.map(e => e.doc))
    //   }).catch(e => console.log(e))
    // }
    
    db.query('filter_index/by_element', {
      keys: activeFilters,
      include_docs: true
    }).then(docs => {
      // logDocs(docs)
      updateListView(docs.rows.map(e => e.doc).sort((a,b)=>{return a.name>b.name}))
    }).catch(e => console.log(e))
}

/** updateListView: for item in response createListItem(fromTemplate(type))
 *  list.push(newItem)
 */
function updateListView(docs) {
  logDocs(docs)
  for(doc of docs) {
    list.append(listItemFromCharacterDoc(doc))
  }
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
 * doc: 
 *  {
 *    name: string,
 *    rank: int,
 *    element: string,
 *    weapon: string,
 *    commonmaterial: string,
 *    localspecialty: string
 *  }
 */
function listItemFromCharacterDoc(doc) {
  let item = document.createElement('div'),
      characterInfo = document.createElement('div'),
      infoCol = document.createElement('div')

  infoCol.classList.add('info-col-1')
  for(info of ['localSpecialty', 'commonMaterial']) {
    infoCol.appendChild(buildInfoBlock(STRINGS[info], doc[info]))
  }

  characterInfo.classList.add('character-info')
  characterInfo.replaceChildren(infoCol)

  item.classList.add('list-element')
  item.replaceChildren(
    buildCharacterBadge(doc.name, doc.element, doc.weapon),
    characterInfo
  )

  return item
}

/** listen: for element in getElementsByClass(filter-button)
 *  bind callback filterUpdate
 */
// TODO: run this after db populates and index views are built
for(element of filter) {
  element.addEventListener('click', filterUpdate, {capture: true})
}

// on detail request -> new model query -> on result -> detail view update