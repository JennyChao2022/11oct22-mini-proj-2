const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 3000

const logins = [
    {username: 'account1234', password: 'a123!'},
    {username: 'accone', password: 'miniProj2$$'},
    {username: 'accountOne', password: 'aBcDeF12!'}
]

function isAlphaNumeric(str) { //Modified from https://stackoverflow.com/a/25352300
    const len = str.length
  
    for (let i = 0; i < len; i++) {
      const code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
};

function numbersOnlyAtEndOfString(str) {
    let firstNumberIndex;
    const length = str.length;

    for (let i = 0; i < length; i++) {
        const code = str.charCodeAt(i)
        if (code > 47 && code < 58) {
            firstNumberIndex = i;
            break;
        }
    }

    if (firstNumberIndex == undefined) return true;

    const slicedString = str.slice(firstNumberIndex + 1)

    for (let i = 0; i < slicedString.length; i++) {
        const code = slicedString.charCodeAt(i)
        if (!(code > 47 && code < 58)) return false
    }

    return true;
}

function stringStartsWithLetter(str) {
    const code = str.charCodeAt(0)
    if ((code > 64 && code < 91) || (code > 96 && code < 123)) return true;
    else return false;
}

function stringContainsSpecialCharacters(str) { // From https://bobbyhadz.com/blog/javascript-check-if-string-contains-special-characters
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}

function hasNumber(myString) { // From https://stackoverflow.com/a/28813213
    return /\d/.test(myString);
}

app.post('/', (req, res) => {
    const username = req?.body?.username
    const password = req?.body?.password

    if (username == undefined || username == null) {
        return res.status(400).send('Username has not been received')
    }

    if (password == undefined || password == null) {
        return res.status(400).send('Password has not been received')
    }

    if (typeof username != 'string') {
        return res.status(400).send('Username must be a string')
    }

    if (typeof password != 'string') {
        return res.status(400).send('Password must be a string')
    }

    if (username.length < 5) {
        return res.status(400).send('The username is less than 5 characters. Your form should prevent usernames with less than 5 characters from being submitted.')
    }

    if (!isAlphaNumeric(username)) {
        return res.status(400).send('The username includes non-alphanumeric characters. Your form should prevent usernames with non-alphanumeric characters from being submitted.')
    }

    if (!numbersOnlyAtEndOfString(username)) {
        return res.status(400).send('The username must only have numbers at the end of the string. Your form should prevent usernames from having numbers in the middle of them from being submitted.')
    }

    if (password.length < 5) {
        return res.status(400).send('The password is less than 5 characters. Your form should prevent passwords with less than 5 characters from being submitted.')
    }

    if (!stringStartsWithLetter(password)) {
        return res.status(400).send('The password does not start with a letter. Your form should prevent passwords that do not start with a letter from being submitted.')
    }

    if (!stringContainsSpecialCharacters(password)) {
        return res.status(400).send('The password does not have a special character in it. Your form should prevent passwords that do not have a special character from being submitted.')
    }

    if (!hasNumber(password)) {
        return res.status(400).send('The password does not have a number in it. Your form should prevent passwords that do not have a number in them from being submitted.')
    }

    const userIndex = logins.findIndex(login => login.username == username)

    if (userIndex == -1) {
        return res.status(404).send(`No user could be found with username ${username}`)
    }

    if (logins[userIndex].password != password) {
        return res.status(401).send('Wrong password')
    }

    res.status(200).send('Successfully logged in')
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/index.html'))
})

app.listen(port, () => {
    console.log('Server is listening on port ' + port)
})