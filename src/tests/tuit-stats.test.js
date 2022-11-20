import TuitStats from "../components/tuits/tuit-stats";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {createTuit, deleteTuit, findAllTuits, findTuitById} from "../services/tuits-service";
import {createUser, deleteUsersByUsername} from "../services/users-service";
import {userTogglesTuitLikes} from "../services/likes-service";
import axios from "axios";

// list of static mocked users and tuits for testing
const MOCKED_USERS = [
    {username: "alice", password: 'alice123', email: 'alice@alice.com', id: '123'},
    {username: "bob", password: '123bob', email: 'bob@bob.com', id: '987'},
    {username: "charlie", password: 'charlie321', email: 'charlie@charlie.com', id: '555'}
];

const MOCKED_TUITS = [
    {
        tuit: "alice's tuit",
        published: new Date().toLocaleDateString(),
        postedBy: MOCKED_USERS[0],
        id: '1',
        stats: {
            likes: 0,
            dislikes: 0
        }
    },
    {
        tuit: "bob's tuit",
        published: new Date('2022-01-01').toLocaleDateString(),
        postedBy: MOCKED_USERS[1],
        id: '2',
        stats: {
            likes: 1,
            dislikes: -1
        }
    },
    {
        tuit: "charlie's tuit",
        published: new Date('2022-12-25').toLocaleDateString(),
        postedBy: MOCKED_USERS[2],
        id: '3',
        stats: {
            likes: -2,
            dislikes: 2
        }
    }
];

// just render each of our mocked tuit array above
test('tuit-stats renders static tuits', () => {
    for (const tuit of MOCKED_TUITS) {
        render(
            <HashRouter>
                <TuitStats tuit={tuit}/>
            </HashRouter>
        );

        // the like and dislike values should both be there
        const likes = tuit.stats.likes;
        const likeStat = screen.getAllByText(likes);
        const dislikes = tuit.stats.dislikes;
        const dislikeStat = screen.getAllByText(dislikes);

        // make sure both of our stats are showing on the page
        for (const stat of likeStat){
            expect(stat).toBeInTheDocument();
        }
        for (const stat of dislikeStat){
            expect(stat).toBeInTheDocument();
        }
    }
});

// now use axios to get some values we put in the remote DB
describe('use axios with async', () => {
    const tuit = MOCKED_TUITS[2];
    const user = MOCKED_USERS[2];

    // make sure any matching user is gone + insert our user and tuit
    beforeAll(async () => {
        await deleteUsersByUsername(user.username)
        // create the user
        const newUser = await createUser(user);
        tuit.postedBy = newUser.id;
        // create the tuit
        const newTuit = await createTuit(newUser.id, tuit.tuit);
        tuit.id = newTuit.id;
    });

    // clean up any inserts
    afterAll( async () => {
        await deleteTuit(tuit.id);
        await deleteUsersByUsername(user.username);
    });

    test('tuit stats renders async', async () => {
        // toggle our likes, then grab the tuit
        await userTogglesTuitLikes(tuit.postedBy, tuit.id);
        let foundTuit = await findTuitById(tuit.id);
        render(
            <HashRouter>
                <TuitStats tuit={foundTuit}/>
            </HashRouter>
        );

        // the like and dislike values should be opposites
        const likes = foundTuit.stats.likes;
        const likeStat = screen.getByText(likes);
        const dislikes = foundTuit.stats.dislikes;
        const dislikeStat = screen.getByText(dislikes);
        expect(likes).toEqual(dislikes * -1);

        // make sure both of our stats are showing on the page
        expect(likeStat).toBeInTheDocument();
        expect(dislikeStat).toBeInTheDocument();
    });
});

// wrap in a describe block for mocking axios in our beforeAll
describe('mock axios get tuits for stats', () => {
    // mock the get method
    beforeAll(() => jest.spyOn(axios, 'get'));

    // restore the method after our tests run
    afterAll(() => jest.restoreAllMocks());

    test('tuit stats renders mocked', async () => {
        // fill the return value of the axios get request with our mocked list
        axios.get.mockImplementation(() =>
            Promise.resolve({data: {tuits: MOCKED_TUITS} })
        );

        // pull our tuits object out of the response & render the stats of each
        const tuits = await findAllTuits();
        for (const tuit of tuits) {
            render(
                <HashRouter>
                    <TuitStats tuit={tuit} dislikeTuit={}/>
                </HashRouter>
            );

            // the like and dislike values should both be there
            const likes = tuit.stats.likes;
            const likeStat = screen.getAllByText(likes);

            const dislikes = tuit.stats.dislikes;
            const dislikeStat = screen.getAllByText(dislikes);

            // make sure both of our stats are showing on the page
            for (const stat of likeStat){
                expect(stat).toBeInTheDocument();
            }
            for (const stat of dislikeStat){
                expect(stat).toBeInTheDocument();
            }
        }
    });
});