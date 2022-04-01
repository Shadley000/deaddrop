


var details_original = "ADMIN DELETE".split(" ")
var details_new = "CREATE READ".split(" ")
var reduced = details_original.filter(aitem => !details_new.find(bitem => aitem === bitem))
var details_updated =  reduced.concat(details_new);
var details_str = details_updated.join(" ");

console.log(details_str);