# MVC Pattern in Context
## Model
+ Data
+ JSON

Model manages data, in this case as a locally cached Falcor model, which takes queries from the controller.

See [Falcor model](https://netflix.github.io/falcor/build/falcor.browser.js), [data.js](src/data.js)

## View
+ HTML/CSS
+ List elements

View formats are list elements and detail views.

See [...](...)

## Controller
+ JS
+ List search, filters, expand details

Controller handles user input in the form of search arguments, list element interactions, filter buttons. Composes query for the model.

See [index.js](src/index.js)