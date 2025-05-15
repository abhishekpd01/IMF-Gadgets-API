require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const gadgetsRoutes = require('./routes/gadgets')
const userRoutes = require('./routes/user');
const { restrictedToLoggedIn } = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/gadgets', restrictedToLoggedIn, gadgetsRoutes);
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Gadgets⚙️ API!'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
})