const m = (art: string, smudge = ["r3", "r4"]) => ({ id: "paper-boat", title: "Lantern Boat", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "twist", mechanics: ["smudged", "color"], smudge, aha: "", art });
export const A = [
m(`
......c.....
......cb....
.cc...cbb...
.ca...cabb..
.ca...cbabb.
.c....cbbab.
.c....cbbbba
cccccccccccc
.ccbccbccbc.
..cccccccc..`, ["r3","r4"]),
m(`
......c.....
......cb....
.cc...cbb...
.ca...cabb..
.ca...cbabb.
.c....cbbab.
.c....cbbbba
cccccccccccc
.ccbccbccbc.
..cccccccc..`, ["r4","r5"]),
m(`
......c.....
......cb....
.cc...cbb...
.ca...cabb..
.ca...cbabb.
.c....cbbab.
.c....cbbbba
cccccccccccc
.ccbccbccbc.
..cccccccc..`, ["r2","r3"]),
m(`
......c.....
......cb....
.cc...cbb...
.ca...cabb..
.ca...cbabb.
.c....cbbab.
.c..a.cbbbba
cccccccccccc
.ccbccbccbc.
..cccccccc..`, ["r3","r4"]),
];
