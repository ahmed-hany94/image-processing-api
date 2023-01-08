import express, { Express, Request, Response } from 'express';
import sharp from 'sharp';
import { promises as fsPromises } from 'fs';
import path from 'path';

const app: Express = express();
app.use(express.static(__dirname + '/assets'));

// localhost:3000/api/images?filename=name&width=200&height=200
// localhost:3000/api/images?filename=fjord.jpg&width=200&height=200
// localhost:3000/api/images?filename=icelandwaterfall.jpg&width=200&height=200
// localhost:3000/api/images?filename=santamonica.jpg&width=200&height=200
// localhost:3000/api/images?filename=palmtunnel.jpg&width=200&height=200

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello, world from my server</h1>');
});

app.get('/api/images', async function (req: Request, res: Response) {
  try {
    const filename = req.query.filename as string;
    const width = parseInt(req.query.width as string);
    const height = parseInt(req.query.height as string);
    let fname = '';
    let extension = '';

    if (filename && width && height) {
      // TODO: check that image exists in full folder
      //       read the image to send to sharp
      //       check that image is not corrupted
      if (filename.split('.').length === 2) {
        fname = filename.split('.')[0];
        extension = filename.split('.')[1];
      } else {
        fname = filename;
        extension = 'jpg';
      }
      const imgBuffer = await fsPromises.readFile(
        `./assets/full/${fname}.${extension}`
      );
      const img = await sharp(imgBuffer)
        .resize(width, height)
        .toFile(`./assets/thumb/${fname}-${width}-${height}.${extension}`);
      res.status(200).sendFile(
        // `<img src="${req.protocol}://${req.get('host')}${req.url}"></img>`
        path.resolve(
          __dirname +
            `/../assets/thumb/${fname}-${width}-${height}.${extension}`
        )
      );
    } else {
      res.status(404).send('Not Found');
    }
  } catch (e) {
    // throw an error
    console.log(e);
  }
});

app.listen(3000, () => {
  console.log(`Listening on http://localhost:3000`);
});

export { app };
