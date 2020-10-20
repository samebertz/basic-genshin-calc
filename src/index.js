var model = new falcor.Model(characterData);

model.getValue('character.name')
  .then(function(name) {
    document.write(name);
  });

// on filter update -> new model query -> on result -> list view update
// listen: for element in getElementsByClass(filter-button) bind callback filterUpdate
/** filterUpdate: model.getValue(queryFromFilter())
 *  .then((response)=>updateListView(response)) */
/** updateListView: for item in response createListItem(fromTemplate(type))
 *  list.push(newItem)
 */

// on detail request -> new model query -> on result -> detail view update