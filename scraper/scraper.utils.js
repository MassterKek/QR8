const month = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
};

const isValidResponse = (event) => {
    if ('title' in event && 'description' in event && 'date' in event 
        && 'address' in event && 'venue' in event && 'thumbnail' in event) {
            return true;
    }
    return false;
};

const getValues = (event, query_id) => {
    let full_address = `${event.address[0]}, ${event.address[1]}`
    return [event.title, event.description, parseDate(event.date.start_date), event.date.when, 
        full_address, event.venue.name, event.venue.rating, event.venue.reviews, 
        event.thumbnail, query_id];
}

const parseDate = (eventDate) => {
    fields = eventDate.split(' ');
    date = `2021-${month[fields[0]]}-${fields[1]}`;
    return date;
}

const parseAddress = (address) => {
    const parsed = address.split(',');
    return parsed.map(string => string.trim())
};

module.exports = { isValidResponse, getValues, parseDate, parseAddress };
