# Scratch
## Directory Layout
### Current
```
assets
┣ characters
┣ elements
┣ materials
┃ ┣ boss
┃ ┣ commonMaterial
┃ ┣ enhancement
┃ ┣ localSpecialty
┃ ┣ other
┃ ┣ rareMaterial
┃ ┣ shard
┃ ┣ talent
┃ ┗ weapon
┗ weapons
```
### Target
```
assets
┣ character
┣ weapon
┣ element
┗ material
  ┣ domain
  ┃ ┣ weapon
  ┃ ┗ talent
  ┣ boss
  ┣ elite
  ┃ ┣ crystal
  ┃ ┗ core
  ┣ rare
  ┣ common
  ┣ local
  ┗ other
```
# MVC Pattern in Context
## Model
+ Data
+ JSON

Model manages data, takes queries from the controller, and marshals responses. In this case the model is middleware (either a Falcor model and router, or a GraphQL server) that takes requests (paths or queries respectively), performs the DB access, packages the response, and returns data asynchronously in a shape matching the request.

See [Falcor](https://netflix.github.io/falcor/), [GraphQL](https://graphql.org/), [data.js](src/data.js)

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