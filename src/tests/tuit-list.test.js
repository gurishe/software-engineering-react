import Tuits from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";

// list of static mocked users and tuits for testing
const MOCKED_USERS = [
  {username: "alice", password: 'alice123', email: 'alice@alice.com', id: '123'},
  {username: "bob", password: '123bob', email: 'bob@bob.com', id: '987'},
  {username: "charlie", password: 'charlie321', email: 'charlie@charlie.com', id: '555'}
];

const MOCKED_TUITS = [
  {tuit: "alice's tuit", published: new Date().toLocaleDateString(), postedBy: MOCKED_USERS[0], id: '1'},
  {tuit: "bob's tuit", published: new Date('2022-01-01').toLocaleDateString(), postedBy: MOCKED_USERS[1], id: '2'},
  {tuit: "charlie's tuit", published: new Date('2022-12-25').toLocaleDateString(), postedBy: MOCKED_USERS[2], id: '3'}
];

// just render our mocked tuit array above
test('tuit list renders static tuit array', () => {
  render(
    <HashRouter>
      <Tuits tuits={MOCKED_TUITS} />
    </HashRouter>
  );

  // make sure the body of each tuit appears + the usernames
  for (const tuit of MOCKED_TUITS) {
    const tuitText = tuit.tuit;
    const tuitElement = screen.getByText(tuitText);
    expect(tuitElement).toBeInTheDocument();

    // use a regular expression since we are filling in username dynamically
    const usernameRegEx = new RegExp(tuit.postedBy.username, 'i');
    // username should be enclosed in a header 2 tag, hence the "selector" specification
    const userElement = screen.getByText(usernameRegEx, {selector: 'h2'});
    expect(userElement).toBeInTheDocument();
  }
});

// now use axios to get some values we have previously entered in the remote DB
test('tuit list renders async', async () => {
  const tuits = await findAllTuits();
  render(
      <HashRouter>
        <Tuits tuits={tuits} />
      </HashRouter>
  );

  // check for a NASA tuit we know we have inserted previously
  const tuitElement = screen.getByText(/NASA's test launch/i);
  expect(tuitElement).toBeInTheDocument();

  // username is in an <h2> element
  const userElement = screen.getByText(/nasa/i, {selector: 'h2'});
  expect(userElement).toBeInTheDocument();
})

// wrap in a describe block for mocking axios in our beforeAll
describe('mock axios get tuits', () => {
  // mock the get method
  beforeAll(() => jest.spyOn(axios, 'get'));

  // restore the method after our tests run
  afterAll(() => jest.restoreAllMocks());

  test('tuit list renders mocked', async () => {
    // fill the return value of the axios get request with our mocked list
    axios.get.mockImplementation(() =>
        Promise.resolve({ data: {tuits: MOCKED_TUITS} })
    );

    // pull our tuits object out of the response & render
    const { tuits } = await findAllTuits();
    render(
        <HashRouter>
          <Tuits tuits={tuits} />
        </HashRouter>
    );

    // make sure the body of each tuit and the author are being displayed
    for (const tuit of MOCKED_TUITS) {
      const tuitElement = screen.getByText(tuit.tuit);
      expect(tuitElement).toBeInTheDocument();

      // use RegEx constructor to fill in username dynamically
      const usernameRegEx = new RegExp(tuit.postedBy.username, 'i');
      // username should be in <h2> tag
      const userElement = screen.getByText(usernameRegEx, {selector: 'h2'});
      expect(userElement).toBeInTheDocument();

      // check that each of our dates are found as well
      const dateElement = screen.getByText(new RegExp(tuit.published, 'i'), {selector: 'h2'});
      expect(dateElement).toBeInTheDocument();
    }
  });
});
