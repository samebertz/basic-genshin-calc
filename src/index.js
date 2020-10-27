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
    addListItem(doc)
  }
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
function addListItem(doc) {
  let item = document.createElement('div'),
      name = document.createElement('span'),
      nameString = document.createTextNode(doc.name),
      img = document.createElement('img'),
      imgPath = '/assets/characters/' + doc.name + ".png",
      weapon = document.createElement('span'),
      weaponString = document.createTextNode("Weapon: " + doc.weapon),
      localSpecialty = document.createElement('span'),
      localSpecialtyString = document.createTextNode("Local Specialty: " + doc.localSpecialty),
      commonMaterial = document.createElement('span'),
      commonMaterialString = document.createTextNode("Common Material: " + doc.commonMaterial)

  name.appendChild(nameString)
  name.classList.add('character-name')
  img.setAttribute('src', imgPath)
  img.classList.add('character-img')
  weapon.appendChild(weaponString)
  localSpecialty.appendChild(localSpecialtyString)
  commonMaterial.appendChild(commonMaterialString)
  item.replaceChildren(img, name, document.createElement('br'), weapon, document.createElement('br'), localSpecialty, document.createElement('br'), commonMaterial)

  item.classList.add('list-element')
  list.append(item)
}

/** listen: for element in getElementsByClass(filter-button)
 *  bind callback filterUpdate
 */
// TODO: run this after db populates and index views are built
for(element of filter) {
  element.addEventListener('click', filterUpdate, {capture: true})
}

// on detail request -> new model query -> on result -> detail view update