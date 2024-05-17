import MapTest from "../Map";
import tt from '@tomtom-international/web-sdk-services';

const Button = () => {

    var moveMap = function(lnglat){
        map.flyTo({
            center: lnglat,
            zoom: 14,
        })
    }

    var handleResults = function (result) {
        console.log(result);
        if (result.results){
            moveMap(result.results [0].position)
        }
    }

    var search = function () {  
    
        tt.services.fuzzySearch({
            key: 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU',
            query: document.getElementById("searchfunction").value,
            
        }).go().then(handleResults);
    }

    return (
        <button onClick={search} className="btn btn-primary m-2">Sök stad</button>
    );
};

export default Button