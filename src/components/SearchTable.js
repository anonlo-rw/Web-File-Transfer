export default function SearchTable(searchString) {
    var tr = document.getElementById("table").getElementsByTagName("tr");
    var currentEntries = 0;

    for (var i = 1; i < tr.length; i++) {

        tr[i].style.display = "none";
        var td = tr[i].getElementsByTagName("td");

        for (var j = 2; j < td.length; j++) {

            var cell = tr[i].getElementsByTagName("td")[j];
            if (cell) {
                if (cell.innerHTML.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
                    tr[i].style.display = "";
                    currentEntries++;
                    break;
                }
            }
        }
    }
    return currentEntries;
}