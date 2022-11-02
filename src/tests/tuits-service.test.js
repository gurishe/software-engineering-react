import {
    createTuit,
    deleteTuit,
    findTuitById,
    findAllTuits
} from "../services/tuits-service";
import {createUser, deleteUsersByUsername} from "../services/users-service";

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

    beforeAll(async () => await deleteUsersByUsername(user.username));

    afterAll( async () => {
        await deleteTuit(tuit.id);
        await deleteUsersByUsername(user.username);
    });

    test('createTuit', async () => {
        const newUser = await createUser(user);
        tuit.postedBy = newUser.id;
        const newTuit = await createTuit(newUser.id, tuit);
        tuit.id = newTuit.id;

        expect(newTuit.tuit).toEqual(tuit.tuit);
        const tuitDate = new Date(newTuit.postedOn);
        expect(tuitDate.getTime()).toBeGreaterThanOrEqual(tuit.postedOn.getTime());
    });
});

describe('can delete tuit with REST API', () => {
    const user = {
        username: 'the-real-tuiter',
        password: 'this_is_secure_123',
        email: 'admin@tuiter.com'
    };

    const tuit = {
        tuit: 'Who saw the game last night?',
        postedBy: '',
        postedOn: new Date()
    };

    beforeAll(async () => {
        const newUser = await createUser(user);
        tuit.postedBy = newUser.id
        const newTuit = await createTuit(newUser.id, tuit);
        tuit.id = newTuit.id;
    });

    afterAll(async () => await deleteUsersByUsername(user.username));

    test('deleteTuit', async () => {
        const status = await deleteTuit(tuit.id);
        expect(status.deletedCount).toEqual(1);
    });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
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

    beforeAll(async () => await deleteUsersByUsername(user.username));

    afterAll( async () => {
        await deleteTuit(tuit.id);
        await deleteUsersByUsername(user.username);
    });

    test('getTuitById', async () => {
        const newUser = await createUser(user);
        tuit.postedBy = newUser.id;
        const newTuit = await createTuit(newUser.id, tuit);
        tuit.id = newTuit.id;

        const foundTuit = await findTuitById(newTuit.id);

        expect(foundTuit.tuit).toEqual(tuit.tuit);
        const tuitDate = new Date(foundTuit.postedOn);
        expect(tuitDate.getTime()).toBeGreaterThanOrEqual(tuit.postedOn.getTime());
        expect(foundTuit.postedBy.username).toEqual(user.username);
        expect(foundTuit.postedBy.password).toEqual(user.password);
    });
});

describe('can retrieve all tuits with REST API', () => {
});