// ergebnis.js

const ikigaiData = JSON.parse(localStorage.getItem('ikigaiData'));

// Erstellen einer Map, die die Kombinationen von Kategorien als Schlüssel und die zugehörigen Begriffe als Werte enthält
const areaData = {};

// Funktion zur Generierung eines eindeutigen Schlüssels basierend auf den Kategorien
function getKey(categoriesArray) {
    return categoriesArray.sort().join('_');
}

// Begriffe den entsprechenden Bereichen zuordnen
ikigaiData.forEach(item => {
    const key = getKey(item.categories);
    if (areaData[key]) {
        areaData[key].push(item.term);
    } else {
        areaData[key] = [item.term];
    }
});

// SVG-Container erstellen
const width = 700;
const height = 700;
const svg = d3.select("#venn").append("svg")
    .attr("width", width)
    .attr("height", height);

// Kreisdaten
const radius = 200;
const positions = {
    'liebe': { x: width / 2 - 100, y: height / 2 - 100 },
    'gut': { x: width / 2 + 100, y: height / 2 - 100 },
    'welt': { x: width / 2 - 100, y: height / 2 + 100 },
    'bezahlt': { x: width / 2 + 100, y: height / 2 + 100 }
};

const colors = {
    'liebe': '#FF6B6B',    // Sanftes Rot
    'gut': '#4ECDC4',      // Türkis
    'welt': '#FFD93D',     // Sonnengelb
    'bezahlt': '#1A535C'   // Tiefes Blaugrün
};

// Kreise zeichnen
Object.keys(positions).forEach(key => {
    svg.append("circle")
        .attr("cx", positions[key].x)
        .attr("cy", positions[key].y)
        .attr("r", radius)
        .style("fill", colors[key])
        .style("fill-opacity", 0.6)
        .style("stroke", "#333")
        .style("stroke-width", 2);
});

// Labels für die Kreise hinzufügen
const labels = {
    'liebe': 'Was du liebst',
    'gut': 'Worin du gut bist',
    'welt': 'Was die Welt braucht',
    'bezahlt': 'Wofür du bezahlt werden kannst'
};

Object.keys(positions).forEach(key => {
    let labelY;
    if (key === 'liebe' || key === 'gut') {
        labelY = positions[key].y - radius - 10;
    } else {
        labelY = positions[key].y + radius + 30;
    }

    svg.append("text")
        .attr("x", positions[key].x)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .text(labels[key])
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "#333");
});

// Begriffe in den Bereichen anzeigen
function addText(areaKey, x, y) {
    const terms = areaData[areaKey] || [];
    if (terms.length > 0) {
        svg.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .text(terms.join(', '))
            .style("font-size", "12px")
            .style("fill", "#333");
    }
}

// Positionen für die Texte festlegen
addText('liebe', positions['liebe'].x - radius / 2, positions['liebe'].y - 20);
addText('gut', positions['gut'].x + radius / 2, positions['gut'].y - 20);
addText('welt', positions['welt'].x - radius / 2, positions['welt'].y + 40);
addText('bezahlt', positions['bezahlt'].x + radius / 2, positions['bezahlt'].y + 40);

// Überlappungsbereiche (2er Kombinationen)
addText('gut_liebe', (positions['liebe'].x + positions['gut'].x) / 2, positions['liebe'].y - radius / 2);
addText('liebe_welt', positions['liebe'].x - radius / 2, (positions['liebe'].y + positions['welt'].y) / 2);
addText('bezahlt_gut', positions['gut'].x + radius / 2, (positions['gut'].y + positions['bezahlt'].y) / 2);
addText('bezahlt_welt', (positions['welt'].x + positions['bezahlt'].x) / 2, positions['bezahlt'].y + radius / 2);

// Überlappungsbereiche (3er Kombinationen)
addText('gut_liebe_welt', positions['liebe'].x, positions['welt'].y);
addText('bezahlt_gut_liebe', positions['gut'].x, positions['bezahlt'].y);
addText('bezahlt_liebe_welt', positions['liebe'].x, positions['bezahlt'].y);
addText('bezahlt_gut_welt', positions['bezahlt'].x, positions['welt'].y);

// Ikigai-Zentrum (4er Kombination)
addText('bezahlt_gut_liebe_welt', width / 2, height / 2 + 10);

// Titel für den Ikigai-Bereich
svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 - 10)
    .attr("text-anchor", "middle")
    .text('Ikigai')
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .style("fill", "#333");

// Download-Funktion (unverändert)
document.getElementById('downloadBtn').addEventListener('click', function() {
    const svgElement = document.querySelector('#venn svg');

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    canvas.width = svgElement.clientWidth;
    canvas.height = svgElement.clientHeight;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = 'ikigai-diagramm.jpg';
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
});
