import React from 'react';
import './App.css';
import { useRating, usePersistRating } from './useRating';

function App() {
    const [beer, setBeer] = React.useState('');
    const handleSubmit = (event) => {
        setBeer(event.target.elements.beerInput.value);
        event.preventDefault();
    };
    return (
        <div className="App">
            <h1>Serverless Ratings App</h1>
            <section>
                <h2>Get Rating</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="beerInput">Beer: </label>
                    <input id="beerInput" type="text" />
                    <button type="submit">Get Rating!</button>
                </form>
                {beer && <Rating beer={beer}></Rating>}
            </section>
            <AddRating></AddRating>
            <pre>
                <a href="https://github.com/paltamadura/serverless-ratings-demo">GitHub</a>
            </pre>
        </div>
    );
}
function Rating({ beer }) {
    const { status, data } = useRating(beer);
    return (
        <>
            {status === 'loading' && 'Loading...'}
            {status === 'error' && 'Error!'}
            {data && (
                <div>
                    Rating for {beer}: {data.averageRating}
                </div>
            )}
        </>
    );
}

function AddRating() {
    const [rating, setRating] = React.useState(null);
    const [mutate, { status }] = usePersistRating();
    const handleSubmit = (event) => {
        const { beerInputAddRating, ratingInput } = event.target.elements;
        const rating = { beer: beerInputAddRating.value, rating: ratingInput.value };
        setRating(rating);
        mutate(rating);
        event.preventDefault();
    };

    return (
        <section>
            <h2>Add Rating</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="beerInputAddRating">Beer: </label>
                <input id="beerInputAddRating" type="text" />
                <label htmlFor="ratingInput">Rating</label>
                <select name="ratingInput" id="ratingInput">
                    {[5, 4, 3, 2, 1].map((val) => (
                        <option key={val} value={val}>
                            {val}
                        </option>
                    ))}
                </select>
                <button type="submit">Save</button>
            </form>
            {rating && (
                <>
                    {status === 'loading' && 'Loading...'}
                    {status === 'error' && 'Error!'}
                    {status === 'success' && 'Success!'}
                </>
            )}
        </section>
    );
}

export default App;
