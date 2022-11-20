import {
    userTogglesTuitDislikes,
    userTogglesTuitLikes,
    findAllTuitsLikedByUser,
    findAllTuitsDislikedByUser
} from "../services/likes-service";
import {
    createTuit,
    deleteTuit,
    findTuitById
} from "../services/tuits-service";
import {
    createUser,
    deleteUsersByUsername
} from "../services/users-service";

describe('userTogglesLikesAndDislikes', () => {
    const user = {
        username: 'the-real-tuiter',
        password: 'this_is_secure_123',
        email: 'admin@tuiter.com'
    };

    const tuit = {
        tuit: 'This is a great chance to test likes and dislikes',
        postedBy: '',
        postedOn: new Date()
    };

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

    test('togglingLikesOnAndOff', async () => {
        // initially should be zero
        let foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(0);
        expect(foundTuit.stats.dislikes).toEqual(0);

        // liking it should increase likes, decrease dislikes
        await userTogglesTuitLikes(tuit.postedBy, tuit.id)
        foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(1);
        expect(foundTuit.stats.dislikes).toEqual(-1);

        // togging again should remove the like & reset both to zero
        await userTogglesTuitLikes(tuit.postedBy, tuit.id)
        foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(0);
        expect(foundTuit.stats.dislikes).toEqual(0);
    });

    test('togglingDislikesOnAndOff', async () => {
        // initially should be zero
        let foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(0);
        expect(foundTuit.stats.dislikes).toEqual(0);

        // disliking it should increase likes, decrease likes
        await userTogglesTuitDislikes(tuit.postedBy, tuit.id)
        foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(-1);
        expect(foundTuit.stats.dislikes).toEqual(1);

        // togging again should remove the dislike & reset both to zero
        await userTogglesTuitDislikes(tuit.postedBy, tuit.id)
        foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(0);
        expect(foundTuit.stats.dislikes).toEqual(0);
    });

    test('toggleBothLikesAndDislikes', async () => {
        // initially should be zero
        let foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(0);
        expect(foundTuit.stats.dislikes).toEqual(0);

        // liking it should increase likes, decrease dislikes
        await userTogglesTuitLikes(tuit.postedBy, tuit.id)
        foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(1);
        expect(foundTuit.stats.dislikes).toEqual(-1);

        // togging dislike should switch the values of like and dislike counter
        await userTogglesTuitDislikes(tuit.postedBy, tuit.id)
        foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(-1);
        expect(foundTuit.stats.dislikes).toEqual(1);

        // liking again should swap it back
        await userTogglesTuitLikes(tuit.postedBy, tuit.id)
        foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(1);
        expect(foundTuit.stats.dislikes).toEqual(-1);

        // togging like again should remove the like & reset both to zero
        await userTogglesTuitLikes(tuit.postedBy, tuit.id)
        foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(0);
        expect(foundTuit.stats.dislikes).toEqual(0);
    });
});


describe('gettingTuitsUserLikesAndDislikes', () => {
    const user = {
        username: 'the-real-tuiter',
        password: 'this_is_secure_123',
        email: 'admin@tuiter.com'
    };

    const tuit = {
        tuit: 'This is a great chance to test likes and dislikes',
        postedBy: '',
        postedOn: new Date()
    };

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
    afterAll(async () => {
        await deleteTuit(tuit.id);
        await deleteUsersByUsername(user.username);
    });

    test('getTuitsUserLiked', async () => {
        // initially should be zero and no likes found
        let foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.likes).toEqual(0);

        let foundTuits = await findAllTuitsLikedByUser(tuit.postedBy);
        expect(foundTuits.length).toEqual(0);

        // now we should find the tuit
        await userTogglesTuitLikes(tuit.postedBy, tuit.id);
        foundTuits = await findAllTuitsLikedByUser(tuit.postedBy);
        expect(foundTuits.length).toEqual(1);
        expect(foundTuits[0].id).toEqual(tuit.id);

        // togging again should remove the like
        await userTogglesTuitLikes(tuit.postedBy, tuit.id)
    });

    test('getTuitsUserDisliked', async () => {
        // initially should be zero and no dislikes found
        let foundTuit = await findTuitById(tuit.id);
        expect(foundTuit.stats.dislikes).toEqual(0);

        let foundTuits = await findAllTuitsDislikedByUser(tuit.postedBy);
        expect(foundTuits.length).toEqual(0);

        // now we should find the tuit
        await userTogglesTuitDislikes(tuit.postedBy, tuit.id);
        foundTuits = await findAllTuitsDislikedByUser(tuit.postedBy);
        expect(foundTuits.length).toEqual(1);
        expect(foundTuits[0].id).toEqual(tuit.id);

        // togging again should remove the dislike
        await userTogglesTuitDislikes(tuit.postedBy, tuit.id)
    });
});