import fs from 'fs';
import path from 'path';
import express, { Express, Response, NextFunction } from 'express';
import cors from 'cors';
import writeUsers from './writeUsers';
import { User, UserRequest } from './types';
import readUsers from './readUsers';

const app : Express = express();
const port = 8000;
export const dataFile = '../data/users.json';

let users: User[];

fs.readFile(path.resolve(__dirname, dataFile), (err, data) => {
  console.log('reading file ... ');
  if (err) throw err;
  users = JSON.parse(data.toString());
});

const addMsgToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
  if (users) {
    req.users = users;
    next();
  } else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  }
};

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(addMsgToRequest);

app.use('/read', readUsers);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/write', writeUsers);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
