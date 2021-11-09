const isValidResponse = (event) => {
    if ('title' in event && 'description' in event && 'date' in event 
        && 'address' in event && 'venue' in event && 'thumbnail' in event) {
            return true;
    }
    return false;
};

const getValues = (event, query_id) => {
    let full_address = `${event.address[0]}, ${event.address[1]}`
    return [event.title, event.description, event.date.start_date, event.date.when, 
        full_address, event.venue.name, event.venue.rating, event.venue.reviews, 
        event.thumbnail, query_id];
}

module.exports = { isValidResponse, getValues };
