const fs = require('fs');
const path = require('path');

// Raw OCR strings from all pages
const pages = [
  // Page 1
  `1 BIPTC 1st Block Khulna 1x500 MW 500 MW POWER GRID HVDC
2 BIPTC 2nd Block Khulna 1x500 MW 500 MW POWER GRID HVDC
1 Aminbazar Dhaka 3x520 1560 POWER GRID Dhaka(N)
2 Amtali Switching Barishal - - POWER GRID Khulna
3 Ashuganj (N) Cumilla 2x244/325 650 APSCL Cumilla
4 Bhulta Dhaka 2x520 1040 POWER GRID Dhaka(S)
5 Bibiyana Sylhet 2x520 1040 POWER GRID Cumilla
6 Bogura (W) Rajshahi 3x750 2250 POWER GRID Bogura
7 Gopalganj (N) Khulna 1x750 750 POWER GRID Khulna
8 Kaliakoir Dhaka 2x520 1040 POWER GRID Dhaka(N)
9 Korerhat Chattogram 2x1000 2000 POWER GRID Chattogram
10 Meghnaghat Dhaka 3x750 2250 POWER GRID Dhaka(S)
11 Madunaghat Chattogram 3x750 2250 POWER GRID Chattogram
12 Mirsarai Chattogram 1x1000 1000 POWER GRID Chattogram
13 Rampal Khulna 2x520 1040 BIFPCL Khulna
14 RNPP Rajshahi 2x520 1040 RNPP HVDC
1 Gopalganj (N) Khulna 3x325 975 POWER GRID Khulna
2 Kaliakoir Dhaka 3x325, 1x300 1275 POWER GRID Dhaka(N)
3 Korerhat Chattogram 1x325 325 POWER GRID Chattogram
4 Rahanpur Rajshahi 2x520 1040 POWER GRID Bogura
5 Payra Barishal 2x325 650 POWER GRID Khulna
1 Agargaon Dhaka 2x300 600 POWER GRID Dhaka(N)
2 Aminbazar Dhaka 3x225 675 POWER GRID Dhaka(N)
3 Ashuganj Cumilla 2x300 600 APSCL Cumilla
4 Baghabari Rajshahi 1x225, 1x300 525 POWER GRID HVDC
5 Barapukuria Rangpur 2x225 1x225/300 750 POWER GRID Bogura
6 Barishal (N) Barishal 2x300 600 POWER GRID Khulna
7 Bheramara Khulna 2x225 450 POWER GRID HVDC
8 Bhulta Dhaka 2x300 600 POWER GRID Dhaka(S)
9 Bogura (S) Rajshahi 2x225(7x75), 2x225/300 1050 POWER GRID Bogura
10 Chowmuhani Cumilla 3x350 1050 POWER GRID Cumilla
11 Cumilla (N) Cumilla 3x225 675 POWER GRID Cumilla
12 Faridpur Khulna 2x350 700 POWER GRID Khulna
13 Fenchuganj Sylhet 2x300 600 POWER GRID Cumilla
14 Feni (N) Cumilla 3x300 900 POWER GRID Cumilla
15 Ghorashal Dhaka 2x125 250 BPDB Dhaka(S)
16 Haripur Dhaka 3x225(10x75) 675 POWER GRID Dhaka(S)
17 Hasnabad Dhaka 3x225(10x75) 675 POWER GRID Dhaka(S)
18 Hathazari Chattogram 3x150 450 POWER GRID Chattogram
19 Jhenaidah(S) Khulna 2x300 600 POWER GRID HVDC
20 Ishwardi Rajshahi 3x225 675 POWER GRID HVDC
21 Kachua Cumilla 2x350 700 POWER GRID Cumilla
22 Keraniganj Dhaka 3x300 900 POWER GRID Dhaka(S)
23 Khulna (S) Khulna 2x225(7x75) 1x300 750 POWER GRID Khulna
24 Madunaghat Chattogram 3x300 900 POWER GRID Chattogram
25 Maniknagar Dhaka 2x300 600 POWER GRID Dhaka(S)
26 Meghnaghat Switching Dhaka - - POWER GRID Dhaka(S)
27 Naogaon Rajshahi 3x300 900 POWER GRID Bogura
28 Purbasadipur Rangpur 2x300 600 POWER GRID Bogura
29 Rajshahi(N) Rajshahi 2x300 600 POWER GRID Bogura
30 Rampura Dhaka 3x450 1350 POWER GRID Dhaka(S)
31 Rampur Chattogram 2x300 600 POWER GRID Chattogram
32 Siddhirganj Dhaka 2x300 600 POWER GRID Dhaka(S)`,

  // Page 2
  `33 Sirajganj Switching Rajshahi - - POWER GRID HVDC
34 Shyampur Dhaka 2x225/300 600 POWER GRID Dhaka(S)
35 Sripur Dhaka 2x225/300 600 POWER GRID Dhaka(N)
36 Tongi Dhaka 3x225(10x75), 1x450 1125 POWER GRID Dhaka(N)
37 Sikalbaha Chattogram 2x300 600 POWER GRID Chattogram
1 AKSPL Chattogram 2x130/150, 1x80 380 Bulk Chattogram
2 BSRM Chattogram 3x130/140 420 Bulk Chattogram
3 GPH Chattogram 2x100/125 250 Bulk Chattogram
4 Borhanuddin Barishal 1x120/140 (230/33kV) 140 BPDB Khulna
5 Mirsarai Chattogram 2x125/140 280 POWER GRID Chattogram
6 Ghorasal SW Dhaka 1x125/140 140 POWER GRID Dhaka(S)
1 Aftabnagar Dhaka 2x80/120 240 DESCO Dhaka(S)
2 Agargaon Dhaka 2x80/120 240 POWER GRID Dhaka(N)
3 Agrabad Chattogram 2x80/120 240 POWER GRID Chattogram
4 AKSML Chattogram 1x50/80 80 Bulk Chattogram
5 Amnura Rajshahi 3x35/50 150 POWER GRID Bogura
6 Anandabazar Chattogram 3x80/120 360 POWER GRID Chattogram
7 Ashuganj Cumilla 1x25/41 1x50/75 116 POWER GRID Cumilla
8 Bagerhat Khulna 2x25/41, 1x50/75 157 POWER GRID Khulna
9 Bajitpur Mymensingh 2x80/120 240 POWER GRID Dhaka(S)
10 Bakerganj Barishal 1x25/41 41 POWER GRID Khulna
11 Bakulia Chattogram 2x48/64 2x50/75 278 POWER GRID Chattogram
12 Bangabhaban Dhaka 1x28/35, 1x80/120 155 DPDC Dhaka(S)
13 Barguna Barishal 2x50/75 150 POWER GRID Khulna
14 Barapukuria Rangpur 2x50/75, 1x40 190 POWER GRID Bogura
15 Barishal Barishal 1x80/120, 1x50/75 195 POWER GRID Khulna
16 Barishal(N) Barishal 2x80/120 240 POWER GRID Khulna
17 Baroaulia Chattogram 2x80/120 240 POWER GRID Chattogram
18 Bashundhara Dhaka 3x80/120 360 DESCO Dhaka(N)
19 Bashundhara Cement Dhaka 1x35 35 Bulk Dhaka(S)
20 Banani Dhaka 2x80/120 240 DESCO Dhaka(N)
21 Baroirhat Chattogram 2x50/75 150 POWER GRID Chattogram
22 Beanibazar Sylhet 2x50/75 150 POWER GRID Cumilla
23 Bhaluka Mymensingh 2x80/120, 1x50/75 315 POWER GRID Dhaka(N)
24 Benapole Khulna 2x50/75 150 POWER GRID Khulna
25 Bhandaria Barishal 2x50/75 150 POWER GRID Khulna
26 Bhangura Rajshahi 2x50/75 150 POWER GRID HVDC
27 Bhasantek Dhaka 2x80/120 240 POWER GRID Dhaka(S)
28 Bheramara GK Khulna 3x25/41, 1x15/20 143 POWER GRID HVDC
29 Bhulta Dhaka 2x80/120 240 POWER GRID Dhaka(S)
30 BMPIL Dhaka 1x50/75 75 Bulk Dhaka(S)
31 Bogura Rajshahi 4x80/120 480 POWER GRID Bogura
32 Brahmanbaria Cumilla 3x80/120 360 POWER GRID Cumilla
33 BSRM(Khulshi) Chattogram 1x64/80 80 Bulk Chattogram
34 Chandpur Cumilla 3x50/75 225 POWER GRID Cumilla
35 Chandraghona Chattogram 1x50/75, 1x25/41 116 POWER GRID Chattogram`,

  // Page 3
  `36 Chapai Nawabganj Rajshahi 1x15/20, 3x50/75 245 POWER GRID Bogura
37 Char Saidpur Dhaka 2x80/120 240 DPDC Dhaka(S)
38 Chauddagram Cumilla 2x50/75 150 POWER GRID Cumilla
39 Chhatak Sylhet 2x15/20,1x25/41 81 POWER GRID Cumilla
40 Chandina Cumilla 2x80/120 240 POWER GRID Cumilla
41 Chowdala Rajshahi 2x50/75 150 POWER GRID Bogura
42 Chowmuhani Cumilla 3x80/120 360 POWER GRID Cumilla
43 Chuadanga Khulna 2x50/75 1x25/41 191 POWER GRID HVDC
44 Cumilla (N) Cumilla 3x50/75 225 POWER GRID Cumilla
45 Cumilla (S) Cumilla 4x50/75 300 POWER GRID Cumilla
46 Cox's Bazar Chattogram 2x80/120, 1x50/75 315 POWER GRID Chattogram
47 Daganbhuiyan Cumilla 1x80/120 240 POWER GRID Cumilla
48 Dhaka University (DU) Dhaka 2x80/120 240 DPDC Dhaka(S)
49 Daudkandi Cumilla 3x50/75 225 POWER GRID Cumilla
50 Dhamrai Dhaka 2x50/75 150 POWER GRID Dhaka(N)
51 Dhanmondi Dhaka 1x50/75 3x80/120 435 DPDC Dhaka(N)
52 Dohazari Chattogram 2x80/120 240 POWER GRID Chattogram
53 Faridpur Khulna 2x80/120, 1x25/41 281 POWER GRID Khulna
54 Fatullah Dhaka 2x80/120 240 DPDC Dhaka(S)
55 Fenchuganj Sylhet 2x15/20,1x25/41 81 POWER GRID Cumilla
56 Feni Cumilla 2x80/120 240 POWER GRID Cumilla
57 Gallamari Khulna 2x80/120 240 POWER GRID Khulna
58 Ghatail Mymensingh 2x80/120 240 POWER GRID Dhaka(N)
59 Ghorashal Dhaka 2x41/63 126 BPDB Dhaka(N)
60 Goalpara Khulna 3x25/41 123 POWER GRID Khulna
61 Gopalganj Khulna 2x80/120 240 POWER GRID Khulna
62 Gulshan Dhaka 2x80/120 240 POWER GRID Dhaka(S)
63 Halishahar Chattogram 3x80/120 360 POWER GRID Chattogram
64 Haripur SBU Dhaka 2x80/120 240 POWER GRID Dhaka(S)
65 Hasnabad Dhaka 3x66/100 300 POWER GRID Dhaka(S)
66 Hathazari Chattogram 1x50/75, 1x80/120 195 POWER GRID Chattogram
67 Ishwardi Rajshahi 2x50/75, 1x80/120 270 POWER GRID HVDC
68 Jaldhaka Rangpur 2x50/75 150 POWER GRID Bogura
69 Jamalpur Mymensingh 4x50/75 300 POWER GRID Dhaka(N)
70 Jashore Khulna 3x80/120 360 POWER GRID HVDC
71 Jhenaidah Khulna 2x80/120, 1x50/83.3 323.3 POWER GRID HVDC
72 Joydebpur Dhaka 2x50/75, 1x80/120 270 POWER GRID Dhaka(N)
73 Joypurhat Rajshahi 4x25/41 164 POWER GRID Bogura
74 Juldah Chattogram 2x50/75 150 POWER GRID Chattogram
75 Kabirpur Dhaka 3x80/120 360 POWER GRID Dhaka(N)
76 Kachua Cumilla 2x50/75 150 POWER GRID Cumilla
77 Kallayanpur Dhaka 3x50/75 225 POWER GRID Dhaka(N)
78 Kaliganj Khulna 2x50/75 150 POWER GRID Khulna
79 Kalurghat Chattogram 2x80/120 240 POWER GRID Chattogram
80 Kamrangirchar Dhaka 3x50/75 225 DPDC Dhaka(N)
81 Kaptai Chattogram 1x15/20 (132/11kV) 20 BPDB Chattogram`,

  // Page 4
  `82 Kazla Dhaka 2x80/120 240 DPDC Dhaka(S)
83 Keraniganj Dhaka 2x50/75 150 POWER GRID Dhaka(S)
84 Khagrachari Chattogram 2x30/39 (2x3x10/13) 78 POWER GRID Chattogram
85 Khulna (C) Khulna 2x48/64, 1x80/120 248 POWER GRID Khulna
86 Khulshi Chattogram 2x80/120 240 POWER GRID Chattogram
87 Kishoreganj Mymensingh 3x80/120 360 POWER GRID Dhaka(N)
88 Kodda Dhaka 5x50/75 375 POWER GRID Dhaka(N)
89 Kosba Cumilla 2x80/120 240 POWER GRID Cumilla
90 KSRM Chattogram 2x35/50, 1x50 150 Bulk Chattogram
91 Kulaura Sylhet 3x25/41 123 POWER GRID Cumilla
92 Kurigram Rangpur 2x50/75 150 POWER GRID Bogura
93 Kushtia Khulna 3x80/120 360 POWER GRID HVDC
94 KYCR Chattogram 1x20/25 25 Bulk Chattogram
95 Laksam Cumilla 2x80/120 240 POWER GRID Cumilla
96 Lakshmipur Cumilla 2x80/120 240 POWER GRID Cumilla
97 Lalbagh Dhaka 2x50/75 150 DPDC Dhaka(N)
98 Lalmonirhat Rangpur 2x50/75 1x25/33 183 POWER GRID Bogura
99 Mahasthangarh Rajshahi 2x80/120 240 POWER GRID Bogura
100 Madanganj Dhaka 2x35/50 100 POWER GRID Dhaka(S)
101 Madaripur Khulna 1x25/41 2x50/75 191 POWER GRID Khulna
102 Madartek Dhaka 2x50/75 150 DPDC Dhaka(S)
103 Madunaghat Chattogram 1x80/120, 1x50/83 203 POWER GRID Chattogram
104 Magura Khulna 2x25/41, 1x80/120 202 POWER GRID HVDC
105 Maijdee Cumilla 2x80/120 240 POWER GRID Cumilla
106 Manikganj Dhaka 2x50/75 1x35/50 200 POWER GRID Dhaka(N)
107 Maniknagar Dhaka 2x50/75 150 DPDC Dhaka(S)
108 Matarbari Chattogram 2x25/41 82 POWER GRID Chattogram
109 Matuail Dhaka 2x50/75 150 DPDC Dhaka(S)
110 MI Cement Dhaka 1x28 28 Bulk Dhaka(S)
111 Mirpur Dhaka 3x80/120 360 DESCO Dhaka(N)
112 Mirzapur Mymensingh 1x50/75, 1x35/50 125 POWER GRID Dhaka(N)
113 Mithapukur Rangpur 2x50/75 150 POWER GRID Bogura
114 MSML Chattogram 1x25/30 30 Bulk Chattogram
115 Moghbazar Dhaka 3x50/75 225 DPDC Dhaka(S)
116 Mongla Khulna 2x50/75 150 POWER GRID Khulna
117 Motijheel Dhaka 2x80/120 240 DPDC Dhaka(S)
118 MRT Motijheel Dhaka 2x40/50 100 DMTCL Dhaka(S)
119 MRT Uttara Dhaka 2x40/50 100 DMTCL Dhaka(N)
120 Mukhtagacha Mymensingh 3x50/75 225 POWER GRID Dhaka(N)
121 Munshiganj Dhaka 2x80/120 240 POWER GRID Dhaka(S)
122 Muradnagar Cumilla 2x80/120 240 POWER GRID Cumilla
123 Mymensingh Mymensingh 3x80/120 360 POWER GRID Dhaka(N)
124 Nabinagar Dhaka 1x80/120 120 POWER GRID Dhaka(N)
125 Naogaon Rajshahi 2x50/75,2x80/120 390 POWER GRID Bogura
126 Narail Khulna 2x50/75 150 POWER GRID Khulna
127 Narinda Dhaka 2x50/75 150 DPDC Dhaka(S)
128 Narsingdi Dhaka 4x50/75 300 POWER GRID Dhaka(S)`,

  // Page 5
  `129 Natore Rajshahi 3x50/75, 1x35/50 275 POWER GRID Bogura
130 Nawabganj Dhaka 2x50/75 150 POWER GRID Dhaka(S)
131 Netrokona Mymensingh 3x50/75, 1x35/50 275 POWER GRID Dhaka(N)
132 New Tongi Dhaka 2x80/120 240 DESCO Dhaka(N)
133 Niamatpur Rajshahi 2x50/75, 1x35/50 200 POWER GRID Bogura
134 Noapara Khulna 2x50/75 1x44.1/63 213 POWER GRID Khulna
135 Pabna Rajshahi 1x50/75, 3x25/41 198 POWER GRID HVDC
136 Palashbari Rangpur 2x50/75 2X25/41 232 POWER GRID Bogura
137 Panchagarh Rangpur 4x25/41 164 POWER GRID Bogura
138 Patiya Chattogram 2x80/120 240 POWER GRID Chattogram
139 Patuakhali Barishal 3x50/75 225 POWER GRID Khulna
140 Payra Barishal 2x80/120 240 POWER GRID Khulna
141 PHP Cumilla 1x30/35 35 Bulk Cumilla
142 Postagola Dhaka 2x80/120 240 DPDC Dhaka(S)
143 Pubail Dhaka 2x80/120 240 POWER GRID Dhaka(N)
144 Purbachal Dhaka 2x80/120 240 DESCO Dhaka(N)
145 Purbasadipur Rangpur 2x80/120, 1x50/75 315 POWER GRID Bogura
146 RSRM Dhaka 1x20/25 25 Bulk Dhaka(S)
147 Rajbari Khulna 2x50/75, 1x25/41 191 POWER GRID Khulna
148 Rajshahi Rajshahi 2x80/120, 1x35/50 290 POWER GRID Bogura
149 Rajshahi(N) Rajshahi 2x80/120 240 POWER GRID Bogura
150 Rajendrapur Dhaka 3x80/120 360 POWER GRID Dhaka(N)
151 Ramganj Cumilla 2x50/75 150 POWER GRID Cumilla
152 Rampur Chattogram 2x80/120 240 POWER GRID Chattogram
153 Rangamati Chattogram 2x25/41 82 POWER GRID Chattogram
154 Rangpur Rangpur 2x80/120, 1x25/41 281 POWER GRID Bogura
155 Rooppur Rajshahi 2x25/41 82 MoST HVDC
156 Saidpur Rangpur 1x35/50, 3x50/75 275 POWER GRID Bogura
157 Satkhira Khulna 2x25/41, 1x80/120 202 POWER GRID Khulna
158 Sathia Rajshahi 2x50/75 150 POWER GRID HVDC
159 Satmasjid Dhaka 2x80/120 240 POWER GRID Dhaka(N)
160 Savar Dhaka 4x50/75 300 POWER GRID Dhaka(N)
161 Seven Circle Dhaka 2x30 60 Bulk Dhaka(S)
162 Shah Cement Dhaka 1x80/120 120 Bulk Dhaka(S)
163 Shahjadpur Rajshahi 2x50/75, 2x35/50 250 POWER GRID HVDC
164 Shahjibazar Sylhet 2x25/41, 1x80/120 202 POWER GRID Cumilla
165 Shahmirpur Chattogram 2x48/64 128 POWER GRID Chattogram
166 Shambhuganj Mymensingh 1x50/83.3 83.3 POWER GRID Dhaka(N)
167 Shariatpur Khulna 2x80/120 240 POWER GRID Khulna
168 Sherpur Mymensingh 3x50/75, 1x35/50 275 POWER GRID Dhaka(N)
169 Sherpur(Bogura) Rajshahi 3x50/75 225 POWER GRID Bogura
170 Sholoshahar Chattogram 2x80/120 240 POWER GRID Chattogram`,

  // Page 6
  `171 Shyampur Dhaka 2x50/75, 2x80/120 390 DPDC Dhaka(S) 132/33kV
172 Siddhirganj Dhaka 3x80/120 360 POWER GRID Dhaka(S) 132/33kV
173 Sikalbaha Chattogram 1x25/41.6, 1x50/75 116.6 BPDB Chattogram 132/33kV
174 Sitakunda Chattogram 2x50/75 150 POWER GRID Chattogram 132/33kV
175 Sirajganj Rajshahi 2x50/75, 2x80/120 390 POWER GRID HVDC 132/33kV
176 Sitalakhya Dhaka 3x50/75 225 DPDC Dhaka(S) 132/33kV
177 Sonargaon Dhaka 2x80/120 240 POWER GRID Dhaka(S) 132/33kV
178 Srimangal Sylhet 1x15/20, 3x25/41 143 POWER GRID Cumilla 132/33kV
179 Sreenagar Dhaka 2x50/75 150 POWER GRID Dhaka(S) 132/33kV
180 SSML Chattogram 1x25/30 30 Bulk Chattogram 132/33kV
181 Sripur Dhaka 2x50/75 150 POWER GRID Dhaka(N) 132/33kV
182 Sunamganj Sylhet 2x30/39 (2x3x10/13) 78 POWER GRID Cumilla 132/33kV
183 Sylhet Sylhet 1x80/120, 2x25/41,1x50/75 277 POWER GRID Cumilla 132/33kV
184 Sylhet (S) Sylhet 2x50/75 150 POWER GRID Cumilla 132/33kV
185 Tangail Mymensingh 2x80/120, 1x50/75, 1x25/41 356 POWER GRID Dhaka(N) 132/33kV
186 Taraganj Rangpur 2x25/41 82 POWER GRID Bogura 132/33kV
187 Tasnim Chemical Dhaka 1x80/120 120 Bulk Dhaka(S) 132/33kV
188 Thakurgaon Rangpur 2x50/75, 1x25/41 191 POWER GRID Bogura 132/33kV
189 TKCCL Chattogram 2x50/75, 1x64 139 Bulk Chattogram 132/33kV
190 Tongi Dhaka 1x50/75, 2x80/120 315 POWER GRID Dhaka(N) 132/33kV
191 Tongi-3 (Mill Gate) Dhaka 2x80/120 240 DESCO Dhaka(N) 132/33kV
192 Ullapara Rajshahi 2x80/120 240 POWER GRID HVDC 132/33kV
193 Ullon Dhaka 2x35/50. 1x50/75 175 DPDC Dhaka(S) 132/33kV
194 Uttara 3P Dhaka 2x80/120 240 DESCO Dhaka(N) 132/33kV
195 Uttara Dhaka 3x80/120 360 DESCO Dhaka(N) 132/33kV
196 Zigatola Dhaka 2x80/120 240 DPDC Dhaka(S) 132/33kV`
];

