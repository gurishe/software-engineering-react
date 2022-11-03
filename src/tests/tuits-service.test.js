import {
    createTuit,
    deleteTuit,
    findTuitById,
    findAllTuits
} from "../services/tuits-service";
import {
    createUser,
    deleteUsersByUsername
} from "../services/users-service";

describe('can create tuit with REST API', () => {
    const user = {
        username: 'the-real-tuiter',
        password: 'this_is_secure_123',
        email: 'admin@tuiter.com'
    };

    const tuit = {
        tuit: 'Great weather today in Boston, MA!',
        postedBy: '',
        postedOn: new Date()
    };

    // make sure any matching user is gone
    beforeAll(async () => await deleteUsersByUsername(user.username));

    // clean up any inserts
    afterAll( async () => {
        await deleteTuit(tuit.id);
        await deleteUsersByUsername(user.username);
    });

    test('createTuit', async () => {
        // new user for our tuit
        const newUser = await createUser(user);
        tuit.postedBy = newUser.id;
        // create the tuit
        const newTuit = await createTuit(newUser.id, tuit);
        tuit.id = newTuit.id;

        // verify the fields line up
        expect(newTuit.tuit).toEqual(tuit.tuit);
        const tuitDate = new Date(newTuit.postedOn);
        expect(tuitDate.getTime()).toBeGreaterThanOrEqual(tuit.postedOn.getTime());
        expect(newTuit.postedBy.id).toEqual(tuit.postedBy);
    });
});

describe('can delete tuit with REST API', () => {
    const user = {
        username: 'tuiter-user-01',
        password: 'pwd',
        email: 'test@tuiter.com'
    };

    const tuit = {
        tuit: 'Who saw the game last night?',
        postedBy: '',
        postedOn: new Date()
    };

    // create our tuit and matching user first
    beforeAll(async () => {
        const newUser = await createUser(user);
        tuit.postedBy = newUser.id
        const newTuit = await createTuit(newUser.id, tuit);
        tuit.id = newTuit.id;
    });

    // clean up our user (the test should clean up the tuit)
    afterAll(async () => await deleteUsersByUsername(user.username));

    test('deleteTuit', async () => {
        // delete the tuit, should only be the one removed
        let status = await deleteTuit(tuit.id);
        expect(status.deletedCount).toEqual(1);

        // if we delete again, should be none removed
        status = await deleteTuit(tuit.id);
        expect(status.deletedCount).toEqual(0);
    });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
    const user = {
        username: 'john_locke',
        password: 'leviathan4',
        email: 'john@locke.net'
    };

    const tuit = {
        tuit: 'Great weather today in Boston, MA!',
        postedBy: '',
        postedOn: '2021-12-25T00:00:00.000Z'
    };

    // make sure any matching user is out before the test
    beforeAll(async () => await deleteUsersByUsername(user.username));

    // clean up the resources we created after
    afterAll( async () => {
        await deleteTuit(tuit.id);
        await deleteUsersByUsername(user.username);
    });

    test('getTuitById', async () => {
        // create our user and tuit
        const newUser = await createUser(user);
        tuit.postedBy = newUser.id;
        const newTuit = await createTuit(newUser.id, tuit);
        tuit.id = newTuit.id;

        // make sure the tuit returned by API matches the tuit we've saved here
        const foundTuit = await findTuitById(newTuit.id);

        expect(foundTuit.tuit).toEqual(tuit.tuit);
        expect(foundTuit.postedBy.id).toEqual(tuit.postedBy);
        expect(foundTuit.postedBy.username).toEqual(user.username);
        expect(foundTuit.postedBy.password).toEqual(user.password);

        // convert dates to numbers for easy comparison
        const foundTuitDate = new Date(foundTuit.postedOn).getTime();
        const originalTuitDate = new Date(tuit.postedOn).getTime();
        expect(foundTuitDate).toEqual(originalTuitDate);
    });
});

describe('can retrieve all tuits with REST API', () => {
    const users = [
        {
            username: 'john_locke',
            password: 'leviathan4',
            email: 'john@locke.net'
        },
        {
            username: 'tuiter-user-01',
            password: 'tuiterBot101',
            email: 'test@tuiter.com'
        },
        {
            username: 'the-real-tuiter',
            password: 'this_is_secure_123',
            email: 'admin@tuiter.com'
        }
    ];

    const tuits = [
        {
            tuit: 'Great weather today in Boston, MA!',
            postedBy: '',
            postedOn: new Date()
        },
        {
            tuit: 'Who saw the game last night?',
            postedBy: '',
            postedOn: new Date()
        },
        {
            tuit: 'Tuiter is such a great app',
            postedBy: '',
            postedOn: new Date()
        }
    ];

    // insert our users and set up our tuits
    beforeAll(async () => {
        for (const user of users) {
            const newUser = await createUser(user);
            user.id = newUser.id;
        }

        for (let i = 0; i < tuits.length; i++) {
            tuits[i].postedBy = users[i].id;
            const newTuit = await createTuit(users[i].id, tuits[i])
            tuits[i].id = newTuit.id
        }
    });

    // clean up by removing our users and tuits
    afterAll(async () => {
        for (const user of users) {
            await deleteUsersByUsername(user.username);
        }

        for (const tuit of tuits) {
            await deleteTuit(tuit.id);
        }
    });

    test('fetchAllTuits', async() => {
        // get our tuits
        const allAddedTuits = await findAllTuits();

        // should be at least as many as we have added
        expect(allAddedTuits.length).toBeGreaterThanOrEqual(tuits.length);

        // get just the ones we have added
        const ourTuits = allAddedTuits.filter(tuit => tuits.indexOf(tuit.tuit) > -1);

        // check each of them
        ourTuits.forEach(tuit => {
            // find the matching tuit and compare our fields
            const originalTuit = tuits.find(tuitObject => tuitObject.tuit === tuit.tuit);
            expect(originalTuit.tuit).toEqual(tuit.tuit)
            expect(originalTuit.postedBy).toEqual(tuit.postedBy.id)

            const tuitDate = new Date(tuit.postedOn);
            expect(tuitDate.getTime()).toBeGreaterThanOrEqual(tuit.postedOn.getTime());

            // find the matching user for comparison as well
            const userMatch = users.find(user => user.username === tuit.postedBy.username);
            expect(userMatch).not.toBeNull();
            expect(tuit.postedBy.username).toEqual(userMatch.username);
            expect(tuit.postedBy.password).toEqual(userMatch.password);
        });
    });
});