const express = require('express')
const app = express()

app.use(express.json())

const port = process.env.PORT || 3000

const logins = [
    {email: 'acc@test.com', password: '1234'},
    {email: 'hello@mini.project', password: 'miniProj2'},
    {email: 'test@test.test', password: 'aBcDeF'}
]

app.post('/', (req, res) => {
    const email = req?.body?.email
    const password = req?.body?.password

    if (email == undefined || email == null) {
        return res.status(400).send('Email has not been received')
    }

    if (password == undefined || password == null) {
        return res.status(400).send('Password has not been received')
    }

    if (typeof email != 'string') {
        return res.status(400).send('Email must be a string')
    }

    if (typeof password != 'string') {
        return res.status(400).send('Password must be a string')
    }

    const userIndex = logins.findIndex(login => login.email == email)

    if (userIndex == -1) {
        return res.status(404).send(`No user could be found with email ${email}`)
    }

    if (logins[userIndex].password != password) {
        return res.status(401).send('Wrong password')
    }

    res.status(200).send('Successfully logged in')
})

app.listen(port, () => {
    console.log('Server is listening on port ' + port)
})