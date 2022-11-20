import MyDislikes from "../components/profile/my-dislikes";
import {screen, render, act} from "@testing-library/react";
import {HashRouter} from "react-router-dom";

test('Default no tuits message', () => {
    render(
        <HashRouter>
            <MyDislikes />
        </HashRouter>
    );

    // the like and dislike values should both be there
    const defaultMsg = "You have no disliked Tuits";
    const message = screen.getByText(defaultMsg);
    expect(message).toBeInTheDocument();
});