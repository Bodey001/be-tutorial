const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const sequelize = require('./config/sequelize');
const User = require('./model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




const app = express();
app.use(express.json())        //initialise a middleware to post data from forms;


const mockUser = [
    {
        id: 1,
        username: "Jane Doe",
        email: "example1@gmail.com",
    },
    {
        id: 2,
        username: "Mike Ross",
        email: "example2@gmail.com",
    },
    {
        id: 3,
        username: "Harvey Specter",
        email: "example3@gmail.com",
    },
];
// const product = [
//     {
//         id: 1,
//         name: "Nivea body Lotion",
//         price: 5000,
//     },
//     {
//         id: 2,
//         name: "Apple Macbook Pro",
//         price: 2000000,
//     },
//     {
//         id: 3,
//         name: "6-chair livingroom set",
//         price: 450000,
//     },
// ];
const mockProduct = [
    {
        id: 1,
        name: "Shoe",
        description: "This is a description"
    },
    {
        id: 2,
        name: "bag",
        description: "This is a description"
    },
    {
        id: 3,
        name: "bag",
        description: "This is a description"
    },
];





// //                  GET
// app.get("/", (req, res) => {
//   res.status(304).send("<h1> Server is still up</h1>");
// });
// app.get("/users", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "User Retrieved Successfully", user: mockUser});
// });
// app.get("/product", (req, res) => {
//     const name = req.query.name;

//     if (name) {
//         const product = mockProduct.filter((product) => product.name == name);
//         return res
//             .status(200)
//             .json({ message: "This is a product route", product: product })
//     }
//     return res
//         .status(200)
//         .json({ message: "Products Retrieved Successfully ", product: mockProduct });
// });
// app.get("/product/:id/:name", (req, res) => {
//     const params = req.params.id;

//     const product = mockProduct.find((product) => product.id == id);
    
//     res
//         .status(200)
//         .json({message: `products with id: ${id} retrieved successfully`, product: mockProduct });
// });
// //              POST
// app.post("/product", (req, res) => {
//     const name = req.body.name;
//     const description = req.body.description;

//     const newProduct = {
//         id: mockProduct.length + 1,
//         name: name,
//         description: description
//     }

//     mockProduct.push(newProduct);
//     return res.status(201).json({ message: "product created successfully", mockProduct });
// });
// app.post('/users', async (req, res) => {
//     const { name, email, password } = req.body;

//     const newUser = {
//         name,
//         email,
//         password,
//     };

//     await User.create(newUser);
//     return res.status(201).json({ message: "User Created Successfully"});
// });
// //              PATCH
// app.patch('/product', (req, res) => {
//     const name = req.body.name;

//     const editedProduct = mockProduct.map((product) => {
//         if(product.id == 2) {
//             return {...product, name: name};
//         }
//         return product;
//     })

//     return res.status(201).json({ message: 'product with the id of 2 has been updated', editedProduct});
// });
// //          DELETE
// app.delete('/product', (req, res) => {
//     const id = req.params.id;

//     mockProduct.filter((product) => product.id == id);
//     return res.status(201).json({ message: `product with id: ${id} has been removed`, mockProduct});
// })







//                   Authentication and Authorization

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(403).json({ message: 'You must provide a valid input'})
    };

    const user = await User.findOne({ where: { email }});
    if(user) {
        return res.status(403).json({ message: 'Sorry a user with this email already exist'});
    };

    if(password.length < 6) {
        return res.status(403).json({ message: 'Password is too short'})
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { 
        name,
        email,
        password: hashedPassword
    };
    await User.create(newUser);
    return res.status(201).json({message: "User created successfully"});
});





app.post('/login', async (req, res) => {
    const { email, password} = req.body;

    try {
        const user = await User.findOne({ where: {email}});

        if(!user) {
            return res.status(404).json({ message: "This User does not exist in our record"});
        };

        const checkPassword = await bcrypt.compare( password, user.password);

        if (!checkPassword) {
            return res.status(403).json({ message: 'Incorrect Credential'})
        };


        const accessToken = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET
        );

        return res.status(200).json({ message: 'Login successfully'});
    } catch (error) {
        res.status(500).json({message: `Internal Server Error ${error.message}`});
        console.log(error);
    };
});






app.listen(3000, async () => {
    try {
        await sequelize.sync();
    } catch (error) {
        console.log('There was an error connecting to the database' + error)
    }
  console.log("Server is running on http://localhost:3000");
});