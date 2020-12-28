

export const displayMap=(locations)=>
{
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXNoaGFyOTUiLCJhIjoiY2tqMmU3M3F4MDA1cTJ4bnZrd2NnZWh0eCJ9.WTAqg_guhiHT3p0_u-e5fg';



var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/ashhar95/ckj2fhfqq1k9a19mw2h15qgmn',
scrollZoom:false
// center:[-118.113491,34.111745],
// zoom:10,
// interactive:false
});
const bounds=new mapboxgl.LngLatBounds();

locations.forEach(loc=>
    {
        const el=document.createElement("div");
        el.className="marker";

        new mapboxgl.Marker({
            element:el,
            anchor:"bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        
        new mapboxgl.Popup({
            offset:30
        }).setLngLat(loc.coordinates).setHtml(`<p>Day ${loc.day}:${loc.description}</p>`).addTo(map)
        bounds.extend(loc.coordinates);
    })
 map.fitBounds(bounds,{
     padding:
     {
        top:200,
        bottom:150,
        left:100,
        right:100
    }
 });
}

