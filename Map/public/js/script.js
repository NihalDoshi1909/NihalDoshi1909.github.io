// const socket=io();

// if(navigator.geolocation){
//     navigator.geolocation.watchPosition((position)=>{
//         const {latitude,longitude}=position.coords
//         console.log(latitude,longitude)
//         socket.emit("send-location",{latitude,longitude})
//     },(error)=>{
//         console.log(error)
//     },{
//         enableHighAccuracy:true,
//         timeout:5000,
//         maximumAge:0
//     })
// }

// const map = L.map("map").setView([0,0],15)

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
//     attribution:"nihal"
// }).addTo(map)

// const markers={}

// socket.on("recevie-location",(data)=>{
//     const{id,latitude,longitude}=data
//     console.log(id)
//     map.setView([latitude,longitude])
//     if(markers[id]){
//         markers[id].setLatLng([latitude,longitude])
//     }
//     else{
//         markers[id]=L.marker([latitude,longitude]).addTo(map)
//         console.log("marker:",markers)
//     }
// });


// socket.on("user-disconnect",(id)=>{
//     if(markers[id]){
//         map.removeLayer(markers[id]);
//         delete markers[id]
//     }
// })


const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

const map = L.map("map").setView([0, 0], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "nihal"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    console.log(id);
    map.setView([latitude, longitude]);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("new-user-connected", (data) => {
    const { id, latitude, longitude } = data;
    console.log(`New user connected: ${id}`);
    if (!markers[id]) {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
