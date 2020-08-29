var mongoose 	= require("mongoose");
var Lake 		= require("./models/lake");
var Comment   	= require("./models/comment");
 
var seeds = [
    {
        name:"Steel Ridge" ,
 	image:"https://images.unsplash.com/photo-1439066290691-510066268af5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	description:"This is a very nice lake with amazing views, the aroma of pine needles fills the brisk air.",
	author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
	
    },
    {
        name: "Great hills Lake", 
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
		 author:{
            id : "588c2e092403d111454fff71",
            username: "Jill"
        }
    },
    {
        name: "Flying Resevoir", 
        image: "https://images.unsplash.com/photo-1529440547539-b8500cf6c0c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
		author:{
            id : "588c2e092403d111454fff77",
            username: "Jane"
        }

    }
]

async function seedDB(){
    try {
        await Lake.deleteMany({});
        console.log('Lakes removed');
        await Comment.deleteMany({});
        console.log('Comments removed');

        for(const seed of seeds) {
            let lake = await Lake.create(seed);
            console.log('Lake created');
            let comment = await Comment.create(
                {
                    text: 'This place is great, but I wish there was internet',
                             author:{
								id : "588c2e092403d111454fff77",
								username: "Jane"
							}
                }
            )
            console.log('Comment created');
            lake.comments.push(comment);
            lake.save();
            console.log('Comment added to lake');
        }
    } catch(err) {
        console.log(err);
    }
}

 
module.exports = seedDB;