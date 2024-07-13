const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/*get home */
router.get('', async (req, res) => {
    try{
        const locals = {
            title: "Home page",
            description: "starter code"
        }

        let perPage = 10;
        let page = req.query.page || 1;
        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', { 
            locals, 
            data, 
            current: page, 
            nextPage : hasNextPage ? nextPage : null,
            currentRoute: '/'
        });
    }catch(error){
        console.log(error);
    }
    
});

/*get post id */
router.get('/post/:id', async (req, res ) => {
    try{
        let slug = req.params.id;
        const data = await Post.findById({ _id: slug });

        const locals = {
            title: "personal Blog",
            description: "starter code",
            currentRoute: `/post/${ slug }`
        }
        
        res.render('post', { locals, data });
    }
    catch(error){
        console.log(error);
    }
})

/*post post searchTerm */
router.post('/search', async (req, res) => {
    try{
        const locals = {
            title: "Search",
            description: "starter code"
        }

        let searchTerm = req.body.searchTerm;
        const SearchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await Post.find({
            $or: [
                {title: { $regex: new RegExp(SearchNoSpecialChar, 'i') }},
                {body: { $regex: new RegExp(SearchNoSpecialChar, 'i') }},
            ]
        });
        res.render("search", {
            data, 
            locals,
            currentRoute: '/'
        });
        
    }catch( error ){
        console.log(error);
    }
})




router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    });
});

router.get('/contact', (req, res) => {
    res.render('contact', {
            currentRoute: '/contact'
    });
});

// function insertPostData(){
//     Post.insertMany([
//         {
//             title: "Building a Blog",
//             body: "my first web!"
//         },
//         {
//             title: "Programming language C",
//             body: "Sorting the elements in array"
//         },
//         {
//             title: "Machine Learning",
//             body: "Transformer model with image recognition"
//         },
//         {
//             title: "Computer Systems",
//             body: "Stack in memory"
//         }
        
//     ])
// }
// insertPostData();

module.exports = router;
