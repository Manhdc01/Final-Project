require('dotenv').config()
const mongoose = require('mongoose')
var dbState = [{
    value: 0,
    label: "disconnected"
},
{
    value: 1,
    label: "connected"
},
{
    value: 2,
    label: "connecting"
},
{
    value: 3,
    label: "disconnecting"
}];

const connection = async () => {
    try {
        await mongoose.connect('mongodb+srv://manhdc01:Manh2001@finalproject.xkp0shg.mongodb.net/final');
        const state = Number(mongoose.connection.readyState);
        console.log(dbState.find(f => f.value === state).label, "to db"); // connected to db
    } catch (error) {
        console.log(">>>Error connection to DB", error)
    }
}

module.exports = connection;