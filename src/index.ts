import express, { Express, Request, Response } from 'express';
import sharp from 'sharp';
import { promises as fsPromises } from 'fs';
import path from 'path';

const app: Express = express();
app.use(express.static(__dirname + '/assets'));
const PORT = process.env.PORT || 3000;

// localhost:3000/api/images?filename=name&width=200&height=200
// localhost:3000/api/images?filename=fjord.jpg&width=200&height=200
// localhost:3000/api/images?filename=icelandwaterfall.jpg&width=200&height=200
// localhost:3000/api/images?filename=santamonica.jpg&width=200&height=200
// localhost:3000/api/images?filename=palmtunnel.jpg&width=200&height=200

async function checkIfFileExists(filePath: string): Promise<boolean> {
  try {
    await fsPromises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

app.get('/', (_, res: Response) => {
  res.redirect('/api/images');
});

app.get(
  '/api/images',
  async function (req: Request, res: Response): Promise<void> {
    try {
      const filename = req.query.filename as string;
      const width = parseInt(req.query.width as string);
      const height = parseInt(req.query.height as string);
      let fname = '';
      let extension = '';

      if (filename && width && height) {
        // TODO: What happens if the same image gets converted n-times
        // should I overwrite it each time or save it like I am now?
        // TODO: Caching
        // TODO: support other image formats
        // TODO: Allow for multiple sizes for the same image
        // TODO: explore sharp
        // TODO: add logging
        // TODO: create front-end for upload, display, editing
        // Reference: https://review.udacity.com/#!/rubrics/3005/view
        if (filename.split('.').length === 2) {
          fname = filename.split('.')[0];
          extension = filename.split('.')[1];
        } else {
          fname = filename;
          extension = 'jpg';
        }

        const filePath = `./assets/full/${fname}.${extension}`;
        if (await checkIfFileExists(filePath)) {
          const imgBuffer = await fsPromises.readFile(filePath);

          await sharp(imgBuffer)
            .resize(width, height)
            .toFile(`./assets/thumb/${fname}-${width}-${height}.${extension}`);

          res
            .status(200)
            .sendFile(
              path.resolve(
                __dirname +
                  `/../assets/thumb/${fname}-${width}-${height}.${extension}`
              )
            );
        } else {
          res.status(404).send(`
          <h1>There was an error processing this file. File may not exist.</h1>
        `);
        }
      } else if (
        filename === undefined &&
        width === undefined &&
        height === undefined
      ) {
        let html = `
        <h1>Hello, world from my server</h1>
        <p>Files avaiable to be converted in the 'full' directory</p>
        <ul>
      `;

        await (
          await fsPromises.readdir('./assets/full/')
        ).forEach((file) => (html += `<li>${file}</li>`));
        html += '</ul>';
        res.status(200).send(html);
      } else {
        if (!filename) {
          res.status(404).send(`
            <h1>There was an error processing this file. Must specify filename.</h1>
        `);
        }

        if (!width || !height) {
          res.status(404).send(`
            <h1>There was an error processing this file. Must specify width & height.</h1>
        `);
        }
      }
    } catch (e) {
      res.status(404).send(`
        <h1>There was an error processing this file</h1>
        <p>/api/images?filename=name[.extension]&width=width-value&height=height-value</p>
    `);
    }
  }
);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

export { app };
