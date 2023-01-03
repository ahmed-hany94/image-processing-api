import express, { Express, Request, Response } from 'express';

const app: Express = express();

// localhost:3000/api/images?filename=name&width=200&height=200

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello, world from my server</h1>');
});

app.get('/api', function (req: Request, res: Response) {
  console.log(req.query);
  if (req.query.filename && req.query.width && req.query.height) {
    res.status(200).send('<h1>Should be a file probably</h1>');
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(3000, () => {
  console.log(`Listening on http://localhost:3000`);
});

export { app };
