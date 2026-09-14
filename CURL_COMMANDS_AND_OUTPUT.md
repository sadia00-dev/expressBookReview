# expressBookReview — Curl Commands & Verified Output

These were tested against a locally running copy of the app (port 5000). Run the
same commands against **your own** server after pushing these files to your fork,
then screenshot the terminal output yourself for each task.

Start the server first: `node index.js` (from your repo root, with `index.js`
at the root and `booksdb.js`, `general.js`, `auth_users.js` inside `router/`).

---

## Task 1 — githubrepo
Confirms your repo is forked from the IBM template. Run this against **your**
fork (replace `<your-username>`):
```
curl -s https://api.github.com/repos/<your-username>/expressBookReview
```
Look for `"parent"` or `"source"` in the JSON pointing to
`ibm-developer-skills-network/expressBookReview`.

## Task 2 — getallbooks
```
curl -s http://localhost:5000/
```
```json
{
    "1": {"author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {}},
    "2": {"author": "Hans Christian Andersen", "title": "Fairy tales", "reviews": {}},
    "3": {"author": "Dante Alighieri", "title": "The Divine Comedy", "reviews": {}},
    "4": {"author": "Unknown", "title": "Beowulf", "reviews": {}},
    "5": {"author": "Unknown", "title": "One Thousand and One Nights", "reviews": {}},
    "6": {"author": "Unknown", "title": "Njal's Saga", "reviews": {}},
    "7": {"author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {}},
    "8": {"author": "Honore de Balzac", "title": "Le Père Goriot", "reviews": {}},
    "9": {"author": "Samuel Beckett", "title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {}},
    "10": {"author": "Giovanni Boccaccio", "title": "The Decameron", "reviews": {}}
}
```

## Task 3 — getbooksbyISBN
```
curl -s http://localhost:5000/isbn/1
```
```json
{"author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {}}
```

## Task 4 — getbooksbyauthor
```
curl -s "http://localhost:5000/author/Jane%20Austen"
```
```json
{"7": {"author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {}}}
```

## Task 5 — getbooksbytitle
```
curl -s "http://localhost:5000/title/Beowulf"
```
```json
{"4": {"author": "Unknown", "title": "Beowulf", "reviews": {}}}
```

## Task 6 — getbookreview
```
curl -s "http://localhost:5000/review/1"
```
```json
{}
```
(Empty until a review is added — see Task 9.)

## Task 7 — register
```
curl -s -X POST "http://localhost:5000/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```
```json
{"message":"User successfully registered. Now you can login"}
```

## Task 8 — login
```
curl -s -c cookies.txt -X POST "http://localhost:5000/customer/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```
```json
{"message":"User successfully logged in","accessToken":"<jwt token>"}
```
(`-c cookies.txt` saves the session cookie for the next two calls.)

## Task 9 — reviewadded (add/modify review)
```
curl -s -b cookies.txt -X PUT \
  "http://localhost:5000/customer/auth/review/1?review=Amazing%20book%20about%20colonial%20Nigeria"
```
```json
{"message":"Review for ISBN 1 has been added/updated","reviews":{"testuser":"Amazing book about colonial Nigeria"}}
```

## Task 10 — deletereview
```
curl -s -b cookies.txt -X DELETE "http://localhost:5000/customer/auth/review/1"
```
```json
{"message":"Review for ISBN 1 deleted","reviews":{}}
```

## Task 11 — general.js (async/await + Promises with Axios)
`general.js` includes three additional routes that fetch the same data via
Axios calls (some using `async/await`, one using `.then/.catch` promises):
- `GET /async/isbn/:isbn`
- `GET /async/author/:author`
- `GET /async/title/:title`

Tested output:
```
curl -s "http://localhost:5000/async/isbn/2"
{"author":"Hans Christian Andersen","title":"Fairy tales","reviews":{}}

curl -s "http://localhost:5000/async/author/Dante%20Alighieri"
{"3":{"author":"Dante Alighieri","title":"The Divine Comedy","reviews":{}}}

curl -s "http://localhost:5000/async/title/Beowulf"
{"4":{"author":"Unknown","title":"Beowulf","reviews":{}}}
```
Submit the GitHub URL of your `router/general.js` file for this task.

---

### Setup reminder for your own run
```
npm install express@4 jsonwebtoken express-session body-parser axios
node index.js
```
