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
    for(element of activeFilters) {
      db.query('filter_index/by_element', {
        key: element,
        include_docs: true
      }).then(docs => {
        logDocs(docs)
        updateListView(docs.rows.map(e => e.doc))
      }).catch(e => console.log(e))
    }
}

/** updateListView: for item in response createListItem(fromTemplate(type))
 *  list.push(newItem)
 */
function updateListView(docs) {
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
      imgPath = '/assets/characters/' + doc.name + ".png"

  name.appendChild(nameString)
  name.classList.add('character-name')
  img.setAttribute('src', imgPath)
  img.classList.add('character-img')
  item.replaceChildren(img, name)

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