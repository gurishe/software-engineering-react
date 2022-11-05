import {UserList} from "../components/profile/user-list";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllUsers} from "../services/users-service";
import axios from "axios";

// list of our static mocked users for testing
const MOCKED_USERS = [
  {username: 'ellen_ripley', password: 'lv426', email: 'repley@weyland.com', id: "123"},
  {username: 'sarah_conor', password: 'illbeback', email: 'sarah@bigjeff.com', id: "234"},
]

// if we just use our mocked array, should find our mocked users
test('user list renders static user array', () => {
  render(
    <HashRouter>
      <UserList users={MOCKED_USERS}/>
    </HashRouter>
  );

  let linkElement = screen.getByText(/ellen_ripley/i);
  expect(linkElement).toBeInTheDocument();

  linkElement = screen.getByText(/sarah_conor/i);
  expect(linkElement).toBeInTheDocument();
});

// this reaches out to the remote DB, should find a user that we know we have added previously
test('user list renders async', async () => {
  const users = await findAllUsers();
  render(
    <HashRouter>
      <UserList users={users}/>
    </HashRouter>
  );

  const linkElement = screen.getByText(/aliceOG/i);
  expect(linkElement).toBeInTheDocument();
});

// wrap this test in a describe block so that our beforeAll can mock the axios calls we want to test with
describe('mock axios get user list', () => {
  // here we just mock the get method from axios for each test in this block
  beforeAll(() => jest.spyOn(axios, 'get'));

  // remove the get method mocking after our tests have run
  afterAll(() => jest.restoreAllMocks());

  test('user list renders mocked', async () => {
    // fill the return value of the axios get request with our mocked users list
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: {users: MOCKED_USERS} })
    );

    const response = await findAllUsers();
    const users = response.users;

    render(
      <HashRouter>
        <UserList users={users}/>
      </HashRouter>
    );

    let user = screen.getByText(/ellen_ripley/i);
    expect(user).toBeInTheDocument();

    user = screen.getByText(/sarah_conor/i);
    expect(user).toBeInTheDocument();
  });
});
