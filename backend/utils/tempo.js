const connectDB = require("./utils/ConnectDB").ConnectDB
const express = require("express")
const app = express()
const port = 3000;
const cors = require("cors")
const Web3 = require('web3');


app.use(cors())
app.use(express.json())

//web3 setup
const web3 = new Web3(Web3.givenProvider || 'http://localhost:3000');


app.post('/login', async (req, res) => {
    const { address } = req.body;

    await ConnectDB();

  let user = await User.findOne({ address });

  if (!user) {
    user = new User({ address });
    await user.save();
  }

  res.send({ address: user.address, nonce: user.nonce });
});


app.post('/verify', async (req, res) => {
    const { address, signature } = req.body;
  
    const user = await User.findOne({ address });
  
    if (!user) {
      return res.status(400).send('User not found');
    }
  
    const message = `I am signing my one-time nonce: ${user.nonce}`;
    const signer = web3.eth.accounts.recover(message, signature);
  
    if (signer.toLowerCase() === address.toLowerCase()) {
      user.nonce = Math.floor(Math.random() * 10000);
      await user.save();
      res.send('Authentication successful');
    } else {
      res.status(400).send('Signature verification failed');
    }
  });




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
