var model = new falcor.Model(characterData);

model.getValue('character.name')
    .then(function(name) {
        document.write(name);
    });