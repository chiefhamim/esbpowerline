export type SubstationItem = {
  sn: number;
  name: string;
  zone: string;
  transformer: string;
  capacity: string;
  owner: string;
  circle: string;
  voltage: '400kV' | '230kV' | '132kV' | '230/33kV' | '132/33kV';
};

export const substationsData: SubstationItem[] = [
  {
    "sn": 1,
    "name": "BIPTC 1st Block",
    "zone": "Khulna",
    "transformer": "1x500 MW",
    "capacity": "500 MW",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "400kV"
  },
  {
    "sn": 2,
    "name": "BIPTC 2nd Block",
    "zone": "Khulna",
    "transformer": "1x500 MW",
    "capacity": "500 MW",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "400kV"
  },
  {
    "sn": 1,
    "name": "Aminbazar",
    "zone": "Dhaka",
    "transformer": "3x520",
    "capacity": "1560",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "400kV"
  },
  {
    "sn": 2,
    "name": "Amtali Switching Barishal - - POWER GRID",
    "zone": "Khulna",
    "transformer": "POWER GRID",
    "capacity": "Khulna",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "400kV"
  },
  {
    "sn": 3,
    "name": "Ashuganj (N)",
    "zone": "Cumilla",
    "transformer": "2x244/325",
    "capacity": "650",
    "owner": "APSCL",
    "circle": "Cumilla",
    "voltage": "400kV"
  },
  {
    "sn": 4,
    "name": "Bhulta",
    "zone": "Dhaka",
    "transformer": "2x520",
    "capacity": "1040",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "400kV"
  },
  {
    "sn": 5,
    "name": "Bibiyana Sylhet 2x520 1040 POWER GRID",
    "zone": "Cumilla",
    "transformer": "POWER GRID",
    "capacity": "Cumilla",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "400kV"
  },
  {
    "sn": 6,
    "name": "Bogura (W)",
    "zone": "Rajshahi",
    "transformer": "3x750",
    "capacity": "2250",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "400kV"
  },
  {
    "sn": 7,
    "name": "Gopalganj (N)",
    "zone": "Khulna",
    "transformer": "1x750",
    "capacity": "750",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "400kV"
  },
  {
    "sn": 8,
    "name": "Kaliakoir",
    "zone": "Dhaka",
    "transformer": "2x520",
    "capacity": "1040",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "400kV"
  },
  {
    "sn": 9,
    "name": "Korerhat",
    "zone": "Chattogram",
    "transformer": "2x1000",
    "capacity": "2000",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "400kV"
  },
  {
    "sn": 10,
    "name": "Meghnaghat",
    "zone": "Dhaka",
    "transformer": "3x750",
    "capacity": "2250",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "400kV"
  },
  {
    "sn": 11,
    "name": "Madunaghat",
    "zone": "Chattogram",
    "transformer": "3x750",
    "capacity": "2250",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "400kV"
  },
  {
    "sn": 12,
    "name": "Mirsarai",
    "zone": "Chattogram",
    "transformer": "1x1000",
    "capacity": "1000",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "400kV"
  },
  {
    "sn": 13,
    "name": "Rampal",
    "zone": "Khulna",
    "transformer": "2x520",
    "capacity": "1040",
    "owner": "BIFPCL",
    "circle": "Khulna",
    "voltage": "400kV"
  },
  {
    "sn": 14,
    "name": "RNPP",
    "zone": "Rajshahi",
    "transformer": "RNPP",
    "capacity": "Rajshahi",
    "owner": "RNPP",
    "circle": "Rajshahi 2x520 1040 RNPP HVDC",
    "voltage": "400kV"
  },
  {
    "sn": 1,
    "name": "Gopalganj (N)",
    "zone": "Khulna",
    "transformer": "3x325",
    "capacity": "975",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 2,
    "name": "Kaliakoir",
    "zone": "Dhaka",
    "transformer": "3x325, 1x300",
    "capacity": "1275",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 3,
    "name": "Korerhat",
    "zone": "Chattogram",
    "transformer": "1x325",
    "capacity": "325",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 4,
    "name": "Rahanpur",
    "zone": "Rajshahi",
    "transformer": "2x520",
    "capacity": "1040",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 5,
    "name": "Payra Barishal 2x325 650 POWER GRID",
    "zone": "Khulna",
    "transformer": "POWER GRID",
    "capacity": "Khulna",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 1,
    "name": "Agargaon",
    "zone": "Dhaka",
    "transformer": "2x300",
    "capacity": "600",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 2,
    "name": "Aminbazar",
    "zone": "Dhaka",
    "transformer": "3x225",
    "capacity": "675",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 3,
    "name": "Ashuganj",
    "zone": "Cumilla",
    "transformer": "2x300",
    "capacity": "600",
    "owner": "APSCL",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 4,
    "name": "Baghabari",
    "zone": "Rajshahi",
    "transformer": "1x225, 1x300",
    "capacity": "525",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 5,
    "name": "Barapukuria",
    "zone": "Rangpur",
    "transformer": "2x225 1x225/300",
    "capacity": "750",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 6,
    "name": "Barishal (N) Barishal 2x300 600 POWER GRID",
    "zone": "Khulna",
    "transformer": "POWER GRID",
    "capacity": "Khulna",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 7,
    "name": "Bheramara",
    "zone": "Khulna",
    "transformer": "2x225",
    "capacity": "450",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 8,
    "name": "Bhulta",
    "zone": "Dhaka",
    "transformer": "2x300",
    "capacity": "600",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 9,
    "name": "Bogura (S)",
    "zone": "Rajshahi",
    "transformer": "2x225(7x75), 2x225/300",
    "capacity": "1050",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 10,
    "name": "Chowmuhani",
    "zone": "Cumilla",
    "transformer": "3x350",
    "capacity": "1050",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 11,
    "name": "",
    "zone": "Cumilla",
    "transformer": "(N) Cumilla 3x225",
    "capacity": "675",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 12,
    "name": "Faridpur",
    "zone": "Khulna",
    "transformer": "2x350",
    "capacity": "700",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 13,
    "name": "Fenchuganj Sylhet 2x300 600 POWER GRID",
    "zone": "Cumilla",
    "transformer": "POWER GRID",
    "capacity": "Cumilla",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 14,
    "name": "Feni (N)",
    "zone": "Cumilla",
    "transformer": "3x300",
    "capacity": "900",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 15,
    "name": "Ghorashal",
    "zone": "Dhaka",
    "transformer": "2x125",
    "capacity": "250",
    "owner": "BPDB",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 16,
    "name": "Haripur",
    "zone": "Dhaka",
    "transformer": "3x225(10x75)",
    "capacity": "675",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 17,
    "name": "Hasnabad",
    "zone": "Dhaka",
    "transformer": "3x225(10x75)",
    "capacity": "675",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 18,
    "name": "Hathazari",
    "zone": "Chattogram",
    "transformer": "3x150",
    "capacity": "450",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 19,
    "name": "Jhenaidah(S)",
    "zone": "Khulna",
    "transformer": "2x300",
    "capacity": "600",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 20,
    "name": "Ishwardi",
    "zone": "Rajshahi",
    "transformer": "3x225",
    "capacity": "675",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 21,
    "name": "Kachua",
    "zone": "Cumilla",
    "transformer": "2x350",
    "capacity": "700",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 22,
    "name": "Keraniganj",
    "zone": "Dhaka",
    "transformer": "3x300",
    "capacity": "900",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 23,
    "name": "",
    "zone": "Khulna",
    "transformer": "(S) Khulna 2x225(7x75) 1x300",
    "capacity": "750",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 24,
    "name": "Madunaghat",
    "zone": "Chattogram",
    "transformer": "3x300",
    "capacity": "900",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 25,
    "name": "Maniknagar",
    "zone": "Dhaka",
    "transformer": "2x300",
    "capacity": "600",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 26,
    "name": "Meghnaghat Switching",
    "zone": "Dhaka",
    "transformer": "—",
    "capacity": "—",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 27,
    "name": "Naogaon",
    "zone": "Rajshahi",
    "transformer": "3x300",
    "capacity": "900",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 28,
    "name": "Purbasadipur",
    "zone": "Rangpur",
    "transformer": "2x300",
    "capacity": "600",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 29,
    "name": "Rajshahi(N) Rajshahi 2x300",
    "zone": "Dhaka",
    "transformer": "—",
    "capacity": "—",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 30,
    "name": "Rampura",
    "zone": "Dhaka",
    "transformer": "3x450",
    "capacity": "1350",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 31,
    "name": "Rampur",
    "zone": "Chattogram",
    "transformer": "2x300",
    "capacity": "600",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 32,
    "name": "Siddhirganj",
    "zone": "Dhaka",
    "transformer": "2x300",
    "capacity": "600",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 33,
    "name": "Sirajganj Switching",
    "zone": "Rajshahi",
    "transformer": "—",
    "capacity": "—",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 34,
    "name": "Shyampur",
    "zone": "Dhaka",
    "transformer": "2x225/300",
    "capacity": "600",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 35,
    "name": "Sripur",
    "zone": "Dhaka",
    "transformer": "2x225/300",
    "capacity": "600",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 36,
    "name": "Tongi",
    "zone": "Dhaka",
    "transformer": "3x225(10x75), 1x450",
    "capacity": "1125",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 37,
    "name": "Sikalbaha",
    "zone": "Chattogram",
    "transformer": "2x300",
    "capacity": "600",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 1,
    "name": "AKSPL",
    "zone": "Chattogram",
    "transformer": "2x130/150, 1x80",
    "capacity": "380",
    "owner": "Bulk",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 2,
    "name": "BSRM",
    "zone": "Chattogram",
    "transformer": "3x130/140",
    "capacity": "420",
    "owner": "Bulk",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 3,
    "name": "GPH",
    "zone": "Chattogram",
    "transformer": "2x100/125",
    "capacity": "250",
    "owner": "Bulk",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 4,
    "name": "Borhanuddin Barishal 1x120/140 (230/33kV) 140 BPDB",
    "zone": "Khulna",
    "transformer": "BPDB",
    "capacity": "Khulna",
    "owner": "BPDB",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 5,
    "name": "Mirsarai",
    "zone": "Chattogram",
    "transformer": "2x125/140",
    "capacity": "280",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 6,
    "name": "Ghorasal SW",
    "zone": "Dhaka",
    "transformer": "1x125/140",
    "capacity": "140",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 1,
    "name": "Aftabnagar",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DESCO",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 2,
    "name": "Agargaon",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 3,
    "name": "Agrabad",
    "zone": "Chattogram",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 4,
    "name": "AKSML",
    "zone": "Chattogram",
    "transformer": "1x50/80",
    "capacity": "80",
    "owner": "Bulk",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 5,
    "name": "Amnura",
    "zone": "Rajshahi",
    "transformer": "3x35/50",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 6,
    "name": "Anandabazar",
    "zone": "Chattogram",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 7,
    "name": "Ashuganj",
    "zone": "Cumilla",
    "transformer": "1x25/41 1x50/75",
    "capacity": "116",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 8,
    "name": "Bagerhat",
    "zone": "Khulna",
    "transformer": "2x25/41, 1x50/75",
    "capacity": "157",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 9,
    "name": "Bajitpur",
    "zone": "Mymensingh",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 10,
    "name": "Bakerganj Barishal 1x25/41 41 POWER GRID",
    "zone": "Khulna",
    "transformer": "POWER GRID",
    "capacity": "Khulna",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 11,
    "name": "Bakulia",
    "zone": "Chattogram",
    "transformer": "2x48/64 2x50/75",
    "capacity": "278",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 12,
    "name": "Bangabhaban",
    "zone": "Dhaka",
    "transformer": "1x28/35, 1x80/120",
    "capacity": "155",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 13,
    "name": "Barguna Barishal 2x50/75 150 POWER GRID",
    "zone": "Khulna",
    "transformer": "POWER GRID",
    "capacity": "Khulna",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 14,
    "name": "Barapukuria",
    "zone": "Rangpur",
    "transformer": "2x50/75, 1x40",
    "capacity": "190",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 15,
    "name": "Barishal Barishal 1x80/120, 1x50/75 195 POWER GRID",
    "zone": "Khulna",
    "transformer": "POWER GRID",
    "capacity": "Khulna",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 16,
    "name": "Barishal(N) Barishal 2x80/120 240 POWER GRID",
    "zone": "Khulna",
    "transformer": "POWER GRID",
    "capacity": "Khulna",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 17,
    "name": "Baroaulia",
    "zone": "Chattogram",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 18,
    "name": "Bashundhara",
    "zone": "Dhaka",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "DESCO",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 19,
    "name": "Bashundhara Cement",
    "zone": "Dhaka",
    "transformer": "1x35",
    "capacity": "35",
    "owner": "Bulk",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 20,
    "name": "Banani",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DESCO",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 21,
    "name": "Baroirhat",
    "zone": "Chattogram",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 22,
    "name": "Beanibazar Sylhet 2x50/75 150 POWER GRID",
    "zone": "Cumilla",
    "transformer": "POWER GRID",
    "capacity": "Cumilla",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 23,
    "name": "Bhaluka",
    "zone": "Mymensingh",
    "transformer": "2x80/120, 1x50/75",
    "capacity": "315",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 24,
    "name": "Benapole",
    "zone": "Khulna",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 25,
    "name": "Bhandaria Barishal 2x50/75 150 POWER GRID",
    "zone": "Khulna",
    "transformer": "POWER GRID",
    "capacity": "Khulna",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 26,
    "name": "Bhangura",
    "zone": "Rajshahi",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 27,
    "name": "Bhasantek",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 28,
    "name": "Bheramara GK",
    "zone": "Khulna",
    "transformer": "3x25/41, 1x15/20",
    "capacity": "143",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 29,
    "name": "Bhulta",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 30,
    "name": "BMPIL",
    "zone": "Dhaka",
    "transformer": "1x50/75",
    "capacity": "75",
    "owner": "Bulk",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 31,
    "name": "Bogura",
    "zone": "Rajshahi",
    "transformer": "4x80/120",
    "capacity": "480",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 32,
    "name": "Brahmanbaria",
    "zone": "Cumilla",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 33,
    "name": "BSRM(Khulshi)",
    "zone": "Chattogram",
    "transformer": "1x64/80",
    "capacity": "80",
    "owner": "Bulk",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 34,
    "name": "Chandpur",
    "zone": "Cumilla",
    "transformer": "3x50/75",
    "capacity": "225",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 35,
    "name": "Chandraghona",
    "zone": "Chattogram",
    "transformer": "1x50/75, 1x25/41",
    "capacity": "116",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 36,
    "name": "Chapai Nawabganj",
    "zone": "Rajshahi",
    "transformer": "1x15/20, 3x50/75",
    "capacity": "245",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 37,
    "name": "Char Saidpur",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 38,
    "name": "Chauddagram",
    "zone": "Cumilla",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 39,
    "name": "Chhatak Sylhet 2x15/20,1x25/41 81 POWER GRID",
    "zone": "Cumilla",
    "transformer": "POWER GRID",
    "capacity": "Cumilla",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 40,
    "name": "Chandina",
    "zone": "Cumilla",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 41,
    "name": "Chowdala",
    "zone": "Rajshahi",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 42,
    "name": "Chowmuhani",
    "zone": "Cumilla",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 43,
    "name": "Chuadanga",
    "zone": "Khulna",
    "transformer": "2x50/75 1x25/41",
    "capacity": "191",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 44,
    "name": "",
    "zone": "Cumilla",
    "transformer": "(N) Cumilla 3x50/75",
    "capacity": "225",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 45,
    "name": "",
    "zone": "Cumilla",
    "transformer": "(S) Cumilla 4x50/75",
    "capacity": "300",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 46,
    "name": "Cox's Bazar",
    "zone": "Chattogram",
    "transformer": "2x80/120, 1x50/75",
    "capacity": "315",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 47,
    "name": "Daganbhuiyan",
    "zone": "Cumilla",
    "transformer": "1x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 48,
    "name": "",
    "zone": "Dhaka",
    "transformer": "University (DU) Dhaka 2x80/120",
    "capacity": "240",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 49,
    "name": "Daudkandi",
    "zone": "Cumilla",
    "transformer": "3x50/75",
    "capacity": "225",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 50,
    "name": "Dhamrai",
    "zone": "Dhaka",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 51,
    "name": "Dhanmondi",
    "zone": "Dhaka",
    "transformer": "1x50/75 3x80/120",
    "capacity": "435",
    "owner": "DPDC",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 52,
    "name": "Dohazari",
    "zone": "Chattogram",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 53,
    "name": "Faridpur",
    "zone": "Khulna",
    "transformer": "2x80/120, 1x25/41",
    "capacity": "281",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 54,
    "name": "Fatullah",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 55,
    "name": "Fenchuganj Sylhet 2x15/20,1x25/41 81 POWER GRID",
    "zone": "Cumilla",
    "transformer": "POWER GRID",
    "capacity": "Cumilla",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 56,
    "name": "Feni",
    "zone": "Cumilla",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 57,
    "name": "Gallamari",
    "zone": "Khulna",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 58,
    "name": "Ghatail",
    "zone": "Mymensingh",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 59,
    "name": "Ghorashal",
    "zone": "Dhaka",
    "transformer": "2x41/63",
    "capacity": "126",
    "owner": "BPDB",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 60,
    "name": "Goalpara",
    "zone": "Khulna",
    "transformer": "3x25/41",
    "capacity": "123",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 61,
    "name": "Gopalganj",
    "zone": "Khulna",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 62,
    "name": "Gulshan",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 63,
    "name": "Halishahar",
    "zone": "Chattogram",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 64,
    "name": "Haripur SBU",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 65,
    "name": "Hasnabad",
    "zone": "Dhaka",
    "transformer": "3x66/100",
    "capacity": "300",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 66,
    "name": "Hathazari",
    "zone": "Chattogram",
    "transformer": "1x50/75, 1x80/120",
    "capacity": "195",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 67,
    "name": "Ishwardi",
    "zone": "Rajshahi",
    "transformer": "2x50/75, 1x80/120",
    "capacity": "270",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 68,
    "name": "Jaldhaka",
    "zone": "Rangpur",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 69,
    "name": "Jamalpur",
    "zone": "Mymensingh",
    "transformer": "4x50/75",
    "capacity": "300",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 70,
    "name": "Jashore",
    "zone": "Khulna",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 71,
    "name": "Jhenaidah",
    "zone": "Khulna",
    "transformer": "2x80/120, 1x50/83.3",
    "capacity": "323.3",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 72,
    "name": "Joydebpur",
    "zone": "Dhaka",
    "transformer": "2x50/75, 1x80/120",
    "capacity": "270",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 73,
    "name": "Joypurhat",
    "zone": "Rajshahi",
    "transformer": "4x25/41",
    "capacity": "164",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 74,
    "name": "Juldah",
    "zone": "Chattogram",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 75,
    "name": "Kabirpur",
    "zone": "Dhaka",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 76,
    "name": "Kachua",
    "zone": "Cumilla",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 77,
    "name": "Kallayanpur",
    "zone": "Dhaka",
    "transformer": "3x50/75",
    "capacity": "225",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 78,
    "name": "Kaliganj",
    "zone": "Khulna",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 79,
    "name": "Kalurghat",
    "zone": "Chattogram",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 80,
    "name": "Kamrangirchar",
    "zone": "Dhaka",
    "transformer": "3x50/75",
    "capacity": "225",
    "owner": "DPDC",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 81,
    "name": "Kaptai",
    "zone": "Chattogram",
    "transformer": "1x15/20 (132/11kV)",
    "capacity": "20",
    "owner": "BPDB",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 82,
    "name": "Kazla",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 83,
    "name": "Keraniganj",
    "zone": "Dhaka",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 84,
    "name": "Khagrachari",
    "zone": "Chattogram",
    "transformer": "2x30/39 (2x3x10/13)",
    "capacity": "78",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 85,
    "name": "",
    "zone": "Khulna",
    "transformer": "(C) Khulna 2x48/64, 1x80/120",
    "capacity": "248",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 86,
    "name": "Khulshi",
    "zone": "Chattogram",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 87,
    "name": "Kishoreganj",
    "zone": "Mymensingh",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 88,
    "name": "Kodda",
    "zone": "Dhaka",
    "transformer": "5x50/75",
    "capacity": "375",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 89,
    "name": "Kosba",
    "zone": "Cumilla",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 90,
    "name": "KSRM",
    "zone": "Chattogram",
    "transformer": "2x35/50, 1x50",
    "capacity": "150",
    "owner": "Bulk",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 91,
    "name": "Kulaura Sylhet 3x25/41 123 POWER GRID",
    "zone": "Cumilla",
    "transformer": "POWER GRID",
    "capacity": "Cumilla",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 92,
    "name": "Kurigram",
    "zone": "Rangpur",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 93,
    "name": "Kushtia",
    "zone": "Khulna",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 94,
    "name": "KYCR",
    "zone": "Chattogram",
    "transformer": "1x20/25",
    "capacity": "25",
    "owner": "Bulk",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 95,
    "name": "Laksam",
    "zone": "Cumilla",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 96,
    "name": "Lakshmipur",
    "zone": "Cumilla",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 97,
    "name": "Lalbagh",
    "zone": "Dhaka",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "DPDC",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 98,
    "name": "Lalmonirhat",
    "zone": "Rangpur",
    "transformer": "2x50/75 1x25/33",
    "capacity": "183",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 99,
    "name": "Mahasthangarh",
    "zone": "Rajshahi",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 100,
    "name": "Madanganj",
    "zone": "Dhaka",
    "transformer": "2x35/50",
    "capacity": "100",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 101,
    "name": "Madaripur",
    "zone": "Khulna",
    "transformer": "1x25/41 2x50/75",
    "capacity": "191",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 102,
    "name": "Madartek",
    "zone": "Dhaka",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 103,
    "name": "Madunaghat",
    "zone": "Chattogram",
    "transformer": "1x80/120, 1x50/83",
    "capacity": "203",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 104,
    "name": "Magura",
    "zone": "Khulna",
    "transformer": "2x25/41, 1x80/120",
    "capacity": "202",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 105,
    "name": "Maijdee",
    "zone": "Cumilla",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 106,
    "name": "Manikganj",
    "zone": "Dhaka",
    "transformer": "2x50/75 1x35/50",
    "capacity": "200",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 107,
    "name": "Maniknagar",
    "zone": "Dhaka",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 108,
    "name": "Matarbari",
    "zone": "Chattogram",
    "transformer": "2x25/41",
    "capacity": "82",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 109,
    "name": "Matuail",
    "zone": "Dhaka",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 110,
    "name": "MI Cement",
    "zone": "Dhaka",
    "transformer": "1x28",
    "capacity": "28",
    "owner": "Bulk",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 111,
    "name": "Mirpur",
    "zone": "Dhaka",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "DESCO",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 112,
    "name": "Mirzapur",
    "zone": "Mymensingh",
    "transformer": "1x50/75, 1x35/50",
    "capacity": "125",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 113,
    "name": "Mithapukur",
    "zone": "Rangpur",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 114,
    "name": "MSML",
    "zone": "Chattogram",
    "transformer": "1x25/30",
    "capacity": "30",
    "owner": "Bulk",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 115,
    "name": "Moghbazar",
    "zone": "Dhaka",
    "transformer": "3x50/75",
    "capacity": "225",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 116,
    "name": "Mongla",
    "zone": "Khulna",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 117,
    "name": "Motijheel",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 118,
    "name": "MRT Motijheel",
    "zone": "Dhaka",
    "transformer": "2x40/50",
    "capacity": "100",
    "owner": "DMTCL",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 119,
    "name": "MRT Uttara",
    "zone": "Dhaka",
    "transformer": "2x40/50",
    "capacity": "100",
    "owner": "DMTCL",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 120,
    "name": "Mukhtagacha",
    "zone": "Mymensingh",
    "transformer": "3x50/75",
    "capacity": "225",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 121,
    "name": "Munshiganj",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 122,
    "name": "Muradnagar",
    "zone": "Cumilla",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 123,
    "name": "",
    "zone": "Mymensingh",
    "transformer": "Mymensingh 3x80/120",
    "capacity": "360",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 124,
    "name": "Nabinagar",
    "zone": "Dhaka",
    "transformer": "1x80/120",
    "capacity": "120",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 125,
    "name": "Naogaon",
    "zone": "Rajshahi",
    "transformer": "2x50/75,2x80/120",
    "capacity": "390",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 126,
    "name": "Narail",
    "zone": "Khulna",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 127,
    "name": "Narinda",
    "zone": "Dhaka",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 128,
    "name": "Narsingdi",
    "zone": "Dhaka",
    "transformer": "4x50/75",
    "capacity": "300",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 129,
    "name": "Natore",
    "zone": "Rajshahi",
    "transformer": "3x50/75, 1x35/50",
    "capacity": "275",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 130,
    "name": "Nawabganj",
    "zone": "Dhaka",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 131,
    "name": "Netrokona",
    "zone": "Mymensingh",
    "transformer": "3x50/75, 1x35/50",
    "capacity": "275",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 132,
    "name": "New Tongi",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DESCO",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 133,
    "name": "Niamatpur",
    "zone": "Rajshahi",
    "transformer": "2x50/75, 1x35/50",
    "capacity": "200",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 134,
    "name": "Noapara",
    "zone": "Khulna",
    "transformer": "2x50/75 1x44.1/63",
    "capacity": "213",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 135,
    "name": "Pabna",
    "zone": "Rajshahi",
    "transformer": "1x50/75, 3x25/41",
    "capacity": "198",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 136,
    "name": "Palashbari",
    "zone": "Rangpur",
    "transformer": "2x50/75 2X25/41",
    "capacity": "232",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 137,
    "name": "Panchagarh",
    "zone": "Rangpur",
    "transformer": "4x25/41",
    "capacity": "164",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 138,
    "name": "Patiya",
    "zone": "Chattogram",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 139,
    "name": "Patuakhali Barishal 3x50/75 225 POWER GRID",
    "zone": "Khulna",
    "transformer": "POWER GRID",
    "capacity": "Khulna",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 140,
    "name": "Payra Barishal 2x80/120 240 POWER GRID",
    "zone": "Khulna",
    "transformer": "POWER GRID",
    "capacity": "Khulna",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 141,
    "name": "PHP",
    "zone": "Cumilla",
    "transformer": "1x30/35",
    "capacity": "35",
    "owner": "Bulk",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 142,
    "name": "Postagola",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 143,
    "name": "Pubail",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 144,
    "name": "Purbachal",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DESCO",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 145,
    "name": "Purbasadipur",
    "zone": "Rangpur",
    "transformer": "2x80/120, 1x50/75",
    "capacity": "315",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 146,
    "name": "RSRM",
    "zone": "Dhaka",
    "transformer": "1x20/25",
    "capacity": "25",
    "owner": "Bulk",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 147,
    "name": "Rajbari",
    "zone": "Khulna",
    "transformer": "2x50/75, 1x25/41",
    "capacity": "191",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 148,
    "name": "",
    "zone": "Rajshahi",
    "transformer": "Rajshahi 2x80/120, 1x35/50",
    "capacity": "290",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 149,
    "name": "Rajshahi(N) Rajshahi 2x80/120",
    "zone": "Dhaka",
    "transformer": "—",
    "capacity": "—",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 150,
    "name": "Rajendrapur",
    "zone": "Dhaka",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 151,
    "name": "Ramganj",
    "zone": "Cumilla",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 152,
    "name": "Rampur",
    "zone": "Chattogram",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 153,
    "name": "Rangamati",
    "zone": "Chattogram",
    "transformer": "2x25/41",
    "capacity": "82",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 154,
    "name": "",
    "zone": "Rangpur",
    "transformer": "Rangpur 2x80/120, 1x25/41",
    "capacity": "281",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 155,
    "name": "Rooppur",
    "zone": "Rajshahi",
    "transformer": "2x25/41",
    "capacity": "82",
    "owner": "MoST",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 156,
    "name": "Saidpur",
    "zone": "Rangpur",
    "transformer": "1x35/50, 3x50/75",
    "capacity": "275",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 157,
    "name": "Satkhira",
    "zone": "Khulna",
    "transformer": "2x25/41, 1x80/120",
    "capacity": "202",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 158,
    "name": "Sathia",
    "zone": "Rajshahi",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 159,
    "name": "Satmasjid",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 160,
    "name": "Savar",
    "zone": "Dhaka",
    "transformer": "4x50/75",
    "capacity": "300",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 161,
    "name": "Seven Circle",
    "zone": "Dhaka",
    "transformer": "2x30",
    "capacity": "60",
    "owner": "Bulk",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 162,
    "name": "Shah Cement",
    "zone": "Dhaka",
    "transformer": "1x80/120",
    "capacity": "120",
    "owner": "Bulk",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 163,
    "name": "Shahjadpur",
    "zone": "Rajshahi",
    "transformer": "2x50/75, 2x35/50",
    "capacity": "250",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 164,
    "name": "Shahjibazar Sylhet 2x25/41, 1x80/120 202 POWER GRID",
    "zone": "Cumilla",
    "transformer": "POWER GRID",
    "capacity": "Cumilla",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 165,
    "name": "Shahmirpur",
    "zone": "Chattogram",
    "transformer": "2x48/64",
    "capacity": "128",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 166,
    "name": "Shambhuganj",
    "zone": "Mymensingh",
    "transformer": "1x50/83.3",
    "capacity": "83.3",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 167,
    "name": "Shariatpur",
    "zone": "Khulna",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Khulna",
    "voltage": "230kV"
  },
  {
    "sn": 168,
    "name": "Sherpur",
    "zone": "Mymensingh",
    "transformer": "3x50/75, 1x35/50",
    "capacity": "275",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 169,
    "name": "Sherpur(Bogura)",
    "zone": "Rajshahi",
    "transformer": "3x50/75",
    "capacity": "225",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 170,
    "name": "Sholoshahar",
    "zone": "Chattogram",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 171,
    "name": "Shyampur",
    "zone": "Dhaka",
    "transformer": "2x50/75, 2x80/120",
    "capacity": "390",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 172,
    "name": "Siddhirganj",
    "zone": "Dhaka",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 173,
    "name": "Sikalbaha",
    "zone": "Chattogram",
    "transformer": "1x25/41.6, 1x50/75",
    "capacity": "116.6",
    "owner": "BPDB",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 174,
    "name": "Sitakunda",
    "zone": "Chattogram",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 175,
    "name": "Sirajganj",
    "zone": "Rajshahi",
    "transformer": "2x50/75, 2x80/120",
    "capacity": "390",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 176,
    "name": "Sitalakhya",
    "zone": "Dhaka",
    "transformer": "3x50/75",
    "capacity": "225",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 177,
    "name": "Sonargaon",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 178,
    "name": "Srimangal Sylhet 1x15/20, 3x25/41 143 POWER GRID",
    "zone": "Cumilla",
    "transformer": "POWER GRID",
    "capacity": "Cumilla",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 179,
    "name": "Sreenagar",
    "zone": "Dhaka",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 180,
    "name": "SSML",
    "zone": "Chattogram",
    "transformer": "1x25/30",
    "capacity": "30",
    "owner": "Bulk",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 181,
    "name": "Sripur",
    "zone": "Dhaka",
    "transformer": "2x50/75",
    "capacity": "150",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 182,
    "name": "Sunamganj Sylhet 2x30/39 (2x3x10/13) 78 POWER GRID",
    "zone": "Cumilla",
    "transformer": "POWER GRID",
    "capacity": "Cumilla",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 183,
    "name": "Sylhet Sylhet 1x80/120, 2x25/41,1x50/75 277 POWER GRID",
    "zone": "Cumilla",
    "transformer": "POWER GRID",
    "capacity": "Cumilla",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 184,
    "name": "Sylhet (S) Sylhet 2x50/75 150 POWER GRID",
    "zone": "Cumilla",
    "transformer": "POWER GRID",
    "capacity": "Cumilla",
    "owner": "POWER GRID",
    "circle": "Cumilla",
    "voltage": "230kV"
  },
  {
    "sn": 185,
    "name": "Tangail",
    "zone": "Mymensingh",
    "transformer": "2x80/120, 1x50/75, 1x25/41",
    "capacity": "356",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 186,
    "name": "Taraganj",
    "zone": "Rangpur",
    "transformer": "2x25/41",
    "capacity": "82",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 187,
    "name": "Tasnim Chemical",
    "zone": "Dhaka",
    "transformer": "1x80/120",
    "capacity": "120",
    "owner": "Bulk",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 188,
    "name": "Thakurgaon",
    "zone": "Rangpur",
    "transformer": "2x50/75, 1x25/41",
    "capacity": "191",
    "owner": "POWER GRID",
    "circle": "Bogura",
    "voltage": "230kV"
  },
  {
    "sn": 189,
    "name": "TKCCL",
    "zone": "Chattogram",
    "transformer": "2x50/75, 1x64",
    "capacity": "139",
    "owner": "Bulk",
    "circle": "Chattogram",
    "voltage": "230kV"
  },
  {
    "sn": 190,
    "name": "Tongi",
    "zone": "Dhaka",
    "transformer": "1x50/75, 2x80/120",
    "capacity": "315",
    "owner": "POWER GRID",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 191,
    "name": "Tongi-3 (Mill Gate)",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DESCO",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 192,
    "name": "Ullapara",
    "zone": "Rajshahi",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "POWER GRID",
    "circle": "HVDC",
    "voltage": "230kV"
  },
  {
    "sn": 193,
    "name": "Ullon",
    "zone": "Dhaka",
    "transformer": "2x35/50. 1x50/75",
    "capacity": "175",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  },
  {
    "sn": 194,
    "name": "Uttara 3P",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DESCO",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 195,
    "name": "Uttara",
    "zone": "Dhaka",
    "transformer": "3x80/120",
    "capacity": "360",
    "owner": "DESCO",
    "circle": "Dhaka(N)",
    "voltage": "230kV"
  },
  {
    "sn": 196,
    "name": "Zigatola",
    "zone": "Dhaka",
    "transformer": "2x80/120",
    "capacity": "240",
    "owner": "DPDC",
    "circle": "Dhaka(S)",
    "voltage": "230kV"
  }
] as any;
