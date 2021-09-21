const express = require('express');
const User = require('./user.js');

const app = express();
const PORT = process.env.PORT || 3001;

User.sync({ alter: true });

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('signup'));

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.create({ email, password });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
