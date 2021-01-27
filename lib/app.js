const express = require('express');
const Cat = require('./models/cat');
const app = express();

app.use(express.json());

app.post('/api/v1/cats', async(req, res, next) => {
  try {
    const createdCat = await Cat.insert(req.body);
    res.send(createdCat);
  } catch(error) {
    next(error);
  }
  
});

app.get('/api/v1/cats/:id', async(req, res, next) => {
  try {
    const foundCat = await Cat.findById(req.params.id);
    res.send(foundCat);

  } catch(error) {
    next(error);
  }

});

app.patch('/api/v1/cats/:id', async(req, res, next) => {
  try {
    const updatedCat = await Cat.update(req.params.id, req.body);
    res.send(updatedCat);

  } catch(error) {
    next(error);
  }
});

app.delete('/api/v1/cats/:id', async(req, res, next) => {
  try {
    const deletedCat = await Cat.delete(req.params.id);
    res.send(deletedCat);
  } catch(error) {
    next(error);
  }
});
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
