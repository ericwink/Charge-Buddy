export default function FavoriteCard({ name }) {

    return (
        <div className="card mb-2" >
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <a href="#" className="btn"><i class="fa-solid fa-map-location-dot"></i></a>
                <a href="#" className="btn"><i class="fa-solid fa-heart-circle-xmark"></i></a>
            </div>
        </div>)

}