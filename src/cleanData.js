
const newlines = /[\n]+/g
const spaces = /[\s]+/g
const leadingPunc = /^[^a-zA-Z0-9]+/
const trailingPunc = /[^a-zA-Z0-9]+$/
const spacePeriod = /[\s]+,/g
const dashes = /\u2013|\u2014/g

module.exports = function (site) {
    for (var key in site) {
        if (site.hasOwnProperty(key)) {
            site[key] = cleanField(site[key]);
        }
    }
}

function cleanField(field) {
    // multiple newlines
    field = field.replace(newlines, ", ");

    // multiple spaces
    field = field.replace(spaces, " ");

    // space before period
    field = field.replace(spacePeriod, ",");

    // leading/trailing punctuation
    field = field.replace(leadingPunc, "");
    field = field.replace(trailingPunc, "");
    
    // fix dashes
    field = field.replace(dashes, "-");

    return field;
}