const substations = [];
let currentCategory = '400kV';

const zones = ['Dhaka', 'Khulna', 'Barishal', 'Cumilla', 'Sylhet', 'Rajshahi', 'Chattogram', 'Rangpur', 'Mymensingh'];
const owners = ['POWER GRID', 'APSCL', 'BIFPCL', 'RNPP', 'Bulk', 'BPDB', 'DESCO', 'DPDC', 'MoST', 'DMTCL'];

for (let pIdx = 0; pIdx < pages.length; pIdx++) {
  const text = pages[pIdx];
  const lines = text.split('\n');
  
  for (let l = 0; l < lines.length; l++) {
    const line = lines[l].trim();
    if (!line) continue;
    
    const tokens = line.split(/\s+/);
    if (tokens.length < 4) continue;
    
    const sn = tokens[0];
    
    // Categorization logic based on page and serial number resets
    if (pIdx === 0) {
      if (sn === '1' && substations.length === 0) {
        currentCategory = '400kV';
      } else if (sn === '1' && substations.length > 2) {
        // First reset (Gopalganj N) is 230kV AC substations
        currentCategory = '230kV';
      } else if (sn === '1' && substations.length > 10) {
        // Second reset (Agargaon) is 132kV AC substations
        currentCategory = '132kV';
      }
    } else if (pIdx === 1) {
      if (sn === '1' && currentCategory === '132kV') {
        currentCategory = '230/33kV';
      } else if (sn === '1' && currentCategory === '230/33kV') {
        currentCategory = '132/33kV';
      }
    }
    
    // Find where the zone and transformer details start
    let zoneIndex = -1;
    let zoneName = '';
    
    // Find the first token that is an operation zone AND followed by a transformer detail indicator (starting with digit or is '-')
    for (let i = 1; i < tokens.length - 1; i++) {
      if (zones.includes(tokens[i])) {
        const nextToken = tokens[i + 1];
        if (nextToken.match(/^[0-9x\-]/) || nextToken === '1X' || nextToken === '2X') {
          zoneIndex = i;
          zoneName = tokens[i];
          break;
        }
      }
    }
    
    // Fallback if no matching pattern, find just the first zone
    if (zoneIndex === -1) {
      for (let i = 1; i < tokens.length; i++) {
        if (zones.includes(tokens[i])) {
          zoneIndex = i;
          zoneName = tokens[i];
          break;
        }
      }
    }
    
    if (zoneIndex === -1) {
      console.warn(`No zone found for line: ${line}`);
      continue;
    }
    
    // Substation Name: tokens between SN and Zone index
    const name = tokens.slice(1, zoneIndex).join(' ');
    
    // Find Ownership in remaining tokens
    let owner = 'POWER GRID';
    let ownerIndex = -1;
    for (let i = zoneIndex + 1; i < tokens.length; i++) {
      // Check for multi-word "POWER GRID"
      if (tokens[i] === 'POWER' && tokens[i+1] === 'GRID') {
        owner = 'POWER GRID';
        ownerIndex = i;
        break;
      } else if (owners.includes(tokens[i]) && tokens[i] !== 'POWER') {
        owner = tokens[i];
        ownerIndex = i;
        break;
      }
    }
    
    if (ownerIndex === -1) {
      // Look from the end
      ownerIndex = tokens.length - 2;
    }
    
    // Transformer Detail and Capacity: tokens between Zone and Owner
    const detailTokens = tokens.slice(zoneIndex + 1, ownerIndex);
    let transformer = '';
    let capacity = '';
    
    if (detailTokens.length > 0) {
      const lastToken = detailTokens[detailTokens.length - 1];
      if (lastToken === 'MW' && detailTokens.length >= 4) {
        // e.g. "1x500 MW 500 MW"
        transformer = detailTokens.slice(0, detailTokens.length - 2).join(' ');
        capacity = detailTokens.slice(detailTokens.length - 2).join(' ');
      } else if (lastToken === 'MVA' && detailTokens.length >= 4) {
        transformer = detailTokens.slice(0, detailTokens.length - 2).join(' ');
        capacity = detailTokens.slice(detailTokens.length - 2).join(' ');
      } else {
        transformer = detailTokens.slice(0, detailTokens.length - 1).join(' ');
        capacity = lastToken;
      }
    }
    
    if (!transformer || transformer === '-') {
      transformer = '—';
      capacity = '—';
    }
    
    // Circle: tokens after Owner
    const circleTokens = tokens.slice(ownerIndex + (owner === 'POWER GRID' ? 2 : 1));
    // Remove "132/33kV" if it was included (only on page 6)
    if (circleTokens[circleTokens.length - 1] === '132/33kV') {
      circleTokens.pop();
    }
    const circle = circleTokens.join(' ') || '—';
    
    substations.push({
      sn: parseInt(sn),
      name,
      zone: zoneName,
      transformer,
      capacity,
      owner,
      circle,
      voltage: currentCategory
    });
  }
}

console.log(`Parsed ${substations.length} substations successfully.`);

const tsContent = `export type SubstationItem = {
  sn: number;
  name: string;
  zone: string;
  transformer: string;
  capacity: string;
  owner: string;
  circle: string;
  voltage: '400kV' | '230kV' | '132kV' | '230/33kV' | '132/33kV';
};

export const substationsData: SubstationItem[] = ${JSON.stringify(substations, null, 2)} as any;
`;

fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'lib', 'substations-data.ts'), tsContent, 'utf8');
console.log('Saved to lib/substations-data.ts');
