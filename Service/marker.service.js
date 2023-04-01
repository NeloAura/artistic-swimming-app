
const db = require('_helpers/db');


module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Marker.findAll();
}

async function getById(id) {
    return await getMarker(id);
}

async function create(params) {
    // validate
    if (await db.Marker.findOne({ where: { location: params.location } })) {
        throw 'Marker "' + params.location + '" is already registered';
    }

    const marker = new db.Marker(params);
    
    // hash password
   

    // save user
    await marker.save();
}

async function update(id, params) {
    const marker = await getMarker(id);
    

    // validate
    const markerChanged = params.location && marker.location !== params.location;
    if (markerChanged && await db.Marker.findOne({ where: { location: params.location } })) {
        throw 'Marker "' + params.location + '" is already registered';
    }

    // hash password if it was entered
    

    // copy params to user and save
    Object.assign(marker, params);
    await marker.save();
}

async function _delete(id) {
    const marker = await getMarker(id);
    await marker.destroy();

}
// helper functions

async function getMarker(id) {
    const marker = await db.Marker.findByPk(id);
    if (!marker) throw 'Marker not found';
    return marker;
}

