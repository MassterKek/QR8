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

const getCovidValues = (address, covid_data, event_id) => {
    return [address.AddressLine1, address.AddressLine2, address.Zip, address.Zip4, 
        address.City, address.State, covid_data, event_id];
}

const parseDate = (eventDate) => {
    fields = eventDate.split(' ');
    date = `2021-${month[fields[0]]}-${fields[1]}`;
    return date;
}

const parseAddress = (address) => {
    let parsed = address.split(',');
    parsed = parsed.map(string => string.trim())
    return [parsed[parsed.length - 3], parsed[parsed.length - 2], parsed[parsed.length - 1]]
};

const parseCovidRes = (covid_res) => {
    if (covid_res && covid_res.data && covid_res.data.counties) {
        let positive_cases = 0;
        covid_res.data.counties.forEach(county => {
            positive_cases += county.positiveCt;
        });
        return positive_cases;
    }
    return 0;
};

const parseOrderBy = (orderBy) => {
    switch (orderBy) {
        case "date_start":
            return "e.date_start";
        case "covid_cases":
            return "c.covid_cases";
        default:
            return "e.date_start";
    }
}

module.exports = { isValidResponse, getValues, parseDate, parseAddress, getCovidValues, parseCovidRes, parseOrderBy };
