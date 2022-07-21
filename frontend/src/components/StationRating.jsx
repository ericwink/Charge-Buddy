export default function StationRating({ setRating, changeRadio, checked }) {

    function handleClick(e) {
        setRating(e.target.value)
        changeRadio(e)
    }

    return (
        <>
            <fieldset className="rating">
                <input checked={checked.star5} type="radio" id="star5" name="rating" value="5" onClick={handleClick} /><label className="full" for="star5" title="5 stars"></label>
                <input checked={checked.star4} type="radio" id="star4" name="rating" value="4" onClick={handleClick} /><label className="full" for="star4" title="4 stars"></label>
                <input checked={checked.star3} type="radio" id="star3" name="rating" value="3" onClick={handleClick} /><label className="full" for="star3" title="3 stars"></label>
                <input checked={checked.star2} type="radio" id="star2" name="rating" value="2" onClick={handleClick} /><label className="full" for="star2" title="2 stars"></label>
                <input checked={checked.star1} type="radio" id="star1" name="rating" value="1" onClick={handleClick} /><label className="full" for="star1" title="1 star"></label>
            </fieldset>
        </>
    )
}