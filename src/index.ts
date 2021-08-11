import express = require('express');
import * as uuid from 'uuid';
import * as fs from 'fs';
const fileUpload = require('express-fileupload');

var staticS = require('node-static');

var fileServer = new staticS.Server();

export const ROOT_DIR = './files';

const app = express();

app.use(fileUpload());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Domain");
    next();
});

app.post('/upload', function (req: any, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;

    console.log(`File mime type: '${file.mimetype}'`);
    console.log(`File size: '${file.size}'`);

    const extension = getExtension(file.mimetype);

    const identifier = uuid.v4();
    const fileName = identifier + extension;

    file.mv(`${ROOT_DIR}/${fileName}`, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200);
        res.json({ name: fileName });
    });

});

app.get('/*', (req, res) => {
    const date = new Date().toISOString();
    console.log(' ');
    console.log(`${date} --->  Get request`, req.url);
    const path = ROOT_DIR + req.url;

    try {
        if (fs.existsSync(path)) {
            fileServer.serveFile(path, 200, {}, req, res);
        } else {
            res.status(404);
            res.end();
        }
    } catch (err) {
        console.error(err);
        res.status(404);
        res.end();
    }
});

app.listen(process.env.LISTEN_PORT);

function getExtension(mimetype: string): string {
    return {
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/gif': '.gif',
    }[mimetype] || '';
};
